import {
  Card,
  CardLoader,
  CardTitle,
  Checkbox,
  Form,
  FormField,
  SiteGeneralConfigurationSurface,
} from "@netlify/sdk/ui/react/components";
import { useNetlifySDK } from "@netlify/sdk/ui/react";
import { useState } from "react";
import { trpc } from "../trpc";
import { siteSettingsSchema } from "../../schema/site-settings-schema";


export const SiteGeneralConfiguration = () => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const sdk = useNetlifySDK();
  const trpcUtils = trpc.useUtils();
  const siteSettingsQuery = trpc.siteSettings.query.useQuery();
  const siteSettingsMutation = trpc.siteSettings.mutate.useMutation({
    onSuccess: async () => {
      setHasSubmitted(true);

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
        <Form
          className="tw-mt-4"
          defaultValues={
            siteSettingsQuery.data ?? {
              blueskyDID: "",
              enable: false
            }
          }
          schema={siteSettingsSchema}
          onSubmit={siteSettingsMutation.mutateAsync}
        >
          <Checkbox
            name="enable"
            label="Enabled"
            helpText="Enable the extension for this site"
          />
          
          <FormField
            name="blueskyDID"
            type="text"
            label="Bluesky account DID"
            helpText="The unique identifier for your Bluesky account, starting with `did:`. It can be found in Bluesky under Settings > Change Handle > I have my own domain > No DNS Panel."
          />
        </Form>

        {hasSubmitted && <p>Your settings have been saved. You must trigger a new production deploy for the changes to take effect.</p>}
      </Card>
    </SiteGeneralConfigurationSurface>
  );
};
