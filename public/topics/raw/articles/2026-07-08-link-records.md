---
title: Austin AI Club - July 8, 2026 - Source Link Records
created: 2026-07-07
updated: 2026-07-07
type: summary
tags: [source-record, meetup]
sources: []
---

# Austin AI Club - July 8, 2026 - Source Link Records

## Agent Infrastructure

### Hermes Agent gets model panels as a provider
- Source: https://hermes-agent.nousresearch.com/docs/user-guide/features/mixture-of-agents
  - Title: "Mixture of Agents"
  - Type: Official documentation
  - Access: 2026-07-07
  - Notes: Hermes Agent docs describe MoA as a virtual model provider where named presets appear under the `moa` provider, run reference models first, and pass private context to an aggregator model that keeps the normal agent loop.
- Post: https://x.com/NousResearch/status/2070610321278988385
  - Title: "Hermes Agent exposes MoA presets as virtual models"
  - Type: Official X post
  - Access: 2026-07-07
  - Notes: Nous Research launch post for the Hermes Agent MoA preset feature, claiming higher HermesBench scores versus Opus 4.8 and GPT 5.5.

## Models & Research

### Brain2Qwerty v2 gets non-invasive decoding to 61% word accuracy
- Source: https://ai.meta.com/blog/brain2qwerty-brain-ai-human-communication/
  - Title: "From Brain Waves to Words: Brain2Qwerty Offers a New Path to Communication Without Surgery"
  - Type: Official research blog
  - Access: 2026-07-07
  - Notes: Meta's June 29 post reports Brain2Qwerty v2, trained on about 22,000 typed sentences from nine participants, with 61% average word accuracy and 78% for the best participant.
- Source: https://www.nature.com/articles/s41593-026-02303-2
  - Title: "Noninvasive decoding of typed sentences from human brain activity"
  - Type: Research paper
  - Access: 2026-07-07
  - Notes: Nature Neuroscience paper for the Brain2Qwerty v1 work that the v2 release builds on.
- Source: https://facebookresearch.github.io/brain2qwerty/
  - Title: "Brain2Qwerty"
  - Type: Project page
  - Access: 2026-07-07
  - Notes: Project page for Brain2Qwerty code and research artifacts.
- Post: https://x.com/AIatMeta/status/2071566924803395741
  - Title: "Brain2Qwerty v2"
  - Type: Official X post
  - Access: 2026-07-07
  - Notes: AI at Meta announcement post for Brain2Qwerty v2 and the Nature publication context.

### Open model releases get specialized fast
- Source: https://huggingface.co/nvidia/NVIDIA-Nemotron-Labs-3-Puzzle-75B-A9B-BF16
  - Title: "NVIDIA-Nemotron-Labs-3-Puzzle-75B-A9B-BF16"
  - Type: Official model card
  - Access: 2026-07-07
  - Notes: NVIDIA's BF16 model card describes Nemotron-Labs-3-Puzzle-75B-A9B as a deployment-optimized open model derived from Nemotron-3-Super-120B-A12B through Iterative Puzzle compression, reducing the parent from 120.7B total / 12.8B active parameters to 75.3B total / 9.3B active parameters.
- Source: https://huggingface.co/nvidia/NVIDIA-Nemotron-Labs-3-Puzzle-75B-A9B-FP8
  - Title: "NVIDIA-Nemotron-Labs-3-Puzzle-75B-A9B-FP8"
  - Type: Official model card
  - Access: 2026-07-07
  - Notes: NVIDIA's FP8 checkpoint targets deployment-efficient serving and reports the same Puzzle-compressed architecture with BF16/FP8/NVFP4 benchmark comparisons.
- Source: https://huggingface.co/nvidia/NVIDIA-Nemotron-Labs-3-Puzzle-75B-A9B-NVFP4
  - Title: "NVIDIA-Nemotron-Labs-3-Puzzle-75B-A9B-NVFP4"
  - Type: Official model card
  - Access: 2026-07-07
  - Notes: NVIDIA's NVFP4 checkpoint is the Blackwell-oriented quantized variant of the Puzzle model, supporting the open-model slide's efficiency angle.
- Source: https://arxiv.org/abs/2607.04371
  - Title: "Nemotron-Labs-3-Puzzle-75B-A9B: Compressing Hybrid MoE LLMs"
  - Type: Technical report
  - Access: 2026-07-07
  - Notes: The July 5 technical report claims roughly 2x higher server throughput than Nemotron-3-Super on a single 8xB200 node at matched user-throughput constraints, and 1M-token single-H100 concurrency rising from 1 request to 8 requests.
- Source: https://github.com/QwenLM/Qwen-AgentWorld
  - Title: "Qwen-AgentWorld"
  - Type: Official repository
  - Access: 2026-07-07
  - Notes: Qwen's official repo marks the 2026-06-24 release of Qwen-AgentWorld-35B-A3B and AgentWorldBench, framing the model as an environment simulator for agentic tasks across tools, terminal, web, OS, Android, and software-engineering surfaces. Included after the duplicate pass because June 24 covered GLM, Kimi, MiniMax M3 weights, and TMax, not AgentWorld.
- Source: https://huggingface.co/Qwen/Qwen-AgentWorld-35B-A3B
  - Title: "Qwen/Qwen-AgentWorld-35B-A3B"
  - Type: Official model card
  - Access: 2026-07-07
  - Notes: Hugging Face weights for Qwen-AgentWorld-35B-A3B, described as a language world model trained for agentic environment simulation and runnable through common inference stacks.
- Source: https://mistral.ai/news/leanstral-1-5/
  - Title: "Introducing Leanstral 1.5"
  - Type: Official launch blog
  - Access: 2026-07-07
  - Notes: Mistral's July 2 launch post describes Leanstral 1.5 as an Apache 2.0, 119B-total/6B-active model for Lean proof engineering, with benchmark claims on miniF2F, PutnamBench, FATE-H, and repository bug-fixing.
- Source: https://huggingface.co/mistralai/Leanstral-1.5-119B-A6B
  - Title: "mistralai/Leanstral-1.5-119B-A6B"
  - Type: Official model card
  - Access: 2026-07-07
  - Notes: Mistral model card for the open Leanstral 1.5 weights, confirming the Apache 2.0 release and the Lean 4 proof-assistant specialization.
- Source: https://cohere.com/blog/transcribe-arabic
  - Title: "Transcribe Arabic: The world's most accurate open-source model for Arabic Speech Recognition"
  - Type: Official launch blog
  - Access: 2026-07-07
  - Notes: Cohere's July 7 launch post releases an Apache 2.0 Arabic ASR model, emphasizing dialect coverage, code-switching, WER improvements versus OmniASR and Whisper, and production throughput.
- Source: https://huggingface.co/CohereLabs/cohere-transcribe-arabic-07-2026
  - Title: "CohereLabs/cohere-transcribe-arabic-07-2026"
  - Type: Official model card
  - Access: 2026-07-07
  - Notes: Hugging Face model card for Cohere Transcribe Arabic, listing the 2B ASR model, Arabic/English language support, Apache 2.0 license, and benchmark table.

### Should chat route local by default?
- Source: https://scalingintelligence.stanford.edu/pubs/ipw/
  - Title: "Intelligence Per Watt: A Study of Local Intelligence Efficiency"
  - Type: Research project page
  - Access: 2026-07-07
  - Notes: Stanford Scaling Intelligence Lab page reporting 88.7% local LM accuracy on single-turn chat/reasoning queries and local coverage rising from 23.2% to 71.3% from 2023 to 2025.
- Source: https://ollama.com/blog/faster-gemma-4-mlx-mtp
  - Title: "Faster Gemma 4 on MLX with multi-token prediction"
  - Type: Official technical blog
  - Access: 2026-07-07
  - Notes: Ollama's June 29 post says Gemma 4 in Ollama 0.31 generates nearly 90% faster on Apple Silicon in a coding-agent benchmark using MLX and multi-token prediction.
- Source: https://blog.google/innovation-and-ai/technology/developers-tools/multi-token-prediction-gemma-4/
  - Title: "Multi-token-prediction in Gemma 4"
  - Type: Official technical blog
  - Access: 2026-07-07
  - Notes: Google post explaining Gemma 4 MTP drafters and the speculative-decoding speedup behind the Ollama runtime story.
- Post: https://x.com/ClementDelangue/status/2071951499660292496
  - Title: "71.3% of ChatGPT queries could be local"
  - Type: X post
  - Access: 2026-07-07
  - Notes: Clement Delangue's post turning the Stanford local-inference coverage result into an enterprise AI cost and control argument.
- Post: https://x.com/ollama/status/2072121580201848926
  - Title: "Gemma 4 nearly 90% faster on Apple Silicon"
  - Type: Official X post
  - Access: 2026-07-07
  - Notes: Ollama's X post announcing the Gemma 4 MLX/MTP speedup.

### Proprietary releases split across agents and media
- Source: https://openai.com/index/previewing-gpt-5-6-sol/
  - Title: "Previewing GPT-5.6 Sol: a next-generation model"
  - Type: Official preview blog
  - Access: 2026-07-07
  - Notes: OpenAI's June 26 post previews the GPT-5.6 series, with Sol as the flagship, Terra as the balanced model, and Luna as the fast model, rolling out first through selected partners and a government review process. This is distinct from the June 24 Daybreak access story.
- Source: https://www.anthropic.com/news/claude-sonnet-5
  - Title: "Claude Sonnet 5"
  - Type: Official launch blog
  - Access: 2026-07-07
  - Notes: Anthropic's June 30 launch post positions Sonnet 5 as its most agentic Sonnet model, available in Claude plans, Claude Code, and the API, with lower pricing than Opus 4.8. This turns the June 24 Sonnet 5 rumor/slug chatter into an official release story.
- Source: https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-omni-flash-nano-banana-2-lite/
  - Title: "Start building with Nano Banana 2 Lite and Gemini Omni Flash"
  - Type: Official launch blog
  - Access: 2026-07-07
  - Notes: Google says Nano Banana 2 Lite delivers 4-second text-to-image outputs at $0.034 per 1K image, and introduces Gemini Omni Flash for generative media workflows.
- Source: https://cloud.google.com/blog/products/ai-machine-learning/nano-banana-2-lite-and-gemini-omni-flash-available
  - Title: "Nano Banana 2 Lite and Gemini Omni Flash available"
  - Type: Official cloud blog
  - Access: 2026-07-07
  - Notes: Google Cloud launch context for the same models in developer and cloud surfaces.
- Post: https://x.com/OfficialLoganK/status/2071988351083921690
  - Title: "Nano Banana 2 Lite and Gemini Omni Flash"
  - Type: Official X post
  - Access: 2026-07-07
  - Notes: Logan Kilpatrick's launch post with the headline latency and pricing claims.

### Claude gets a consciousness-adjacent workspace
- Source: https://www.anthropic.com/research/global-workspace
  - Title: "A global workspace in language models"
  - Type: Official research blog
  - Access: 2026-07-07
  - Notes: Anthropic's July 6 interpretability post frames J-space through global workspace theory and access consciousness: Claude can report, modulate, and reason through the workspace, while the authors explicitly do not claim phenomenal consciousness.
- Dashboard: https://neuronpedia.org/jlens
  - Title: "Neuronpedia J-Lens"
  - Type: Interactive demo
  - Access: 2026-07-07
  - Notes: Neuronpedia demo linked by Anthropic for applying the global-workspace methods to open-weight models.
- Post: https://x.com/AnthropicAI/status/2074185390060110138
  - Title: "Anthropic and Neuronpedia demo"
  - Type: Official X post
  - Access: 2026-07-07
  - Notes: Anthropic post pointing to the Neuronpedia interactive demo.
- Post: https://x.com/stevibe/status/2073784489856450916
  - Title: "Reasoning as trees"
  - Type: X post
  - Access: 2026-07-07
  - Notes: Stevibe's visualization of eight models' reasoning traces on a probability problem, used as a practical companion to the interpretability/debugger-surface topic.

### MXFP4 makes MiniMax M3 runnable
- Source: https://huggingface.co/MiniMaxAI/MiniMax-M3
  - Title: "MiniMaxAI/MiniMax-M3"
  - Type: Model card
  - Access: 2026-07-07
  - Notes: Hugging Face model card for the base MiniMax M3 model, describing a native multimodal model with 1M context, about 428B parameters, about 23B active parameters, and MiniMax Sparse Attention for long-context efficiency.
- Source: https://huggingface.co/olka-fi/MiniMax-M3-MXFP4
  - Title: "olka-fi/MiniMax-M3-MXFP4"
  - Type: Quantized model card
  - Access: 2026-07-07
  - Notes: MXFP4 mixed-precision quantization of MiniMax M3 that quantizes the routed MoE experts, about 95% of the weights, to MXFP4; the card reports a 237 GB size, down from a 444 GB MXFP8 source checkpoint, with quality checks preserved.
- Source: https://vllm.ai/blog/2026-06-12-minimax-m3-vllm
  - Title: "MiniMax M3 in vLLM: Day-0 Serving for 1M-Token Multimodal Reasoning"
  - Type: Runtime integration blog
  - Access: 2026-07-07
  - Notes: vLLM post explaining production serving work for MiniMax Sparse Attention, multimodal preprocessing, MXFP8 MoE execution, EAGLE3 speculative decoding, prefix caching, and long-context deployment.
- Repo: https://github.com/BokuNoGF/minimax-m3-mxfp4-4x-gb10
  - Title: "MiniMax-M3 (MXFP4) on 4x DGX Spark / GB10"
  - Type: Repository
  - Access: 2026-07-07
  - Notes: Public recipe for serving quantized MiniMax M3 across DGX Spark hardware with vLLM and EAGLE3.
- Source: https://developer.nvidia.com/blog/deploy-long-context-reasoning-and-agentic-workflows-with-minimax-m3-on-nvidia-accelerated-infrastructure/
  - Title: "Deploy Long-Context Reasoning and Agentic Workflows with MiniMax M3"
  - Type: Official technical blog
  - Access: 2026-07-07
  - Notes: NVIDIA deployment context for MiniMax M3 on accelerated infrastructure.
- Post: https://x.com/Tech2Wild/status/2073836024451477718
  - Title: "MiniMax-M3 on two DGX Sparks"
  - Type: X post
  - Access: 2026-07-07
  - Notes: Tech2Wild post claiming MiniMax M3 running on two DGX Sparks with 4-bit quantization, NVFP4 KV, EAGLE3, vLLM, and 196K context.
- Post: https://x.com/albustime/status/2073986970653515817
  - Title: "Open source Cambrian explosion / MiniMax M3 quantization notes"
  - Type: X post
  - Access: 2026-07-07
  - Notes: Akshobya post summarizing the practical significance of 4-bit quantization and the DGX Spark MiniMax M3 run.

## Security

### Fable 5 comes back with government in the loop
- Source: https://www.anthropic.com/news/redeploying-fable-5
  - Title: "Redeploying Claude Fable 5"
  - Type: Official company blog
  - Access: 2026-07-07
  - Notes: Anthropic says the June 30 export-control lift allowed Fable 5 and Mythos 5 access to resume, while adding a jailbreak severity framework, government collaboration commitments, and Fable 5 usage-credit details.
- Post: https://x.com/AnthropicAI/status/2072106151890809341
  - Title: "Commerce lifts Fable 5 and Mythos 5 export controls"
  - Type: Official X post
  - Access: 2026-07-07
  - Notes: Anthropic's June 30 X update that it had received notice from Commerce and would restore access.
- Post: https://x.com/synthwavedd/status/2072103052635451559
  - Title: "Export control lifted"
  - Type: X post
  - Access: 2026-07-07
  - Notes: Social-news post used as submitted source for the export-control lift.
- Post: https://x.com/deredleritt3r/status/2072112364690833604
  - Title: "Anthropic government commitments"
  - Type: X post
  - Access: 2026-07-07
  - Notes: Commentary post excerpting Anthropic's commitments to proactively detect security risks and work with the US government on model protocols and evaluation.
- Post: https://x.com/theo/status/2072173365318840573
  - Title: "Fable 5 usage credits after July 7"
  - Type: X post
  - Access: 2026-07-07
  - Notes: Theo post highlighting Anthropic's note that Fable 5 remains included for up to 50% of weekly usage limits through July 7, then moves to usage credits.

### Claude Code quietly fingerprinted its own users
- Post: https://x.com/IntCyberDigest/status/2071971609183678544
  - Title: "Claude Code hidden marker claim"
  - Type: X post
  - Access: 2026-07-07
  - Notes: Submitted post alleging Claude Code embedded hidden routing/proxy metadata in prompt messages, used as the social signal for the hidden-user-fingerprinting topic.
- Source: https://www.reddit.com/r/ClaudeAI/comments/1ujila1/anthropic_embedded_spyware_in_claude_code_and/
  - Title: "Anthropic embedded spyware in Claude Code"
  - Type: Reddit analysis thread
  - Access: 2026-07-07
  - Notes: Source thread describing the claimed Claude Code proxy/timezone/China-affiliation prompt markers and version window, framed by the community as hidden instrumentation of Claude Code users.
- Source: https://aiweekly.co/alerts/anthropic-to-remove-claude-code-marker-that-flagged-china-users
  - Title: "Anthropic to remove Claude Code marker that flagged China users"
  - Type: Secondary analysis
  - Access: 2026-07-07
  - Notes: AIWeekly summary reporting Anthropic's explanation that the marker was an anti-reseller/distillation experiment and that rollback was planned.
- Source: https://www.techtimes.com/articles/319415/20260701/claude-code-hid-proxy-fingerprints-system-prompts-anthropic-promises-fix.htm
  - Title: "Claude Code Hid Proxy Fingerprints in System Prompts"
  - Type: Secondary report
  - Access: 2026-07-07
  - Notes: Secondary report on the same Claude Code marker controversy.

### Unbroker makes data-broker opt-outs agent-shaped
- Source: https://hermes-agent.nousresearch.com/docs/user-guide/skills/optional/security/security-unbroker
  - Title: "Unbroker"
  - Type: Official documentation
  - Access: 2026-07-07
  - Notes: Hermes Agent docs describe Unbroker as an optional security skill for autonomously removing personal information from data-broker sites, authored by SHL0MS.
- Source: https://hermes-agent.nousresearch.com/docs/reference/optional-skills-catalog
  - Title: "Optional Skills Catalog"
  - Type: Official documentation
  - Access: 2026-07-07
  - Notes: Hermes Agent optional-skills catalog lists Unbroker under security skills.
- Post: https://x.com/SHL0MS/status/2073128911429668877
  - Title: "Open sourcing UNBROKER"
  - Type: X post
  - Access: 2026-07-07
  - Notes: SHL0MS launch post describing Unbroker as a tool that finds where personal information is exposed by data brokers and files removals inside Hermes Agent.
- Post: https://x.com/NousResearch/status/2074089256192967062
  - Title: "Try 10 minutes with the Unbroker skill"
  - Type: Official X post
  - Access: 2026-07-07
  - Notes: Nous Research post pointing users to the Unbroker skill launch.

## Big Tech Moves

### Palantir discovers AI sovereignty
- Post: https://x.com/PalantirTech/status/2072114267776491695
  - Title: "Palantir on AI sovereignty"
  - Type: Official X post
  - Access: 2026-07-07
  - Notes: Palantir's nine-point AI sovereignty manifesto arguing that data retention, deployment control, and institutional choice are strategic assets; curated as a useful-but-rich pitch from Palantir.
- Source: https://www.palantir.com/protect-your-sovereignty/
  - Title: "Palantir Sovereign AI"
  - Type: Official product/positioning page
  - Access: 2026-07-07
  - Notes: Palantir page backing the sovereignty framing for enterprise AI control.

### Venice raises VC on the privacy pitch
- Source: https://venice.ai/blog/venice-raises-65-million-series-a
  - Title: "Venice Raises $65 Million Series A at a $1 Billion Valuation"
  - Type: Official company blog
  - Access: 2026-07-07
  - Notes: Venice says its first outside capital round was led by Dragonfly at a $1B valuation, with a privacy-first pitch, local device storage for conversations, token-economy metrics, and global scaling goals.
- Post: https://x.com/ErikVoorhees/status/2072336114950545755
  - Title: "VVV and Capital"
  - Type: Founder X post
  - Access: 2026-07-07
  - Notes: Erik Voorhees post announcing Venice's $65M Series A and framing the company as AI plus cryptoeconomics.

### China may hold frontier models at the border
- Source: https://www.reuters.com/world/china/beijing-looking-curbing-overseas-access-chinas-top-ai-models-sources-say-2026-07-07/
  - Title: "Beijing is looking at curbing overseas access to China's top AI models"
  - Type: Report
  - Access: 2026-07-07
  - Notes: Reuters report, amplified by the submitted Jukan post, that China has discussed restricting overseas access to advanced domestic AI models.
- Post: https://x.com/jukan05/status/2074443936865960205
  - Title: "China considers restricting overseas access to cutting-edge AI models"
  - Type: X post
  - Access: 2026-07-07
  - Notes: Submitted post summarizing the Reuters-reported China model-access restriction discussions.

### Etched turns inference chips into rack-scale product
- Source: https://www.etched.com/
  - Title: "Etched"
  - Type: Company/product page
  - Access: 2026-07-07
  - Notes: Etched homepage says the company is validating a rack-scale inference product, first racks ship this summer, and production has begun to fulfill more than $1B in customer contracts.
- Post: https://x.com/Etched/status/2071972062202343590
  - Title: "Etched comes out of stealth"
  - Type: Official X post
  - Access: 2026-07-07
  - Notes: Etched's June 30 post announcing A0 tapeout, first racks, $1B+ in customer contracts, $800M raised, and summer rack shipments.

## Showcase

### Local Codex patches with codex-app-modifier
- Repo: https://github.com/zats/skills
  - Title: "zats/skills"
  - Type: Repository
  - Access: 2026-07-07
  - Notes: Repository for Sash Zats's custom Codex and Claude Code skills, including `codex-app-modifier`, used here as source material for a local Codex customization showcase.
- Post: https://x.com/zats/status/2070945450408993111
  - Title: "Made codex-app-modifier skill"
  - Type: X post
  - Access: 2026-07-07
  - Notes: Post announcing `codex-app-modifier` and the incognito-thread test project for local Codex desktop customization.

### Community Slot
- Link: https://github.com/AustinKelsay/austin-ai-meetup-list
  - Title: "Austin AI Meetup List"
  - Type: Repository
  - Access: 2026-07-07
  - Notes: Placeholder link for the open Community Slot on the next upcoming meetup.
