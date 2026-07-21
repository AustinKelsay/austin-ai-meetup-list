# Publishing the Realtime Voice Arena BenchPack

Date: 2026-07-21

## Recommendation

Publish Realtime Voice Arena as its own public GitHub repository. Because the current manifest declares a `type: "web"` BenchPack, also deploy each version's web UI at an immutable public HTTPS URL and publish a versioned manifest that points to it. Link the showcase slide to the repository for people, and include the versioned manifest URL in the repository README for BenchLocal's **Install from URL** flow.

The important distinction is:

- The **repository** is the small, explicit thing we can share: source, README, methodology, license, screenshots, development instructions, and release history.
- For a traditional **table pack**, the **release archive** is what BenchLocal installs: an already-built, versioned artifact with `benchlocal.pack.json`, the compiled entry under `dist/`, and every runtime file it needs.
- For this **web pack**, BenchLocal installs the manifest and opens the hosted versioned web entry. Both the manifest and hosted build must be public and immutable by version.

This avoids presenting one directory inside the much larger Spark-cluster repository as though that directory were itself the published package. It also matches BenchLocal's documented distribution model rather than inventing a special monorepo install path.

## What BenchLocal normally publishes

BenchLocal explicitly distinguishes source checkouts from installable artifacts. Official packs come from its registry; custom table packs normally come from a specific HTTP(S) archive URL; local repository paths are only a development convenience. A table-pack artifact contains `benchlocal.pack.json` and `dist/...`; a practical artifact also includes `README.md`, `METHODOLOGY.md`, and `verification/` when required. BenchLocal does not run a general fresh `npm install` for an installed table pack, so the archive must already be runnable and must carry any additional runtime files or dependencies it owns. [BenchLocal: Registry and Distribution](https://www.benchlocal.com/docs/registry-and-distribution/)

Realtime Voice Arena is currently different: its installed manifest is a web pack whose entry and allowed origin are `http://127.0.0.1:5177`, with microphone audio sent to `wss://inference.finite.computer`. BenchLocal's web-pack design calls for immutable HTTPS entries such as `https://packs.benchlocal.com/{pack-id}/{version}/index.html`, with the registry or install URL resolving a versioned manifest. Publishing therefore requires replacing the loopback entry with a public versioned web build and deciding whether the Finite realtime endpoint is publicly usable, authenticated, or merely documented as a required private dependency. [BenchLocal: Interactive Web Bench Packs](../../../../BenchLocal/docs/interactive-web-benchpacks.md)

The public minimal example reinforces the source/build split: author `benchlocal.pack.json` and a thin `benchlocal/index.ts` adapter, keep benchmark logic separate, and compile the runtime to the manifest's entry such as `dist/benchlocal/index.js`. [BenchLocal: Minimal BenchPack Example](https://www.benchlocal.com/docs/examples/minimal-benchpack/)

If Realtime Voice Arena needs Python, system packages, model-serving components, or another environment-specific runtime, those should normally live in a declared verifier rather than leak into the BenchLocal host adapter. BenchLocal documents `verification/` plus a Dockerfile and small HTTP runtime as the normal shape for this boundary. [BenchLocal: Verifier-Dependent Bench Packs](https://www.benchlocal.com/docs/verifier-dependent-bench-packs/)

## Why a separate repository is useful, but not sufficient

A dedicated repository solves the current sharing problem:

- Its root can be the BenchPack rather than the Spark-cluster root.
- The README can explain what the benchmark measures, hardware/model assumptions, installation, and the difference between pack code and the local Spark deployment.
- Releases, issues, tags, stars, forks, and citations all refer to the benchmark itself.
- A license and methodology can be made unambiguous at the pack boundary.

However, a normal GitHub source archive is not automatically an installable BenchPack. For this web pack, the deployable UI and public manifest are the install surface; a GitHub Release can still capture source and build assets for provenance, but it does not replace HTTPS hosting. If the project later publishes a table-pack variant, attach an explicitly built archive such as `realtime-voice-arena-benchpack-v0.1.0.zip` rather than assuming GitHub's automatic source ZIP contains the required compiled output. GitHub Releases are tag-based, versioned software publications and support downloadable release assets in addition to GitHub's automatic source ZIP/tarball. [GitHub: About releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)

## Extracting it from the Spark-cluster repository

Choose one of these based on whether its existing commit history is meaningful:

1. **Clean-copy extraction (recommended for an initial small pack):** create a new repository containing only the pack-owned files, with a first commit explaining its origin and linking back to the Spark-cluster project. This gives the cleanest public history and makes accidental inclusion of cluster secrets, configs, datasets, model weights, or unrelated infrastructure less likely.
2. **History-preserving extraction:** work from a fresh clone and use `git filter-repo --subdirectory-filter <pack-folder>` so the pack folder becomes the new repository root. GitHub documents this as its supported procedure for turning a subfolder into a new repository without losing that subfolder's history, while noting that the new repository does not inherit the original repo's branches and tags. [GitHub: Splitting a subfolder into a new repository](https://docs.github.com/en/get-started/using-git/splitting-a-subfolder-out-into-a-new-repository)

Do not make the released pack a Git submodule or require users to clone the Spark repository. That would preserve the exact coupling we are trying to remove and would not match BenchLocal's archive-install model.

## Suggested repository and release shape

```text
realtime-voice-arena-benchpack/
├── benchlocal.pack.json
├── benchlocal/
│   └── index.ts
├── lib/
├── verification/          # only if the benchmark needs a verifier
├── scripts/
│   └── package.*          # builds and archives the installable artifact
├── README.md
├── METHODOLOGY.md
├── LICENSE
├── package.json
└── tests/
```

For each web-pack version:

1. Run tests and build the web app.
2. Deploy the build at an immutable HTTPS URL containing the pack id and version.
3. Publish `benchlocal.pack.json` with that HTTPS `entry`, matching `allowedOrigins`, permissions, data policy, and a unique build id.
4. Smoke-test installation from that exact public manifest on a machine without the Spark repository or local dev server.
5. Tag the source repository (for example, `v0.3.0`) and create a matching GitHub Release for provenance and release notes.
6. Put the stable, version-specific manifest URL in the README; put the repository URL on the showcase slide.

Version-specific URLs are preferable to a moving `latest` URL for reproducible installs. The README may additionally point at the newest release for human convenience.

## When a template repository would help

A GitHub template repository is useful only if the goal expands to helping other people start *new* BenchPacks from the same scaffold. GitHub templates copy a repository's directory structure and files into a new repository with unrelated history; they are not a release or package-distribution mechanism. Realtime Voice Arena itself should be a normal repository. A generic BenchPack starter could become a separate template later. [GitHub: Creating a template repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository)

## Publication checklist

- Confirm the pack is legally separable from the Spark repository and select an explicit license.
- Remove secrets, machine-specific paths, private endpoints, local run histories, datasets/model weights that cannot be redistributed, and unnecessary cluster configuration.
- State hardware, model, Docker, BenchLocal-version, and host-feature requirements in both the README and `benchlocal.pack.json` where supported.
- Include methodology, scenario provenance, scoring behavior, limitations, and reproducibility notes.
- Replace the loopback `entry` and `allowedOrigins` with the immutable public HTTPS deployment.
- Decide and document who can authenticate to `wss://inference.finite.computer`; public source does not make a private backend reproducible.
- Test installation from the final public manifest URL on a machine that does not have the Spark repository, local dev server, or pack source toolchain.
- Keep the showcase copy focused on the demo, but make its primary link the dedicated repository once published; keep NVIDIA PersonaPlex and the Hugging Face model card as upstream/source links.
