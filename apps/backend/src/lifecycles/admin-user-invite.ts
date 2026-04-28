import type { Core } from "@strapi/strapi";

const ADMIN_USER_MODEL_UID = "admin::user";
const EMAIL_SETTINGS_MODEL_UID = "api::email-setting.email-setting";

type TAdminRole = {
  name: string;
};

type TAdminUser = {
  id: number;
  email: string;
  registrationToken?: string;
  firstname?: string;
  lastname?: string;
  roles?: TAdminRole[];
};

const getInviteTemplateId = async (strapi: Core.Strapi): Promise<string | undefined> => {
  const settings = await strapi.db.query(EMAIL_SETTINGS_MODEL_UID).findOne({
    select: ["inviteTemplateId"]
  });

  return settings?.inviteTemplateId;
};

const getAdminUserById = async (
  strapi: Core.Strapi,
  userId: number
): Promise<TAdminUser | null> => {
  const user = await strapi.entityService.findOne(ADMIN_USER_MODEL_UID, userId, {
    fields: ["email", "registrationToken", "firstname", "lastname"],
    populate: ["roles"]
  });

  return (user as unknown as TAdminUser | null) ?? null;
};

const sendInviteEmail = async (
  strapi: Core.Strapi,
  {
    to,
    inviteTemplateId,
    name,
    url,
    role
  }: {
    to: string;
    inviteTemplateId: string;
    name: string;
    url: string;
    role: string;
  }
) => {
  await strapi
    .plugin("email-designer-v5")
    .service("email")
    .sendTemplatedEmail(
      { to },
      { templateReferenceId: inviteTemplateId },
      { name, url, role }
    );
};

export const registerAdminUserInviteLifecycle = (
  strapi: Core.Strapi,
  adminBaseUrl?: string
) => {
  strapi.db.lifecycles.subscribe({
    models: [ADMIN_USER_MODEL_UID],

    async afterCreate(event) {
      if (!adminBaseUrl) {
        strapi.log.warn("[invite-email] SSH_SERVER_HOST no definido, se omite envío");
        return;
      }

      const userId = Number(event.result.id);

      const [user, inviteTemplateId] = await Promise.all([
        getAdminUserById(strapi, userId),
        getInviteTemplateId(strapi)
      ]);

      try {
        const invitedUser = user!;
        const inviteUrl = `${adminBaseUrl}/admin/auth/register?registrationToken=${invitedUser.registrationToken!}`;
        const fullName = [invitedUser.firstname, invitedUser.lastname]
          .filter(Boolean)
          .join(" ");
        const roleName = (invitedUser.roles ?? []).map((role) => role.name).join(", ");

        await sendInviteEmail(strapi, {
          to: invitedUser.email,
          inviteTemplateId: inviteTemplateId!,
          name: fullName,
          url: inviteUrl,
          role: roleName
        });
        strapi.log.info(`[invite-email] Invitación enviada a ${invitedUser.email}`);
      } catch (error) {
        strapi.log.error("[invite-email] Error enviando la invitación", error);
      }
    }
  });
};
