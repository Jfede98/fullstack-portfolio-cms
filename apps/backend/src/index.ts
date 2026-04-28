import { registerAdminUserInviteLifecycle } from "./lifecycles/admin-user-invite";
import { registerCspSyncLifecycle } from "./lifecycles/csp-sync";
import { registerButtonValidationLifecycle } from "./lifecycles/button-validation";

export default {
  register() {},

  async bootstrap({ strapi }) {
    const adminBaseUrl = process.env.SSH_SERVER_HOST?.replace(/\/$/, "");
    const server = strapi.server.httpServer;
    server.setTimeout(1200000); 
    server.headersTimeout = 1200000;
    server.keepAliveTimeout = 1200000;

    registerAdminUserInviteLifecycle(strapi, adminBaseUrl);
    await registerCspSyncLifecycle(strapi);
    registerButtonValidationLifecycle(strapi);
  }
};
