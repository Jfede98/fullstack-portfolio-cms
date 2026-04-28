import { SSMGateway } from "@aws/gateways/ssm";
import { SecretsManagerGateway } from "@aws/gateways/secretsManager";

type TEventReq = {
  RequestType: "Create" | "Delete" | "Update";
  PhysicalResourceId: string;
};

const logic = async () => {
  const keyPairId = process.env.KEY_PAIR_ID;
  const region = process.env.AWS_REGION;
  const infraSecretName = process.env.INFRA_SECRET_NAME;

  if (!keyPairId || !infraSecretName)
    throw new Error("Missing KEY_PAIR_ID or INFRA_SECRET_NAME");

  const ssmPath = `/ec2/keypair/${keyPairId}`;

  const privateKey = await ssmLogic(ssmPath, region);
  await secretsManagerLogic(infraSecretName, privateKey, region);
};

const secretsManagerLogic = async (
  secretName: string,
  privateKey: string,
  region?: string
) => {
  const sm = new SecretsManagerGateway(region);

  try {
    const currentSecretValue =
      await sm.getSecret<Record<string, string>>(secretName);
    if (!currentSecretValue)
      throw new Error(`No se pudo recuperar el secreto ${secretName}`);

    const updatedSecret = {
      ...currentSecretValue,
      EC2_SSH_PRIVATE_KEY: privateKey
    };
    await sm.updateSecret(secretName, updatedSecret);
    console.log(`Llave EC2_SSH_PRIVATE_KEY sincronizada en ${secretName}`);
  } catch (err: any) {
    console.error("Error al actualizar el secreto de infraestructura:", err);
    throw err;
  }
};

const ssmLogic = async (ssmPath: string, region?: string) => {
  const ssm = new SSMGateway(region);
  const privateKey = await ssm.getParameter(ssmPath);
  if (!privateKey) throw new Error("No se pudo recuperar el valor de SSM");
  return privateKey;
};

export const handler = async (event: TEventReq) => {
  console.log("Iniciando Lambda sync keypair...", JSON.stringify(event));

  if (event.RequestType === "Delete")
    return { PhysicalResourceId: event.PhysicalResourceId };

  try {
    if (event.RequestType === "Create" || event.RequestType === "Update") {
      await logic();
    }

    return {
      PhysicalResourceId:
        event.PhysicalResourceId || `sync-${process.env.KEY_PAIR_ID}`
    };
  } catch (error) {
    console.error("Error en la sincronización:", error);
    throw error;
  }
};
