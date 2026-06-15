# Admin

Decap CMS configuration for GitHub Pages.

GitHub OAuth App callback URL:

`https://decap-auth.snmby.workers.dev/callback`

Deploy the worker in `decap-auth/`, then set its secrets:

`wrangler secret put GITHUB_CLIENT_ID`
`wrangler secret put GITHUB_CLIENT_SECRET`
