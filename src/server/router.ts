import { TRPCError } from "@trpc/server";
import { procedure, router } from "./trpc.js";
import { siteSettingsSchema } from "../schema/site-settings-schema.js";

const DID_ENVIRONMENT_VARIABLE = "BLUESKY_DID";

export const appRouter = router({
  siteSettings: {
    query: procedure.query(async ({ ctx: { teamId, siteId, client } }) => {
      if (!siteId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "siteId is required"
        });
      }
      if (!teamId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "siteId is required"
        });
      }
      const siteConfig = await client.getSiteConfiguration(teamId, siteId);
      if (!siteConfig) {
        return;
      }
      const result = siteSettingsSchema.safeParse(siteConfig.config);
      if (!result.success) {
        console.warn(
          "Failed to parse site settings",
          JSON.stringify(result.error, null, 2)
        );
      }
      return result.data;
    }),

    mutate: procedure
      .input(siteSettingsSchema)
      .mutation(async ({ ctx: { account, teamId, siteId, client }, input }) => {
        if (!teamId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "teamId is required"
          });
        }

        if (!siteId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "siteId is required"
          });
        }

        try {
          const existingConfig = await client.getSiteConfiguration(
            teamId,
            siteId
          );
          if (!existingConfig) {
            await client.createSiteConfiguration(teamId, siteId, input);
          } else {
            await client.updateSiteConfiguration(teamId, siteId, {
              ...(existingConfig?.config || {}),
              ...input
            });
          }

          const { blueskyDID, enable } = input;

          if (enable) {
            await client.createOrUpdateVariable({
              accountId: account.id,
              siteId,
              key: DID_ENVIRONMENT_VARIABLE,
              value: blueskyDID
            });
          } else {
            await client.deleteEnvironmentVariable({
              accountId: account.id,
              siteId,
              key: DID_ENVIRONMENT_VARIABLE
            });
          }
        } catch (e) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to save site configuration",
            cause: e
          });
        }
      })
  }
});

export type AppRouter = typeof appRouter;
