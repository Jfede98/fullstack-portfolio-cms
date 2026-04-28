import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

export class SSMGateway {
  private readonly _client: SSMClient;

  constructor(region?: string) {
    this._client = new SSMClient({ region });
  }

  async getParameter(name: string): Promise<string> {
    console.log("SSMGateway | getParameter");
    const command = new GetParameterCommand({
      Name: name,
      WithDecryption: true
    });
    const data = await this._client.send(command);
    return data.Parameter?.Value!;
  }
}
