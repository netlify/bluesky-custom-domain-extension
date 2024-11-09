import type { Config } from "@netlify/functions";

export default async () => {
  const did = Netlify.env.get("BLUESKY_DID");

  if (!did) {
    return new Response("Bluesky did is not configured", { status: 500 });
  }

  return new Response(did, {
    headers: {
      "content-type": "text/plain"
    }
  });
};

export const config: Config = {
  path: "/.well-known/atproto-did"
};
