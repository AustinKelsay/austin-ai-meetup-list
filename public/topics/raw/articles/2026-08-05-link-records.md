---
title: Austin AI Club - August 5, 2026 - Source Link Records
created: 2026-08-04
updated: 2026-08-05
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

### Closed model releases
- Source: https://bfl.ai/blog/flux-3
  - Title: "FLUX 3 - Real World Models"
  - Type: Official product blog
  - Access: 2026-08-04
  - Notes: Black Forest Labs launch post for the unified multimodal flow model covering video+audio early access, upcoming image access, action prediction, and later open-weight FLUX 3 Dev.
- Post: https://x.com/bfl_ai/status/2080308988961554582
  - Title: "Introducing FLUX 3"
  - Type: Official X post
  - Access: 2026-08-04
  - Notes: BFL announcement framing FLUX 3 as one multimodal model for image, video, audio, and action prediction.
- Post: https://x.com/mimicrobotics/status/2080307032746336367
  - Title: "Introducing FLUX-mimic"
  - Type: Company X post
  - Access: 2026-08-05
  - Notes: Mimic Robotics launch for FLUX-mimic, a video-action model on the FLUX 3 backbone for general-purpose dexterity, with Audi as an early manufacturing partner.
- Source: https://www.mimicrobotics.com/blog/introducing-flux-mimic
  - Title: "Introducing FLUX-mimic"
  - Type: Official product blog
  - Access: 2026-08-05
  - Notes: Technical blog for the FLUX 3 video-backbone + action-decoder robotics stack and sample-efficiency claims.
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

### Open model releases
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
- Post: https://x.com/poolsideai/status/2079613777343848465
  - Title: "Releasing Laguna S 2.1"
  - Type: Official X post
  - Access: 2026-08-05
  - Notes: Poolside launch tweet for the 118B/8B-active Laguna S 2.1 coding MoE with up to 1M context; high-engagement open-release anchor for the roundup.
- Source: https://huggingface.co/Nanbeige/Nanbeige4.2-3B
  - Title: "Nanbeige/Nanbeige4.2-3B"
  - Type: Hugging Face model page
  - Access: 2026-08-04
  - Notes: Compact Nanbeige 4.2 3B release called out in the open-release roundup.
- Source: https://huggingface.co/upstage/Solar-Open2-250B
  - Title: "upstage/Solar-Open2-250B"
  - Type: Hugging Face model page
  - Access: 2026-08-04
  - Notes: Upstage Solar-Open2 250B open release included in the open packaging wave.
- Post: https://x.com/hunkims/status/2079949203615453414
  - Title: "Solar Open 2 announcement"
  - Type: Practitioner X post
  - Access: 2026-08-05
  - Notes: Sung Kim announces Solar Open 2 and points to the Hugging Face weights; used when an official Upstage launch post was not recovered.
- Source: https://huggingface.co/shafire/Zero-Gemma4-E4B-OpenZero-GGUF
  - Title: "Zero-Gemma4-E4B-OpenZero-GGUF"
  - Type: Hugging Face model page
  - Access: 2026-08-04
  - Notes: OpenZero Gemma4-E4B GGUF packaging referenced by the open-release roundup.
- Post: https://x.com/LocalAiCherry/status/2082461699622228141
  - Title: "Latest open source local drops"
  - Type: Aggregator X post
  - Access: 2026-08-04
  - Notes: Roundup post listing Laguna-S2.1, Nanbeige 4.2 3B, Solar-Open2 250B, Bonsai/Ternary-Bonsai, Qwen3.6/BTL-3, and OpenZero Gemma4 builds.

### DeepSeek V4 Flash 0731 is absurd for 13B active
- Source: https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash-0731
  - Title: "deepseek-ai/DeepSeek-V4-Flash-0731"
  - Type: Hugging Face model page
  - Access: 2026-08-05
  - Notes: Official MIT Flash-0731 release card; author-reported Terminal-Bench 2.1 score of 82.7 and agent-suite comparisons vs Flash Preview and V4-Pro Preview; ships with DSpark speculative decoding attached.
- Post: https://x.com/deepseek_ai/status/2083084415157022911
  - Title: "DeepSeek-V4-Flash Official API public beta"
  - Type: Official X post
  - Access: 2026-08-05
  - Notes: DeepSeek launch announcing the official V4-Flash API, agent upgrades past V4-Pro Preview, Responses API support, and Codex adaptation.
- Post: https://x.com/deepseek_ai/status/2083084419515220191
  - Title: "Flash-0731 same architecture note"
  - Type: Official X post
  - Access: 2026-08-05
  - Notes: Clarifies Flash-0731 keeps the preview architecture/size and that only the Flash API was updated (Pro unchanged).
- Post: https://x.com/SciTechera/status/2083806034661884030
  - Title: "Flash vs Fable 5 Terminal-Bench cost"
  - Type: Aggregator X post
  - Access: 2026-08-05
  - Notes: Third-party garnish citing Artificial Analysis: Flash 82.7 vs Claude Fable 5 80.5 on Terminal-Bench 2.1 at roughly $0.03 vs $3.15 per task (~105×).
- Post: https://x.com/Hesamation/status/2084658830990880896
  - Title: "DeepSeek cost-per-task chart"
  - Type: Practitioner X post
  - Access: 2026-08-05
  - Notes: Chart-style reaction that DeepSeek's cost-per-task bar is barely visible next to other frontier models; visual garnish for the Flash pricing story.
- Source: https://api-docs.deepseek.com/quick_start/pricing
  - Title: "DeepSeek Models & Pricing"
  - Type: Official API documentation
  - Access: 2026-08-05
  - Notes: Lists deepseek-v4-flash as DeepSeek-V4-Flash-0731 at $0.14/$0.28 per 1M tokens (cache miss/output) with 1M context.
- Source: https://api-docs.deepseek.com/quick_start/agent_integrations/codex
  - Title: "DeepSeek Codex agent integration"
  - Type: Official API documentation
  - Access: 2026-08-05
  - Notes: Official Codex configuration docs linked from the Flash launch post.
- Source: https://arxiv.org/abs/2606.19348
  - Title: "DeepSeek-V4 technical report"
  - Type: Technical report
  - Access: 2026-08-05
  - Notes: Defines Flash as 284B total / 13B activated MoE with 1M context; 0731 keeps that size per DeepSeek's note tweet.

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
- Post: https://x.com/SebastienBubeck/status/2083456300692979886
  - Title: "Bubeck on Astra Lean proofs"
  - Type: Researcher X post
  - Access: 2026-08-05
  - Notes: OpenAI math lead frames the ten Astra results with Lean certificates and CoT walkthroughs; high-engagement launch post.
- Post: https://x.com/gdb/status/2083457463337287721
  - Title: "Greg Brockman on Astra math advances"
  - Type: Official X post
  - Access: 2026-08-04
  - Notes: OpenAI president highlights ten advances solved with internal Astra for about $2,000 at Sol API prices.
- Post: https://x.com/polynoamial/status/2083467194663571701
  - Title: "Noam Brown on Astra open problems"
  - Type: Researcher X post
  - Access: 2026-08-05
  - Notes: Noam Brown's widely shared Astra announcement covering the ten open-problem results and next-major-model framing.

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
- Post: https://x.com/karpathy/status/2083948654377996480
  - Title: "Karpathy on pelican-on-a-bicycle follow-up"
  - Type: Researcher X post
  - Access: 2026-08-05
  - Notes: Follow-up pointing at Simon Willison's pelican-on-a-bicycle eval writeup and publishing playable source for the Middle-earth demo.

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
- Post: https://x.com/AikidoSecurity/status/2084584370556530882
  - Title: "keyv actively compromised"
  - Type: Security vendor X post
  - Access: 2026-08-05
  - Notes: Aikido's live alert that keyv (~127M weekly downloads) was being actively compromised and malware was still spreading.
- Post: https://x.com/wiz_io/status/2084605657571840473
  - Title: "Wiz on keyv/cacheable npm supply chain attack"
  - Type: Security vendor X post
  - Access: 2026-08-05
  - Notes: Wiz Research alert covering affected keyv/cacheable ecosystem packages, IOCs, and mitigations.
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
- Post: https://x.com/sama/status/2082880720989532597
  - Title: "Sam Altman on GPT-5.6 price cuts"
  - Type: Executive X post
  - Access: 2026-08-05
  - Notes: Altman restates the Luna 80% and Terra 20% cuts plus Sol Fast mode; high-engagement pricing garnish for the Topic.

## Showcase

### Community Slot
- Link: https://github.com/AustinKelsay/austin-ai-club
  - Title: "Austin AI Club"
  - Type: Community repository
  - Access: 2026-08-04
  - Notes: Default Community Slot destination for open member shares at the upcoming Meetup.
