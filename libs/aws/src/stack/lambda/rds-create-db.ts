import { SecretsManagerGateway } from "@aws/gateways/secretsManager";
import { Client } from "pg";

type TSecret = {
  host: string;
  username: string;
  password: string;
  port: number;
};

type TEventReq = {
  RequestType: "Create" | "Delete";
  PhysicalResourceId: string;
};

const clientPg = async () => {
  const sm = new SecretsManagerGateway(process.env.AWS_REGION!);

  const { host, username, password, port } = await sm.getSecret<TSecret>(
    process.env.SECRET_ARN!
  );

  return new Client({
    host,
    user: username,
    password,
    port,
    database: "postgres",
    ssl: { rejectUnauthorized: false }
  });
};

export const handler = async (event: TEventReq) => {
  console.log("Iniciando Lambda db...", JSON.stringify(event));

  if (event.RequestType === "Delete") {
    return { PhysicalResourceId: event.PhysicalResourceId };
  }

  if (event.RequestType !== "Create") return {};
  const client = await clientPg();

  try {
    const dbName = process.env.TEST_DB_NAME;
    if (!dbName) throw new Error("TEST_DB_NAME is not defined");

    await client.connect();

    await client.query(`CREATE DATABASE "${dbName}"`);

    console.log(`Base de datos ${dbName} creada exitosamente.`);
  } catch (err) {
    console.error("Error creating database:", err);
  } finally {
    await client.end();
  }

  return { PhysicalResourceId: "rds-custom-resource" };
};
