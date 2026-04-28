import type { Core } from "@strapi/strapi";

const controller = ({ strapi }: { strapi: any }): any => ({
  index(ctx) {
    ctx.body = strapi.plugin("strapi-backups").service("service").getWelcomeMessage();
  },
  async listBackups(ctx) {
    ctx.body = await strapi.plugin("strapi-backups").service("service").listBackups();
  },
  async createBackup(ctx) {
    ctx.body = await strapi.plugin("strapi-backups").service("service").createBackup();
  },
  async restoreBackup(ctx) {
    const { filename } = (ctx.request as any).body;
    ctx.body = await strapi.plugin("strapi-backups").service("service").restoreBackup(filename);
  },
  async deleteBackup(ctx) {
    const { filename } = (ctx.request as any).body;
    ctx.body = await strapi.plugin("strapi-backups").service("service").deleteBackup(filename);
  },
});

export default controller;