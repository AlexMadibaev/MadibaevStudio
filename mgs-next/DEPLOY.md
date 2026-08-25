# MGS MVP on Vercel

## Project settings

- Repository: `AlexMadibaev/MadibaevStudio`
- Branch: `codex/mgs-site-copy`
- Root Directory: `mgs-next`
- Framework preset: `Next.js`
- Build command: `next build`

## Required environment variables

Add these variables for Production, Preview, and Development when needed:

```text
ADMIN_PASSWORD=<your admin password>
ADMIN_SESSION_SECRET=<long random secret>
BLOB_READ_WRITE_TOKEN=<token from a Vercel Blob store>
```

Create a private Vercel Blob store before using project editing or enquiries. The
store is used for `mgs-admin/projects.json` and one private JSON record per
enquiry. The first read seeds the store from `lib/mgs-project-data.ts`.

## Admin URLs

```text
/admin/login
/admin
/admin/projects
/admin/enquiries
```

After the first deployment, verify:

1. `/admin/login` accepts `ADMIN_PASSWORD`.
2. `/admin/projects` shows the seeded project cards and cover previews.
3. Saving a draft works before publishing it.
4. `/contact` creates an enquiry and `/admin/enquiries` lists it.

Without `BLOB_READ_WRITE_TOKEN`, the public site still renders the bundled
projects, while admin writes and enquiry submission remain disabled.
