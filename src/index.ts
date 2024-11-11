// Documentation: https://sdk.netlify.com
import { NetlifyExtension } from "@netlify/sdk";

const extension = new NetlifyExtension();

extension.addFunctions("./src/functions", {
  prefix: "bluesky-custom-domain",
  shouldInjectFunction: () => Boolean(process.env["BLUESKY_DID"])
});

export { extension };
