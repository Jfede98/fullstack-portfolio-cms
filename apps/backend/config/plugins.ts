import path from "path";

const pathName = (namePath: string) => path.resolve(process.cwd(), namePath);

export const resolvePlugin = (name: string) => {
  const env = process.env.NODE_ENV_PLUGIN ?? "development";

  return env === "production"
    ? pathName(`./plugins/${name}`)
    : pathName(`../../libs/${name}`);
};

const isProd = process.env.APP_STAGE === "prod";
const isDev = process.env.APP_STAGE === "dev";
const isStg = process.env.APP_STAGE === "stg";

export default ({ env }) => {
  return {
    seo: {
      enabled: true
    },
    email: {
      config: {
        provider: "nodemailer",
        providerOptions: {
          host: env("SMTP_HOST"),
          port: env.int("SMTP_PORT"),
          secure: env.bool("SMTP_SECURE"),
          auth: {
            user: env("SMTP_USERNAME", env("SMTP_USER")),
            pass: env("SMTP_PASSWORD", env("SMTP_PASS"))
          }
        },
        settings: {
          defaultFrom: env("SMTP_FROM_EMAIL"),
          defaultReplyTo: env("SMTP_REPLY_TO")
        }
      }
    },

    upload: {
      config: {
        responsiveDimensions: false,
        breakpoints: {},
        provider: "aws-s3",
        providerOptions: {
          s3Options: {
            ...(env("AWS_ACCESS_KEY_ID") && {
              credentials: {
                accessKeyId: env("AWS_ACCESS_KEY_ID"),
                secretAccessKey: env("AWS_ACCESS_SECRET")
              }
            }),
            region: env("AWS_REGION", "us-east-1"),
            params: {
              Bucket: env("AWS_BUCKET"),
              ACL: "private"
            }
          },
          baseUrl: env("CLOUDFRONT_URL"),
          rootPath: env("AWS_S3_ROOT_PATH")
        },
        sizeLimit: 1_000_000,
        security: {
          allowedTypes: [
            "image/jpeg",
            "image/png",
            "image/svg+xml",
            "image/webp",
            "image/avif",
            "application/xml",
            "application/pdf",
            "text/plain",
            "text/csv",
            "application/rtf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation"
          ]
        },
        actionOptions: {
          upload: {
            params: {
              Bucket: env("AWS_BUCKET"),
              ACL: "private"
            }
          },
          uploadStream: {
            params: {
              Bucket: env("AWS_BUCKET"),
              ACL: "private"
            }
          },
          delete: {
            params: {
              Bucket: env("AWS_BUCKET")
            }
          }
        }
      }
    },

    documentation: {
      enabled: true,
      config: {
        openapi: "3.0.1",
        info: {
          version: "1.0.0",
          title: "Xtrim API Documentation",
          description: "Documentacion de la API de Xtrim"
        },
        servers: [
          {
            url: "http://localhost:1337/api",
            description: "Local Development API Server"
          },
          {
            url: "https://dev-xtrim-admin.dathaplus.com/api",
            description: "DEVELOPMENT API Server"
          }
        ],
        "x-strapi-config": {
          plugins: ["upload"]
        }
      }
    },
    "email-designer-v5": {
      enabled: true
    },
    "strapi-revalidate": {
      enabled: !isProd,
      resolve: resolvePlugin("strapiRevalidate")
    },
    "strapi-sync": {
      enabled: isStg,
      resolve: resolvePlugin("strapiSync")
    },
    "strapi-backups": {
      enabled: true,
      resolve: resolvePlugin("strapiBackups")
    },
    "dynamic-enumeration": {
      enabled: true
    }
  };
};
