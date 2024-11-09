import { z } from "zod";

export const siteSettingsSchema = z.object({
  blueskyDID: z.string().min(1)
});
