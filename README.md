# Characters of the Darkness

Characters of the Darkness is a local-first character builder and sheet manager for Chronicles of Darkness. It currently supports Changeling: The Lost and Mage: The Awakening, with English (`en-US`) and Brazilian Portuguese (`pt-BR`) presentation.

The application runs on [Vinext](https://github.com/cloudflare/vinext), Vite, React, and Cloudflare. Large rules catalogs are served as static data and loaded only for the selected game line.

## Prerequisites

- Node.js `>=22.13.0`
- Bash with `flock`, `curl`, and GNU `timeout` for the repository's verified install/build wrappers

## Development

```bash
npm run install:ci
npm run dev
```

Useful checks:

```bash
npm run lint
npm run build
node --test --test-concurrency=1 tests/*.test.mjs
npx tsc --noEmit
git diff --check
```

The verified npm wrappers are designed for Bash environments and use project-scoped runtime directories through `scripts/sites-env.sh`. `.sites-runtime/` and Wrangler runtime state are disposable and ignored by Git.

See [AGENTS.md](AGENTS.md) for architecture, ownership boundaries, catalog rules, persistence policy, quality gates, and contribution guidance.

## Runtime and deployment

Cloudflare configuration lives in `wrangler.jsonc`; `.openai/hosting.json` declares the Sites project and D1 binding. The Worker entry is `worker/index.ts`, static assets are emitted to `dist/client`, and the server entry is emitted to `dist/server/index.js`.

Workspace identity is read from the `oai-authenticated-user-email` header, with the optional percent-encoded full-name headers used when available. `app/chatgpt-auth.ts` contains the server-only helpers for dispatch-owned ChatGPT sign-in. D1 access is isolated under `db/`.

Catalog data under `public/data/**` must remain compatible with static deployment. Browser code must not assume runtime filesystem access.
