---
title: Austin AI Club - June 24, 2026 - Source Link Records
created: 2026-06-16
updated: 2026-06-16
type: summary
tags: [source-record, meetup]
sources: []
---

# Austin AI Club - June 24, 2026 - Source Link Records

## Agent Infrastructure

### Hermes Agent gets a Stripe wallet
- Post: https://x.com/NousResearch/status/2066647737613832624
  - Title: "Nous Research announces Stripe skills for Hermes Agent"
  - Type: Official X post
  - Access: 2026-06-16
  - Notes: Nous Research's June 15 announcement that Hermes Agent can buy things, pay per-call APIs, and provision SaaS with configurable safety limits on every action. 338.5K views, 4.1K likes, 325 reposts, 134 quotes, 1.3K bookmarks.

## Models & Research

### GLM-5.2 ships open weights with a 1M context
- Source: https://z.ai/blog/glm-5.2
  - Title: "GLM-5.2: Frontier Intelligence, Open Weights"
  - Type: Official announcement
  - Access: 2026-06-16
  - Notes: Z.ai's June 16 launch post for GLM-5.2 highlighting 1M-token context, coding and agentic task improvements, MIT open weights, and two reasoning effort levels.
- Source: https://huggingface.co/zai-org/GLM-5.2
  - Title: "zai-org/GLM-5.2"
  - Type: Model card
  - Access: 2026-06-16
  - Notes: Hugging Face model card for the 753B-parameter GLM-5.2 open weights under MIT license. Includes benchmark table, local deployment recipes for SGLang/vLLM/xLLM/Transformers/KTransformers, and links to technical reports.
- Source: https://github.com/zai-org/GLM-5
  - Title: "zai-org/GLM-5"
  - Type: Repository
  - Access: 2026-06-16
  - Notes: Official GitHub repository for GLM-5 model resources.
- Source: https://docs.z.ai/guides/llm/glm-5.2
  - Title: "GLM-5.2 - Z.ai Docs"
  - Type: Documentation
  - Access: 2026-06-16
  - Notes: API guide for using GLM-5.2 on the Z.ai platform, including model endpoints and parameters.
- Source: https://arxiv.org/abs/2602.15763
  - Title: "GLM-5: from Vibe Coding to Agentic Engineering"
  - Type: Research paper
  - Access: 2026-06-16
  - Notes: Technical report for the GLM-5 model family.
- Source: https://arxiv.org/abs/2603.12201
  - Title: "IndexCache: Accelerating Sparse Attention via Cross-Layer Index Reuse"
  - Type: Research paper
  - Access: 2026-06-16
  - Notes: Paper describing the IndexShare/IndexCache sparse-attention architecture used in GLM-5.2 to reduce per-token FLOPs at long context.
- Post: https://x.com/Zai_org/status/2066938937344495629
  - Title: "Z.ai announces GLM-5.2"
  - Type: Official X post
  - Access: 2026-06-16
  - Notes: Z.ai's official announcement thread (338.6K views, 2.9K likes, 385 reposts, 500 quotes, 166 replies) introducing GLM-5.2 with open weights, 1M context, and coding/agentic improvements.

### DiffusionGemma makes text diffusion practical
- Source: https://blog.google/innovation-and-ai/technology/developers-tools/diffusion-gemma-faster-text-generation/
  - Title: "DiffusionGemma: 4x faster text generation"
  - Type: Official announcement
  - Access: 2026-06-16
  - Notes: Google's June 10 blog introducing DiffusionGemma, a 26B MoE experimental open text-diffusion model under Apache 2.0. Claims 1000+ tok/s on H100 and 700+ tok/s on RTX 5090; quality remains below autoregressive Gemma 4 for production text.
- Source: https://developers.googleblog.com/en/diffusiongemma-the-developer-guide
  - Title: "DiffusionGemma: The developer guide"
  - Type: Official documentation
  - Access: 2026-06-16
  - Notes: Developer guide for integrating and serving DiffusionGemma via MLX, vLLM, Hugging Face Transformers, and Hackable Diffusion.
- Source: https://huggingface.co/google/diffusiongemma-26B-A4B-it
  - Title: "google/diffusiongemma-26B-A4B-it"
  - Type: Model card
  - Access: 2026-06-16
  - Notes: Apache 2.0 weights for DiffusionGemma 26B-A4B instruction-tuned model.
- Post: https://x.com/Google/status/2064741293163418032
  - Title: "Google announces DiffusionGemma"
  - Type: Official X post
  - Access: 2026-06-16
  - Notes: Google's official announcement thread (235.8K views, 3.2K likes, 378 reposts, 87 quotes, 931 bookmarks) framing DiffusionGemma as drafting and refining entire blocks of text simultaneously.
- Post: https://x.com/sundarpichai/status/2064744345216196942
  - Title: "Sundar Pichai shares DiffusionGemma Hugging Face weights"
  - Type: Official X post
  - Access: 2026-06-16
  - Notes: Sundar Pichai's follow-up post (81.4K views, 552 likes) pointing to the Apache 2.0 weights on Hugging Face.

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
