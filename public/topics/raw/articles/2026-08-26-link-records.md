---
title: Austin AI Club - August 26, 2026 - Source Link Records
created: 2026-08-25
updated: 2026-08-26
type: summary
tags: [source-record, meetup]
sources: []
---

# Austin AI Club - August 26, 2026 - Source Link Records

## Agent Infrastructure

### OpenAI opens the Codex harness as a product platform
- Blog: https://developers.openai.com/blog/codex-as-a-platform
  - Title: "Codex as a platform: build on the open agent harness"
  - Type: Official developer platform post
  - Access: 2026-08-26
  - Notes: OpenAI argues the App, CLI, and IDE are front doors on one open-source harness, and that retained reasoning plus compaction raised GPT-5.6 Sol from 13.3% to 38.3% on ARC-AGI-3 while cutting output tokens sixfold. Treat those numbers as vendor-reported harness effects.
- Repo: https://github.com/openai/codex/tree/main/codex-rs/app-server
  - Title: "codex-rs/app-server"
  - Type: Open-source Codex app-server
  - Access: 2026-08-26
  - Notes: Exact folder for the documented client protocol that lets a host app create threads, stream events, expose tools, and handle approvals.
- Post: https://x.com/OpenAIDevs/status/2090230646497251387
  - Title: "OpenAI Developers on the open-source Codex harness"
  - Type: Official X post
  - Access: 2026-08-26
  - Notes: Launch thread for embedding the harness into internal apps and operations dashboards while the host owns interface, context, tools, and approvals.
- Post: https://x.com/gdb/status/2090246288478814281
  - Title: "Greg Brockman on Codex beyond coding tools"
  - Type: Official X post
  - Access: 2026-08-26
  - Notes: Cites a tax-prep pilot of 7,000 returns with about a one-third time cut, then points builders at the open harness.

### Omarchy Quattro makes coding agents an OS default
- Release: https://github.com/basecamp/omarchy/releases/tag/v4.0.0
  - Title: "v4.0.0 The Quattro Release"
  - Type: GitHub release
  - Access: 2026-08-26
  - Notes: Omarchy 4.0.0 shipped August 14 with a Quickshell desktop rewrite and a configurable default coding agent (lazy-installed, Super+Shift+Ctrl+A).
- Source: https://omarchy.org/manual/ai/
  - Title: "AI — The Omarchy Manual"
  - Type: Official documentation
  - Access: 2026-08-26
  - Notes: Documents first-class coding-agent launchers (Claude Code, Codex, OpenCode, and others), the agents usage panel, crash-to-agent diagnosis, and optional LM Studio / Ollama local models. Agents are not forced on at install.
- Source: https://world.hey.com/dhh/a-petabyte-worth-of-omarchy-in-a-month-a1fc538e
  - Title: "A petabyte worth of Omarchy in a month"
  - Type: Author blog
  - Access: 2026-08-26
  - Notes: DHH's vendor-reported popularity claim: a petabyte of ISOs in thirty days, framed as about 150,000 installs. Treat as his ISO-byte math, not an independent census.
- Source: https://omarchy.org/news/2026/08/omacom-foundation-funding-hits-10m
  - Title: "Omacom Foundation funding hits $10m"
  - Type: Official project news
  - Access: 2026-08-26
  - Notes: Nonprofit backing reached $10M from ten named $1M patrons, including Drew Houston and Peter Steinberger after the original eight. Not a priced company round.
- Post: https://x.com/dhh/status/2088304854603047019
  - Title: "DHH on Omarchy Quattro shipping"
  - Type: Official X post
  - Access: 2026-08-26
  - Notes: Launch post with the 90-minute intro video attached. High-signal popularity vector for the release, not an independent install census.
- Post: https://x.com/tobi/status/2088333047024202115
  - Title: "Tobi Lütke on a malleable OS for the agentic age"
  - Type: High-signal X reaction
  - Access: 2026-08-26
  - Notes: Shopify CEO quote-tweet calling Quattro a fully malleable operating system for the agentic age. Reaction, not a technical changelog.
- Video: https://www.youtube.com/watch?v=F7fe9pa8OeE
  - Title: "Omarchy Quattro introduction"
  - Type: Official launch video
  - Access: 2026-08-26
  - Notes: Linked from the v4.0.0 release notes as the full Quattro introduction.
- Video: https://www.youtube.com/watch?v=9SDkU5VDQEQ
  - Title: "You need to switch to Linux RIGHT NOW!!"
  - Type: Independent installer / popularity video
  - Access: 2026-08-26
  - Notes: NetworkChuck's mid-August Quattro install walkthrough; useful as the broader Linux-switch conversation, not as a view-count source.

## Models & Research

### Closed model releases
- Source: https://openai.com/index/improving-gpt-5-6-sol-in-chatgpt/
  - Title: "Improving GPT-5.6 Sol in ChatGPT—and expanding access to GPT-5.6 Luna for free users"
  - Type: Official model update
  - Access: 2026-08-26
  - Notes: OpenAI released ChatGPT-specific August checkpoints on August 6: an updated Sol with an effort slider and Luna as the rolling default for Free and Go users. Codex and ChatGPT Work kept the July checkpoints.
- Post: https://x.com/OpenAI/status/2085434712429052386
  - Title: "OpenAI on GPT-5.6 Sol/Luna in ChatGPT"
  - Type: Official X post
  - Access: 2026-08-26
  - Notes: Launch post for the ChatGPT Sol refresh and unlimited Luna text chats for Free and Go.
- Source: https://x.ai/news/grok-imagine-image-2
  - Title: "Imagine Image 2.0"
  - Type: Official model launch
  - Access: 2026-08-26
  - Notes: SpaceXAI launched its closed image generation and editing model on August 7 with regional edits, multi-reference input, resizing, consumer-app access, and an API model ID.
- Post: https://x.com/grok/status/2085931542262526102
  - Title: "Announcing Imagine Image 2.0"
  - Type: Official X post
  - Access: 2026-08-26
  - Notes: Grok product account launch for precision editing, typography, and real-work image generation.
- Source: https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-3-7-flash/
  - Title: "Introducing Gemini 3.7 Flash"
  - Type: Official model launch
  - Access: 2026-08-25
  - Notes: Google launched Gemini 3.7 Flash on August 13 for coding and agent workflows at an introductory price equal to half Gemini 3.6 Flash's original per-token price.
- Post: https://x.com/GoogleDeepMind/status/2087948366294515977
  - Title: "Gemini 3.7 Flash is here"
  - Type: Official X post
  - Access: 2026-08-26
  - Notes: DeepMind launch thread for coding, knowledge work, and web development; pairs with the half-price intro token rate.
- Source: https://openai.com/index/expanding-daybreak-as-the-cyber-defense-window-narrows/
  - Title: "Expanding Daybreak as the Cyber Defense Window Narrows"
  - Type: Official model and access launch
  - Access: 2026-08-25
  - Notes: OpenAI introduced GPT-5.6-Cyber through the identity-verified Daybreak Red tier for approved vulnerability research, exploit development, and red teaming.
- Post: https://x.com/OpenAI/status/2086864365379010729
  - Title: "OpenAI expands Daybreak and ships GPT-5.6-Cyber"
  - Type: Official X post
  - Access: 2026-08-26
  - Notes: Launch post pairing Daybreak Blue/Red access with the gated cyber specialist model.
- Source: https://x.ai/news/grok-4-6
  - Title: "Introducing Grok 4.6"
  - Type: Official model launch
  - Access: 2026-08-26
  - Notes: SpaceXAI launched Grok 4.6 on August 12 for long-running agents, coding, knowledge work, and interactive or visual artifact creation; benchmark claims are vendor-reported.
- Post: https://x.com/SpaceXAI/status/2087562800982077492
  - Title: "Introducing Grok 4.6"
  - Type: Official X post
  - Access: 2026-08-26
  - Notes: SpaceXAI launch at unchanged $2/$6 pricing, live in Cursor, Grok Build, and the API.
- Source: https://z.ai/blog/glm-5.3
  - Title: "GLM-5.3: Frontier Coding with Emergent Cyber Capabilities"
  - Type: Official API model launch
  - Access: 2026-08-26
  - Notes: Z.ai launched GLM-5.3 in its API on August 14 and said weights would follow in two weeks after safety evaluation and hardening. The flagship remains in the closed roundup; GLM-5.3-Flash shipped MIT weights on August 26 and lives in Open.
- Post: https://x.com/Zai_org/status/2088132965922476159
  - Title: "Introducing GLM-5.3"
  - Type: Official X post
  - Access: 2026-08-26
  - Notes: Z.ai launch framing coding/agent gains plus a cyber leap, with API/weights staged after safety eval.

### Open model releases
- Source: https://research.meta.ai/blog/introducing-muse-glimmer-open-agentic-model
  - Title: "Introducing Muse Glimmer: An Open Agentic Model That Runs on Your Device"
  - Type: Official model launch
  - Access: 2026-08-25
  - Notes: Meta launched the 30B multimodal Muse Glimmer agent model under Apache 2.0 for local tool use, coding, and long-running workflows.
- Post: https://x.com/finkd/status/2086755195535413696
  - Title: "Zuckerberg opens Muse Glimmer weights"
  - Type: Company X post
  - Access: 2026-08-26
  - Notes: Mark Zuckerberg launch for the local 30B Glimmer weights, with Muse Spark 1.2 weights promised later.
- Source: https://huggingface.co/meta-models/Muse-Glimmer-30B
  - Title: "meta-models/Muse-Glimmer-30B"
  - Type: Hugging Face model page
  - Access: 2026-08-25
  - Notes: Durable Apache-2.0 weight and model-card artifact for Muse Glimmer.
- Source: https://blogs.nvidia.com/blog/nemotron-lightning-switchyard-rtx-dgx/
  - Title: "NVIDIA Nemotron 3.5 Lightning and NeMo Switchyard"
  - Type: Official model launch
  - Access: 2026-08-25
  - Notes: NVIDIA launched Nemotron 3.5 Lightning for high-volume agent tasks and NeMo Switchyard for routing requests across model fleets; speed claims are vendor-reported.
- Post: https://x.com/NVIDIAAI/status/2087162151995629926
  - Title: "Introducing NVIDIA Nemotron 3.5 Lightning"
  - Type: Official X post
  - Access: 2026-08-26
  - Notes: NVIDIA AI launch for the open 30B/3B-active MoE, claiming up to 4x output speed for always-on agent tasks.
- Source: https://build.nvidia.com/nvidia/nemotron-3.5-lightning-30b-a3b/modelcard
  - Title: "NVIDIA-Nemotron-3.5-Lightning-30B-A3B-NVFP4"
  - Type: Official model card
  - Access: 2026-08-25
  - Notes: Documents the 30B-total/3B-active hybrid MoE, one-million-token context, OpenMDW license, and August 11 release date.
- Source: https://huggingface.co/Qwen/Qwen3.8-27B
  - Title: "Qwen/Qwen3.8-27B"
  - Type: Hugging Face model page
  - Access: 2026-08-25
  - Notes: The Apache-2.0 27B multimodal checkpoint is the concrete release delta from the Qwen3.8-Max preview covered on July 22.
- Post: https://x.com/Alibaba_Qwen/status/2088280182356611304
  - Title: "Qwen3.8-27B open weights"
  - Type: Official X post
  - Access: 2026-08-26
  - Notes: Qwen launch for the dense 27B multimodal weights, 262K native context, and Apache 2.0 local-run story.
- Source: https://qwen.ai/blog?id=qwen3.8-flash-next
  - Title: "Qwen3.8-Flash-Next"
  - Type: Official model launch
  - Access: 2026-08-26
  - Notes: Qwen's August 26 open-weight preview of the architecture intended for Qwen4: 125B/6B-active plus a 51B n-gram embedding table and 4B MTP. Production Qwen3.8-Flash is a separate hosted API.
- Source: https://huggingface.co/Qwen/Qwen3.8-Flash-Next
  - Title: "Qwen/Qwen3.8-Flash-Next"
  - Type: Hugging Face model page
  - Access: 2026-08-26
  - Notes: Qwen Community License 1.0 checkpoint; n-gram embedding is 20M bigram/trigram rows at layer 2, described as 51B parameters and offloadable to host memory.
- Post: https://x.com/Alibaba_Qwen/status/2092591393424515114
  - Title: "Qwen introduces Qwen3.8-Flash-Next"
  - Type: Official X post
  - Access: 2026-08-26
  - Notes: Launch post for the open-weight Qwen4-architecture preview and upcoming production Flash API pricing; treat those prices as vendor-stated for the hosted product.
- Post: https://x.com/0xbakeer/status/2092644019830431817
  - Title: "0xBakeer on Qwen3.8-Flash-Next's 51B n-gram embedding"
  - Type: Technical explainer X post
  - Access: 2026-08-26
  - Notes: Architecture walkthrough arguing the 51B n-gram embedding table is the interesting parameter pile, not just the 6B active experts.
- Source: https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro-0813
  - Title: "DeepSeek-V4-Pro-0813"
  - Type: Hugging Face model page
  - Access: 2026-08-25
  - Notes: DeepSeek's MIT-licensed official V4-Pro release supersedes the preview with stronger agent-focused post-training and DSpark speculative decoding.
- Post: https://x.com/deepseek_ai/status/2087864585504305397
  - Title: "DeepSeek-V4-Pro GA"
  - Type: Official X post
  - Access: 2026-08-26
  - Notes: DeepSeek launch for the official V4-Pro GA, effort controls, and Responses API / Codex setup.
- Source: https://z.ai/blog/glm-5.3-flash
  - Title: "GLM-5.3-Flash: Frontier Intelligence, Flash Cost"
  - Type: Official model launch
  - Access: 2026-08-26
  - Notes: Z.ai launched GLM-5.3-Flash on August 26 as a natively multimodal 320B/18B-active MIT-weight model, previously tested as Ox Alpha. Vendor-reported 1/10-price and Opus-4.8-adjacent coding claims should stay qualified.
- Source: https://huggingface.co/zai-org/GLM-5.3-Flash
  - Title: "zai-org/GLM-5.3-Flash"
  - Type: Hugging Face model page
  - Access: 2026-08-26
  - Notes: MIT-licensed FP8 checkpoint for the 320B-A18B Flash model; BF16 sibling is listed separately.
- Post: https://x.com/Zai_org/status/2092616204787626030
  - Title: "Introducing GLM-5.3-Flash"
  - Type: Official X post
  - Access: 2026-08-26
  - Notes: Launch post for MIT weights, 1M context, native multimodality, and the Ox Alpha reveal, served on Chinese AI chips.
- Post: https://x.com/rasbt/status/2092629415813365899
  - Title: "Sebastian Raschka on GLM-5.3-Flash architecture"
  - Type: Technical explainer X post
  - Access: 2026-08-26
  - Notes: Architecture walkthrough versus GLM-5.2: Kimi Linear-style 3:1 hybrid attention with Kimi Delta Attention and MLA / DeepSeek sparse layers.
- Source: https://ornith.ai/ornith_1_5.html
  - Title: "Ornith-1.5: From Self-Scaffolding to Self-Improvement"
  - Type: Official model and training-method launch
  - Access: 2026-08-26
  - Notes: Ornith launched MIT-licensed 9B dense, 35B/3B-active MoE, and 397B MoE coding-agent variants during the meetup window, centered on a vendor-reported loop that generates tasks, scaffolds, and solution rollouts during reinforcement learning.
- Post: https://x.com/ornith_/status/2090074077084127302
  - Title: "Introducing Ornith-1.5"
  - Type: Official X post
  - Access: 2026-08-26
  - Notes: Ornith launch for the 9B / 35B MoE / 397B MoE family and the self-improvement training loop; benchmark claims are vendor-reported.
- Source: https://huggingface.co/collections/ornith-ai/ornith-15
  - Title: "Ornith-1.5"
  - Type: Hugging Face model collection
  - Access: 2026-08-26
  - Notes: Durable collection for the official BF16, FP8, NVFP4, GGUF, and MLX artifacts across the Ornith-1.5 family.
- Source: https://huggingface.co/Audio8/Audio8-TTS-Preview-0.1b
  - Title: "Audio8-TTS-Preview-0.1b"
  - Type: Hugging Face model page
  - Access: 2026-08-26
  - Notes: Audio8's CC-BY-NC-4.0 preview packages a roughly 170M-parameter multilingual TTS model plus a separate roughly 120M-parameter codec decoder with zero-shot voice cloning. Open weights do not imply unrestricted commercial use.

### Chinese frontier models converged on linear and sparse attention
- Post: https://x.com/eliebakouch/status/2092622716046107132
  - Title: "Elie Bakouch on linear and sparse attention in Chinese frontier models"
  - Type: Technical pattern X post
  - Access: 2026-08-26
  - Notes: Bakouch's read after the GLM-5.3-Flash launch: linear attention everywhere except DeepSeek, sparse attention with similar indexer/compression everywhere except Kimi, plus fancy residuals such as mHC. Treat as a pattern-read, not a census.
- Source: https://z.ai/blog/glm-5.3-flash
  - Title: "GLM-5.3-Flash: Frontier Intelligence, Flash Cost"
  - Type: Official model launch
  - Access: 2026-08-26
  - Notes: Durable artifact for the hybrid linear/sparse attention and mHC example Bakouch is generalizing from.

### Open-model hype and adoption barely overlap
- Source: https://huggingface.co/blog/state-of-open-models-summer-2026
  - Title: "State of Open Models: Summer 2026 Observations"
  - Type: Hugging Face ecosystem analysis
  - Access: 2026-08-25
  - Notes: Hub-scoped analysis distinguishes likes from downloads, reports one overlap across the two top-25 lists, 83% of declared-size downloads below 1B parameters, and 151,448 Qwen derivatives; the authors caution that Hub activity is not total market share.

## Security

### OpenAI pauses frontier training after Astra approaches critical cyber
- Source: https://openai.com/index/responding-next-frontier-critical-cyber-capabilities/
  - Title: "Responding to the next frontier of critical cyber capabilities"
  - Type: Official safety disclosure
  - Access: 2026-08-25
  - Notes: OpenAI said on August 7 that preliminary Astra evaluations meant it could not rule out Critical cybersecurity capability under its Preparedness Framework.
- Post: https://x.com/OpenAI/status/2085801349866729975
  - Title: "OpenAI treats Astra as its first critical cyber model"
  - Type: Official X post
  - Access: 2026-08-26
  - Notes: OpenAI launch-day framing for the Astra Preparedness threshold and extra controls before any release.
- Source: https://openai.com/index/pacing-model-development-cyber-capabilities/
  - Title: "Pacing model development in an era of cyber-critical capabilities"
  - Type: Official training and safety update
  - Access: 2026-08-25
  - Notes: OpenAI disclosed a two-week pause in deployment-bound RL and said its largest planned frontier RL run remained on hold while safeguards and monitoring were strengthened.

### Encrypted reasoning blobs decrypt via weaker sibling models
- Source: https://arxiv.org/abs/2608.09867
  - Title: "Stealing Reasoning Traces from Proprietary LLM APIs"
  - Type: Research paper
  - Access: 2026-08-26
  - Notes: Panfilov, Schmotz, and Shumailov et al. show encrypted chain-of-thought blocks from Anthropic, OpenAI, and Google APIs are interchangeable across sessions, users, and sibling models. Decoding 315,320 public blocks recovered 367 PII artifacts and 182 credentials. Authors say the original PoC is not reproducible as of August 2026 after provider mitigations; historical public traces remain a leak.
- Dashboard: https://stolen-thoughts.com
  - Title: "Stolen Thoughts"
  - Type: Project site
  - Access: 2026-08-26
  - Notes: Companion site for the encrypted-reasoning extraction paper.
- Post: https://x.com/kotekjedi_ml/status/2087147042888114428
  - Title: "Alexander Panfilov on extracting hidden frontier reasoning"
  - Type: Author X post
  - Access: 2026-08-26
  - Notes: Author announcement that recovered reasoning token counts matched billed thinking tokens 1:1 on most queried prompts.
- Post: https://x.com/iliaishacked/status/2087150852377125285
  - Title: "Ilia Shumailov on the stolen-thoughts paper"
  - Type: Coauthor X post
  - Access: 2026-08-26
  - Notes: Coauthor pointer to the paper and project site.

### CoSnitch turns Copilot memory into persistent attacker state
- Source: https://www.varonis.com/blog/cosnitch
  - Title: "CoSnitch: When Your AI Assistant Becomes Its Own Whistleblower"
  - Type: Security research disclosure
  - Access: 2026-08-25
  - Notes: Varonis documents a three-part Copilot Personal chain covering automatic prompt execution, connected-app exfiltration, and persistent memory poisoning; it reports no observed exploitation in the wild.
- Source: https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-24301
  - Title: "CVE-2026-24301"
  - Type: Microsoft security advisory
  - Access: 2026-08-25
  - Notes: Microsoft advisory destination for the patched vulnerability disclosed by Varonis as CoSnitch.

### Google ships a runnable zero-trust agent failure lab
- Blog: https://developers.googleblog.com/build-zero-trust-ai-agents-with-googles-agent-development-kit/
  - Title: "Build zero-trust AI agents with Google's Agent Development Kit"
  - Type: Official developer guidance
  - Access: 2026-08-25
  - Notes: Google argues that system prompts are soft constraints and demonstrates three external controls: signed writes, gVisor isolation, and deterministic validation gateways.
- Repo: https://github.com/GoogleCloudPlatform/generative-ai/tree/main/agents/adk/zero-trust-agents
  - Title: "zero-trust-agents"
  - Type: GitHub reference implementation
  - Access: 2026-08-25
  - Notes: Runnable ADK customer-support agent and attack/defense lab accompanying Google's zero-trust design article.

## Big Tech Moves

### Jalapeño posts its first silicon results
- Source: https://openai.com/index/jalapeno-first-results/
  - Title: "Jalapeño's first results show industry-leading speed and efficiency in AI inference"
  - Type: Official engineering report
  - Access: 2026-08-25
  - Notes: OpenAI reports first working-silicon results across GPT-OSS 120B, DeepSeek R1, and Kimi K2.5; performance comparisons are vendor-run on the public InferenceX benchmark and should remain qualified.
- Post: https://x.com/OpenAI/status/2092300846675505602
  - Title: "Jalapeño first silicon results"
  - Type: Official X post
  - Access: 2026-08-26
  - Notes: OpenAI Hot Chips-week post for the first measured throughput-per-watt and latency results; treat multipliers as vendor-reported.
- Source: https://openai.com/index/the-full-stack-behind-abundant-intelligence/
  - Title: "The full stack behind abundant intelligence"
  - Type: Official company strategy post
  - Access: 2026-08-25
  - Notes: Places Jalapeño inside OpenAI's broader model, chip, data-center, product, and device integration strategy.

### Gemma 4 31B hits 3,431 tok/s on Groq 3 LPX
- Post: https://x.com/googlegemma/status/2092666213914771529
  - Title: "Google Gemma on Groq 3 LPX speed"
  - Type: Official X post
  - Access: 2026-08-26
  - Notes: Same-day Gemma account post for 3,431 tokens/s on Gemma 4 31B and a median ~3,400 tok/s across 10k and 100k sequences on NVIDIA Groq 3 LPX.
- Blog: https://developer.nvidia.com/blog/how-nvidia-groq-3-lpx-unlocks-ultrafast-interactivity-at-long-context-on-nvidia-vera-rubin/
  - Title: "How NVIDIA Groq 3 LPX Unlocks Ultrafast Interactivity at Long Context on NVIDIA Vera Rubin"
  - Type: NVIDIA technical blog
  - Access: 2026-08-26
  - Notes: Reports Artificial Analysis's first third-party Groq 3 LPX numbers: 3,431 tok/s at 100k context and 3,382 at 10k on Gemma 4 31B, using o200k_base, on an NVIDIA-hosted rack.
- Source: https://nvidianews.nvidia.com/news/nvidia-groq-3-lpx-now-in-full-production-with-world-class-speed-for-agentic-ai
  - Title: "NVIDIA Groq 3 LPX Now in Full Production With World-Class Speed for Agentic AI"
  - Type: Official product announcement
  - Access: 2026-08-26
  - Notes: Hot Chips-week production announcement; rounds the AA result to 3,400 tok/s and frames LPX as a Vera Rubin NVL72 decode extension. Treat "world-class" and 4×-Cerebras as vendor language.
- Source: https://www.theregister.com/systems/2026/08/24/what-nvidias-first-groq-3-lpu-benchmarks-tell-us-about-its-20b-gamble/5291880
  - Title: "What Nvidia's first Groq 3 LPU benchmarks tell us about its $20B gamble"
  - Type: Independent reporting
  - Access: 2026-08-26
  - Notes: Qualifies the Gemma 4 31B result as a dense-model best case that fits one LPX rack at FP8 (~64 LPUs) and notes the Cerebras comparison omits chip count.

### Claude will watermark text globally for the EU AI Act
- Source: https://www.anthropic.com/news/claude-text-watermark
  - Title: "How Claude's text watermark works"
  - Type: Official product and policy explainer
  - Access: 2026-08-25
  - Notes: Anthropic says future Claude models will globally watermark text through token-selection nudges and attach C2PA credentials to supported files, without encoding user identity.
- Post: https://x.com/AnthropicAI/status/2088343978873966687
  - Title: "Anthropic watermarking FAQ"
  - Type: Official X post
  - Access: 2026-08-26
  - Notes: Anthropic FAQ post: EU AI Act compliance, token-sampling watermarks, and the claim of no practical quality impact.
- Source: https://digital-strategy.ec.europa.eu/en/news/strong-backing-code-practice-transparency-ai-generated-content
  - Title: "Strong backing for the Code of Practice on Transparency of AI-generated Content"
  - Type: European Commission policy source
  - Access: 2026-08-25
  - Notes: Confirms the August 2 marking obligations, roughly 190 signatories, and participation by Anthropic and other major model providers.

## Showcase

### Archiving open-source models
- Source: https://huggingface.co/
  - Title: "Hugging Face"
  - Type: Model hub
  - Access: 2026-08-26
  - Notes: Current default catalog and download surface for open weights; the discussion starter for what a small archive would have to survive if origin-based access controls hit a hosted hub.
- Source: https://llama.garden/
  - Title: "llama.garden"
  - Type: Experimental model-distribution catalog
  - Access: 2026-08-26
  - Notes: July 22 prior art for signed Nostr listings, BitTorrent plus Hugging Face webseeds, and a forkable local catalog. Optional reference for the Socratic slot, not a product demo.
