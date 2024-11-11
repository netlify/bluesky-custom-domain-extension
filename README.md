# Bluesky Custom Domain extension for Netlify

An extension that lets you use our Netlify site domain as a custom handle in [Bluesky](https://bsky.app). It works with custom domains or the default `.netlify.app` subdomains.

After installing the extension, you'll need the DID of your Bluesky account:

1. Go to the [Bluesky settings page](https://bsky.app/settings)
2. Click on _Change Handle_
3. Click on _I have my own domain_
4. Select the _No DNS Panel_ tab
5. Type the domain you want to use
6. Copy the contents of the text starting with `did:`

Now it's time to configure the extension:

1. In the Netlify app, navigate to the site associated with the domain you want to use
2. Click on _Site configuration_
3. Under _General site settings_, click on _Bluesky Custom Handle_
4. Insert the DID obtained before and click on _Save_
5. Trigger a new production deploy of your site

Finally, go back to the Bluesky UI and click on _Verify Text File_.
