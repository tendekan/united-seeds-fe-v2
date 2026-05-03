# UnitedSeeds — React port

Modern, TypeScript + CSS Modules React rewrite of the vanilla JS app in the parent
folder. Lives side-by-side so the legacy app keeps working until this version is
validated.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle into dist/
npm run preview  # serve the build locally
```

## Stack

- **Vite + React 18 + TypeScript**
- **CSS Modules** with shared design tokens (`src/styles/tokens.css`)
- Same Google + Facebook OAuth client IDs as the legacy app (configured in `index.html`)
- No external state library — `Context` + `useState` are enough for this app

## Folder layout

```
src/
├── api/           # Typed wrappers around BE endpoints
├── contexts/      # Auth, Settings, Toast, Spinner
├── hooks/         # useGoogleAuth, useFacebookAuth
├── utils/         # storage, format, categories
├── types/         # Shared types + CSS module declarations
├── styles/        # Global tokens + base CSS
└── components/
    ├── ui/        # Button, Modal, Avatar, Spinner, Card, FormField
    ├── layout/    # Header, Sidebar, Footer, AppShell
    ├── auth/      # AuthModal, SignedOutLanding
    ├── posts/     # Composer, Card, List, Pagination, LikesModal, Media
    ├── comments/  # CommentsSection, CommentItem
    ├── profile/   # ProfileView, PhotoModal, UserListModal
    ├── feed/      # FeedView
    ├── services/  # ServicesView, ServicePostsView
    ├── dating/    # DatingView
    ├── settings/  # SettingsView
    ├── chatbot/   # Chatbot floating panel (logged-in only)
    └── cookie/    # CookieConsent banner
```

## Cross-component navigation

Components dispatch custom events (`us:openProfile`, `us:openServicePosts`) to
request the AppShell to switch view. This keeps deep components decoupled from
the navigation state without pulling in a router.

## Notes

- All BE calls go through `src/api/client.ts`, which auto-attaches the bearer
  token and signs the user out on 401.
- The chatbot toggle is rendered only when there is a logged-in `user`.

## Deploy to Vercel

Vercel auto-detects Vite, so no extra config file is needed. Pick whichever flow fits.

### Option A — Vercel dashboard (Git-connected)

1. Push this folder to a GitHub/GitLab/Bitbucket repo.
2. Go to <https://vercel.com/new> and import the repo.
3. When prompted, set **Root Directory** to the folder containing this `package.json` (e.g. `united-seeds-fe-v2`) if it isn't the repo root.
4. Confirm the auto-detected settings:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Click **Deploy**. Subsequent pushes to the default branch trigger production deploys; other branches and PRs get preview URLs.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel            # first run links the project and creates a preview deploy
vercel --prod     # promote to production
```

Run the commands from this directory. The CLI will pick up the Vite preset automatically.

### OAuth origins

Google and Facebook OAuth client IDs are configured in `index.html` and are tied to specific origins. After the first deploy, add the Vercel production domain (and any custom domains) to the **Authorized JavaScript origins** in the Google Cloud console and to the allowed domains in the Facebook app settings — otherwise sign-in will fail on the deployed site.

### Backend / CORS

`src/api/client.ts` calls the backend over HTTPS. Make sure the BE allows the Vercel domain in its CORS config. If the BE URL ever needs to vary by environment, expose it as a `VITE_`-prefixed env var in the Vercel project settings and read it via `import.meta.env`.