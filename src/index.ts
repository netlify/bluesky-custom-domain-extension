// Documentation: https://sdk.netlify.com
import { NetlifyExtension } from "@netlify/sdk";

const extension = new NetlifyExtension();

extension.addFunctions("./src/functions", {
  prefix: "my_unique_prefix",
  shouldInjectFunction: () => {
    console.log("INJECT!!!!!!");
    // If the function is not enabled, return early
    // if (!process.env["BLUESKY_CUSTOM_DOMAIN_EXTENSION_ENABLED"]) {
    //   return;
    // }
    return true;
  }
});

export { extension };
