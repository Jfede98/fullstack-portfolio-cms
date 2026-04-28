import {
  SecretsManagerClient,
  GetSecretValueCommand,
  PutSecretValueCommand,
  DescribeSecretCommand,
  type DescribeSecretResponse,
  CreateSecretCommand
} from "@aws-sdk/client-secrets-manager";

export class SecretsManagerGateway {
  private readonly _client: SecretsManagerClient;

  constructor(region?: string) {
    this._client = new SecretsManagerClient({ region });
  }

  async getSecret<T>(secretId: string): Promise<T> {
    console.log("SecretsManagerGateway | getSecret");
    const command = new GetSecretValueCommand({ SecretId: secretId });
    const data = await this._client.send(command);
    return JSON.parse(data.SecretString!);
  }

  async updateSecret(
    secretId: string,
    value: Record<string, unknown>
  ): Promise<void> {
    console.log("SecretsManagerGateway | updateSecret");
    const command = new PutSecretValueCommand({
      SecretId: secretId,
      SecretString: JSON.stringify(value)
    });
    await this._client.send(command);
  }

  async describeSecret(secretId: string): Promise<DescribeSecretResponse> {
    const command = new DescribeSecretCommand({ SecretId: secretId });
    return this._client.send(command);
  }

  async createNewSecret(
    secretName: string,
    secretValue: string,
    secretDescription?: string
  ) {
    console.log("SecretsManagerGateway | createNewSecret");
    const command = new CreateSecretCommand({
      Name: secretName,
      SecretString: secretValue,
      Description: secretDescription
    });

    return this._client.send(command);
  }
}
