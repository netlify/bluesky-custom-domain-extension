import {
  Card,
  CardLoader,
  CardTitle,
  Form,
  FormField,
  SiteGeneralConfigurationSurface,
} from "@netlify/sdk/ui/react/components";
import { useNetlifySDK } from "@netlify/sdk/ui/react";
import { trpc } from "../trpc";
import { siteSettingsSchema } from "../../schema/site-settings-schema";

export const SiteGeneralConfiguration = () => {
  const sdk = useNetlifySDK();
  const trpcUtils = trpc.useUtils();
  const siteSettingsQuery = trpc.siteSettings.query.useQuery();
  const siteSettingsMutation = trpc.siteSettings.mutate.useMutation({
    onSuccess: async () => {
      await trpcUtils.siteSettings.query.invalidate();
    },
  });

  if (siteSettingsQuery.isLoading) {
    return <CardLoader />;
  }

  return (
    <SiteGeneralConfigurationSurface>
      <Card>
        <CardTitle>{sdk.extension.name} configuration</CardTitle>
        <p>Please note that after updating these settings, you must make a new production deploy for the changes to take effect.</p>
        <Form
          defaultValues={
            siteSettingsQuery.data ?? {
              blueskyDID: "",
            }
          }
          schema={siteSettingsSchema}
          onSubmit={siteSettingsMutation.mutateAsync}
        >
          <FormField
            name="blueskyDID"
            type="text"
            label="Bluesky account DID"
            helpText="The unique identifier for your Bluesky accoun, starting with `did:`. It can be found in Bluesky under Settings > Change Handle > I have my own domain > No DNS Panel."
          />
        </Form>
      </Card>
    </SiteGeneralConfigurationSurface>
  );
};
