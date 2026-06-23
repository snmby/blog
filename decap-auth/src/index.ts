type Env = {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  CMS_ORIGIN?: string;
};

const AUTH_PATH = "/auth";
const CALLBACK_PATH = "/callback";
const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";

function cmsOrigin(env: Env) {
  return env.CMS_ORIGIN || "https://bolgwelt.top";
}

function encodeState(origin: string) {
  return btoa(JSON.stringify({ origin }));
}

function decodeState(state: string | null, fallbackOrigin: string) {
  if (!state) return fallbackOrigin;

  try {
    const parsed = JSON.parse(atob(state)) as { origin?: unknown };
    if (typeof parsed.origin === "string") {
      const origin = new URL(parsed.origin).origin;
      if (origin === fallbackOrigin) return origin;
    }
  } catch {
    return fallbackOrigin;
  }

  return fallbackOrigin;
}

function html(message: string, origin: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Auth</title>
  </head>
  <body>
    <script>
      if (window.opener) {
        window.opener.postMessage("authorizing:github", ${JSON.stringify(origin)});
        window.opener.postMessage(${JSON.stringify(message)}, ${JSON.stringify(origin)});
      }
      window.close();
    </script>
  </body>
</html>`;
}

function callbackUrl(url: URL) {
  return new URL(CALLBACK_PATH, url.origin).toString();
}

async function exchangeCode(code: string, redirectUri: string, env: Env) {
  const response = await fetch(GITHUB_TOKEN_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "snmby-decap-auth",
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
    }),
  });

  const data = (await response.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!response.ok || data.error) {
    throw new Error(data.error_description || data.error || `token exchange failed: ${response.status}`);
  }
  if (!data.access_token) {
    throw new Error("missing access token");
  }

  return data.access_token;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const redirectUri = callbackUrl(url);
    const allowedOrigin = cmsOrigin(env);

    if (url.pathname === "/" || url.pathname === AUTH_PATH) {
      const origin = url.searchParams.get("origin");
      const stateOrigin = origin ? new URL(origin).origin : allowedOrigin;

      const githubUrl = new URL(GITHUB_AUTHORIZE_URL);
      githubUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
      githubUrl.searchParams.set("redirect_uri", redirectUri);
      githubUrl.searchParams.set("scope", "repo,user:email");
      githubUrl.searchParams.set("allow_signup", "true");
      githubUrl.searchParams.set("state", encodeState(stateOrigin === allowedOrigin ? stateOrigin : allowedOrigin));

      return Response.redirect(githubUrl.toString(), 302);
    }

    if (url.pathname === CALLBACK_PATH) {
      const error = url.searchParams.get("error");
      const code = url.searchParams.get("code");
      const origin = decodeState(url.searchParams.get("state"), allowedOrigin);

      if (error) {
        return new Response(html(`authorization:github:error:${JSON.stringify({ message: error })}`, origin), {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      }

      if (!code) {
        return new Response(html(`authorization:github:error:${JSON.stringify({ message: "missing_code" })}`, origin), {
          status: 400,
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      }

      try {
        const token = await exchangeCode(code, redirectUri, env);
        return new Response(
          html(`authorization:github:success:${JSON.stringify({ token })}`, origin),
          {
          headers: { "content-type": "text/html; charset=utf-8" },
          },
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "oauth_failed";
        return new Response(
          html(`authorization:github:error:${JSON.stringify({ message })}`, origin),
          {
          status: 500,
          headers: { "content-type": "text/html; charset=utf-8" },
          },
        );
      }
    }

    return new Response("Not found", { status: 404 });
  },
};
