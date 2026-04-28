import {
  AWS_ASSETS_CERTIFICATE_ARN,
  AWS_ASSETS_DOMAIN_NAME,
  AWS_ASSETS_STORAGE_NAME,
  AWS_EC2_INSTANCE_CLASS,
  AWS_EC2_INSTANCE_EIP,
  AWS_EC2_INSTANCE_GENERATE_NEW_ELASTIC_IP,
  AWS_EC2_INSTANCE_NAME,
  AWS_EC2_INSTANCE_SIZE,
  AWS_EC2_KEYPAIR_RESOURCE_NAME,
  AWS_RDS_INSTANCE_CLASS,
  AWS_RDS_INSTANCE_SIZE,
  ISOLATED_SUBNET_MASK,
  ISOLATED_SUBNET_NAME,
  PRIVATE_SUBNET_MASK,
  PRIVATE_SUBNET_NAME,
  PUBLIC_SUBNET_MASK,
  PUBLIC_SUBNET_NAME,
  REGION,
  VPC_CIDR_BLOCK,
  VPC_DISPONIBLE_ZONES_NUMBER,
  VPC_ID,
  VPC_NAME,
  VPC_NAT_GATEWAYS_NUMBER
} from "@aws/stack/constants/env";
import {
  Stack,
  App,
  Tags,
  CustomResource,
  Duration,
  type StackProps,
  RemovalPolicy,
  CfnDeletionPolicy
} from "aws-cdk-lib";
import {
  Instance,
  KeyPair,
  MachineImage,
  Peer,
  Port,
  SubnetType,
  type SecurityGroup,
  type Vpc
} from "aws-cdk-lib/aws-ec2";
import { VPCConstruct } from "@aws/cdk/vpc";
import { SecurityGroupConstruct } from "@aws/cdk/securityGroup";
import { S3BucketConstruct } from "@aws/cdk/s3";
import { CloudFrontConstruct } from "@aws/cdk/cloudfront";
import { RDSConstruct } from "@aws/cdk/rds";
import { SecretsMangerConstruct } from "@aws/cdk/secretsManager";
import { EC2Construct } from "@aws/cdk/ec2";
import { NodeLambdaConstruct } from "@aws/cdk/lambda";
import { DEFAULT_TAGS } from "@aws/stack/constants/tags";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import {
  parseInstanceClass,
  parseInstanceSize,
  s3AccessPolicy
} from "../helper/ec2";
import { Resources } from "../constants/enums";
import { DatabaseInstance, StorageType } from "aws-cdk-lib/aws-rds";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import path from "node:path";
import { Provider } from "aws-cdk-lib/custom-resources";
import { Subnet } from "@aws/cdk/subnet";
import type { Distribution } from "aws-cdk-lib/aws-cloudfront";
import { aws_secretsmanager as secretsmanager } from "aws-cdk-lib";
import { readFileSync } from "node:fs";
import type { IBucket } from "aws-cdk-lib/aws-s3";
import { secretsManagerSyncPolicy, ssmSyncPolicy } from "../helper/lambda";
import { CfnSecret } from "aws-cdk-lib/aws-secretsmanager";
import { applyCategorizedAccess } from "../helper/securityGroup";
import { ipList } from "../ips";

export class CDKStackConstruct extends Stack {
  private readonly _app: App;
  private _stage: string;
  private _vpcInstance: Vpc | null;
  private _ec2Instance: Instance | null;
  private _ec2KeyPair: KeyPair | null | undefined;
  private _s3Bucket: IBucket | null;
  private _cfInstance: Distribution | null;
  private _rdsInstance: DatabaseInstance | null;
  private _ec2SecurityGroup: SecurityGroup | null;
  private _cfSecurityGroup: SecurityGroup | null;
  private _rdsSecurityGroup: SecurityGroup | null;
  private _wafArn: string | undefined | null;
  private _s3StorybookFolder: string;
  private _s3AssetsFolder: string;

  constructor(
    scope: App,
    id: string,
    stage: string,
    wafArn: string | null,
    { ...props }: StackProps
  ) {
    super(scope, id + "-" + stage, { ...props, crossRegionReferences: true });
    this._app = scope;
    this._stage = stage;
    this._s3StorybookFolder = "public-storybook";
    this._s3AssetsFolder = "assets-admin-xtrim";

    this._vpcInstance = null;
    this._ec2Instance = null;
    this._rdsInstance = null;
    this._cfInstance = null;
    this._s3Bucket = null;
    this._ec2KeyPair = null;

    this._rdsSecurityGroup = null;
    this._cfSecurityGroup = null;
    this._ec2SecurityGroup = null;
    this._rdsSecurityGroup = null;
    this._wafArn = wafArn;

    this._init();
  }

  private _init() {
    this.templateOptions.description = "CDK Stack Construct";
    this._vpc();
    this._buildSecurityGroup();
    this._buildAssetsStorage();
    const ec2 = this._buildEc2();
    const rds = this._buildRds();
    const infraSecret = this._createOutputsSecret(ec2);

    this._buildRdsLambda(rds.DbName);
    this._buildSyncKeyLambda(infraSecret);

    Tags.of(this).add("Stage", this._stage!);
  }

  private _vpc() {
    const { vpc } = new VPCConstruct({
      scope: this,
      id: `${VPC_ID}-${this._stage}`,
      name: `${VPC_NAME}-${this._stage}`,
      cidr: VPC_CIDR_BLOCK,
      natGateways: Number(VPC_NAT_GATEWAYS_NUMBER)!,
      maxAzs: Number(VPC_DISPONIBLE_ZONES_NUMBER)!,
      subnets: [
        new Subnet(
          PUBLIC_SUBNET_NAME,
          SubnetType.PUBLIC,
          Number(PUBLIC_SUBNET_MASK)
        ),
        new Subnet(
          PRIVATE_SUBNET_NAME,
          SubnetType.PRIVATE_WITH_EGRESS,
          Number(PRIVATE_SUBNET_MASK)
        ),
        new Subnet(
          ISOLATED_SUBNET_NAME,
          SubnetType.PRIVATE_ISOLATED,
          Number(ISOLATED_SUBNET_MASK)
        )
      ],
      props: {
        env: { region: REGION },
        terminationProtection: this._stage === "prod"
      },
      tags: DEFAULT_TAGS(Resources.VPC, this._stage)
    });

    this._vpcInstance = vpc;
  }

  private _buildAssetsStorage() {
    if (!AWS_ASSETS_STORAGE_NAME)
      throw new Error("AWS_ASSETS_STORAGE_NAME is not defined");

    const name = AWS_ASSETS_STORAGE_NAME;
    const storage = new S3BucketConstruct({
      scope: this,
      id: name,
      bucketName: `${name}-${this._stage}`,
      tags: DEFAULT_TAGS(Resources.S3, this._stage)
    });

    const { instance } = new CloudFrontConstruct({
      scope: this,
      id: `${name}-cf-${this._stage}`,
      origin: S3BucketOrigin.withOriginAccessControl(storage.bucket),
      domainNames: AWS_ASSETS_DOMAIN_NAME?.split(","),
      certificateArn: AWS_ASSETS_CERTIFICATE_ARN,
      comment: `Distribución para la configuración de assets del sitio público - Ambiente: ${this._stage}`,
      tags: DEFAULT_TAGS(Resources.CLOUDFRONT, this._stage)
    });

    storage.createEmptyDirectory(storage.bucket, this._s3StorybookFolder);
    storage.createEmptyDirectory(storage.bucket, this._s3AssetsFolder);

    if (this._stage === "stg") {
      storage.createEmptyDirectory(
        storage.bucket,
        `${this._s3StorybookFolder}-dev`
      );
      storage.createEmptyDirectory(
        storage.bucket,
        `${this._s3AssetsFolder}-dev`
      );
    }

    this._cfInstance = instance;
    this._s3Bucket = storage.Instance;
  }

  private _buildSecurityGroup() {
    if (!this._vpcInstance) throw new Error("VPC instance is not defined");
    const stage = this._stage;

    const [
      { SecurityGroup: cfSG },
      { SecurityGroup: ec2SG },
      { SecurityGroup: rdsSG },
      { SecurityGroup: tomLeadSG }
    ] = [
      {
        name: `xtrim-cloudfront-sg-${stage}`,
        description: "PrivateCloudfrontSG",
        allowAllOutbound: true,
        id: `xtrim-cloudfront-sg-${stage}`
      },
      {
        name: `xtrim-strapi-ec2-sg-${stage}`,
        description: "EC2-SG",
        allowAllOutbound: true,
        id: `xtrim-strapi-ec2-sg-${stage}`
      },
      {
        name: `xtrim-rds-sg-${stage}`,
        description: "RDS-SG",
        allowAllOutbound: false,
        id: `xtrim-rds-sg-${stage}`
      },
      {
        name: `xtrim-tom-lead-${stage}`,
        description: "TOM-LEAD-SG",
        allowAllOutbound: true,
        id: `xtrim-tom-lead-${stage}`
      }
    ].map(
      ({ allowAllOutbound, name, id, description }) =>
        new SecurityGroupConstruct({
          vpc: this._vpcInstance!,
          scope: this,
          id,
          name: name,
          description,
          allowAllOutbound:
            allowAllOutbound !== undefined ? allowAllOutbound : false,
          tags: DEFAULT_TAGS(Resources.SG, this._stage)
        })
    );

    tomLeadSG.addIngressRule(
      Peer.ipv4(this._vpcInstance!.vpcCidrBlock),
      Port.allTraffic(),
      "Allow all traffic from VPC CIDR"
    );

    ec2SG.addIngressRule(
      cfSG,
      Port.tcp(1337),
      "Allow CloudFront access on dynamic Strapi Port"
    );

    if (this._stage === "stg") {
      ec2SG.addIngressRule(
        cfSG,
        Port.tcp(1338),
        "Allow CloudFront access on dynamic Strapi Port"
      );
    }

    rdsSG.addIngressRule(ec2SG, Port.tcp(5432), "Rds-ingress-rule");
    applyCategorizedAccess(this, ec2SG, this._stage, ipList);
    this._ec2SecurityGroup = ec2SG;
    this._rdsSecurityGroup = rdsSG;
    this._cfSecurityGroup = cfSG;
  }

  private _buildEc2() {
    if (!this._vpcInstance || !this._ec2SecurityGroup || !AWS_EC2_INSTANCE_NAME)
      throw new Error(
        "VPC Instance, Security Group or InstanceName are not defined on EC2 Service"
      );

    const name = AWS_EC2_INSTANCE_NAME;
    const id = `${name}-${this._stage}`;
    let enabledElasticIp = AWS_EC2_INSTANCE_GENERATE_NEW_ELASTIC_IP === "true";
    const assignEIP = AWS_EC2_INSTANCE_EIP;
    const resource = Resources.EC2;
    const instanceClass = parseInstanceClass(resource, AWS_EC2_INSTANCE_CLASS);
    const instanceSize = parseInstanceSize(resource, AWS_EC2_INSTANCE_SIZE);

    if (assignEIP && enabledElasticIp) {
      enabledElasticIp = false;
      console.log(
        "Asignación de EIP habilitada, descartando la generación de una nueva EIP"
      );
    }

    const { _instance: instance, KeyPair } = new EC2Construct({
      scope: this,
      id,
      vpc: this._vpcInstance,
      instanceName: id,
      instanceClass,
      instanceSize,
      securityGroup: this._ec2SecurityGroup,
      generateKeyPair: true,
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC
      },
      machineImage: MachineImage.latestAmazonLinux2023(),
      instanceUser: "ec2-user",
      generageNewEip: enabledElasticIp,
      eip: assignEIP,
      tags: DEFAULT_TAGS(Resources.EC2, this._stage)
    });

    const scriptPath = path.join(__dirname, "..", "scripts", "ec2-setup.sh");
    const secretName = `${this._stage}/xtrim-sitio-publico-infra-inputs/environment`;
    const secret = secretsmanager.Secret.fromSecretNameV2(
      this,
      "StrapiEnv",
      secretName
    );

    secret.grantRead(instance);

    const userDataScript = readFileSync(scriptPath, "utf8")
      .replace("$STAGE", this._stage)
      .replace("$SECRET_NAME", secretName)
      .replace("$AWS_REGION", Stack.of(this).region);

    instance.addUserData(userDataScript);

    instance.addToRolePolicy(s3AccessPolicy(this._s3Bucket!.bucketArn));

    this._ec2Instance = instance;
    this._ec2KeyPair = KeyPair;
    return instance;
  }

  private _buildRds() {
    if (!this._vpcInstance || !this._rdsSecurityGroup)
      throw new Error(
        "VPC Instance, Security Group, DB_Name or InstanceName are not defined on RDS Service"
      );

    const name = "xtrim-rds-sitio-publico";
    const id = `${name}-${this._stage}`;
    const dbName = "strapi";
    const resource = Resources.RDS;
    const instanceClass = parseInstanceClass(resource, AWS_RDS_INSTANCE_CLASS);
    const instanceSize = parseInstanceSize(resource, AWS_RDS_INSTANCE_SIZE);

    const rds = new RDSConstruct({
      scope: this,
      id,
      dbName,
      name: `${this._stage}-xtrim-web-db`,
      secretName: `${this._stage}/xtrim-db-credentials/environment`,
      vpc: this._vpcInstance,
      appSecurityGroup: this._rdsSecurityGroup,
      tags: DEFAULT_TAGS(Resources.RDS, this._stage),
      storageType: StorageType.GP2,
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_ISOLATED
      },
      securityGroups: [this._rdsSecurityGroup],
      deletionProtection: true,
      instanceClass,
      instanceSize,
      dbUsername: "strapi",
      removalPolicy: RemovalPolicy.RETAIN
    });

    if (!this._ec2Instance)
      throw new Error("EC2 instance is not defined when building RDS");

    rds.addGrantRead(this._ec2Instance);
    this._rdsInstance = rds.instance;
    return rds;
  }

  private _buildRdsLambda(rdsName: string) {
    const stage = this._stage;
    if (stage !== "stg") return;

    if (!this._vpcInstance || !this._rdsInstance)
      throw new Error(
        "VPC Instance, DB Secret Name or RDS Instance are not defined when building RDS Lambda"
      );

    const lambda = new NodeLambdaConstruct({
      scope: this,
      id: `rds-lambda-${this._stage}`,
      name: "CreateExtraDbHandler",
      vpc: this._vpcInstance,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
      handler: "index.handler",
      runtime: Runtime.NODEJS_24_X,
      timeout: Duration.seconds(30),
      entry: path.resolve(__dirname, "..", "lambda", "rds-create-db.ts"),
      environment: {
        SECRET_ARN: this._rdsInstance.secret!.secretArn!,
        TEST_DB_NAME: `${rdsName}-dev`
      }
    });

    this._rdsInstance.secret?.grantRead(lambda.Instance);
    this._rdsInstance.connections.allowDefaultPortFrom(
      lambda.Instance,
      "Allow access from DB creation Lambda"
    );

    const dbProvider = new Provider(this, "DbProvider", {
      onEventHandler: lambda.Instance
    });

    new CustomResource(this, "ExtraDatabaseResource", {
      serviceToken: dbProvider.serviceToken
    });
  }

  private _buildSyncKeyLambda(infraSecret: SecretsMangerConstruct) {
    if (!this._vpcInstance || !this._ec2KeyPair)
      throw new Error(
        "VPC Instance or EC2 KeyPair are not defined when building SyncKeyPair Lambda"
      );

    const keyPairId = this._ec2KeyPair.keyPairId;
    const keyPairName = this._ec2KeyPair.keyPairName;

    const lambda = new NodeLambdaConstruct({
      scope: this,
      id: `sync-key-lambda-${this._stage}`,
      name: "SyncKeyPairHandlerV3",
      handler: "index.handler",
      runtime: Runtime.NODEJS_24_X,
      timeout: Duration.seconds(30),
      entry: path.resolve(__dirname, "..", "lambda", "sync-keypair.ts"),
      environment: {
        KEY_PAIR_ID: keyPairId,
        KEY_PAIR_NAME: keyPairName,
        INFRA_SECRET_NAME: infraSecret.Name
      }
    });

    lambda.addRolePolicy(ssmSyncPolicy(this.region, this.account, keyPairId));
    lambda.addRolePolicy(
      secretsManagerSyncPolicy(this.region, this.account, infraSecret.Name)
    );

    const syncProvider = new Provider(this, "SyncKeyProvider", {
      onEventHandler: lambda.Instance
    });

    new CustomResource(this, AWS_EC2_KEYPAIR_RESOURCE_NAME, {
      serviceToken: syncProvider.serviceToken,
      properties: {
        KeyPairId: keyPairId,
        ForceUpdate: new Date().toISOString()
      }
    });

    lambda.node.addDependency(infraSecret);
  }

  private _createOutputsSecret(ec2: Instance) {
    const name = `${this._stage}/xtrim-sitio-publico-infra-outputs/environment`;
    const secrets = [
      {
        label: "REGION",
        value: REGION
      },
      {
        label: "VPC_ID",
        value: this._vpcInstance!.vpcId
      },
      {
        label: "PUBLIC_SUBNET_IGW",
        value: this._vpcInstance!.publicSubnets.map((s) => s.subnetId).join(",")
      },
      {
        label: "PRIVATE_SUBNET_NAT",
        value: this._vpcInstance!.privateSubnets.map((s) => s.subnetId).join(
          ","
        )
      },
      {
        label: "PRIVATE_SUBNET_WIHOUT_NAT",
        value: this._vpcInstance!.isolatedSubnets.map((s) => s.subnetId).join(
          ","
        )
      },
      {
        label: "EC2_SG",
        value: this._ec2SecurityGroup!.securityGroupId
      },
      {
        label: "CLOUDFRONT_FRONTEND_SG",
        value: this._cfSecurityGroup!.securityGroupId
      },
      {
        label: "CLOUDFRONT_ASSETS_ENDPOINT",
        value: this._cfInstance!.distributionDomainName
      },
      {
        label: "CLOUDFRONT_ASSETS_DISTRIBUTION_ID",
        value: this._cfInstance!.distributionId
      },
      {
        label: "RDS_SG",
        value: this._rdsSecurityGroup!.securityGroupId
      },
      {
        label: "RDS_ENDPOINT",
        value: this._rdsInstance!.dbInstanceEndpointAddress
      },
      {
        label: "EC2_PRIVATE_IP",
        value: ec2.instancePrivateIp
      },
      {
        label: "EC2_PUBLIC_DNS",
        value: ec2.instancePublicDnsName
      },
      {
        label: "EC2_PUBLIC_IP",
        value: ec2.instancePublicIp
      },
      {
        label: "S3_BUCKET_NAME",
        value: this._s3Bucket!.bucketName
      },
      {
        label: "SSM_EC2_SSH_PRIVATE_KEY_REFERENCE",
        value: `/ec2/keypair/${this._ec2KeyPair!.keyPairId}`
      },
      {
        label: "S3_STORYBOOK_FOLDER",
        value: this._s3StorybookFolder
      },
      {
        label: "S3_ASSETS_FOLDER",
        value: this._s3AssetsFolder
      }
    ];

    if (this._stage === "stg")
      secrets.push(
        {
          label: "S3_STORYBOOK_FOLDER_DEV",
          value: `${this._s3StorybookFolder}-dev`
        },
        {
          label: "S3_ASSETS_FOLDER_DEV",
          value: `${this._s3AssetsFolder}-dev`
        }
      );

    if (this._wafArn) secrets.push({ label: "WAF_ARN", value: this._wafArn });

    const infraSecret = new SecretsMangerConstruct({
      scope: this,
      id: `InfraOutputsSecret-${this._stage}`,
      name: name,
      description: "IDs de infraestructura generados por CDK",
      tags: [
        ...DEFAULT_TAGS(Resources.SECRETS, this._stage),
        { key: "update", value: new Date().getTime().toString() }
      ],
      secrets
    });

    const cfnSecret = infraSecret.node
      .findAll()
      .find((c) => c instanceof CfnSecret) as CfnSecret;

    if (cfnSecret) {
      cfnSecret.cfnOptions.deletionPolicy = CfnDeletionPolicy.RETAIN;
      cfnSecret.cfnOptions.updateReplacePolicy = CfnDeletionPolicy.RETAIN;
    }

    return infraSecret;
  }

  get app() {
    return this._app;
  }
}
