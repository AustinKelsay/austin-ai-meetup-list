// This file is the frontend's explicit content contract.
// Keep it boring: sessions -> tracks -> items.
//
// Optional session-level slideshow shape:
// - presentationIntro: welcome slide shown before all track slides
// - event: meetup metadata for reminders + add-to-calendar links
// - showcases: short end-of-meetup shares rendered as the final track
//
// Supported item shapes:
// - href: plain linked topic
// - embed / embeds: X/Twitter embed override(s)
// - image / images: linked hero image override(s)
// - video / videos: standalone video embed override(s)
// - mediaPair: combined story, usually "video + reaction post"
// - linkPair: side-by-side links, useful for repo + dashboard style items
// - notes: optional presenter note (string) shown as a callout
// - suppressXEmbeds / suppressVideos / suppressImages: opt out of default media rendering
//
// Standard track taxonomy for recurring club sessions:
// 1. Local Builds & Projects
// 2. SHIPPED
// 3. Agent Infrastructure
// 4. Models & Research
// 5. Security
// 6. Big Tech Moves
export const sessions = [
  {
    id: "session-2026-04-01",
    slug: "2026-04-01",
    date: "April 1, 2026",
    markdownHref: "./topics/2026-04-01.md",
    event: {
      title: "Austin AI Club",
      summary: "Quick AI news rundown, demos, and open discussion.",
      startAt: "2026-04-01T17:00:00-05:00",
      endAt: "2026-04-01T19:00:00-05:00",
      timezone: "America/Chicago",
      locationName: "Bitcoin Park Austin",
      locationAddress: "Austin, TX",
      reminderSendHour: 10,
    },
    presentationIntro: {
      eyebrow: "Austin AI Club",
      title: "Austin AI Club",
      bullets: [
        "Small, high-signal, invite only.",
        "Quick AI news rundown, then open discussion.",
        "Bring projects, prototypes, links, research, or a showcase.",
      ],
    },
    showcases: [
      {
        title: "DISTILL",
        description:
          "DISTILL stands for Data Infrastructure for Storing, Tagging, Indexing, and Labeling Locally. It is a desktop app for reviewing, labeling, and exporting chat history from Codex CLI, Claude Code, and OpenCode.",
        chip: "showcase",
        href: "https://github.com/AustinKelsay/DISTILL",
        image: {
          src: "/images/distill-showcase.png",
          href: "https://github.com/AustinKelsay/DISTILL",
          alt: "DISTILL desktop app screenshot",
          caption: "DISTILL session review UI",
        },
        notes:
          "Local chat history, one place, ready to review and export.",
      },
    ],
    tracks: [
      {
        id: "apr-shipped",
        title: "SHIPPED",
        purpose:
          "Too many vibe coders burn tokens and ship nothing. What did you actually get into the world this month?",
        sectionNote:
          "If you're doing a showcase later, no need to spoil it here — save the good stuff.",
        items: [],
      },
      {
        id: "apr-agent-infrastructure",
        title: "Agent Infrastructure",
        purpose:
          "This section covers the plumbing for agent systems: runtimes, protocols, interfaces, orchestration layers, and the tooling that makes autonomous workflows usable.",
        items: [
          {
            title: "GTC 2026 was an AI factory pitch",
            description:
              "The main pitch was not just faster chips. NVIDIA framed GTC around the whole AI factory, from Vera Rubin racks to DSX reference designs.",
            chip: "news",
            href: "https://blogs.nvidia.com/blog/gtc-2026-news/",
            notes:
              "They are selling a blueprint for the data center, not just the box that goes in it.",
            image: {
              src: "https://iprsoftwaremedia.com/219/files/202603/69b75d173d6332e5b174de10_nvidia-vera-rubin-dsx/nvidia-vera-rubin-dsx_8a1ea329-b957-4cc8-83a6-f6e76d324c62-prv.jpg",
              href:
                "https://nvidianews.nvidia.com/news/nvidia-releases-vera-rubin-dsx-ai-factory-reference-design-and-omniverse-dsx-digital-twin-blueprint-with-broad-industry-support",
              alt: "NVIDIA Vera Rubin DSX AI Factory reference design",
              caption:
                "Official NVIDIA press image: Vera Rubin DSX AI Factory reference design",
            },
            linkPair: [
              "https://nvidianews.nvidia.com/news/nvidia-vera-rubin-platform",
              "https://nvidianews.nvidia.com/news/nvidia-releases-vera-rubin-dsx-ai-factory-reference-design-and-omniverse-dsx-digital-twin-blueprint-with-broad-industry-support",
              "https://www.nvidia.com/gtc",
            ],
          },
          {
            title: "NVIDIA wants a place in the agent stack too",
            description:
              "It was not only hardware. NVIDIA also launched Agent Toolkit, OpenShell, and AI-Q, which looks like a serious push into the default enterprise agent stack.",
            chip: "stack",
            href: "https://nvidianews.nvidia.com/news/ai-agents",
            notes:
              "They want a seat in the runtime layer, not just a claim on the GPU budget.",
            image: {
              src: "https://iprsoftwaremedia.com/219/files/202603/69b796313d6332f8a374de0e_nvidia-agent-toolkit/nvidia-agent-toolkit_bb2c0928-f241-4d78-b39d-14f05c246fe1-prv.jpg",
              href: "https://nvidianews.nvidia.com/news/ai-agents",
              alt: "NVIDIA Agent Toolkit",
              caption: "Official NVIDIA press image: Agent Toolkit / OpenShell / AI-Q",
            },
            linkPair: [
              "https://build.nvidia.com/openshell",
              "https://build.nvidia.com/nvidia/aiq",
            ],
          },
          {
            title: "Physical AI got pulled into the same pitch",
            description:
              "Robotics, autonomy, and synthetic-data pipelines showed up as the next leg of the same infrastructure story.",
            chip: "robotics",
            href:
              "https://nvidianews.nvidia.com/news/nvidia-announces-open-physical-ai-data-factory-blueprint-to-accelerate-robotics-vision-ai-agents-and-autonomous-vehicle-development",
            notes:
              "Same playbook, different target: simulate it, generate the data, then move into real-world systems.",
            image: {
              src: "https://iprsoftwaremedia.com/219/files/202603/69b4f26b3d633201f974de1a_nvidia-physical-ai-data-factory-blueprint/nvidia-physical-ai-data-factory-blueprint_3e75cdcf-01f2-4acc-b4a9-a3125fac7b06-prv.jpg",
              href:
                "https://nvidianews.nvidia.com/news/nvidia-announces-open-physical-ai-data-factory-blueprint-to-accelerate-robotics-vision-ai-agents-and-autonomous-vehicle-development",
              alt: "NVIDIA Physical AI Data Factory Blueprint",
              caption:
                "Official NVIDIA press image: Physical AI Data Factory Blueprint",
            },
            linkPair: [
              "https://nvidianews.nvidia.com/news/nvidia-and-global-robotics-leaders-take-physical-ai-to-the-real-world",
              "https://nvidianews.nvidia.com/news/nvidia-expands-open-model-families-to-power-the-next-wave-of-agentic-physical-and-healthcare-ai",
            ],
          },
          {
            title: "Free coding agent with ad model",
            description:
              "A free coding agent angle with an ad-supported model behind it.",
            chip: "x",
            href: "https://x.com/jahooma/status/2034784332569878618",
            embed: {
              type: "tweet",
              href: "https://twitter.com/jahooma/status/2034784332569878618?ref_src=twsrc%5Etfw",
            },
          },
          {
            title: "Chrome DevTools MCP",
            description:
              "Chrome DevTools now exposes an MCP path for debugging live browser sessions, with Addy Osmani framing the practical workflow.",
            chip: "pair",
            href: "https://developer.chrome.com/blog/chrome-devtools-mcp-debug-your-browser-session",
            linkPair: [
              "https://x.com/addyosmani/status/2032875051830358197",
            ],
          },
          {
            title: "OpenAgents Autopilot",
            description:
              "New OpenAgents product angle: passively sell compute and get paid in bitcoin.",
            chip: "x",
            href: "https://x.com/ThrillerX_/status/2036864088341360670",
            embed: {
              type: "tweet",
              href: "https://twitter.com/ThrillerX_/status/2036864088341360670?ref_src=twsrc%5Etfw",
            },
          },
          {
            title: "402 Index paid API loop demo",
            description:
              "Ryan Gentry's demo shows service discovery, evaluation, tool detection, payment, and response consumption inside one agent loop. Underneath is `402index-mcp-server`, an MCP server for discovering 15,000+ paid API endpoints across L402, x402, and MPP.",
            chip: "pair",
            href: "https://x.com/RyanTheGentry/status/2039036789252390970",
            embed: {
              type: "tweet",
              href: "https://twitter.com/RyanTheGentry/status/2039036789252390970?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://github.com/ryanthegentry/402index-mcp-server",
            ],
            notes:
              "This is the cleanest end-to-end machine-payments demo in the list: discovery, trust, payment, and execution collapsed into one flow.",
          },
          {
            title: "Zai launches AutoClaw",
            description:
              "Zhipu's one-click local OpenClaw installer turns a PC into a 24/7 AI agent. Ships with Pony Alpha 2, 50+ preloaded skills, and supports open models like DeepSeek and Kimi.",
            chip: "x",
            href: "https://x.com/Zai_org/status/2038632251551023250",
            embed: {
              type: "tweet",
              href: "https://twitter.com/Zai_org/status/2038632251551023250?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://pandaily.com/zhipu-ai-launches-auto-claw-a-one-click-local-open-claw-that-turns-p-cs-into-24-7-ai-agents",
              "https://cntechpost.com/2026/03/10/zhipu-launches-autoclaw-one-click-local-ai-deployment-rival-tech-giants/",
            ],
          },
          {
            title: "Ollama launches Pi",
            description:
              "Ollama adds Pi to `ollama launch`, making Mario Zechner's minimal coding agent available from the CLI with near-zero setup. Ollama's docs position Pi as a minimal AI agent toolkit with plugin support and a quick launch path.",
            chip: "pair",
            href: "https://x.com/ollama/status/2038506792070914079",
            embed: {
              type: "tweet",
              href: "https://twitter.com/ollama/status/2038506792070914079?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://docs.ollama.com/integrations/pi",
              "https://www.sci-tech-today.com/news/ollama-pi-coding-agent-launch-openclaw-customization/",
            ],
          },
          {
            title: "Osaurus local AI suite",
            description:
              "Osaurus is pitching a Mac-native local AI suite that makes MLX models feel as easy to run as Ollama, but adds a real UI, persistent memory, sandboxed code execution, 20+ plugins, and Ollama API compatibility.",
            chip: "x",
            href: "https://x.com/pleb_devs/status/2036911139485798755",
            embed: {
              type: "tweet",
              href: "https://twitter.com/pleb_devs/status/2036911139485798755?ref_src=twsrc%5Etfw",
            },
          },
          {
            title: "Claude Code gets computer use",
            description:
              "Computer use is now in Claude Code. Research preview, Pro and Max plans, macOS only.",
            chip: "x",
            href: "https://x.com/claudeai/status/2038663014098899416",
            embed: {
              type: "tweet",
              href: "https://twitter.com/claudeai/status/2038663014098899416?ref_src=twsrc%5Etfw",
            },
            notes:
              "This is the biggest expansion of Claude Code beyond the terminal. No setup required — when it does not have a tool or connector, it navigates your screen directly.",
          },
        ],
      },
      {
        id: "apr-models-research",
        title: "Models & Research",
        purpose:
          "This section covers model releases, research updates, benchmark shifts, and capability changes that affect what we should test, trust, or pay attention to next.",
        items: [
          {
            title: "Chroma Context-1",
            description:
              "Chroma releases Context-1, a 20B open-source (Apache 2.0) agentic search model built on GPT-OSS-20B that retrieves and prunes documents for downstream reasoning models. Matches frontier LLM retrieval at a fraction of the cost with 400–500 tok/s on B200. Trained with RLVR on synthetic tasks across web, finance, legal, and email domains.",
            chip: "pair",
            href: "https://x.com/trychroma/status/2037243681988894950",
            embed: {
              type: "tweet",
              href: "https://twitter.com/trychroma/status/2037243681988894950?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://www.trychroma.com/research/context-1",
              "https://x.com/trychroma/status/2037243685038153823",
              "https://x.com/trychroma/status/2037243687240163693",
              "https://x.com/trychroma/status/2037243689853161868",
              "https://x.com/trychroma/status/2037243694894768143",
            ],
          },
          {
            title: "Nemotron-Cascade 2",
            description:
              "NVIDIA's Nemotron-Cascade 2 is an open 30B MoE with 3B active parameters, gold-medal-level performance on IMO 2025, IOI 2025, and ICPC World Finals 2025, plus strong agentic and coding results for its size.",
            chip: "pair",
            href: "https://x.com/_weiping/status/2034877099908243746",
            embeds: [
              {
                type: "tweet",
                href: "https://twitter.com/Wenliang_Dai/status/2035020886269690339?ref_src=twsrc%5Etfw",
              },
            ],
            linkPair: [
              "https://huggingface.co/nvidia/Nemotron-Cascade-2-30B-A3B",
              "https://huggingface.co/collections/nvidia/nemotron-cascade-2",
              "https://arxiv.org/abs/2603.19220",
            ],
          },
          {
            title: "GLM-5.1",
            description:
              "Z.AI now documents GLM-5.1 directly for coding-agent use, with reasoning enabled plus a 204.8k context window and 131k max tokens. Worth comparing against GLM-5 and the other agent-first releases.",
            chip: "x",
            href: "https://x.com/Zai_org/status/2037490078126084514",
            embed: {
              type: "tweet",
              href: "https://twitter.com/Zai_org/status/2037490078126084514?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://docs.z.ai/devpack/using5.1",
              "https://docs.z.ai/guides/llm/glm-5",
            ],
          },
          {
            title: "GLM-5V-Turbo",
            description:
              "Z.AI introduces GLM-5V-Turbo, a vision coding model built for multimodal coding tasks across images, videos, design drafts, and document layouts.",
            chip: "x",
            href: "https://x.com/Zai_org/status/2039371126984360085",
            embed: {
              type: "tweet",
              href: "https://twitter.com/Zai_org/status/2039371126984360085?ref_src=twsrc%5Etfw",
            },
          },
          {
            title: "MiniMax M2.7",
            description:
              "MiniMax is pitching M2.7 as a serious SWE and agent model, with the launch post calling out SWE-Pro, Terminal Bench 2, tool use, and OpenClaw-style team workflows.",
            chip: "x",
            href: "https://x.com/MiniMax_AI/status/2034315320337522881",
            embed: {
              type: "tweet",
              href: "https://twitter.com/MiniMax_AI/status/2034315320337522881?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://www.minimax.io/news/minimax-m27-en",
              "https://platform.minimax.io/subscribe/coding-plan",
            ],
          },
          {
            title: "GPT-5.4 mini and nano",
            description:
              "Artificial Analysis highlights OpenAI's cheaper GPT-5.4 mini and nano variants, with nano standing out on price-performance.",
            chip: "bench",
            href: "https://x.com/ArtificialAnlys/status/2037043552405119395",
            embed: {
              type: "tweet",
              href: "https://twitter.com/ArtificialAnlys/status/2037043552405119395?ref_src=twsrc%5Etfw",
            },
          },
          {
            title: "Holo3 computer-use models",
            description:
              "H Company launches Holo3, an open-weight computer-use model series claiming 78.9% on OSWorld-Verified while undercutting GPT-5.4 and Opus 4.6 on price.",
            chip: "x",
            href: "https://x.com/hcompany_ai/status/2039021096649805937",
            embed: {
              type: "tweet",
              href: "https://twitter.com/hcompany_ai/status/2039021096649805937?ref_src=twsrc%5Etfw",
            },
          },
          {
            title: "Qwen3.5-Omni",
            description:
              "Alibaba drops Qwen3.5-Omni, a full-modal model handling text, images, audio, and video with real-time speech generation. Three sizes (Plus, Flash, Light), 256k context, speech recognition for 113 languages, and claims 215 SOTA results in audio/video tasks while outperforming Gemini 3.1 Pro on general audio understanding.",
            chip: "x",
            href: "https://x.com/Alibaba_Qwen/status/2038636335272194241",
            embed: {
              type: "tweet",
              href: "https://twitter.com/Alibaba_Qwen/status/2038637124619231467?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://x.com/Ali_TongyiLab/status/2038609308750143762",
              "https://qwen.ai/research",
              "https://huggingface.co/collections/Qwen/qwen35",
            ],
          },
          {
            title: "Cohere Transcribe",
            description:
              "Cohere releases a 2B open-weights conformer encoder-decoder transcription model trained from scratch on 14 languages, hitting 4.7% on AA-WER across 3 datasets including Artificial Analysis's proprietary AA-AgentTalk dataset.",
            chip: "x",
            href: "https://x.com/ArtificialAnlys/status/2038678855213568031",
            embed: {
              type: "tweet",
              href: "https://twitter.com/ArtificialAnlys/status/2038678855213568031?ref_src=twsrc%5Etfw",
            },
          },
          {
            title: "Liquid AI LFM2.5-350M",
            description:
              "Liquid AI releases LFM2.5-350M, a tiny agentic model trained for instruction following, data extraction, and tool use. The pitch is edge-grade size with unusually capable small-model behavior.",
            chip: "x",
            href: "https://x.com/i/status/2039029358224871605",
            embed: {
              type: "tweet",
              href: "https://twitter.com/i/status/2039029358224871605?ref_src=twsrc%5Etfw",
            },
          },
          {
            title: "GLM5 Turbo",
            description:
              "Artificial Analysis highlights another new model drop worth checking against their leaderboard.",
            chip: "bench",
            href: "https://x.com/ArtificialAnlys/status/2038667075489808804",
            embed: {
              type: "tweet",
              href: "https://twitter.com/ArtificialAnlys/status/2038667075489808804?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://artificialanalysis.ai/leaderboards/models",
            ],
          },
          {
            title: "Composer 2 / Kimi K2.5 drama",
            description:
              "The Composer 2 and Kimi K2.5 dispute is worth unpacking as both model drama and product positioning, with Fleetwood's image adding a useful visual artifact to the thread.",
            chip: "pair",
            href: "https://x.com/ns123abc/status/2035058399067435474",
            embed: {
              type: "tweet",
              href: "https://twitter.com/fleetwood___/status/2037117778503626937?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://x.com/Kimi_Moonshot/status/2035074972943831491",
              "https://x.com/fleetwood___/status/2037117778503626937",
            ],
          },
          {
            title: "Claude-distilled Qwen models trending on HF",
            description:
              "Jackrong's Claude Opus 4.6 reasoning distills into Qwen3.5 are trending on Hugging Face, now spanning 2B through 35B-A3B sizes with GGUF quants. V2 just dropped with shorter reasoning chains, less over-analysis on easy problems, and a better reasoning-cost-to-quality ratio.",
            chip: "pair",
            href: "https://x.com/HuggingModels/status/2038398319417082125",
            embeds: [
              {
                type: "tweet",
                href: "https://twitter.com/HuggingModels/status/2038398319417082125?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/KyleHessling1/status/2038672381850653119?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/Hesamation/status/2038642306434150427?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/UnslothAI/status/2038625148354679270?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/outsource_/status/2038999111039357302?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/aiwithmayank/status/2038918640519807340?ref_src=twsrc%5Etfw",
              },
            ],
            linkPair: [
              "https://huggingface.co/collections/Jackrong/qwen35-claude-46-opus-reasoning-distilled",
              "https://huggingface.co/Jackrong/Qwen3.5-27B-Claude-4.6-Opus-Reasoning-Distilled-v2-GGUF",
            ],
          },
          {
            title: "Distillation hesitation",
            description:
              "GLM-5.1, MiniMax M2.7, Xiaomi MiMo-V2 are all out but none dropped public weights. Chinese labs that normally ship open are holding back, possibly because distillation makes open releases risky. Meanwhile people are already distilling Claude Opus into Qwen3.5 anyway.",
            chip: "pair",
            href: "https://docs.z.ai/devpack/using5.1",
            embeds: [
              {
                type: "tweet",
                href: "https://twitter.com/anthonyronning/status/2037586323834642859?ref_src=twsrc%5Etfw",
              },
            ],
            linkPair: [
              "https://docs.z.ai/guides/llm/glm-5",
              "https://www.minimax.io/news/minimax-m27-en",
              "https://platform.minimax.io/subscribe/coding-plan",
              "https://weibo.com/6486870325/5277992772176164",
              "https://github.com/XiaomiMiMo/MiMo-V2-Flash",
              "https://huggingface.co/Jackrong/Qwen3.5-27B-Claude-4.6-Opus-Reasoning-Distilled",
            ],
          },
          {
            title: "ARC AGI benchmark #3",
            description:
              "ARC-AGI-3 is the first fully interactive benchmark, replacing grid puzzles with video-game-like scenarios where agents explore with no instructions. Humans score 100%, best AI (Gemini 3.1 Pro) hits 0.37%. A simple RL and graph-search approach scored 12.58%, outperforming every frontier LLM by 30x. $2M prize pool.",
            chip: "x",
            href: "https://x.com/arcprize/status/2036860080541589529",
            embed: {
              type: "tweet",
              href: "https://twitter.com/arcprize/status/2036860080541589529?ref_src=twsrc%5Etfw",
            },
          },
          {
            title: "Google TurboQuant",
            description:
              "Google Research says TurboQuant is a training-free, data-oblivious quantization approach that can compress KV caches by at least 6x, hit quality-neutral 3-bit cache settings in their tests, and improve vector-search indexing. TheTom also shipped a public implementation, which makes this more than just a paper story.",
            chip: "research",
            href:
              "https://research.google/blog/turboquant-a-training-free-approach-to-speed-up-and-compress-large-language-models/",
            linkPair: [
              "https://arxiv.org/abs/2504.19874",
              "https://x.com/i/status/2036696569194647869",
              "https://x.com/no_stp_on_snek/status/2036944965364834444",
              "https://ngrok.com/blog/quantization",
              "https://huggingface.co/blog/not-lain/kv-caching",
              "https://arxiv.org/html/2411.07191v2",
              "https://x.com/i/status/2039089641043755036",
              "https://github.com/TheTom/turboquant_plus",
            ],
            notes:
              "This is an inference-economics slide as much as a research slide: memory pressure on KV cache is the tax on long context, and the public implementation makes it easier to test outside Google's writeup.",
          },
          {
            title: "LLM neuroanatomy / RYS layer repetition",
            description:
              "David Noel Ng's RYS writeup treats transformer stacks like neuroanatomy: repeat the right middle layers in Qwen2-72B and you can get stronger leaderboard behavior without retraining the whole model.",
            chip: "research",
            href: "https://dnhkng.github.io/posts/rys/",
            notes:
              "The interesting part is not just the leaderboard stunt. It suggests model internals may be more structurally hackable than most release narratives admit.",
          },
          {
            title: "Local models getting glazed",
            description:
              "The local-model flex genre keeps escalating: more posts about absurdly large or absurdly fast models running on phones and laptops, which is becoming its own signal about inference progress.",
            chip: "pair",
            href: "https://x.com/theo/status/2038051651823812839",
            embed: {
              type: "tweet",
              href: "https://twitter.com/thdxr/status/2038619304447385906?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://x.com/anemll/status/2035901335984611412",
              "https://x.com/adrgrondin/status/2039066539022778613",
              "https://x.com/thdxr/status/2038054914358645168",
              "https://x.com/thdxr/status/2038619304447385906",
              "https://x.com/teortaxesTex/status/2038329816412283343",
            ],
          },
        ],
      },
      {
        id: "apr-security",
        title: "Security",
        purpose:
          "This section is where we look at attacks, exploits, abuse patterns, and defensive ideas so we stay sharp about how these systems can be manipulated in the real world.",
        items: [
          {
            title: "Claude Code source leaked via npm sourcemap",
            description:
              "Chaofan Shou says `@anthropic-ai/claude-code@2.1.88` shipped a `cli.js.map` in the npm tarball, exposing the bundled source. Sigrid Jin mirrored it to GitHub, and the map gives a view into Anthropic's internal fast paths and feature flags.",
            chip: "security",
            href: "https://x.com/Fried_rice/status/2038894956459290963",
            embed: {
              type: "tweet",
              href: "https://twitter.com/Fried_rice/status/2038894956459290963?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://x.com/realsigridjin/status/2038908883004227957",
              "https://x.com/StraughterG/status/2039117804155068903",
              "https://registry.npmjs.org/@anthropic-ai/claude-code/-/claude-code-2.1.88.tgz",
              "https://x.com/i/status/2039039787475353821",
              "https://arstechnica.com/ai/2026/03/entire-claude-code-cli-source-code-leaks-thanks-to-exposed-map-file",
              "https://github.com/Gitlawb/openclaude",
            ],
            notes:
              "As of March 31, 2026, npm `latest` is back on 2.1.87, so this looks like a quick rollback after the 2.1.88 publish.",
          },
          {
            title: "LiteLLM supply-chain attack",
            description:
              "Karpathy flags the LiteLLM PyPI compromise as a worst-case supply-chain failure, with credential exfiltration risk spreading through transitive dependencies like dspy.",
            chip: "x",
            href: "https://x.com/karpathy/status/2036487306585268612",
            embed: {
              type: "tweet",
              href: "https://twitter.com/karpathy/status/2036487306585268612?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://github.com/BerriAI/litellm/issues/24512",
            ],
          },
          {
            title: "Axios supply-chain attack",
            description:
              "Karpathy flags a live npm compromise of `axios`, arguing the deeper issue is how unpinned dependencies let a brief malicious release spread randomly at scale. The quoted context says `axios@1.14.1` pulled in a newly published `plain-crypto-js@4.2.1`.",
            chip: "security",
            href: "https://x.com/karpathy/status/2038849654423798197",
            embed: {
              type: "tweet",
              href: "https://twitter.com/karpathy/status/2038849654423798197?ref_src=twsrc%5Etfw",
            },
            notes:
              "His concrete point is operational, not just sensational: package managers should make safer defaults like release-age constraints normal instead of optional.",
          },
          {
            title: "Black-hat LLMs",
            description:
              "Nicholas Carlini's Black-hat LLMs talk is a good framing slide for the meetup: if LLMs are now critical infrastructure and attack surfaces, offensive methods around them will keep getting sharper.",
            chip: "video",
            href: "https://www.youtube.com/watch?v=1sd26pWhfmg",
          },
        ],
      },
      {
        id: "apr-big-tech-moves",
        title: "Big Tech Moves",
        purpose:
          "This section tracks platform decisions, acquisitions, distribution shifts, and strategic moves from major companies that could change where AI products get distribution, leverage, or control.",
        items: [
          {
            title: "OpenAI closes new funding round",
            description:
              "OpenAI says it closed a new funding round with $122 billion in committed capital at an $852B post-money valuation, giving it far more room to fund compute, product demand, and global expansion.",
            chip: "finance",
            href: "https://x.com/OpenAI/status/2039085161971896807",
            embed: {
              type: "tweet",
              href: "https://twitter.com/OpenAI/status/2039085161971896807?ref_src=twsrc%5Etfw",
            },
          },
          {
            title: "Sora app shutdown",
            description:
              "Sora's standalone app is shutting down. The official account says more details are coming on timelines for the app and API plus how user work will be preserved, which makes this a notable retreat in consumer AI video distribution.",
            chip: "x",
            href: "https://x.com/soraofficialapp/status/2036532795984715896",
            embed: {
              type: "tweet",
              href: "https://twitter.com/soraofficialapp/status/2036532795984715896?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://x.com/i/status/2036577092360609999",
            ],
          },
          {
            title: "MK-Ultrathink",
            description:
              "uncleJim frames Meta's Moltbook acquisition as an agentic-commerce bet: owning an influence layer for AI agents before agents become a primary internet interface.",
            chip: "x",
            href: "https://x.com/uncleJim21/status/2037241016626159979",
            embed: {
              type: "tweet",
              href: "https://twitter.com/uncleJim21/status/2037241016626159979?ref_src=twsrc%5Etfw",
            },
          },
          {
            title: "White House pushes a national AI framework",
            description:
              "Not your typical policy memo. The White House wants Congress to preempt state AI laws, fast-track data-center permits, and set up a hands-off federal regime.",
            chip: "policy",
            href:
              "https://www.whitehouse.gov/releases/2026/03/president-donald-j-trump-unveils-national-ai-legislative-framework/",
            notes:
              "If any of this moves, the AI conversation shifts from model capabilities to federal power grabs, copyright battles, and state-vs-fed turf wars.",
            image: {
              src: "https://www.whitehouse.gov/wp-content/uploads/2025/03/WH47-Social-Share-Card.jpg",
              href:
                "https://www.whitehouse.gov/releases/2026/03/president-donald-j-trump-unveils-national-ai-legislative-framework/",
              alt: "White House social share card",
              caption: "Official White House share image",
            },
            linkPair: [
              "https://www.whitehouse.gov/wp-content/uploads/2026/03/03.20.26-National-Policy-Framework-for-Artificial-Intelligence-Legislative-Recommendations.pdf",
              "https://apnews.com/article/479eb3d0a50fe7237678a9bfb146ac7a",
              "https://www.axios.com/2026/03/20/white-house-ai-plan-trump-framework",
            ],
          },
          {
            title: "OpenAI to acquire Astral",
            description:
              "OpenAI is buying Astral — the people behind uv, Ruff, and ty. So now some of the most popular Python tooling lives inside the Codex umbrella.",
            chip: "acquisition",
            href: "https://openai.com/index/openai-to-acquire-astral/",
            notes:
              "The coding-agent fight just moved down into tools developers already have in their workflow.",
            image: {
              src: "https://astral.sh/static/OpenGraph/Astral.jpg",
              href: "https://astral.sh/blog/openai",
              alt: "Astral social card",
              caption: "Astral share image",
            },
            linkPair: [
              "https://astral.sh/blog/openai",
              "https://astral.sh",
            ],
          },
          {
            title: "Meta and Intel chip push",
            description:
              "Two different hardware angles worth grouping together: Meta and Arm are co-designing a data-center CPU for AI workloads, while Intel's Arc Pro B70 puts 32GB of VRAM into a relatively affordable workstation GPU that could matter for local inference.",
            chip: "pair",
            href:
              "https://about.fb.com/news/2026/03/meta-partners-with-arm-to-develop-new-class-of-data-center-silicon/",
            notes:
              "This stopped being about GPU shortages a while ago. The big platforms are building silicon end to end, and the workstation market is still looking for viable local-AI cards outside NVIDIA.",
            mediaPair: {
              left: {
                type: "image",
                src: "https://about.fb.com/wp-content/uploads/2026/03/arm-Partnership_Header.jpg?w=1200",
                href:
                  "https://about.fb.com/news/2026/03/meta-partners-with-arm-to-develop-new-class-of-data-center-silicon/",
                alt: "Meta and Arm logos",
                caption: "Official Meta image: Meta and Arm partnership",
              },
              right: {
                type: "tweet",
                href: "https://twitter.com/i/status/2036821577627517160?ref_src=twsrc%5Etfw",
              },
            },
            linkPair: [
              "https://newsroom.arm.com/blog/introducing-arm-agi-cpu",
              "https://x.com/i/status/2036821577627517160",
            ],
          },
          {
            title: "Tesla dodges AV regulation",
            description:
              "California says Tesla is operating under a chauffeured-service permit rather than an autonomous-vehicle service permit, which lets the company keep the robotaxi framing while avoiding the stricter AV reporting regime applied to rivals like Waymo.",
            chip: "policy",
            href: "https://electrek.co/2026/03/25/california-regulator-confirms-tesla-not-operating-autonomous-vehicle-service",
          },
        ],
      },
    ],
  },
  {
    id: "session-2026-03-18",
    slug: "2026-03-18",
    date: "March 18, 2026",
    markdownHref: "./topics/2026-03-18.md",
    event: {
      title: "Austin AI Club",
      summary: "Quick AI news rundown, demos, and open discussion.",
      startAt: "2026-03-18T17:00:00-05:00",
      endAt: "2026-03-18T19:00:00-05:00",
      timezone: "America/Chicago",
      locationName: "Bitcoin Park Austin",
      locationAddress: "Austin, TX",
      reminderSendHour: 10,
    },
    presentationIntro: {
      eyebrow: "Austin AI Club",
      title: "Austin AI Club",
      bullets: [
        "Small, high-signal, invite only.",
        "Quick AI news rundown, then open discussion.",
        "Bring projects, prototypes, links, or research.",
      ],
    },
    showcases: [
      {
        title: "Pimping your OpenClaw",
        description:
          "Topher on customizing and leveling up your OpenClaw setup.",
        chip: "showcase",
      },
    ],
    tracks: [
      {
        id: "mar-agent-infrastructure",
        title: "Agent Infrastructure",
        purpose:
          "This section covers the plumbing for agent systems: runtimes, protocols, interfaces, orchestration layers, and the tooling that makes autonomous workflows usable.",
        items: [
          {
            title: "Agent Overload",
            description:
              "OpenClaw, NemoClaw, PicoClaw, NullClaw, NanoClaw, MicroClaw, Hermes Agent, Qwen Agent, and Pi in one place.",
            chip: "watch",
            linkPair: [
              "https://github.com/openclaw/openclaw",
              "https://github.com/NVIDIA/NemoClaw",
              "https://github.com/sipeed/picoclaw",
              "https://github.com/nullclaw/nullclaw",
              "https://github.com/qwibitai/nanoclaw",
              "https://github.com/microclaw/microclaw",
              "https://github.com/NousResearch/hermes-agent",
              "https://github.com/QwenLM/Qwen-Agent",
              "https://github.com/badlogic/pi-mono",
            ],
          },
          {
            title: "CLI vs MCP",
            description:
              "Best recent data point: Scalekit ran 75 benchmark runs and found CLI agents were 10-32x cheaper with 100% reliability vs MCP's 72%, while still arguing MCP matters once agents act across customer boundaries.",
            chip: "data",
            href: "https://www.scalekit.com/blog/mcp-vs-cli-use",
            embed: {
              type: "tweet",
              href: "https://twitter.com/ravibits/status/2031807480448389375?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://www.scalekit.com/blog/mcp-vs-cli-use",
            ],
          },
          {
            title: "OpenAI WebSockets",
            description:
              "OpenAI's official server-side WebSocket path for realtime inference and event-driven model sessions.",
            chip: "docs",
            href: "https://developers.openai.com/api/docs/guides/realtime-websocket",
            linkPair: [
              "https://developers.openai.com/api/docs/guides/realtime-websocket",
              "https://developers.openai.com/api/docs/guides/realtime-conversations",
              "https://developers.openai.com/api/docs/guides/realtime-models-prompting",
              "https://developers.openai.com/api/docs/guides/realtime-server-controls",
              "https://developers.openai.com/api/docs/guides/realtime-transcription",
              "https://openai.github.io/openai-agents-js/guides/voice-agents/quickstart/",
            ],
          },
          {
            title: "Frontier lab agent frameworks",
            description:
              "The big-company version of agent infrastructure: OpenAI pushing Codex through ACP, and Anthropic packaging its own first-party Agent SDK.",
            chip: "docs",
            href: "https://agentclientprotocol.com/overview/introduction",
            linkPair: [
              "https://agentclientprotocol.com/overview/introduction",
              "https://platform.claude.com/docs/en/agent-sdk/quickstart",
            ],
          },
          {
            title: "Claude Code + Codex updates roundup",
            description:
              "The current frontier-lab coding-agent picture: Codex app and model updates on OpenAI's side, Claude Code overview and subagents on Anthropic's side.",
            chip: "docs",
            href: "https://openai.com/index/introducing-the-codex-app/",
            linkPair: [
              "https://openai.com/index/introducing-the-codex-app/",
              "https://openai.com/index/introducing-gpt-5-3-codex/",
              "https://docs.anthropic.com/en/docs/claude-code/overview",
              "https://docs.anthropic.com/en/docs/claude-code/sub-agents",
            ],
          },
          {
            title: "Claude distillation claims",
            description:
              "Anthropic says DeepSeek, Moonshot, and MiniMax were doing industrial-scale Claude distillation through fake accounts and massive prompt traffic.",
            chip: "news",
            href: "https://www.tomshardware.com/tech-industry/artificial-intelligence/anthropic-accuses-deepseek-other-chinese-ai-developers-of-industrial-scale-copying-claims-distillation-included-24-000-fraudulent-accounts-and-16-million-exchanges-to-train-smaller-models",
            linkPair: [
              "https://www.tomshardware.com/tech-industry/artificial-intelligence/anthropic-accuses-deepseek-other-chinese-ai-developers-of-industrial-scale-copying-claims-distillation-included-24-000-fraudulent-accounts-and-16-million-exchanges-to-train-smaller-models",
              "https://www.pcgamer.com/software/ai/anthropic-says-it-has-identified-thousands-of-fraudulent-accounts-taking-claude-and-extracting-its-capabilities-to-train-and-improve-their-own-models/",
              "https://www.business-standard.com/technology/tech-news/anthropic-accuses-deepseek-minimax-of-stealing-data-from-ai-model-claude-126022400092_1.html",
            ],
          },
          {
            title: "OpenClaw pairing bench",
            description:
              "Interesting eval and coordination benchmark for agent-style model pairing.",
            chip: "x",
            embed: {
              type: "tweet",
              href: "https://twitter.com/moritzkremb/status/2030221468244775131?ref_src=twsrc%5Etfw",
            },
          },
        ],
      },
      {
        id: "mar-models-research",
        title: "Models & Research",
        purpose:
          "This section covers model releases, research updates, benchmark shifts, and capability changes that affect what we should test, trust, or pay attention to next.",
        items: [
          {
            title: "Qwen 3.5 series",
            description:
              "Fresh Qwen weights to test and compare across the 3.5 line.",
            chip: "watch",
            linkPair: [
              "https://huggingface.co/collections/Qwen/qwen35",
              "https://artificialanalysis.ai/leaderboards/models?is_open_weights=open_source",
            ],
          },
          {
            title: "Nemotron v3 series",
            description:
              "NVIDIA's newer Nemotron open-weight line is worth tracking as its model family and evaluations keep expanding.",
            chip: "watch",
            linkPair: [
              "https://huggingface.co/collections/nvidia/nvidia-nemotron-v3",
            ],
          },
          {
            title: "Nemotron 3 VoiceChat frontier",
            description:
              "Artificial Analysis says NVIDIA's new speech-to-speech model is the open-weights pareto leader across conversational dynamics and speech reasoning.",
            chip: "bench",
            embed: {
              type: "tweet",
              href: "https://twitter.com/ArtificialAnlys/status/2033642073052868861?ref_src=twsrc%5Etfw",
            },
          },
          {
            title: "Mistral Small",
            description:
              "Fresh Mistral Small model drop worth sanity-checking against the other new releases.",
            chip: "x",
            embed: {
              type: "tweet",
              href: "https://twitter.com/MistralDevs/status/2033654167395357082?ref_src=twsrc%5Etfw",
            },
          },
          {
            title: "GPT-5.4 mini",
            description:
              "OpenAI's new smaller proprietary model is positioned for coding, computer use, multimodal understanding, and subagents, with OpenAI claiming it is 2x faster than GPT-5 mini.",
            chip: "x",
            href: "https://openai.com/index/introducing-gpt-5-4-mini-and-nano/",
            embed: {
              type: "tweet",
              href: "https://twitter.com/OpenAI/status/2033953592424731072?ref_src=twsrc%5Etfw",
            },
          },
          {
            title: "Xiaomi MiMo-V2-Pro",
            description:
              "Artificial Analysis says Xiaomi's new reasoning model lands between Kimi K2.5 and GLM-5 on its intelligence index, with strong agent-task performance and good token efficiency.",
            chip: "bench",
            embed: {
              type: "tweet",
              href: "https://twitter.com/ArtificialAnlys/status/2034239267052896516?ref_src=twsrc%5Etfw",
            },
          },
          {
            title: "MiniMax M2.7",
            description:
              "MiniMax is pitching M2.7 as a self-evolving agentic model with strong software engineering, tool use, and multi-agent performance.",
            chip: "x",
            href: "https://www.minimax.io/news/minimax-m27-en",
            embed: {
              type: "tweet",
              href: "https://twitter.com/MiniMax_AI/status/2034315320337522881?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://www.minimax.io/news/minimax-m27-en",
            ],
          },
          {
            title: "LMfit",
            description:
              "Local AI utility that checks your hardware and helps estimate which models will actually run well before you download anything.",
            chip: "x",
            embed: {
              type: "tweet",
              href: "https://twitter.com/dr_cintas/status/2029272137488580761?ref_src=twsrc%5Etfw",
            },
          },
          {
            title: "Frontier check",
            description: "Where the top models actually stand right now.",
            chip: "data",
            href: "https://artificialanalysis.ai",
          },
        ],
      },
      {
        id: "mar-security",
        title: "Security",
        purpose:
          "This section is where we look at attacks, exploits, abuse patterns, and defensive ideas so we stay sharp about how these systems can be manipulated in the real world.",
        items: [
          {
            title: "KeepAI",
            description:
              "Artur from Nostrband just dropped this. Nostr-native AI tooling.",
            chip: "x",
            embed: {
              type: "tweet",
              href: "https://twitter.com/ArturBrugeman/status/2032450145527148575?ref_src=twsrc%5Etfw",
              quote:
                "Anybody want this for their OpenClaw?",
              author: "Artur Brugeman",
              date: "March 13, 2026",
            },
          },
          {
            title: "SEO Injection",
            description:
              "A more casual example of personal agents helping with security work by catching hidden SEO poisoning and other weird website junk.",
            chip: "x",
            embed: {
              type: "tweet",
              href: "https://twitter.com/isabellasg3/status/2029710987008315620?ref_src=twsrc%5Etfw",
            },
          },
          {
            title: "Security nightmare thread",
            description:
              "The compact threat-model thread: exposed instances, auth bypasses, bad add-ons, and the agent as the social engineer.",
            chip: "x",
            href: "https://x.com/HedgieMarkets/status/2029337090844946791",
            embed: {
              type: "tweet",
              href: "https://twitter.com/HedgieMarkets/status/2029337090844946791?ref_src=twsrc%5Etfw",
            },
          },
        ],
      },
      {
        id: "mar-big-tech-moves",
        title: "Big Tech Moves",
        purpose:
          "This section covers major company moves, hardware releases, ecosystem bets, and market shifts that change the ground our local AI work sits on.",
        items: [
          {
            title: 'Meta\'s "Moltbook"',
            description:
              "Facebook building agents to automate social networks.",
            chip: "news",
            href: "https://techcrunch.com/2026/03/10/meta-acquired-moltbook-the-ai-agent-social-network-that-went-viral-because-of-fake-posts/",
            linkPair: [
              "https://techcrunch.com/2026/03/10/meta-acquired-moltbook-the-ai-agent-social-network-that-went-viral-because-of-fake-posts/",
              "https://apnews.com/article/31af42ccbb04001dd17a3fc7067d1de3",
            ],
          },
          {
            title: "Claude Kill?",
            description:
              "Anthropic got pushed out of the Department of War deal, OpenAI signed its own agreement, and now the defense-AI relationship is turning into a very public fight over military use and vendor power.",
            chip: "news",
            href: "https://apnews.com/article/d4608c7dd139245ac8ad94d5427c505a",
            linkPair: [
              "https://apnews.com/article/d4608c7dd139245ac8ad94d5427c505a",
              "https://openai.com/index/our-agreement-with-the-department-of-war/",
              "https://www.axios.com/2026/03/16/tech-industry-rallies-anthropic-pentagon-fight",
            ],
          },
          {
            title: "Niantic turns Pokemon Go city data into robot navigation",
            description:
              "A decade of player scans and 30B+ images are now feeding Niantic Spatial's city-scale positioning stack for Coco delivery bots.",
            chip: "news",
            href: "https://www.techrepublic.com/article/news-coco-robots-niantic-mapping/",
            embed: {
              type: "tweet",
              href: "https://twitter.com/nianticspatial/status/2031383333221880051?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://www.nianticspatial.com/blog/coco-robotics",
              "https://gizmodo.com/niantic-partnership-food-delivery-bots-use-pokemon-go-data-2000732212",
            ],
          },
          {
            title: "MacBook Pro M5 Max as a local inference laptop",
            description:
              "M5 Max 128GB running Qwen3.5-35B at 74 tok/s and Nemotron-3 Super at 24 tok/s via MLX. 40-core GPU with tensor cores, 614GB/s bandwidth. A $3.5K laptop that runs 70B models comfortably.",
            chip: "x",
            href: "https://x.com/nix_eth/status/2032879242737045612",
            embed: {
              type: "tweet",
              href: "https://twitter.com/nix_eth/status/2032879242737045612?ref_src=twsrc%5Etfw",
            },
          },
          {
            title: "Confer + Meta private AI",
            description:
              "Moxie Marlinspike says Confer is bringing private AI and end-to-end encryption into Meta AI products, a notable open-weights-meets-privacy platform move.",
            chip: "x",
            href: "https://confer.to/blog/2026/03/encrypted-meta/",
            embed: {
              type: "tweet",
              href: "https://twitter.com/moxie/status/2034096735619059966?ref_src=twsrc%5Etfw",
            },
          },
          {
            title: "NemoClaw launch + OpenClaw reaction",
            description:
              "Chris Messina posted the actual Jensen-led NemoClaw launch video, and kanavtwt posted a funny reaction clip pushing the OpenClaw hype cycle.",
            chip: "pair",
            mediaPair: {
              video: {
                href: "https://youtu.be/kRmZ5zmMS2o?si=RgD8HNueWbZtK_Td",
                embedHref:
                  "https://www.youtube.com/embed/kRmZ5zmMS2o?si=RgD8HNueWbZtK_Td",
                title:
                  "NVIDIA's Jenson Hwang launches NemoClaw to the OpenClaw community",
                caption:
                  "Video: Chris Messina on NVIDIA's NemoClaw launch into the OpenClaw community",
              },
              reaction: {
                type: "tweet",
                href: "https://twitter.com/kanavtwt/status/2033835300653568159?ref_src=twsrc%5Etfw",
              },
            },
          },
        ],
      },
      {
        id: "mar-local-builds-projects",
        title: "Local Builds & Projects",
        purpose:
          "This section is for projects from friends in the Austin scene, friends-of-friends, and things in our immediate orbit. It is where we track what people around the ATX AI community are actually shipping, experimenting with, or quietly building that reflects our shared principles.",
        outro: {
          title: "What else are we building?",
          body:
            "Share anything you're working on.",
        },
        items: [
          {
            title: "pika chat",
            description:
              "Stealth AI chat product using marmot and MLS protocols for secure end-to-end encrypted chat, with early code already visible in the repo.",
            chip: "github",
            href: "https://github.com/sledtools/pika/tree/master",
          },
          {
            title: "plebdev-bench",
            description:
              "Local benchmark project for tracking model performance, with both an open repo and a live leaderboard dashboard.",
            chip: "github",
            href: "https://github.com/AustinKelsay/plebdev-bench",
            linkPair: [
              "https://github.com/AustinKelsay/plebdev-bench",
              "https://plebdev-bench-dashboard.vercel.app/#/leaderboard",
            ],
          },
          {
            title: "sage",
            description:
              "Interesting agent assistant framework built by Anthony of Maple with a novel memory and tool-calling architecture.",
            chip: "github",
            href: "https://github.com/AnthonyRonning/sage",
          },
          {
            title: "visibible",
            description:
              "Announced from the meetup: a new project from plebdev, with launch posts on X and a Primal profile to follow along.",
            chip: "launch",
            href: "https://x.com/bitcoinplebdev/status/2035102011746644051",
            linkPair: [
              "https://x.com/bitcoinplebdev/status/2035102011746644051",
              "https://x.com/bitcoinplebdev/status/2036172958964535544",
              "https://primal.net/p/nprofile1qqswamncyflsf6hqt5w0xwxm7ww5v2hnvqufhrgfeaahkvkjz65hd0cd2xzj0",
            ],
          },
          {
            title: "plebdev's adversarial AI course",
            description:
              "Free adversarial AI course covering practical attacks, red-team thinking, and the security mindset around modern models.",
            chip: "x",
            href: "https://x.com/pleb_devs/status/2028582994596778014",
          },
        ],
      },
    ],
  },
];
