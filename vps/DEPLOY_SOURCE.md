# VPS application source

The production Docker image is built from `../mgs-next`.

Do not add a second copy of `app`, `components`, `lib`, `public`, package manifests, or Next.js configuration under `vps/`. Keep only deployment infrastructure in this directory.
