---
title: Austin AI Club - June 24, 2026 - Source Link Records
created: 2026-06-16
updated: 2026-06-23
type: summary
tags: [source-record, meetup]
sources: []
---

# Austin AI Club - June 24, 2026 - Source Link Records

## Local Builds & Projects

### Ben turns Bwen into Qwenstradamus
- Post: https://x.com/benthecarman/status/2069442971070566874
  - Title: "Ben Carman launches qwenstradamus"
  - Type: X post
  - Access: 2026-06-23
  - Notes: Ben's June 23 announcement that qwenstradamus.com turns his Bwen process into a paid service for training a downloadable personal model from a user's own tweets. FXTwitter metadata showed 3,656 views, 27 likes, 2 reposts, 8 replies, and 9 bookmarks.
- Post: https://x.com/benthecarman/status/2068796180339851429
  - Title: "Training a model on my tweets"
  - Type: X article
  - Access: 2026-06-23
  - Notes: Ben's June 21 build writeup describing the original bwen:14b process: Qwen3-14B fine-tune, historical tweets plus handwritten prompts, tweet embedding and theme clustering, 554 themes collapsed to 51, roughly 300 hand prompts, LoRA training, and retrieval over the original tweet database.
- Source: https://qwenstradamus.com/
  - Title: "qwenstradamus - a model that tweets like you"
  - Type: Product page
  - Access: 2026-06-23
  - Notes: Service page metadata says it trains an AI model on a user's own tweets that writes in their voice, then lets the user download it.
- Source: https://huggingface.co/benthecarman/bwen-14b
  - Title: "benthecarman/bwen-14b"
  - Type: Model card
  - Access: 2026-06-23
  - Notes: Hugging Face model card for Ben's Qwen3-derived personal voice model. API metadata on June 23 showed creation on June 21, 16 downloads, GGUF and LoRA tags, `base_model:unsloth/Qwen3-14B`, and dataset link to `benthecarman/bwen-dataset`.
- Source: https://huggingface.co/datasets/benthecarman/bwen-dataset
  - Title: "benthecarman/bwen-dataset"
  - Type: Dataset card
  - Access: 2026-06-23
  - Notes: Hugging Face dataset card for the tweet/prompt training dataset behind bwen. API metadata on June 23 showed creation on June 21, 27 downloads, and tags for text generation, Twitter, voice cloning, and personal data.
- Repo: https://github.com/benthecarman/bwen
  - Title: "benthecarman/bwen"
  - Type: Repository
  - Access: 2026-06-23
  - Notes: Public source repo for the bwen training pipeline; `git ls-remote` resolved HEAD to `cd58bb5c355516913d1b1cec83f79b92e7b70c2c`.

## Agent Infrastructure

### Hermes Agent gets a Stripe wallet
- Post: https://x.com/NousResearch/status/2066647737613832624
  - Title: "Nous Research announces Stripe skills for Hermes Agent"
  - Type: Official X post
  - Access: 2026-06-16
  - Notes: Nous Research's June 15 announcement that Hermes Agent can buy things, pay per-call APIs, and provision SaaS with configurable safety limits on every action. 338.5K views, 4.1K likes, 325 reposts, 134 quotes, 1.3K bookmarks.

## Models & Research

### Closed model releases are a quiet week
- Source: https://openai.com/index/daybreak-securing-the-world/
  - Title: "Daybreak: Tools for securing every organization in the world"
  - Type: Official announcement
  - Access: 2026-06-23
  - Notes: OpenAI's June 22 Daybreak expansion with the full GPT-5.5-Cyber model, Codex Security plugin, Cyber Partner Program, and Patch the Planet. Included as a fresh access/productization update; GPT-5.5-Cyber itself was already covered on May 13.
- Source: https://digg.com/ai/a95mmx07
  - Title: "OpenAI partners with Trail of Bits to automatically patch open-source vulnerabilities, merging 37 fixes in its first week"
  - Type: Digg cluster
  - Access: 2026-06-23
  - Notes: Digg cluster around OpenAI Daybreak and GPT-5.5-Cyber. Shows 2.9M cluster engagement and captures X reaction around machine-speed patching, partner-gated access, and maintainer review.
- Post: https://x.com/OpenAI/status/2069104283824640023
  - Title: "OpenAI announces Daybreak expansion"
  - Type: Official X post
  - Access: 2026-06-23
  - Notes: Official OpenAI launch post for Daybreak expansion, Codex Security, GPT-5.5-Cyber, Cyber Partner Program, and Patch the Planet; treated here as a Daybreak/access update rather than a net-new model release.
- Post: https://x.com/OpenAI/status/2069104286479618296
  - Title: "OpenAI describes GPT-5.5-Cyber"
  - Type: Official X post
  - Access: 2026-06-23
  - Notes: Official OpenAI thread post describing GPT-5.5-Cyber as its most capable cyber model for authorized defensive work; retained to support the June 22 access/productization update.

### Open models are eating the frontier gap
- Source: https://z.ai/blog/glm-5.2
  - Title: "GLM-5.2: Frontier Intelligence, Open Weights"
  - Type: Official announcement
  - Access: 2026-06-23
  - Notes: Z.ai's June 16 launch post for GLM-5.2 highlighting 1M-token context, coding and agentic task improvements, MIT open weights, and two reasoning effort levels.
- Source: https://huggingface.co/zai-org/GLM-5.2
  - Title: "zai-org/GLM-5.2"
  - Type: Model card
  - Access: 2026-06-23
  - Notes: Hugging Face model card for the 753B-parameter GLM-5.2 open weights under MIT license. API metadata on June 23 showed 2,157 likes and 40,127 downloads.
- Source: https://github.com/zai-org/GLM-5
  - Title: "zai-org/GLM-5"
  - Type: Repository
  - Access: 2026-06-23
  - Notes: Official GitHub repository for GLM-5 model resources.
- Source: https://docs.z.ai/guides/llm/glm-5.2
  - Title: "GLM-5.2 - Z.ai Docs"
  - Type: Documentation
  - Access: 2026-06-23
  - Notes: API guide for using GLM-5.2 on the Z.ai platform, including model endpoints and parameters.
- Source: https://arxiv.org/abs/2602.15763
  - Title: "GLM-5: from Vibe Coding to Agentic Engineering"
  - Type: Research paper
  - Access: 2026-06-23
  - Notes: Technical report for the GLM-5 model family.
- Source: https://arxiv.org/abs/2603.12201
  - Title: "IndexCache: Accelerating Sparse Attention via Cross-Layer Index Reuse"
  - Type: Research paper
  - Access: 2026-06-23
  - Notes: Paper describing the IndexShare/IndexCache sparse-attention architecture used in GLM-5.2 to reduce per-token FLOPs at long context.
- Source: https://digg.com/ai/wmry8acg
  - Title: "Zai_org's open-weights GLM-5.2 ranks third overall on the GDPval-AA"
  - Type: Digg cluster
  - Access: 2026-06-23
  - Notes: Digg cluster around Artificial Analysis' GDPval-AA result: GLM-5.2 leads open weights, ranks #3 overall, and scores 1524 Elo behind Claude Fable 5 and Claude Opus 4.8.
- Post: https://x.com/Zai_org/status/2066938937344495629
  - Title: "Z.ai announces GLM-5.2"
  - Type: Official X post
  - Access: 2026-06-23
  - Notes: Z.ai's official announcement thread introducing GLM-5.2 with open weights, 1M context, and coding/agentic improvements.
- Post: https://x.com/ArtificialAnlys/status/2069121548670406947
  - Title: "Artificial Analysis GDPval-AA result for GLM-5.2"
  - Type: X post
  - Access: 2026-06-23
  - Notes: Artificial Analysis post stating GLM-5.2 leads open weights and sits #3 overall on GDPval-AA.
- Source: https://huggingface.co/moonshotai/Kimi-K2.7-Code
  - Title: "moonshotai/Kimi-K2.7-Code"
  - Type: Model card
  - Access: 2026-06-23
  - Notes: Hugging Face model card for Moonshot AI's coding-focused agentic model built on Kimi K2.6. API metadata on June 23 showed 974 likes and 447,920 downloads; the card reports 1T total parameters, 32B active parameters, 256K context, and roughly 30% lower thinking-token usage than K2.6.
- Source: https://digg.com/tech/lvlg9m33
  - Title: "Moonshot AI open-sources Kimi-K2.7-Code, ranking third on the MCPAtlas leaderboard ahead of GPT-5.5"
  - Type: Digg cluster
  - Access: 2026-06-23
  - Notes: Digg cluster around the Kimi K2.7 Code launch and reaction, including the official Kimi.ai announcement post, Hugging Face link, and coding-agent benchmark discussion.
- Source: https://digg.com/tech/27r7m6uc
  - Title: "Moonshot AI's Kimi k2.7 code model matches the k2.6 WeirdML score while cutting output tokens nearly in half"
  - Type: Digg cluster
  - Access: 2026-06-23
  - Notes: Digg cluster focused on Kimi K2.7 Code's token-efficiency angle: similar WeirdML performance while cutting average output length from roughly 17,000 tokens to 9,000.
- Post: https://x.com/Kimi_Moonshot/status/2065377579130142937
  - Title: "Kimi.ai announces Kimi K2.7 Code"
  - Type: Official X post
  - Access: 2026-06-23
  - Notes: Official Kimi.ai launch post for Kimi K2.7 Code, describing better coding and agent performance over K2.6, 30% lower reasoning-token usage, and availability through Kimi API and Kimi Code.
- Source: https://huggingface.co/MiniMaxAI/MiniMax-M3
  - Title: "MiniMaxAI/MiniMax-M3"
  - Type: Model card
  - Access: 2026-06-23
  - Notes: Hugging Face model card for MiniMax M3, a native multimodal MoE with 1M context, roughly 428B total parameters, and roughly 23B active parameters. API metadata on June 23 showed 1,219 likes and 131,057 downloads; the model card tags it for coding, agents, video, multimodal work, and arXiv 2606.13392.
- Post: https://x.com/MiniMax_AI/status/2065436935188058208
  - Title: "MiniMax announces M3 open weights on Hugging Face"
  - Type: Official X post
  - Access: 2026-06-23
  - Notes: MiniMax's June 12 official weights-release post for MiniMax M3. The June 10 board already captured the launch post; this source is included because the actual Hugging Face weights landed after that meetup.
- Post: https://x.com/huggingface/status/2065464345413239151
  - Title: "Hugging Face highlights MiniMax M3 weights"
  - Type: X post
  - Access: 2026-06-23
  - Notes: Hugging Face amplification post for MiniMax M3 weights, useful as a platform corroboration source for the post-meetup weights availability.
- Source: https://huggingface.co/collections/allenai/tmax
  - Title: "Tmax - a allenai Collection"
  - Type: Hugging Face collection
  - Access: 2026-06-23
  - Notes: AllenAI collection of TMax models, datasets, and rollout artifacts for terminal agents.
- Source: https://huggingface.co/allenai/tmax-27b
  - Title: "allenai/tmax-27b"
  - Type: Model card
  - Access: 2026-06-23
  - Notes: TMax 27B model card. HF card reports roughly 43% on Terminal Bench 2.0 after 160 RL steps.
- Source: https://huggingface.co/papers/2606.23321
  - Title: "Tmax: A simple recipe for terminal agents"
  - Type: Paper page
  - Access: 2026-06-23
  - Notes: Hugging Face paper page for the TMax terminal-agent RL recipe.
- Source: https://wai-org.com/blog/tmax/
  - Title: "TMax: A Simple Recipe for Terminal Agents"
  - Type: Blog
  - Access: 2026-06-23
  - Notes: WAI blog describing TMax as an open RL recipe plus TMax-15k, a 14,600-environment dataset.
- Source: https://digg.com/ai/opo8qjez
  - Title: "Ai2 launches TMax, an open-source terminal agent whose 27B model matches systems 40 times its size on Terminal Bench 2.0"
  - Type: Digg cluster
  - Access: 2026-06-23
  - Notes: Digg cluster for TMax with 226.4K cluster engagement and the X/HF/GitHub source chain for open data, weights, and rollouts.
- Repo: https://github.com/hamishivi/tmax
  - Title: "hamishivi/tmax"
  - Type: Repository
  - Access: 2026-06-23
  - Notes: GitHub repo for TMax data generation, training, evaluation, and paper assets.
- Post: https://x.com/natolambert/status/2069055568124281315
  - Title: "Nathan Lambert shares TMax references"
  - Type: X post
  - Access: 2026-06-23
  - Notes: High-signal X source linking the TMax paper, blog, GitHub repo, Hugging Face artifacts, and video.

## Security

### Who reported the Fable jailbreak?
- Source: https://www.politico.com/news/2026/06/13/inside-the-whirlwind-24-hours-that-led-the-white-house-to-slap-export-controls-on-anthropic-00961519
  - Title: "Inside the whirlwind 24 hours that led the White House to slap export controls on Anthropic"
  - Type: News reporting
  - Access: 2026-06-16
  - Notes: Politico's June 13 report naming Amazon CEO Andy Jassy as raising concerns to the White House about the Fable model's guardrails; at least five other companies also reportedly contacted senior officials. Cites administration and White House officials.
- Source: https://www.anthropic.com/news/fable-mythos-access
  - Title: "Update on Fable and Mythos access"
  - Type: Official response
  - Access: 2026-06-16
  - Notes: Anthropic's post-export-control statement defending its safeguards, stating no universal jailbreak had been found, and explaining the decision to disable Fable 5 and Mythos 5 access to ensure compliance.
- Post: https://x.com/DavidSacks/status/2065853007619588171
  - Title: "David Sacks on Fable export controls and Anthropic remediation"
  - Type: Official X post
  - Access: 2026-06-16
  - Notes: David Sacks calls the source a "highly credible trusted partner of both Anthropic and the USG," supports the administration's export-control action, and frames the goal as Anthropic remediating the safety issue so Fable can return to general release.
- Post: https://x.com/v_shakthi/status/2065985743340839080
  - Title: "Shakthi Vadakkepat summary of Politico's Fable 5 story"
  - Type: X post
  - Access: 2026-06-16
  - Notes: Low-engagement pointer (265 views, 3 likes) summarizing the Politico report that Andy Jassy and Amazon raised Fable concerns to the White House, leading to export controls.

## Big Tech Moves

### Cursor previews Origin, a GitHub competitor
- Post: https://x.com/morganlinton/status/2066927927997190564?s=46
  - Title: "Morgan Linton: Breaking: Origin - Cursor's competitor to GitHub"
  - Type: X post
  - Access: 2026-06-16
  - Notes: Leaked/pre-announced screenshot positioning Cursor's "Origin" as a GitHub competitor. 116.6K views, 1.2K likes, 186 reposts, 36 quotes. Primary source is a single X post; details on feature set and timing remain unconfirmed.

## Showcase
