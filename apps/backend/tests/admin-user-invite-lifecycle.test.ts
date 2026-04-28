import { registerAdminUserInviteLifecycle } from "../src/lifecycles/admin-user-invite";

type AfterCreate = (event: { result: { id: number } }) => Promise<void>;

type StrapiMock = {
  db: {
    query: jest.Mock;
    lifecycles: {
      subscribe: jest.Mock;
    };
  };
  entityService: {
    findOne: jest.Mock;
  };
  plugin: jest.Mock;
  log: {
    info: jest.Mock;
    warn: jest.Mock;
    error: jest.Mock;
  };
};

const makeStrapi = () => {
  const sendTemplatedEmail = jest.fn().mockResolvedValue(undefined);
  const queryFindOne = jest.fn().mockResolvedValue({ inviteTemplateId: "tmpl_1" });

  const strapi: StrapiMock = {
    db: {
      query: jest.fn().mockReturnValue({
        findOne: queryFindOne
      }),
      lifecycles: {
        subscribe: jest.fn()
      }
    },
    entityService: {
      findOne: jest.fn().mockResolvedValue({
        id: 1,
        email: "user@example.com",
        registrationToken: "reg-token",
        firstname: "Test",
        lastname: "User",
        roles: [{ name: "Admin" }, { name: "Editor" }]
      })
    },
    plugin: jest.fn().mockReturnValue({
      service: jest.fn().mockReturnValue({
        sendTemplatedEmail
      })
    }),
    log: {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    }
  };

  return { strapi, sendTemplatedEmail, queryFindOne };
};

const getAfterCreate = (strapi: StrapiMock): AfterCreate => {
  const config = strapi.db.lifecycles.subscribe.mock.calls[0][0] as {
    afterCreate: AfterCreate;
  };
  return config.afterCreate;
};

describe("admin-user invite lifecycle", () => {
  it("logs warning and skips when SSH_SERVER_HOST is missing", async () => {
    const { strapi, sendTemplatedEmail } = makeStrapi();
    registerAdminUserInviteLifecycle(strapi as unknown as never, undefined);

    const afterCreate = getAfterCreate(strapi);
    await afterCreate({ result: { id: 1 } });

    expect(strapi.log.warn).toHaveBeenCalledWith(
      "[invite-email] SSH_SERVER_HOST no definido, se omite envío"
    );
    expect(sendTemplatedEmail).not.toHaveBeenCalled();
  });

  it("sends invite email after admin user creation", async () => {
    const { strapi, sendTemplatedEmail } = makeStrapi();
    registerAdminUserInviteLifecycle(
      strapi as unknown as never,
      "https://admin.example.com"
    );

    const afterCreate = getAfterCreate(strapi);
    await afterCreate({ result: { id: 1 } });

    expect(strapi.db.query).toHaveBeenCalledWith("api::email-setting.email-setting");
    expect(strapi.entityService.findOne).toHaveBeenCalledWith(
      "admin::user",
      1,
      expect.objectContaining({
        fields: ["email", "registrationToken", "firstname", "lastname"],
        populate: ["roles"]
      })
    );
    expect(sendTemplatedEmail).toHaveBeenCalledWith(
      { to: "user@example.com" },
      { templateReferenceId: "tmpl_1" },
      {
        name: "Test User",
        url: "https://admin.example.com/admin/auth/register?registrationToken=reg-token",
        role: "Admin, Editor"
      }
    );
    expect(strapi.log.info).toHaveBeenCalledWith(
      "[invite-email] Invitación enviada a user@example.com"
    );
  });

  it("logs error when sending invite fails", async () => {
    const { strapi, sendTemplatedEmail } = makeStrapi();
    sendTemplatedEmail.mockRejectedValueOnce(new Error("boom"));
    registerAdminUserInviteLifecycle(
      strapi as unknown as never,
      "https://admin.example.com"
    );

    const afterCreate = getAfterCreate(strapi);
    await afterCreate({ result: { id: 1 } });

    expect(strapi.log.error).toHaveBeenCalledWith(
      "[invite-email] Error enviando la invitación",
      expect.any(Error)
    );
  });

  it("logs error when user/settings data are incomplete", async () => {
    const { strapi, sendTemplatedEmail, queryFindOne } = makeStrapi();
    strapi.entityService.findOne.mockResolvedValueOnce(undefined);
    queryFindOne.mockResolvedValueOnce(undefined);
    registerAdminUserInviteLifecycle(
      strapi as unknown as never,
      "https://admin.example.com"
    );

    const afterCreate = getAfterCreate(strapi);
    await afterCreate({ result: { id: 1 } });

    expect(sendTemplatedEmail).not.toHaveBeenCalled();
    expect(strapi.log.error).toHaveBeenCalledWith(
      "[invite-email] Error enviando la invitación",
      expect.any(Error)
    );
  });

  it("sends invite with empty fullName and role when optional fields are missing", async () => {
    const { strapi, sendTemplatedEmail } = makeStrapi();
    strapi.entityService.findOne.mockResolvedValueOnce({
      id: 2,
      email: "minimal@example.com",
      registrationToken: "token-2"
    });

    registerAdminUserInviteLifecycle(
      strapi as unknown as never,
      "https://admin.example.com"
    );

    const afterCreate = getAfterCreate(strapi);
    await afterCreate({ result: { id: 2 } });

    expect(sendTemplatedEmail).toHaveBeenCalledWith(
      { to: "minimal@example.com" },
      { templateReferenceId: "tmpl_1" },
      {
        name: "",
        url: "https://admin.example.com/admin/auth/register?registrationToken=token-2",
        role: ""
      }
    );
  });
});
