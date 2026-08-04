---
title: Austin AI Club - August 5, 2026 - Source Link Records
created: 2026-08-04
updated: 2026-08-04
type: summary
tags: [source-record, meetup]
sources: []
---

# Austin AI Club - August 5, 2026 - Source Link Records

## Agent Infrastructure

### Uncle Bob's senior job is constraints, not reading agent code
- Post: https://x.com/unclebobmartin/status/2080257779395154409
  - Title: "Uncle Bob on not reading agent-written code"
  - Type: Practitioner X post
  - Access: 2026-08-04
  - Notes: Robert C. Martin says his current strategy is not reading agent-written code and instead surrounding agents with extreme constraints and unit tests.

## Models & Research

### FLUX 3 collapses image, video, audio, and action into one backbone
- Source: https://bfl.ai/blog/flux-3
  - Title: "FLUX 3 - Real World Models"
  - Type: Official product blog
  - Access: 2026-08-04
  - Notes: Black Forest Labs launch post for the unified multimodal flow model covering video+audio early access, upcoming image access, action prediction with mimic robotics, and later open-weight FLUX 3 Dev.
- Post: https://x.com/bfl_ai/status/2080308988961554582
  - Title: "Introducing FLUX 3"
  - Type: Official X post
  - Access: 2026-08-04
  - Notes: BFL announcement framing FLUX 3 as one multimodal model for image, video, audio, and action prediction.

### Ling-3.0-flash bets 5.1B active can replace a 1T flagship
- Source: https://developer.ant-ling.com/en/docs/models/ling
  - Title: "Ling model docs"
  - Type: Official model documentation
  - Access: 2026-08-04
  - Notes: Ant Ling docs list Ling-3.0-flash as 124B total / 5.1B active, 256K native context extendable to 1M, hybrid reasoning, production-agent positioning.
- Source: https://huggingface.co/inclusionAI/Ling-3.0-flash
  - Title: "inclusionAI/Ling-3.0-flash"
  - Type: Hugging Face model page
  - Access: 2026-08-04
  - Notes: Public model card / artifact page for Ling-3.0-flash.
- Post: https://x.com/AntLingAGI/status/2080351022028095681
  - Title: "Releasing Ling-3.0-flash"
  - Type: Official X post
  - Access: 2026-08-04
  - Notes: Launch claim that 124B/5.1B-active matches or beats Ant's 1T flagship on most shown benchmarks.

### Local open drops keep specializing by size and job
- Source: https://poolside.ai/blog/introducing-laguna-s-2-1
  - Title: "Introducing Laguna S 2.1"
  - Type: Official product blog
  - Access: 2026-08-04
  - Notes: Poolside launch for the 118B/8B-active agentic coding MoE with up to 1M context and published evaluation trajectories.
- Source: https://huggingface.co/poolside/Laguna-S-2.1
  - Title: "poolside/Laguna-S-2.1"
  - Type: Hugging Face model page
  - Access: 2026-08-04
  - Notes: Open-weight Laguna S 2.1 artifact under OpenMDW-1.1.
- Source: https://huggingface.co/Nanbeige/Nanbeige4.2-3B
  - Title: "Nanbeige/Nanbeige4.2-3B"
  - Type: Hugging Face model page
  - Access: 2026-08-04
  - Notes: Compact Nanbeige 4.2 3B release called out in the local-drops roundup.
- Source: https://huggingface.co/upstage/Solar-Open2-250B
  - Title: "upstage/Solar-Open2-250B"
  - Type: Hugging Face model page
  - Access: 2026-08-04
  - Notes: Upstage Solar-Open2 250B open release included in the local packaging wave.
- Source: https://huggingface.co/shafire/Zero-Gemma4-E4B-OpenZero-GGUF
  - Title: "Zero-Gemma4-E4B-OpenZero-GGUF"
  - Type: Hugging Face model page
  - Access: 2026-08-04
  - Notes: OpenZero Gemma4-E4B GGUF packaging referenced by the local-drops roundup.
- Post: https://x.com/LocalAiCherry/status/2082461699622228141
  - Title: "Latest open source local drops"
  - Type: Aggregator X post
  - Access: 2026-08-04
  - Notes: Roundup post listing Laguna-S2.1, Nanbeige 4.2 3B, Solar-Open2 250B, Bonsai/Ternary-Bonsai, Qwen3.6/BTL-3, and OpenZero Gemma4 builds.

### Astra turns open math problems into Lean certificates for about $2K
- Source: https://openai.com/index/ten-advances-in-mathematics/
  - Title: "Ten advances in mathematics and theoretical computer science"
  - Type: Official research announcement
  - Access: 2026-08-04
  - Notes: OpenAI announcement that an internal Astra version produced ten long-open math/TCS results at roughly $2,000 Sol API token cost.
- Repo: https://github.com/openai/ten-proofs
  - Title: "openai/ten-proofs"
  - Type: GitHub repository
  - Access: 2026-08-04
  - Notes: Lean 4 formalizations accompanying the ten results; repo reports zero sorry count.
- Source: https://cdn.openai.com/pdf/ten-proofs-oai.pdf
  - Title: "Ten proofs manuscript PDF"
  - Type: Official PDF manuscript
  - Access: 2026-08-04
  - Notes: Published manuscript accompanying the Lean certificates.
- Post: https://x.com/gdb/status/2083457463337287721
  - Title: "Greg Brockman on Astra math advances"
  - Type: Official X post
  - Access: 2026-08-04
  - Notes: OpenAI president highlights ten advances solved with internal Astra for about $2,000 at Sol API prices.

### Karpathy replaces pelican-SVG with a $10 Middle-earth world
- Source: https://karpathy.ai/lotr-movie/
  - Title: "karpathy.ai/lotr-movie"
  - Type: Playable demo / source host
  - Access: 2026-08-04
  - Notes: Browser-playable Three.js world Karpathy published from the Opus 5 experiment.
- Post: https://x.com/karpathy/status/2083749667410727319
  - Title: "Opus 5 Lord of the Rings Three.js experiment"
  - Type: Researcher X post
  - Access: 2026-08-04
  - Notes: Karpathy describes the 1M-token / ~$10 Opus 5 experiment producing ~5,500 lines of procedural Three.js code and the visual self-audit weakness.

### Pokee-Isaac claims real 10M-token agent context on one GPU
- Source: https://pokee.ai/
  - Title: "Pokee"
  - Type: Official product page
  - Access: 2026-08-04
  - Notes: Product surface claiming Pokee-Isaac 28B with 10M-token context and single-GPU deploy.
- Source: https://docs.pokee.ai/docs/models
  - Title: "Pokee models and pricing"
  - Type: Official documentation
  - Access: 2026-08-04
  - Notes: Docs for Pokee Isaac model tiers and API usage.
- Post: https://x.com/Pokee_AI/status/2084682445648216383
  - Title: "Releasing Pokee-Isaac 28B"
  - Type: Official X post
  - Access: 2026-08-04
  - Notes: Vendor launch claims including 10M context, 93.3% RULER at 10M, and RTX 4090-class single-GPU deploy; treat superlatives as author-reported.

## Security

### Bitcoin red team runs on Kimi K3 while OpenAI sits out
- Post: https://x.com/Rob1Ham/status/2083546478409056301
  - Title: "Bitcoin responders using Kimi K3 for cyber"
  - Type: Practitioner X post
  - Access: 2026-08-04
  - Notes: Rob Hamilton says responders are using Kimi K3 for cyber defense after OpenAI chiding, with over 1,000 bitcoin already stolen via LLM-assisted attacks per his account.
- Post: https://x.com/Rob1Ham/status/2084523368783438198
  - Title: "Bitcoin Red Team Update"
  - Type: Practitioner X post
  - Access: 2026-08-04
  - Notes: Update claiming ~$20,000 spend across services and that funding for the red-team effort is secured.
- Post: https://x.com/premai_io/status/2084552134444662986
  - Title: "Prem launches prem-router for Kimi-K3 access"
  - Type: Company X post
  - Access: 2026-08-04
  - Notes: Prem says demand from bitcoin researchers and security experts drove prem-router and sponsored credits for open-source model access.
- Source: https://www.premai.io/
  - Title: "Prem"
  - Type: Official company site
  - Access: 2026-08-04
  - Notes: Prem's public sovereign/confidential AI product surface supporting the router announcement context.

### Shai-Hulud hits keyv and 2B monthly npm installs
- Source: https://www.aikido.dev/blog/keyv-and-friends-compromised-in-npm-supply-chain-attack
  - Title: "Keyv and friends compromised in active Shai-Hulud supply chain attack"
  - Type: Security research writeup
  - Access: 2026-08-04
  - Notes: Aikido details the August 4 keyv maintainer GitHub compromise, worm propagation, credential theft, and hundreds of packages totaling over 2B monthly installs.
- Source: https://devops.com/fast-moving-shai-hulud-attack-infects-npm-packages-with-2-billion-monthly-downloads/
  - Title: "Fast-Moving Shai-Hulud Attack Infects npm Packages with 2 Billion Monthly Downloads"
  - Type: Trade reporting
  - Access: 2026-08-04
  - Notes: Submitted DevOps.com summary of the Aikido/Endor-tracked wave and 2B+ monthly install exposure.

## Big Tech Moves

### OpenAI cuts GPT-5.6 Luna 80% and Terra 20%
- Source: https://openai.com/index/advancing-the-price-performance-frontier-with-gpt-5-6/
  - Title: "Advancing the price-performance frontier with GPT-5.6"
  - Type: Official pricing announcement
  - Access: 2026-08-04
  - Notes: OpenAI announces 80% Luna and 20% Terra API price cuts plus Fast mode for Sol, attributing the cuts to runtime-efficiency gains.
- Post: https://x.com/OpenAI/status/2082878156483219672
  - Title: "GPT-5.6 Luna and Terra price reductions"
  - Type: Official X post
  - Access: 2026-08-04
  - Notes: OpenAI announcement of the Luna 80% and Terra 20% reductions and faster Sol API option.

## Showcase

### Community Slot
- Link: https://github.com/AustinKelsay/austin-ai-club
  - Title: "Austin AI Club"
  - Type: Community repository
  - Access: 2026-08-04
  - Notes: Default Community Slot destination for open member shares at the upcoming Meetup.
