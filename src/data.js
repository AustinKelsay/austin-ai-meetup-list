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
// - embed: X/Twitter embed
// - video: standalone video embed
// - mediaPair: combined story, usually "video + reaction post"
// - linkPair: side-by-side links, useful for repo + dashboard style items
// - notes: optional presenter note (string) shown as a callout
//
// Standard track taxonomy for recurring club sessions:
// 1. Local Builds & Projects
// 2. Agent Infrastructure
// 3. Models & Research
// 4. Security
// 5. Big Tech Moves
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
      blurb: "Wednesday, 5 p.m. at Bitcoin Park Austin.",
      bullets: [
        "Small, high-signal, invite only.",
        "Quick AI news rundown, then open discussion.",
        "Bring projects, prototypes, links, research, or a showcase.",
      ],
      hostNote:
        "Casual format. No meetup page. No commitment required.",
      ctaLabel: "austinai.club",
      ctaHref: "https://austinai.club",
    },
    tracks: [
      {
        id: "apr-agent-infrastructure",
        title: "Agent Infrastructure",
        purpose:
          "This section covers the plumbing for agent systems: runtimes, protocols, interfaces, orchestration layers, and the tooling that makes autonomous workflows usable.",
        items: [
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
              "https://developer.chrome.com/blog/chrome-devtools-mcp-debug-your-browser-session",
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
            title: "Opencode remote sandboxes",
            description:
              "Remote sandboxes in Opencode look like a useful direction for running agent work outside the local machine.",
            chip: "x",
            href: "https://x.com/i/status/2036924361379037224",
            embed: {
              type: "tweet",
              href: "https://twitter.com/i/status/2036924361379037224?ref_src=twsrc%5Etfw",
            },
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
            title: "Nemotron-3-Cascade",
            description:
              "Fresh Nemotron model release to look at for architecture, capability, and open-weight relevance.",
            chip: "x",
            href: "https://x.com/HuggingPapers/status/2034876841475838329",
            embed: {
              type: "tweet",
              href: "https://twitter.com/HuggingPapers/status/2034876841475838329?ref_src=twsrc%5Etfw",
            },
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
              "https://x.com/ns123abc/status/2035058399067435474",
              "https://x.com/Kimi_Moonshot/status/2035074972943831491",
              "https://x.com/fleetwood___/status/2037117778503626937",
            ],
          },
          {
            title: "ARC AGI benchmark #3",
            description:
              "New ARC AGI benchmark result worth checking as another data point on reasoning and generalization.",
            chip: "x",
            href: "https://x.com/arcprize/status/2036860080541589529",
            embed: {
              type: "tweet",
              href: "https://twitter.com/arcprize/status/2036860080541589529?ref_src=twsrc%5Etfw",
            },
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
        ],
      },
      {
        id: "apr-big-tech-moves",
        title: "Big Tech Moves",
        purpose:
          "This section tracks platform decisions, acquisitions, distribution shifts, and strategic moves from major companies that could change where AI products get distribution, leverage, or control.",
        items: [
          {
            title: "Meta buys Moltbook",
            description:
              "Jim C frames Meta's Moltbook acquisition as an agentic-commerce bet: owning an influence layer for AI agents before agents become a primary internet interface.",
            chip: "x",
            href: "https://x.com/uncleJim21/status/2037241016626159979",
            embed: {
              type: "tweet",
              href: "https://twitter.com/uncleJim21/status/2037241016626159979?ref_src=twsrc%5Etfw",
            },
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
      blurb: "Wednesday, 5 p.m. at Bitcoin Park Austin.",
      bullets: [
        "Small, high-signal, invite only.",
        "Quick AI news rundown, then open discussion.",
        "Bring projects, prototypes, links, or research.",
      ],
      hostNote:
        "Casual format. No meetup page. No commitment required.",
      ctaLabel: "austinai.club",
      ctaHref: "https://austinai.club",
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
