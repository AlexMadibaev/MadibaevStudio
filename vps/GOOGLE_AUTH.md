# Google-only admin login

The admin panel no longer accepts a password. A session is issued only after Google OAuth succeeds and Google returns a verified email that exactly matches `ADMIN_GOOGLE_EMAIL`.

## 1. Create Google OAuth credentials

In Google Cloud Console:

1. Create or select a project.
2. Configure the OAuth consent screen.
3. Create an OAuth client with application type **Web application**.
4. Add this Authorized redirect URI exactly:

   `https://madibaevstudio.online/api/admin/google/callback`

5. Copy the Client ID and Client Secret.

No Google API beyond the standard OpenID Connect identity scopes is required. The app requests only `openid email profile`.

## 2. Configure the VPS `.env`

Set real values only on the VPS; never commit them:

```env
ADMIN_SESSION_SECRET=<at-least-64-random-characters>
ADMIN_GOOGLE_EMAIL=<the-one-google-email-allowed-to-enter-admin>
GOOGLE_CLIENT_ID=<google-web-client-id>
GOOGLE_CLIENT_SECRET=<google-web-client-secret>
GOOGLE_REDIRECT_URI=https://madibaevstudio.online/api/admin/google/callback
```

`ADMIN_GOOGLE_EMAIL` is case-normalized and must otherwise match the verified Google email exactly. Every other Google account is rejected.

Generate a strong session secret, for example:

```bash
openssl rand -base64 64
```

## 3. Deploy

From the repository root on the VPS:

```bash
cd vps
docker compose config
docker compose up -d --build
```

Then open:

`https://madibaevstudio.online/admin/login`

The only available sign-in method should be **Continue with Google**.

## Security properties

- Password login endpoint is disabled.
- OAuth uses a random `state` value to prevent login CSRF.
- OAuth uses PKCE (`S256`).
- Temporary OAuth cookies are HttpOnly, SameSite=Lax and short-lived.
- Google must report `email_verified=true`.
- Only the exact `ADMIN_GOOGLE_EMAIL` value is allowed.
- The resulting admin session remains HttpOnly and expires after 12 hours.
- Google client secret and owner email stay in VPS environment variables, not in the public repository.
