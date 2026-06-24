// This file is the frontend's explicit content contract.
// Keep it boring: meetups -> tracks -> items.
//
// Optional meetup-level Presentation Mode shape:
// - presentationIntro: welcome slide shown before all track slides
// - event: meetup metadata for reminders + add-to-calendar links
// - showcases: short end-of-meetup shares rendered as the final track
//
// Supported item shapes:
// - href: plain linked topic
// - embed / embeds: X/Twitter embed override(s)
// - image / images: linked hero image override(s)
// - video / videos: standalone video embed override(s)
// - mediaPair: combined topic media, including tweet/image/video/link/article cards
// - xArticle(...): curated article card for X longform articles that do not embed cleanly
// - linkPair: side-by-side links, useful for repo + dashboard style items
// - notes: optional presenter note (string) shown as a callout
// - topStory: optional host-facing highlight in the meetup topic list
// - suppressXEmbeds / suppressVideos / suppressImages: opt out of default media rendering
//
// Standard track taxonomy for recurring club meetups:
// 1. Local Builds & Projects
// 2. Agent Infrastructure
// 3. Models & Research
// 4. Security
// 5. Big Tech Moves
function xArticle(article) {
  return {
    ...article,
    type: "article",
    eyebrow: article.eyebrow ?? "X article",
  };
}

export const meetups = [
  {
    id: "meetup-2026-06-24",
    slug: "2026-06-24",
    date: "June 24, 2026",
    markdownHref: "./topics/2026-06-24.md",
    event: {
      title: "Austin AI Club",
      summary: "Quick AI news rundown, demos, and open discussion.",
      startAt: "2026-06-24T18:00:00-05:00",
      endAt: "2026-06-24T20:00:00-05:00",
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
      hostNote:
        "Local model services, agent payments, open serving infra, model-release super-slides, Fable fallout, and Cursor's platform play: Ben turns Bwen into qwenstradamus, Hermes gets Stripe checkout, vLLM makes weird open models runnable, the closed-model slide is basically a duplicate check with only OpenAI Daybreak access news, open models are eating more of the frontier gap, reporting names Amazon as the White House source on the jailbreak, and a leaked 'Origin' suggests Cursor wants to compete with GitHub.",
    },
    showcases: [
      {
        title: "Community Slot",
        description:
          "Bring a project, prototype, repo, demo, or weird link worth showing the room.",
        chip: "showcase",
        href: "https://github.com/AustinKelsay/austin-ai-meetup-list",
      },
    ],
    tracks: [
      {
        id: "jun24-local-builds",
        title: "Local Builds & Projects",
        purpose:
          "This section covers member projects, prototypes, demos, and builds shared by the community.",
        items: [
          {
            title: "Ben turns Bwen into Qwenstradamus",
            description:
              "Ben Carman moved bwen:14b from a one-off Qwen3-14B LoRA trained on his tweets into qwenstradamus.com, a service that trains a downloadable model of your own voice from your tweets. Nice local-AI loop: archive export, clustered themes, hand prompts, LoRA, retrieval over original tweets, then a tiny paid product.",
            chip: "local build",
            href: "https://qwenstradamus.com/",
            mediaPair: {
              left: xArticle({
                title: "Training a model on my tweets",
                source: "Ben Carman",
                date: "June 21, 2026",
                href: "https://x.com/i/article/2068794888406376448",
                image:
                  "https://pbs.twimg.com/media/HLXW2tgXAAAuj4P.jpg",
                description:
                  "The build notes behind bwen:14b: Qwen3-14B fine-tune, tweet clustering, roughly 300 hand prompts, LoRA training, and retrieval over original tweets.",
                links: [
                  {
                    label: "Model",
                    href: "https://huggingface.co/benthecarman/bwen-14b",
                  },
                  {
                    label: "Dataset",
                    href: "https://huggingface.co/datasets/benthecarman/bwen-dataset",
                  },
                  {
                    label: "Repo",
                    href: "https://github.com/benthecarman/bwen",
                  },
                ],
              }),
              right: {
                type: "article",
                eyebrow: "Service",
                title: "qwenstradamus",
                source: "Built on Bwen",
                date: "June 23, 2026",
                href: "https://qwenstradamus.com/",
                image: "https://qwenstradamus.com/og.png",
                description:
                  "Train an AI model on your own tweets that writes in your voice, then download it.",
                links: [
                  {
                    label: "Launch post",
                    href: "https://twitter.com/benthecarman/status/2069442971070566874?ref_src=twsrc%5Etfw",
                  },
                  {
                    label: "Service",
                    href: "https://qwenstradamus.com/",
                  },
                ],
              },
            },
            topStory: true,
          },
        ],
      },
      {
        id: "jun24-agent-infra",
        title: "Agent Infrastructure",
        purpose:
          "This section covers the plumbing for agent systems: runtimes, protocols, interfaces, orchestration layers, and the tooling that makes autonomous workflows usable.",
        items: [
          {
            title: "Hermes Agent gets a Stripe wallet",
            description:
              "Nous Research shipped Stripe skills for Hermes Agent, so agents can buy things, pay per-call APIs, and provision SaaS under configurable limits. The real trust boundary is spend approval and controlled limits, not giving an agent an unlimited card.",
            chip: "agent payments",
            href: "https://x.com/NousResearch/status/2066647737613832624",
            embed: {
              type: "tweet",
              href: "https://twitter.com/NousResearch/status/2066647737613832624?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://stripe.com/blog/stripe-projects-adds-new-agents-providers-developer-controls",
              "https://hermes-agent.nousresearch.com/docs/user-guide/skills/optional/payments/payments-stripe-link-cli",
            ],
          },
          {
            title: "vLLM turns weird open models into runnable systems",
            description:
              "vLLM is doing the unglamorous work that decides whether the open-model wave is usable: MiniMax M3 sparse-attention serving, native DiffusionGemma support, and Fusion routing for model panels. The takeaway is not more weights; it is turning weird architectures into deployable systems.",
            chip: "serving infra",
            href: "https://vllm-project.github.io/2026/06/12/minimax-m3-vllm.html",
            linkPair: [
              "https://vllm-project.github.io/2026/06/10/diffusion-gemma.html",
              "https://vllm-project.github.io/2026/06/16/vllm-sr-fusion-api.html",
              "https://blogs.nvidia.com/blog/rtx-ai-garage-local-gemma-diffusion/",
            ],
          },
        ],
      },
      {
        id: "jun24-models-research",
        title: "Models & Research",
        purpose:
          "This section covers model releases, benchmark shifts, papers, architecture updates, and capability comparisons.",
        items: [
          {
            title: "Closed model releases are a quiet week",
            description:
              "No net-new proprietary model release survived the duplicate pass. OpenAI's June 22 Daybreak expansion is new access/product packaging for GPT-5.5-Cyber, but the model itself was a May 13 topic; Fable/Mythos, Opus 4.8, Grok Imagine, and MAI were June 10.",
            chip: "closed models",
            href: "https://openai.com/index/daybreak-securing-the-world/",
            embeds: [
              {
                type: "tweet",
                href: "https://twitter.com/OpenAI/status/2069104283824640023?ref_src=twsrc%5Etfw",
              },
            ],
            linkPair: ["https://digg.com/ai/a95mmx07"],
            topStory: true,
          },
          {
            title: "Open models are eating the frontier gap",
            description:
              "The fresh post-June-10 open wave is GLM-5.2, Moonshot AI's Kimi K2.7 Code, MiniMax M3 weights, and Ai2's TMax: long-horizon coding, agent benchmarks, and terminal-agent RL all moved open. Nemotron/Cosmos, DiffusionGemma, and MiniMax's launch post were already June 10; June 24 adds the actual M3 HF weights.",
            chip: "open models",
            href: "https://z.ai/blog/glm-5.2",
            embeds: [
              {
                type: "tweet",
                href: "https://twitter.com/Zai_org/status/2066938937344495629?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/ArtificialAnlys/status/2069121548670406947?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/Kimi_Moonshot/status/2065377579130142937?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/MiniMax_AI/status/2065436935188058208?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/natolambert/status/2069055568124281315?ref_src=twsrc%5Etfw",
              },
            ],
            linkPair: [
              "https://huggingface.co/zai-org/GLM-5.2",
              "https://github.com/zai-org/GLM-5",
              "https://docs.z.ai/guides/llm/glm-5.2",
              "https://arxiv.org/abs/2602.15763",
              "https://arxiv.org/abs/2603.12201",
              "https://digg.com/ai/wmry8acg",
              "https://huggingface.co/moonshotai/Kimi-K2.7-Code",
              "https://digg.com/tech/lvlg9m33",
              "https://digg.com/tech/27r7m6uc",
              "https://huggingface.co/MiniMaxAI/MiniMax-M3",
              "https://x.com/huggingface/status/2065464345413239151",
              "https://huggingface.co/collections/allenai/tmax",
              "https://huggingface.co/allenai/tmax-27b",
              "https://huggingface.co/papers/2606.23321",
              "https://wai-org.com/blog/tmax/",
              "https://digg.com/ai/opo8qjez",
              "https://github.com/hamishivi/tmax",
            ],
          },
        ],
      },
      {
        id: "jun24-security",
        title: "Security",
        purpose:
          "This section covers attacks, abuse patterns, red-team findings, prompt injection, defensive work, and security-relevant failures.",
        items: [
          {
            title: "Who reported the Fable jailbreak?",
            description:
              'David Sacks called the source a "highly credible trusted partner" of both Anthropic and the USG. Reporting identifies Amazon as the key complainant, with Andy Jassy raising concerns to the White House and Amazon researchers reportedly demonstrating the bypass; at least five other companies also contacted senior officials.',
            chip: "security",
            href: "https://www.politico.com/news/2026/06/13/inside-the-whirlwind-24-hours-that-led-the-white-house-to-slap-export-controls-on-anthropic-00961519",
            embeds: [
              {
                type: "tweet",
                href: "https://twitter.com/DavidSacks/status/2065853007619588171?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/v_shakthi/status/2065985743340839080?ref_src=twsrc%5Etfw",
              },
            ],
            linkPair: [
              "https://www.anthropic.com/news/fable-mythos-access",
            ],
          },
        ],
      },
      {
        id: "jun24-big-tech",
        title: "Big Tech Moves",
        purpose:
          "This section covers major company moves, hardware launches, platform bets, product strategy, and policy or infrastructure changes that shape AI development.",
        items: [
          {
            title: "Cursor previews Origin, a GitHub competitor",
            description:
              'Cursor is no longer just an editor. A leaked "Origin" positioning shows the AI coding companies want to own the full dev stack — code host, collaboration, and agent runtime — not just the IDE.',
            chip: "platform",
            href: "https://x.com/morganlinton/status/2066927927997190564?s=46",
            embed: {
              type: "tweet",
              href: "https://twitter.com/morganlinton/status/2066927927997190564?ref_src=twsrc%5Etfw",
            },
          },
        ],
      },
    ],
  },
  {
    id: "meetup-2026-06-10",
    slug: "2026-06-10",
    date: "June 10, 2026",
    markdownHref: "./topics/2026-06-10.md",
    event: {
      title: "Austin AI Club",
      summary: "Quick AI news rundown, demos, and open discussion.",
      startAt: "2026-06-10T18:00:00-05:00",
      endAt: "2026-06-10T20:00:00-05:00",
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
      hostNote:
        "Platform week: Microsoft wants the enterprise agent stack, Washington wants early frontier-model access, Anthropic is pricing Claude like a public-market giant, and Google is renting SpaceX compute.",
    },
    showcases: [],
    tracks: [
      {
        id: "jun10-local-builds",
        title: "Local Builds & Projects",
        purpose:
          "This section covers member projects, prototypes, demos, and builds shared by the community.",
        items: [
          {
            title: "Ben's twitter export to dataset",
            description:
              "Ben Carman's tool for converting Twitter archive exports into structured datasets.",
            chip: "data tooling",
            href: "https://github.com/benthecarman/twitter-to-dataset",
          },
        ],
      },
      {
        id: "jun10-agent-infra",
        title: "Agent Infrastructure",
        purpose:
          "This section covers the plumbing for agent systems: runtimes, protocols, interfaces, orchestration layers, and the tooling that makes autonomous workflows usable.",
        items: [
          {
            title: "Microsoft wants the whole agent stack",
            description:
              "Build 2026 was not one launch: Microsoft IQ, Work IQ, Scout, Agent 365, the GitHub Copilot app, Windows 365 for Agents, and MAI models all point to the same pitch. Enterprise agents live inside Microsoft's identity, data, OS, and developer surfaces.",
            chip: "agent platform",
            href: "https://blogs.microsoft.com/blog/2026/06/02/microsoft-build-2026-be-yourself-at-work/",
            embeds: [
              {
                type: "tweet",
                href: "https://twitter.com/Microsoft/status/2061889381137523028?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/github/status/2061868358526709816?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/Microsoft365/status/2061857362130973083?ref_src=twsrc%5Etfw",
              },
            ],
            linkPair: [
              "https://github.blog/news-insights/product-news/github-copilot-app-the-agent-native-desktop-experience/",
              "https://github.blog/changelog/2026-06-02-expanded-technical-preview-availability-for-the-github-copilot-app/",
              "https://blogs.windows.com/windowsdeveloper/2026/06/02/build-2026-furthering-windows-as-the-trusted-platform-for-development/",
            ],
          },
          {
            title: "Claude gets its cloud-bill moment",
            description:
              'Axios says an unnamed client allegedly spent $500M in a month after failing to cap employee Claude licenses, while The Verge says Microsoft is winding down most Claude Code licenses partly for financial reasons. The takeaway is not "guess the company"; it is that agentic AI needs budgets, routing, per-user limits, and token observability before the bill becomes the incident.',
            chip: "cost controls",
            href: "https://www.axios.com/2026/05/28/ai-spending-roi-enterprise-costs",
            embeds: [
              {
                type: "tweet",
                href: "https://twitter.com/Polymarket/status/2060034216906068131?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/_alialkhatib/status/2060056690221838552?ref_src=twsrc%5Etfw",
              },
            ],
            linkPair: [
              "https://www.theverge.com/tech/930447/microsoft-claude-code-discontinued-notepad",
              "https://boingboing.net/2026/05/29/a-company-accidentally-spent-500-million-on-claude-in-one-month.html",
            ],
          },
          {
            title: "AI Twitter advice has a six-month half-life",
            description:
              "The useful part of the Karpathy-filter thread is not the dunk list; it is what keeps compounding: context engineering, tool design, evals, orchestrator/subagent boundaries, and harness > model. Good palate cleanser before a board full of fast-expiring model drops.",
            chip: "agent craft",
            href: "https://x.com/0xMortyx/status/2061491256107159736",
            embed: {
              type: "tweet",
              href: "https://twitter.com/0xMortyx/status/2061491256107159736?ref_src=twsrc%5Etfw",
            },
          },
          {
            title: "Stop prompting agents, start designing loops",
            description:
              'Peter Steinberger\'s 8M-view post and Boris Cherny\'s self-verification loops both landed the same week with the same message: manual prompting is dead, orchestrated loops are the new baseline. The shift from "ask Claude to code" to "build systems that supervise Claude coding" is no longer early-adopter territory.',
            chip: "orchestration",
            href: "https://x.com/steipete/status/2063697162748260627",
            embeds: [
              {
                type: "tweet",
                href: "https://twitter.com/steipete/status/2063697162748260627?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet", 
                href: "https://twitter.com/bcherny/status/2064426115255730578?ref_src=twsrc%5Etfw",
              },
            ],
            linkPair: [
              "https://digg.com/ai/7ifyvmb9",
            ],
          },
          {
            title: "Local AI becomes bandwidth math",
            description:
              'The question for local AI deployment is no longer just "can it run?" but whether the memory path can keep up with model demands. Fresh bandwidth comparisons show the hardware reality behind local inference planning.',
            chip: "local infra",
            href: "https://x.com/The_Only_Signal/status/2060321842716365147",
            embed: {
              type: "tweet",
              href: "https://twitter.com/The_Only_Signal/status/2060321842716365147?ref_src=twsrc%5Etfw",
            },
          },
          {
            title: "Vector compression hits 10x without the quality tax",
            description:
              "Shard KV cache compression, TurboVec, and TurboQuant all crossed the same threshold this year: aggressive compression that actually works in production. Shard gets 10-11x memory reduction on Llama with zero NIAH degradation, though Tim Dettmers called out the TurboQuant comparison as non-reproducible. Tom Turney shipped TurboQuant+ in llama.cpp within 36 hours of the Google paper, and Ryan Codrai's TurboVec fits 31GB of embeddings into 4GB on a MacBook. The real story is compression moving from research to practical local deployment.",
            chip: "compression",
            href: "https://github.com/krish1905/shard",
            embeds: [
              {
                type: "tweet",
                href: "https://twitter.com/krishgarg/status/2059041521576648980?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/Tim_Dettmers/status/2059345041240244611?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/GoogleResearch/status/2036533564158910740?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/no_stp_on_snek/status/2036944965364834444?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/VaibhavSisinty/status/2063357634267509010?ref_src=twsrc%5Etfw",
              },
            ],
            linkPair: [
              "https://krishgarg.com/shard",
              "https://research.google/blog/turboquant-redefining-ai-efficiency-with-extreme-compression/",
              "https://github.com/RyanCodrai/turbovec",
              "https://digg.com/ai/jo5iwt70",
            ],
          },
        ],
      },
      {
        id: "jun10-models-research",
        title: "Models & Research",
        purpose:
          "This section covers model releases, benchmark shifts, papers, architecture updates, and capability comparisons.",
        items: [
          {
            title: "Closed labs start the June model wave",
            description:
              "Anthropic moved the top of the proprietary stack again: Claude Fable 5 is the public Mythos-class release, Mythos 5 is trusted-access, and risky cyber/bio/distillation requests can fall back to Opus 4.8. Put that next to Grok Imagine 1.5 Preview and Microsoft's seven-model MAI push: frontier labs are shipping capability and safety gating as one product surface.",
            chip: "proprietary models",
            href: "https://www.anthropic.com/news/claude-fable-5-mythos-5",
            embeds: [
              {
                type: "tweet",
                href: "https://twitter.com/claudeai/status/2064394146916229443?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/claudeai/status/2060042702150930686?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/grok/status/2062225080843747351?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/mustafasuleyman/status/2061880164498428188?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/MicrosoftAI/status/2061887504916087224?ref_src=twsrc%5Etfw",
              },
            ],
            linkPair: [
              "https://www.anthropic.com/news/claude-opus-4-8",
              "https://x.ai/news",
              "https://microsoft.ai/news/building-a-hillclimbing-machine-launching-seven-new-mai-models/",
              "https://microsoft.ai/news/introducing-mai-thinking-1/",
            ],
          },
          {
            title: "Open-weight release week turns into a firehose",
            description:
              "The open slide is now a stack, not a list: Nemotron/Cosmos/OmniDreams for physical AI, Gemma/Liquid/Step/OpenBMB/Tencent/Cohere for local LLMs and coding agents, DiffusionGemma for text diffusion, PaddleOCR/LocateAnything for vision, MOSS/Higgs/dots for audio, Ideogram/Magenta/NAVA/Lance/Bernini/JoyAI for media, WALL-OSS for robotics, and Unsloth/Comfy/NVFP4 quants for deployment.",
            chip: "open models",
            href: "https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Ultra-550B-A55B-BF16",
            embeds: [
              {
                type: "tweet",
                href: "https://twitter.com/NVIDIAAI/status/2062521325076299981?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/MiniMax_AI/status/2061266317815296322?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/googlegemma/status/2062202706882883696?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/NVIDIAAI/status/2061308434629132553?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/ideogram_ai/status/2062202228770045991?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/GoogleMagenta/status/2062589313372594538?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/jetbrains/status/2061444430884675791?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/NVIDIAAI/status/2062896815784219076?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/hcompany_ai/status/2061815365168923083?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/ModelScope2022/status/2061008636634394819?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/ModelScope2022/status/2063881896153543022?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/JinWeiyang18434/status/2062034336929677578?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/HuggingModels/status/2062025488147849246?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/boson_ai/status/2062629221411995896?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/AdinaYakup/status/2062923324896727048?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/liquidai/status/2060023455290974474?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/PaddlePaddle/status/2059990434827661769?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/OpenBMB/status/2061810723169415205?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/OpenBMB/status/2058903449379717319?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/ArtificialAnlys/status/2062381047212638697?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/TencentHunyuan/status/2057384034544804136?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/TencentHunyuan/status/2059104921778352626?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/ModelScope2022/status/2059243470469185617?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/ClementDelangue/status/2061968482640523365?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/ModelScope2022/status/2059244401189163391?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/pmarca/status/2063179832008356119?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/XiaomiMiMo/status/2063993799085633911?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/UnslothAI/status/2062207258810053084?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/UnslothAI/status/2062470072179044447?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/HuggingPapers/status/2060470519775043879?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/UnslothAI/status/2056369392666194108?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/NVIDIAAI/status/2056887241432014959?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/AdinaYakup/status/2063901313578963072?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/cohere/status/2064378058329526556?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/googleaidevs/status/2064743223491449013?ref_src=twsrc%5Etfw",
              },
            ],
            linkPair: [
              "https://vllm.ai/blog/2026-06-04-nemotron-3-ultra-vllm",
              "https://huggingface.co/google/gemma-4-12B",
              "https://nvidianews.nvidia.com/news/nvidia-launches-cosmos-3-the-open-frontier-foundation-model-for-physical-ai",
              "https://ideogram.ai/news/ideogram-4.0/",
              "https://huggingface.co/google/magenta-realtime-2",
              "https://huggingface.co/blog/JetBrains/mellum2-launch",
              "https://huggingface.co/nvidia/omni-dreams-models",
              "https://hcompany.ai/holo3",
              "https://huggingface.co/Kwai-Keye/Keye-VL-2.0-30B-A3B",
              "https://huggingface.co/nex-agi/Nex-N2-Pro",
              "https://huggingface.co/jdopensource/JoyAI-Echo",
              "https://huggingface.co/ByteDance/Bernini-R",
              "https://huggingface.co/bosonai/higgs-audio-v3-tts-4b",
              "https://github.com/rednote-hilab/dots.tts",
              "https://huggingface.co/LiquidAI/LFM2.5-8B-A1B",
              "https://huggingface.co/PaddlePaddle/PaddleOCR-VL-1.6",
              "https://huggingface.co/openbmb/MiniCPM-V-4.6",
              "https://huggingface.co/openbmb/MiniCPM5-1B",
              "https://huggingface.co/stepfun-ai/Step-3.7-Flash",
              "https://huggingface.co/tencent/Hy-MT2-1.8B",
              "https://huggingface.co/tencent/Hy-MT2-7B",
              "https://huggingface.co/tencent/Hy-MT2-30B-A3B",
              "https://huggingface.co/OpenMOSS-Team/MOSS-TTS-v1.5",
              "https://github.com/OpenMOSS/MOSS-TTS",
              "https://huggingface.co/OpenMOSS-Team/MOSS-SoundEffect-v2.0",
              "https://huggingface.co/baidu/NAVA",
              "https://huggingface.co/bytedance-research/Lance",
              "https://huggingface.co/XiaomiMiMo/MiMo-V2.5-Pro-FP4-DFlash",
              "https://huggingface.co/unsloth/gemma-4-12b-it-GGUF",
              "https://huggingface.co/unsloth/gemma-4-26B-A4B-it-GGUF",
              "https://huggingface.co/unsloth/gemma-4-31B-it-GGUF",
              "https://huggingface.co/RedHatAI/gemma-4-31B-it-FP8-block",
              "https://huggingface.co/RedHatAI/gemma-4-12B-it-NVFP4",
              "https://huggingface.co/nvidia/Qwen3.6-35B-A3B-NVFP4",
              "https://huggingface.co/unsloth/Qwen3.6-27B-MTP-GGUF",
              "https://huggingface.co/Kijai/WanVideo_comfy",
              "https://huggingface.co/Kijai/LTX2.3_comfy",
              "https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI",
              "https://huggingface.co/Comfy-Org/PixelDiT",
              "https://huggingface.co/Comfy-Org/Ideogram-4",
              "https://huggingface.co/amazon/chronos-2",
              "https://huggingface.co/CohereLabs/cohere-transcribe-03-2026",
              "https://huggingface.co/blog/CohereLabs/introducing-north-mini-code",
              "https://huggingface.co/CohereLabs/North-Mini-Code-1.0",
              "https://huggingface.co/CohereLabs/North-Mini-Code-1.0-fp8",
              "https://huggingface.co/nvidia/LocateAnything-3B",
              "https://huggingface.co/nvidia/nemotron-3.5-asr-streaming-0.6b",
              "https://huggingface.co/nvidia/Nemotron-Labs-Diffusion-3B-Base",
              "https://huggingface.co/nvidia/Nemotron-Labs-Diffusion-VLM-8B",
              "https://huggingface.co/x-square-robot/wall-oss-flow",
              "https://huggingface.co/x-square-robot/wall-oss-0.5",
              "https://github.com/X-Square-Robot/wall-x",
              "https://huggingface.co/mindlab-research/Macaron-V1-Preview-749B",
            ],
          },
          {
            title: "Fable's refusals go too far",
            description:
              "Anthropic shipped Claude Fable 5 with new cyber/bio safety classifiers that fallback to Opus 4.8 on refused requests. The result: 38/40 biology questions refused in one private eval, a third of BullshitBench questions blocked, and viral X posts about 'basic questions' getting rejected. The official line is these measures let Mythos-level capability ship sooner; the user reality is a model that refuses harmless queries loses more trust than one that occasionally gets a risky answer wrong.",
            chip: "model behavior",
            href: "https://x.com/ClaudeDevs/status/2064428347678220691",
            embeds: [
              {
                type: "tweet",
                href: "https://twitter.com/ClaudeDevs/status/2064428347678220691?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/djcows/status/2064513368002842732?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/DerekCroote/status/2064472087167930372?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/petergostev/status/2064435631594291304?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/petergostev/status/2064634015382978941?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/antirez/status/2064766429887352971?ref_src=twsrc%5Etfw",
              },
            ],
            linkPair: [
              "https://x.com/TimothyKassis/status/2064438011417481570",
              "https://x.com/LechMazur/status/2064511888793161887",
              "https://x.com/mykola/status/2064400637857591666",
            ],
          },
          {
            title: "World models need a taxonomy, not another demo",
            description:
              "Fei-Fei Li splits the overloaded world models label into renderers, simulators, and planners. That is the cleanest way to compare video generators, physics simulators, robotics policies, and agent planning without pretending they are the same capability.",
            chip: "world models",
            href: "https://drfeifei.substack.com/p/a-functional-taxonomy-of-world-models",
            embed: {
              type: "tweet",
              href: "https://twitter.com/a16z/status/2062266181890031815?ref_src=twsrc%5Etfw",
            },
          },
        ],
      },
      {
        id: "jun10-security",
        title: "Security",
        purpose:
          "This section covers attacks, abuse patterns, red-team findings, prompt injection, defensive work, and security-relevant failures.",
        items: [
          {
            title: "Frontier model review gets a federal lane",
            description:
              "Trump's June 2 AI order creates a classified cyber benchmark and a voluntary 30-day pre-release access path for covered frontier models, while explicitly avoiding mandatory licensing. The trust boundary is now government early access, not just lab evals.",
            chip: "governance",
            href: "https://www.whitehouse.gov/presidential-actions/2026/06/promoting-advanced-artificial-intelligence-innovation-and-security/",
            linkPair: [
              "https://www.whitehouse.gov/fact-sheets/2026/06/fact-sheet-president-donald-j-trump-promotes-advanced-artificial-intelligence-innovation-and-security/",
              "https://apnews.com/article/e41af74f7b0865482f07d10fe7a50fe3",
              "https://techcrunch.com/2026/06/02/trump-signs-narrower-executive-order-on-ai-oversight-after-industry-objections/",
            ],
          },
        ],
      },
      {
        id: "jun10-big-tech",
        title: "Big Tech Moves",
        purpose:
          "This section covers major company moves, hardware launches, platform bets, product strategy, and policy or infrastructure changes that shape AI development.",
        items: [
          {
            title: "Apple finally shows Siri AI",
            description:
              "WWDC26 gave the first real look at Apple's delayed assistant reset: screen awareness, personal context search, app actions, web grounding, and a dedicated Siri app. The question is whether privacy-first OS agents can catch up to chat-native AI before users stop asking Siri for anything serious.",
            chip: "consumer agents",
            href: "https://www.apple.com/newsroom/2026/06/apple-unveils-next-generation-of-apple-intelligence-siri-ai-and-more/",
            embed: {
              type: "tweet",
              href: "https://twitter.com/tftc21/status/2064042445021868257?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://techcrunch.com/2026/06/08/apples-long-awaited-ai-siri-overhaul-is-finally-here/",
              "https://www.axios.com/2026/06/08/apple-intelligence-ai-siri-golden-gate",
            ],
          },
          {
            title: "Apple stretches PCC onto Google/NVIDIA",
            description:
              "The sharper Siri infra story is that Apple now says AFM Cloud Pro extends Private Cloud Compute to NVIDIA GPUs in Google's cloud. If the privacy guarantees hold, PCC just changed from an Apple-Silicon-only cloud story into a verifiable confidential-inference architecture that can rent frontier GPU scale.",
            chip: "private compute",
            href: "https://9to5mac.com/2026/06/08/craig-federighi-details-apples-collaboration-with-google-for-siri-ai-in-ios-27/",
            embeds: [
              {
                type: "tweet",
                href: "https://twitter.com/anthonyronning/status/2064091573571477857?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/BenBajarin/status/2064065407615717659?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/NewsFromGoogle/status/2010760810751017017?ref_src=twsrc%5Etfw",
              },
            ],
            linkPair: [
              "https://blog.google/company-news/inside-google/company-announcements/joint-statement-google-apple/",
              "https://security.apple.com/blog/private-cloud-compute/",
              "https://www.apple.com/newsroom/2026/06/apple-unveils-next-generation-of-apple-intelligence-siri-ai-and-more/",
              "https://appleinsider.com/articles/26/01/12/google-confirms-that-it-wont-get-apple-user-data-in-new-siri-deal",
            ],
          },
          {
            title: "OpenAI says AI research automation is the race",
            description:
              "OpenAI's new plan memo frames phase three around an automated AI researcher, personal AGI for everyone, and governance that can coordinate or slow frontier work when needed. The loud sentence is that AI doing AI research will determine the pace of progress within the next few years.",
            chip: "strategy",
            href: "https://openai.com/index/built-to-benefit-everyone-our-plan/",
            embed: {
              type: "tweet",
              href: "https://twitter.com/sama/status/2064088940932641225?ref_src=twsrc%5Etfw",
            },
          },
          {
            title: "Anthropic enters IPO mode at $965B",
            description:
              "A $65B Series H, $47B run-rate, and confidential S-1 in the same week as Opus 4.8 makes the bet explicit: Claude's enterprise agent revenue is being priced like a near-trillion public-market company.",
            chip: "ipo",
            href: "https://www.anthropic.com/news/series-h",
            linkPair: [
              "https://www.anthropic.com/news/confidential-draft-s1-sec",
              "https://www.axios.com/2026/06/01/anthropic-ipo-openai",
              "https://techcrunch.com/2026/05/28/anthropic-raises-65-billion-nears-1t-valuation-ahead-of-ipo/",
            ],
          },
          {
            title: "Google rents SpaceX's GPU bridge",
            description:
              "The SEC filing says Google will pay SpaceX $920M/month for roughly 110K NVIDIA GPUs from October 2026 through June 2029. Google needing bridge capacity from Musk's compute pile says the agent-platform demand curve is outrunning even hyperscalers.",
            chip: "compute",
            href: "https://www.sec.gov/Archives/edgar/data/1181412/000162828026041150/spacexagreementfwp.htm",
            linkPair: [
              "https://techcrunch.com/2026/06/05/google-will-pay-spacex-920m-per-month-for-compute/",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "meetup-2026-05-27",
    slug: "2026-05-27",
    date: "May 27, 2026",
    markdownHref: "./topics/2026-05-27.md",
    event: {
      title: "Austin AI Club",
      summary: "Quick AI news rundown, demos, and open discussion.",
      startAt: "2026-05-27T18:00:00-05:00",
      endAt: "2026-05-27T20:00:00-05:00",
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
      hostNote:
        "Inflection week: first AI lab turns profitable, humanoids prove industrial readiness, and recursive AI research begins with Karpathy joining Anthropic.",
    },
    showcases: [
      {
        title: "Ostrich LLMs",
        description:
          "Qwen 3.6-based 27B model fine-tuned for healthcare autonomy outside traditional medical systems.",
        chip: "showcase",
        href: "https://huggingface.co/etemiz/Ostrich-27B-Qwen3.6-260526",
      },
      {
        title: "Community Slot",
        description:
          "Bring a project, prototype, repo, demo, or weird link worth showing the room.",
        chip: "showcase",
        href: "https://github.com/AustinKelsay/austin-ai-meetup-list",
      },
    ],
    tracks: [
      {
        id: "may27-agent-infra",
        title: "Agent Infrastructure",
        purpose:
          "This section covers the plumbing for agent systems: runtimes, protocols, interfaces, orchestration layers, and the tooling that makes autonomous workflows usable.",
        items: [
          {
            title: "Composer 2.5 = Opus at one tenth the cost??",
            description:
              "Cursor's new in-house coding model matches Claude Opus 4.7 performance at 10x cheaper pricing. Built on Kimi K2.5 with 85% of compute spent on their own RL pipeline, it's the first clear signal that frontier-competitive coding can run without frontier bills.",
            chip: "coding agents",
            href: "https://cursor.com/blog/composer-2-5",
            embed: {
              type: "tweet",
              href: "https://twitter.com/cursor_ai/status/2056415413077233983?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://handyai.substack.com/p/model-drop-composer-25",
              "https://turion.ai/blog/cursor-composer-2-5-coding-agents-may-2026/",
            ],
            topStory: true,
          },
          {
            title: "Figure AI's 200-hour humanoid marathon",
            description:
              "Figure 03 robots sorted 249,560 packages over 200 continuous hours with zero hardware failures. This isn't a demo anymore - it's proof that humanoid robots can run actual industrial operations. The 'dark factory' era just got real.",
            chip: "robotics",
            href: "https://interestingengineering.com/ai-robotics/figure-03-humanoid-robot-200-hour-shift",
            embed: {
              type: "tweet",
              href: "https://twitter.com/adcock_brett/status/2057699179938693430?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://en.sedaily.com/finance/2026/05/26/figure-ais-humanoid-robot-works-200-hours-nonstop-sorting",
            ],
          },
        ],
      },
      {
        id: "may27-models",
        title: "Models & Research",
        purpose:
          "This section covers model releases, benchmark shifts, papers, architecture updates, and capability comparisons.",
        items: [
          {
            title: "Multi-token prediction goes mainstream",
            description:
              "Gemma 4 ships with native MTP drafters for 3x inference speedup, llama.cpp mainline adds `--spec-type draft-mtp`, and Qwen 3.6 runs locally on 12GB with 98% acceptance rates. Unsloth ships automatic MTP support with 2x faster GGUF inference. The memory bandwidth bottleneck finally has production-ready solutions.",
            chip: "optimization",
            href: "https://www.infoq.com/news/2026/05/gemma4-multi-token-prediction/",
            embeds: [
              {
                type: "tweet",
                href: "https://twitter.com/ggerganov/status/2056391115469689330?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/UnslothAI/status/2056369392666194108?ref_src=twsrc%5Etfw",
              },
            ],
            linkPair: [
              "https://carteakey.dev/blog/running-qwen3-6-mtp-locally/",
              "https://github.com/unslothai/unsloth/releases/tag/v0.1.405-beta",
            ],
          },
          {
            title: "DFlash beats autoregressive drafting ceiling",
            description:
              "Block diffusion model predicts 8-16 tokens in parallel with single forward pass, delivering 3x speedups versus traditional speculative decoding's 2x limit. Baseten's implementation shows it's not just research anymore.",
            chip: "optimization",
            href: "https://www.baseten.co/blog/dflash-faster-llm-inference/",
            embed: {
              type: "tweet",
              href: "https://twitter.com/zhijianliu_/status/2051900751673467097?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://dasroot.net/posts/2026/04/speculative-decoding-dflash-lorbus-mtp-speed/",
            ],
          },
          {
            title: "DeepSWE exposes the real coding model hierarchy",
            description:
              "New benchmark reveals GPT-5.5 leads at 70% while other models cluster much lower, shattering the illusion that frontier coding agents are roughly equivalent. Unlike SWE-bench Pro's narrow 30-point spread, DeepSWE shows a 70-point performance gap on realistic engineering tasks.",
            chip: "benchmarks",
            href: "https://deepswe.datacurve.ai/",
            embed: {
              type: "tweet",
              href: "https://twitter.com/theo/status/2059352130289651925?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://venturebeat.com/technology/deepswe-blows-up-the-ai-coding-leaderboard-crowns-gpt-5-5-and-finds-claude-opus-exploiting-a-benchmark-loophole",
            ],
          },
          {
            title: "PrismML ships 1-bit image gen that runs on iPhone",
            description:
              "Bonsai Image 4B compresses the FLUX.2 Klein 4B diffusion transformer from 7.75 GB to 0.93 GB (1-bit) and 1.21 GB (ternary), an 8.3x and 6.4x reduction while retaining 88-95% quality. First 4B-class diffusion model to run directly on iPhone hardware — 512x512 in 9.4s on iPhone 17 Pro Max. Apache 2.0.",
            chip: "models",
            href: "https://prismml.com/news/bonsai-image-4b",
            embed: {
              type: "tweet",
              href: "https://twitter.com/PrismML/status/2059339159899390326?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://huggingface.co/spaces/webml-community/bonsai-image-webgpu",
            ],
          },
          {
            title: "Epicure squeezes global cooking into 2MB",
            description:
              "KAIKAKU.AI maps 4.1M multilingual recipes into a 2MB embedding model—1,790 ingredients, 300 dimensions, walkable flavor geometry from recipe and chemistry graphs.",
            chip: "embeddings",
            href: "https://arxiv.org/abs/2605.22391",
            embed: {
              type: "tweet",
              href: "https://twitter.com/josefchen/status/2059350978109874677?ref_src=twsrc%5Etfw",
            },
          },
        ],
      },
      {
        id: "may27-security",
        title: "Security",
        purpose:
          "This section covers attacks, abuse patterns, red-team findings, prompt injection, defensive work, and security-relevant failures.",
        items: [
          {
            title: "TrapDoor supply chain attack hijacks AI coding assistants",
            description:
              "Malware campaign hit 34 packages across npm/PyPI/Crates.io using invisible Unicode in `.cursorrules` and `CLAUDE.md` files to trick AI assistants into exfiltrating secrets. When you ask Claude to debug code, it runs the attacker's 'security scan' instead.",
            chip: "supply chain",
            href: "https://agentriot.com/news/ai-security/ai-agent-security-may-2026",
            embed: {
              type: "tweet",
              href: "https://twitter.com/SocketSecurity/status/2058601291123716426?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://byteiota.com/trapdoor-supply-chain-attack-npm-pypi-crates/",
            ],
            topStory: true,
          },
        ],
      },
      {
        id: "may27-big-tech",
        title: "Big Tech Moves",
        purpose:
          "This section covers major company moves, hardware launches, platform bets, product strategy, and policy or infrastructure changes that shape AI development.",
        items: [
          {
            title: "Digg returns as AI signal detector",
            description:
              "Kevin Rose pivots the legendary aggregator into real-time AI news ranking by tracking 1,000 influential voices on X.",
            chip: "platform",
            href: "https://digg.com",
            images: [
              { src: "/images/digg-1.png", href: "https://digg.com", alt: "Digg screenshot 1" },
              { src: "/images/digg-2.png", href: "https://digg.com", alt: "Digg screenshot 2" },
            ],
            linkPair: [
              "https://techcrunch.com/2026/05/11/digg-tries-again-this-time-as-an-ai-news-aggregator/",
              "https://www.engadget.com/2170484/digg-ai-news-aggregator/",
            ],
          },
          {
            title: "SpaceX options Cursor for $60B",
            description:
              "The partnership gives Cursor access to Colossus supercomputing clusters while SpaceX gets the right to acquire the AI coding startup by year-end. Either a $60B purchase or $10B termination fee - the scale shows how serious the coding agent infrastructure race has become.",
            chip: "acquisition",
            href: "https://siliconangle.com/2026/04/22/spacex-partners-cursor-ai-training-floats-potential-60b-acquisition/",
            embed: {
              type: "tweet",
              href: "https://twitter.com/cursor_ai/status/2046726224266043533?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://cursor.com/blog/spacex-model-training",
              "https://www.linkedin.com/pulse/claude-codes-quiet-victory-lap-how-spacex-cursor-tie-up-john-cloud-jfbec",
            ],
            topStory: true,
          },
          {
            title: "Anthropic cuts the programmatic subsidy",
            description:
              "Claude Agent SDK, `claude -p`, GitHub Actions, and third-party tools move off subscription limits onto separate $20-200 monthly credits at full API rates. The '25x cut' framing from Theo and others highlights how subsidized programmatic usage was getting expensive.",
            chip: "pricing",
            href: "https://gist.github.com/MagnaCapax/d9177e35b355853f03c730dfcaa693ef",
            embed: {
              type: "tweet",
              href: "https://twitter.com/theo/status/2055793010370306556?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://www.digitalapplied.com/blog/anthropic-claude-credit-overhaul-june-15-2026",
            ],
          },
          {
            title: "Grok API gets X Premium OAuth integration",
            description:
              "OpenClaw now supports OAuth for X Premium ($8/month) and SuperGrok ($30/month) subscribers, removing API key friction for agent workflows. Direct xAI API billing remains available for programmatic use, but the subscription bridge finally bridges consumer and developer access.",
            chip: "integration",
            href: "https://memeburn.com/how-to-use-grok-in-openclaw-oauth-api-key-guide-2026/",
            embed: {
              type: "tweet",
              href: "https://twitter.com/xai/status/2055745332919808181?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://www.apideck.com/blog/how-to-get-your-grok-xai-api-key",
              "https://unified.to/blog/how_to_get_a_grok_xai_and_groq_api_key_and_connect_it_to_your_product",
            ],
          },
          {
            title: "Anthropic hits first profit at $10.9B quarterly revenue",
            description:
              "First AI lab to turn a real profit with $559M operating income, driven by Claude Code enterprise adoption. Revenue doubled quarter-over-quarter, outpacing Google and Facebook's pre-IPO growth. The 'AI replaces measurable labor costs' business model finally works at scale.",
            chip: "financials",
            href: "https://techcrunch.com/2026/05/20/anthropic-says-its-about-to-have-its-first-profitable-quarter/",
            linkPair: [
              "https://www.thehindubusinessline.com/info-tech/anthropic-eyes-559-million-profit-in-june-quarter-amid-explosive-ai-demand/article71004656.ece",
            ],
          },
          {
            title: "Karpathy joins Anthropic for recursive AI research",
            description:
              "OpenAI co-founder and beloved AI educator joins Anthropic's pre-training team to build Claude-assisted research tools. This is about AI training its own successors - the recursive self-improvement story that changes model development timelines.",
            chip: "talent",
            href: "https://techcrunch.com/2026/05/19/openai-co-founder-andrej-karpathy-joins-anthropics-pre-training-team/",
            embed: {
              type: "tweet",
              href: "https://twitter.com/karpathy/status/2056753169888334312?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://www.thestreet.com/technology/anthropic-hires-karpathy-in-one-of-biggest-deals-in-ai",
            ],
            topStory: true,
          },
        ],
      },
    ],
  },
  {
    id: "meetup-2026-05-13",
    slug: "2026-05-13",
    date: "May 13, 2026",
    markdownHref: "./topics/2026-05-13.md",
    event: {
      title: "Austin AI Club",
      summary: "Quick AI news rundown, demos, and open discussion.",
      startAt: "2026-05-13T18:00:00-05:00",
      endAt: "2026-05-13T20:00:00-05:00",
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
      hostNote:
        "Security spine this week: AI SaaS as supply chain, privacy tools getting inverted, and compute as product strategy.",
    },
    showcases: [
      {
        title: "Community Slot",
        description:
          "Bring a project, prototype, repo, demo, or weird link worth showing the room.",
        chip: "showcase",
        href: "https://github.com/AustinKelsay/austin-ai-meetup-list",
      },
    ],
    tracks: [
      {
        id: "may13-agent-infra",
        title: "Agent Infrastructure",
        purpose:
          "This section covers the plumbing for agent systems: runtimes, protocols, interfaces, orchestration layers, and the tooling that makes autonomous workflows usable.",
        items: [
          {
            title: "Claude as bitcoin wallet forensics",
            description:
              "A lost-wallet story became a weirdly good agent demo: dump the old computer context in, have Claude trace files, debug btcrecover, and turn digital archaeology into recovered keys.",
            chip: "forensics",
            href: "https://x.com/cprkrn/status/2054586810475364536",
            embed: {
              type: "tweet",
              href: "https://twitter.com/cprkrn/status/2054586810475364536?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://news.bitcoin.com/bitcoiner-dumps-old-computer-files-into-claude-ai-recovers-5-btc-lost-since-2015/",
              "https://beincrypto.com/bitcoin-wallet-claude-ai-recovery/",
            ],
          },
          {
            title: "Matt Pocock, prompts better than me.",
            description:
              "The viral bit is not the repo itself; it is that engineering taste, review loops, TDD, issue triage, and planning rituals are becoming portable agent behavior.",
            chip: "agent skills",
            href: "https://github.com/mattpocock/skills",
            linkPair: [
              "https://agentconn.com/agents/mattpocock-skills/",
              "https://llmbase.ai/skills/mattpocock/",
            ],
            topStory: true,
          },
          {
            title: "Sandcastle",
            description:
              "TypeScript runner for sending coding agents into isolated worktrees and collecting the results.",
            chip: "agent infra",
            href: "https://github.com/mattpocock/sandcastle",
            image: {
              src: "/images/sandcastle-workflow.png",
              href: "https://github.com/mattpocock/sandcastle",
              caption: "Sandcastle workflow: prompt files fan out into isolated worktrees and containers.",
            },
            linkPair: ["https://www.sourcepulse.org/projects/27307520"],
          },
          {
            title: "Amnesic personal OS",
            description:
              "Fully local, private OS concept that boots from a USB stick and leaves no trace on the host machine.",
            chip: "local",
            href: "https://x.com/nichxbt/status/2046647915343741391",
            embed: {
              type: "tweet",
              href: "https://twitter.com/nichxbt/status/2046647915343741391?ref_src=twsrc%5Etfw",
            },
          },
          {
            title: "Agents as fields",
            description:
              "Attio-style AI attributes put agents inside the workflow instead of beside it.",
            chip: "agent UX",
            href: "https://x.com/rrhoover/status/2048366028850163752",
            embed: {
              type: "tweet",
              href: "https://twitter.com/rrhoover/status/2048366028850163752?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://dribbble.com/shots/25870869-Attio-AI-Attributes",
            ],
          },
          {
            title: "YC wants a company brain",
            description:
              "YC's Company Brain RFS is the same agent-memory story at company scale: turn Slack, tickets, docs, and database know-how into a living map that agents can actually operate against.",
            chip: "company brain",
            href: "https://x.com/ycombinator/status/2048834293779378437",
            embed: {
              type: "tweet",
              href: "https://twitter.com/ycombinator/status/2048834293779378437?ref_src=twsrc%5Etfw",
            },
            image: {
              src: "/images/company-brain-yc.jpg",
              href: "https://x.com/ycombinator/status/2048834293779378437",
              caption: "YC's Company Brain post thumbnail.",
            },
            topStory: true,
          },
          {
            title: "Isaac Sim for beginners",
            description:
              "NVIDIA's robotics simulator pitch: prototype the chassis, wheels, sensors, and environment before touching hardware.",
            chip: "robotics",
            href: "https://developer.nvidia.com/isaac/sim",
            embed: {
              type: "tweet",
              href: "https://twitter.com/_vmlops/status/2048594851374243967?ref_src=twsrc%5Etfw",
            },
          },
          {
            title: "Claude Managed Agents learn between runs",
            description:
              "Anthropic is moving agent memory, outcomes, orchestration, and webhooks into the managed platform layer. Dreaming is still preview, but durable agents are becoming hosted product surface, not just your own loop around an API.",
            chip: "agent memory",
            href: "https://claude.com/blog/new-in-claude-managed-agents",
            linkPair: [
              "https://claude.com/code-with-claude/session/sf-memory-and-dreaming-for-self-learning-agents",
              "https://www.anthropic.com/news/higher-limits-spacex",
            ],
          },
          {
            title: "The agent harness belongs outside the sandbox",
            description:
              "Mendral's backend-harness argument is a clean agent infrastructure split: keep credentials, memory, and durable execution outside the disposable workspace, then reach into the sandbox over RPC.",
            chip: "agent infra",
            href: "https://www.mendral.com/blog/agent-harness-belongs-outside-sandbox",
            topStory: true,
          },
          {
            title: "Dumb AI loops die in production",
            description:
              "Rohit's agent-systems writeup is the sober version of the loop hype: building, memory, harness, and orchestration all become product risk once state, auth, and unattended actions enter the chat.",
            chip: "agent risk",
            href: "https://x.com/i/article/2050613084558094336",
            embed: {
              type: "tweet",
              href: "https://twitter.com/rohit4verse/status/2050968031493550202?ref_src=twsrc%5Etfw",
            },
            video: {
              href: "https://www.youtube.com/watch?v=2TLXsxkz0zI",
              embedHref: "https://www.youtube.com/embed/2TLXsxkz0zI",
              title:
                "Ralph Loops: Build Dumb AI Loops That Ship — Chris Parsons, Cherrypick",
              caption:
                "AI Engineer talk behind the submitted dumb-loop production-risk post.",
            },
            topStory: true,
          },
        ],
      },
      {
        id: "may13-models-research",
        title: "Models & Research",
        purpose:
          "This section covers model releases, benchmark shifts, and capability updates that change what we should test, trust, or compare next.",
        items: [
          {
            title: "GPT Image 2 gets UI-ish",
            description:
              "Better text, layout, and screenshot fidelity. The interesting part is mockups and visual iteration, not just prettier images.",
            chip: "image",
            href: "https://developers.openai.com/api/docs/models/gpt-image-2",
            embeds: [
              {
                type: "tweet",
                href: "https://twitter.com/chetaslua/status/2046489044243403029?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/fofrAI/status/2046603571286720769?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/yacineMTB/status/2046751282904338672?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/cto_junior/status/2046543490151240168?ref_src=twsrc%5Etfw",
              },
            ],
          },
          {
            title: "Qwen3.6-27B gets laptop-shaped",
            description:
              "New quant evals show 12GB and 17.6GB variants with small reported quality hits.",
            chip: "local",
            href: "https://qwen.ai/blog?id=qwen3.6",
            embeds: [
              {
                type: "tweet",
                href: "https://twitter.com/bnjmn_marie/status/2047786725846724918?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/TeksEdge/status/2047876512863633710?ref_src=twsrc%5Etfw",
              },
            ],
          },
          {
            title: "SubQ goes after 12M-token context",
            description:
              "Subquadratic is pitching a sparse-attention frontier model with a 12M-token window and 52x faster 1M-token processing than FlashAttention. If the claims hold up, full-repo agents get a very different context budget.",
            chip: "long context",
            href: "https://subq.ai/introducing-subq",
            embed: {
              type: "tweet",
              href: "https://twitter.com/alex_whedon/status/2051663268704636937?ref_src=twsrc%5Etfw",
            },
          },
          {
            title: "12 models in 37 days",
            description:
              "Model velocity is now part of the workload: launches, quants, silent upgrades, and API-only variants every week.",
            chip: "models",
            href: "https://x.com/stevibe/status/2047539989492498711",
            embeds: [
              {
                type: "tweet",
                href: "https://twitter.com/stevibe/status/2047539989492498711?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/theo/status/2046767107178676636?ref_src=twsrc%5Etfw",
              },
            ],
          },
          {
            title: "Attune patches the open-model tool-call boundary",
            description:
              "Anthony Ronning's PoC treats empty outputs, malformed JSON, and missing tool_calls as contract failures between model, provider, and agent harness, not just bad model behavior.",
            chip: "open models",
            href: "https://github.com/AnthonyRonning/attune",
            embed: {
              type: "tweet",
              href: "https://twitter.com/anthonyronning/status/2053823121975542061?ref_src=twsrc%5Etfw",
            },
          },
          {
            title: "Gemma 4 app surface",
            description:
              "The follow-up question: how fast do the weights become useful across AI Studio, AI Edge Gallery, Ollama, LM Studio, llama.cpp, and now MTP drafters that promise up to 3x faster output.",
            chip: "open model",
            href: "https://deepmind.google/models/gemma/",
            embed: {
              type: "tweet",
              href: "https://twitter.com/googledevs/status/2051700498328346945?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://ai.google.dev/gemma/docs/releases",
              "https://blog.google/innovation-and-ai/technology/ai/google-ai-updates-april-2026/",
              "https://blog.google/innovation-and-ai/technology/developers-tools/multi-token-prediction-gemma-4/",
            ],
          },
          {
            title: "ProgramBench says agents still cannot rebuild software",
            description:
              "Given only binaries and docs, agents have to recreate full programs like jq, ripgrep, FFmpeg, and SQLite from scratch. GPT-5.5 xhigh tops the leaderboard at 0.5% fully solved, which is a useful cold shower for whole-codebase autonomy.",
            chip: "benchmark",
            href: "https://programbench.com/",
            linkPair: [
              "https://arxiv.org/abs/2511.00079",
              "https://github.com/ProgramBench/ProgramBench",
            ],
            image: {
              src: "/images/programbench-leaderboard.png",
              href: "https://programbench.com/",
              caption:
                "ProgramBench leaderboard: agents try to rebuild whole programs from binaries and docs.",
            },
            topStory: true,
          },
          {
            title: "Talkie tests vintage-model generalization",
            description:
              "A 13B model trained only on pre-1931 text is a cleaner probe for what LMs learn from language versus the modern web. The fun question is whether scale lets a model learn post-cutoff skills like code from examples alone.",
            chip: "vintage LM",
            href: "https://talkie-lm.com/introducing-talkie",
            embed: {
              type: "tweet",
              href: "https://twitter.com/status_effects/status/2048878495539843211?ref_src=twsrc%5Etfw",
            },
            topStory: true,
          },
          {
            title: "Red/blue button model behavior",
            description:
              "Jan Kulveit's red/blue button plots are a compact moral-decision probe: same dilemma, different models and reasoning settings, visibly different button preferences.",
            chip: "behavior",
            href: "https://x.com/jankulveit/status/2048808080188608953",
            embed: {
              type: "tweet",
              href: "https://twitter.com/jankulveit/status/2048808080188608953?ref_src=twsrc%5Etfw",
            },
          },
        ],
      },
      {
        id: "may13-security",
        title: "Security",
        purpose:
          "This section covers attacks, abuse patterns, defensive ideas, and security-relevant failures around modern AI systems and tooling.",
        items: [
          {
            title: "Vercel's Context.ai breach",
            description:
              "A compromised third-party AI tool led to Google Workspace takeover and access to non-sensitive env vars. AI SaaS is supply chain now.",
            chip: "supply chain",
            href: "https://vercel.com/kb/bulletin/vercel-april-2026-security-incident",
            embed: {
              type: "tweet",
              href: "https://twitter.com/theo/status/2046767107178676636?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://labs.cloudsecurityalliance.org/research/csa-research-note-ai-saas-supply-chain-vercel-contextai-2026/",
            ],
          },
          {
            title: "Mini Shai-Hulud hits the AI dev supply chain",
            description:
              "TanStack, Mistral AI, and other developer packages got pulled into a fresh supply-chain wave; the scary part is trusted package publishing turning into credential theft at CI speed.",
            chip: "supply chain",
            href: "https://www.wiz.io/blog/mini-shai-hulud-strikes-again-tanstack-more-npm-packages-compromised",
            embeds: [
              {
                type: "tweet",
                href: "https://twitter.com/hetmehtaa/status/2054158511073116266?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/theo/status/2054445127662477581?ref_src=twsrc%5Etfw",
              },
            ],
            linkPair: [
              "https://expel.com/blog/mini-shai-hulud-cross-ecosystem-supply-chain-worm-targeting-npm-pypi/",
              "https://www.tomshardware.com/tech-industry/cyber-security/compromised-mistral-ai-and-tanstack-packages-may-have-exposed-github-cloud-and-ci-cd-credentials-in-mini-shai-hulud-malware-infection-supply-chain-campaign-spreads-across-npm-and-ai-developer-ecosystems-like-wildfire",
            ],
            topStory: true,
          },
          {
            title: "PII filters are becoming local model infrastructure",
            description:
              "OpenAI shipped Privacy Filter, NVIDIA has GLiNER-PII, and the move is privacy protection becoming a small local model you put before logs, RAG, evals, and training data.",
            chip: "privacy",
            href: "https://openai.com/index/introducing-openai-privacy-filter/",
            linkPair: [
              "https://huggingface.co/openai/privacy-filter",
              "https://huggingface.co/nvidia/gliner-PII",
            ],
            topStory: true,
          },
          {
            title: "HRF funds AI for individual rights",
            description:
              "The Human Rights Foundation's AI grants are the freedom-tech version of the agent story: privacy-preserving assistants, pay-per-query AI over Bitcoin, and tools built for people under surveillance.",
            chip: "freedom tech",
            href: "https://hrf.org/program/ai-for-individual-rights/",
            embed: {
              type: "tweet",
              href: "https://twitter.com/TFTC21/status/2054591422959861780?ref_src=twsrc%5Etfw",
            },
          },
          {
            title: "GPT-5.5-Cyber opens the trust gate",
            description:
              "OpenAI is giving vetted defenders more permissive cyber workflows through Trusted Access, with GPT-5.5-Cyber in limited preview for critical infrastructure teams. The main shift is access control around dual-use capability, not a simple cyber model beats everything launch.",
            chip: "cyber",
            href: "https://openai.com/index/gpt-5-5-with-trusted-access-for-cyber/",
            embed: {
              type: "tweet",
              href: "https://twitter.com/sama/status/2049712078836170843?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://openai.com/daybreak",
              "https://openai.com/index/trusted-access-for-cyber/",
              "https://www.axios.com/2026/05/13/palo-alto-networks-mythos-gpt-cybersecurity",
            ],
          },
          {
            title: "Loupe scans Bitcoin open source before attackers do",
            description:
              "Block and Spiral are pointing AI vulnerability scanning at open-source Bitcoin projects, which is the practical defensive twin of the GPT-5.5-Cyber story.",
            chip: "vuln scanning",
            href: "https://spiralbtc.substack.com/p/meet-loupe-ai-powered-vulnerability",
            embed: {
              type: "tweet",
              href: "https://twitter.com/ProjectLoupe/status/2054252211756994678?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://glitchwire.com/news/blocks-spiral-launches-loupe-an-ai-vulnerability-scanner-for-open-source-bitcoin/",
            ],
          },
          {
            title: "Anthropic opens the bounty door",
            description:
              "Anthropic moved its security bug bounty onto HackerOne for public reporting. Useful vendor-signal: frontier model companies are turning model and platform security into something outside researchers can poke at directly.",
            chip: "bug bounty",
            href: "https://hackerone.com/anthropic",
            embed: {
              type: "tweet",
              href: "https://twitter.com/AnthropicAI/status/2052466175540629965?ref_src=twsrc%5Etfw",
            },
          },
          {
            title: "AI resume screeners prefer AI-polished resumes",
            description:
              "Same candidate, AI-rewritten resume wins 97.6% of the time in the reported study. The security angle is automated gatekeeping that rewards model-fluent polish over the underlying human.",
            chip: "hiring",
            href: "https://x.com/heynavtoor/status/2048088874686300431",
            embed: {
              type: "tweet",
              href: "https://twitter.com/heynavtoor/status/2048088874686300431?ref_src=twsrc%5Etfw",
            },
            topStory: true,
          },
          {
            title: "Cursor + Claude deletes PocketOS production data",
            description:
              "The alleged PocketOS incident is the nightmare version of agent authority: production database gone, backups destroyed, and the founder blaming his own prompt discipline afterward.",
            chip: "agent risk",
            href: "https://x.com/disclosetv/status/2048915961781104741",
            embed: {
              type: "tweet",
              href: "https://twitter.com/disclosetv/status/2048915961781104741?ref_src=twsrc%5Etfw",
            },
            notes:
              "Host angle: compare whether the failure was agent autonomy, production permissions, backup design, or rage-prompting an agent with too much authority.",
            topStory: true,
          },
        ],
      },
      {
        id: "may13-big-tech-moves",
        title: "Big Tech Moves",
        purpose:
          "This section covers major company moves, product launches, acquisitions, and platform bets that shift how the AI market is organized.",
        items: [
          {
            title: "Anthropic buys the AWS compute runway",
            description:
              "Up to 5 GW of Trainium compute, with nearly 1 GW expected by the end of 2026.",
            chip: "compute",
            href: "https://www.anthropic.com/news/anthropic-amazon-compute",
            embed: {
              type: "tweet",
              href: "https://twitter.com/AnthropicAI/status/2046327624092487688?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://www.aboutamazon.com/news/company-news/amazon-invests-additional-5-billion-anthropic-ai",
            ],
          },
          {
            title: "Frontier model testing gets a federal lane",
            description:
              "CAISI signed pre-deployment evaluation agreements with Google DeepMind, Microsoft, and xAI. Voluntary today, but it makes national-security testing part of the frontier-model shipping path.",
            chip: "policy",
            href: "https://www.nist.gov/news-events/news/2026/05/caisi-signs-agreements-regarding-frontier-ai-national-security-testing",
          },
          {
            title: "Pentagon picks a classified AI stack",
            description:
              "SpaceX, OpenAI, Google, NVIDIA, Reflection, Microsoft, Oracle, and AWS are being brought into IL6 and IL7 defense environments. The story is not one chatbot contract; it is cloud, compute, model access, and operational AI moving into classified workflows.",
            chip: "defense",
            href: "https://www.nextgov.com/artificial-intelligence/2026/05/pentagon-makes-agreements-7-companies-add-ai-classified-networks/413264/",
            linkPair: [
              "https://techcrunch.com/2026/05/01/pentagon-inks-deals-with-nvidia-microsoft-and-aws-to-deploy-ai-on-classified-networks/",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "meetup-2026-04-15",
    slug: "2026-04-15",
    date: "April 15, 2026",
    markdownHref: "./topics/2026-04-15.md",
    event: {
      title: "Austin AI Club",
      summary: "Quick AI news rundown, demos, and open discussion.",
      startAt: "2026-04-15T17:00:00-05:00",
      endAt: "2026-04-15T19:00:00-05:00",
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
      hostNote:
        "Smaller board this week. Less scrolling, more actual discussion.",
    },
    showcases: [],
    tracks: [
      {
        id: "apr15-local-builds",
        title: "Local Builds & Projects",
        purpose:
          "This section covers actual meetup member projects, demos, prototypes, and local builds that were made by people in the room.",
        items: [
          {
            title: "OpenAgents: Pylon + Autopilot",
            description:
              "Pylon looks like the local runtime underneath OpenAgents, while Autopilot is the desktop layer on top. The bigger idea is agents that keep their own identity, state, and wallet instead of living inside one hosted chat box.",
            chip: "local",
            href: "https://docs.openagents.com/concepts/sovereign-agents",
            embed: {
              type: "tweet",
              href: "https://twitter.com/OpenAgents/status/2042626501451919412?ref_src=twsrc%5Etfw",
            },
            linkPair: [
              "https://openagents.com/",
              "https://github.com/openagents-org/openagents",
            ],
          },
        ],
      },
      {
        id: "apr15-agent-infra",
        title: "Agent Infrastructure",
        purpose:
          "This section covers the plumbing for agent systems: runtimes, protocols, interfaces, orchestration layers, and the tooling that makes autonomous workflows usable.",
        items: [
          {
            title: "mesh-llm pools compute for open models",
            description:
              "Block's Michael Neale is pitching mesh-llm as an OpenAI-compatible inference mesh for pooling spare compute across open models.",
            chip: "infra",
            href: "https://docs.anarchai.org/",
            linkPair: [
              "https://github.com/michaelneale/mesh-llm",
              "https://x.com/jack/status/2039736688457507251",
            ],
            notes:
              "Interesting because it tries to collapse local inference, p2p routing, and agent coordination into one surface.",
          },
          {
            title: "Karpathy's LLM wiki idea",
            description:
              "Karpathy's pitch is simple: use LLMs to build a living markdown wiki for a topic, then keep extending that artifact instead of starting over from scratch every time.",
            chip: "memory",
            href: "https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f",
            embed: {
              type: "tweet",
              href: "https://twitter.com/karpathy/status/2039805659525644595?ref_src=twsrc%5Etfw",
            },
            linkPair: ["https://x.com/karpathy/status/2040470801506541998"],
            notes:
              "Better framing than disposable chat history: the wiki becomes the working artifact, and the model keeps editing it forward.",
          },
          {
            title: "Everybody wants an agent story now",
            description:
              "Slack, Microsoft, IBM, and a bunch of smaller infra players all pushed agent launches in the same week. The main signal is not any one framework. It is that everybody suddenly needs to be in the agent business.",
            chip: "infra",
            href: "https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-version-1-0/",
            linkPair: [
              "https://slack.com/blog/news/agent-orchestration",
              "https://rivet.dev/changelog/2026-04-04-introducing-agentos/",
              "https://github.com/rivet-dev/agent-os",
              "https://www.zenml.io/blog/kitaru-launch",
              "https://github.com/zenml-io/kitaru",
              "https://medium.com/agentspan/open-sourcing-agentspan-durable-ai-agents-069adc",
              "https://agentspan.ai/",
              "https://huggingface.co/blog/ibm-research/altk-evolve",
              "https://venturebeat.com/orchestration/slack-adds-30-ai-features-to-slackbot-its-most-ambitious-update-since-the-salesforce-acquisition/",
            ],
            notes:
              "Feels like the new checkbox for every big platform: if you do not have an agent product, agent framework, or agent roadmap, you look behind.",
          },
        ],
      },
      {
        id: "apr15-models-research",
        title: "Models & Research",
        purpose:
          "This section covers model releases, benchmark shifts, and capability updates that change what we should test, trust, or compare next.",
        items: [
          {
            title: "Waypoint-1.5 brings real-time AI worlds to everyday GPUs",
            description:
              "Overworld is releasing Waypoint-1.5 as a real-time diffusion world model aimed at consumer hardware, with local execution tiers for 720p and 360p plus a browser path for instant access.",
            chip: "world model",
            href: "https://over.world/blog/waypoint-1-5",
            linkPair: [
              "https://github.com/Overworldai/Biome/blob/main/README.md",
              "https://x.com/overworld_ai/status/2042287199513952563",
            ],
          },
          {
            title: "GLM-5.1",
            description:
              "Z.ai is launching GLM-5.1 as an open-source agentic coding model and claiming top open-source results on SWE-Bench Pro, Terminal-Bench, and NL2Repo, plus autonomous runs that stay productive for up to eight hours.",
            chip: "model",
            href: "https://docs.z.ai/guides/llm/glm-5.1",
            linkPair: [
              "https://z.ai/blog/glm-5.1",
              "https://x.com/Zai_org/status/2041550153354519022",
            ],
          },
          {
            title: "Trinity-Large-Thinking",
            description:
              "Arcee drops an Apache 2.0 reasoning MoE with unusually strong agentic benchmark claims for an open model.",
            chip: "model",
            href: "https://huggingface.co/arcee-ai/Trinity-Large-Thinking",
            linkPair: [
              "https://x.com/TheAhmadOsman/status/2039481776628777245",
            ],
          },
          {
            title: "Qwen3.6-Plus",
            description:
              "Qwen is pitching Qwen3.6-Plus as a real-world multimodal agent model: coding, vision, and 1M context in one API.",
            chip: "model",
            href: "https://qwen.ai/blog?id=qwen3.6",
            linkPair: [
              "https://chat.qwen.ai/",
              "https://x.com/Alibaba_Qwen/status/2039705104723611829",
            ],
          },
          {
            title: "Google Gemma 4",
            description:
              "Google DeepMind releases Gemma 4, the most capable open model family to date under Apache 2.0. Four sizes (E2B, E4B, 26B MoE, 31B Dense), built on Gemini 3 tech, with native function-calling, 256K context, and on-device agentic workflows.",
            chip: "model",
            href: "https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/",
            linkPair: [
              "https://developers.googleblog.com/en/bring-state-of-the-art-agentic-skills-to-the-edge-with-gemma-4/",
              "https://ai.google.dev/gemma/docs/releases",
              "https://x.com/Google/status/2039736220834480233",
            ],
          },
          {
            title: "Llama 4 Scout & Maverick",
            description:
              "Meta releases Llama 4 Scout and Maverick, the first open-weight natively multimodal MoE models. Scout fits on a single H100 with a 10M-token context window. Maverick packs 128 experts and strong image understanding.",
            chip: "model",
            href: "https://ai.meta.com/blog/llama-4-multimodal-intelligence/",
            linkPair: [
              "https://llama.meta.com/models/llama-4/",
              "https://huggingface.co/blog/llama4-release",
            ],
          },
          {
            title: "Meta introduces Muse Spark",
            description:
              "Meta is pitching Muse Spark as a step toward personal superintelligence, while Artificial Analysis says the model scores 52 on its Intelligence Index and marks Meta's first major non-open-weights release since Llama 4.",
            chip: "model",
            href: "https://ai.meta.com/blog/introducing-muse-spark-msl/",
            linkPair: [
              "https://x.com/ArtificialAnlys/status/2041913043379220801",
            ],
          },
        ],
      },
      {
        id: "apr15-security",
        title: "Security",
        purpose:
          "This section covers attacks, abuse patterns, defensive ideas, and security-relevant failures around modern AI systems and tooling.",
        items: [
          {
            title: "Anthropic launches Project Glasswing with Claude Mythos Preview",
            description:
              "Anthropic is saying Mythos Preview is already strong enough at vulnerability discovery and exploit development that it is keeping the model out of general release and routing access through Project Glasswing instead.",
            chip: "security",
            href: "https://www.anthropic.com/glasswing",
            linkPair: [
              "https://red.anthropic.com/2026/mythos-preview/",
              "https://www.anthropic.com/claude-mythos-preview-system-card",
              "https://x.com/AnthropicAI/status/2041578392852517128",
            ],
            notes:
              "This is bigger than a model launch: Anthropic says Mythos has already found thousands of high-severity zero-days across every major OS and browser, launched with AWS, Apple, Google, Microsoft, and others, and tied the effort to $100M in usage credits plus $4M for open-source security groups.",
          },
          {
            title: "Anthropic's fake-tool anti-distillation path",
            description:
              "The leaked Claude Code source shows an anti-distillation mode that opts CLI traffic into fake tool injection.",
            chip: "security",
            href:
              "https://github.com/Gitlawb/openclaude/blob/2f162af60cc028899a343a660fef2da8186ca018/src/services/api/claude.ts",
            linkPair: [
              "https://winbuzzer.com/2026/04/01/claude-code-source-leak-anti-distillation-traps-undercover-mode-xcxwbn/",
            ],
            notes:
              "This is the clearest recent sign that labs now treat distillation as an adversarial security problem, not just an abuse problem.",
          },
          {
            title: "Microsoft Agent Governance Toolkit",
            description:
              "Microsoft open-sources a runtime security toolkit for autonomous AI agents under MIT. Policy enforcement, zero-trust identity, audit trails, and guardrails mapped to OWASP agent risk categories.",
            chip: "security",
            href: "https://opensource.microsoft.com/blog/2026/04/02/introducing-the-agent-governance-toolkit/",
            linkPair: [
              "https://github.com/microsoft/agent-governance-toolkit",
            ],
            notes:
              "This is the first major vendor-backed open-source governance layer for agents. The OWASP mapping gives it a standards anchor that most agent security tools lack.",
          },
          {
            title: "OWASP Secure Agent Playbook",
            description:
              "OWASP drops a step-by-step security playbook specifically for building and operating AI agents, grounded in their agent risk taxonomy.",
            chip: "security",
            href: "https://github.com/OWASP/secure-agent-playbook",
            linkPair: [
              "https://genai.owasp.org/resource/ai-security-solutions-landscape-for-agentic-ai-q2-2026/",
            ],
            notes:
              "Pairs well with the Microsoft governance toolkit. OWASP is setting the taxonomy and Microsoft is building the runtime enforcement.",
          },
          {
            title: "AI Trust Commons governance framework",
            description:
              "Open-source (Apache 2.0) cross-provider governance framework for AI agents that works across AWS, Azure, and GCP. Aims to unify audit, compliance, and standards mapping for enterprise agent deployments.",
            chip: "security",
            href: "https://github.com/aitrustcommons/governance-framework",
            linkPair: [
              "https://aitrustcommons.org/",
              "https://aitrustcommons.org/standards/",
            ],
            notes:
              "The cross-provider angle is what makes this different from vendor-specific toolkits. Maps to both NIST and OWASP standards.",
          },
        ],
      },
      {
        id: "apr15-big-tech-moves",
        title: "Big Tech Moves",
        purpose:
          "This section covers major company moves, product launches, acquisitions, and platform bets that shift how the AI market is organized.",
        items: [
          {
            title: "Anthropic vs OpenClaw keeps escalating",
            description:
              "First Anthropic cut OpenClaw off Claude subscription credits on April 4, 2026. Then on April 10, 2026 Peter Steinberger said Anthropic suspended his Claude and API access, before his account was restored roughly two hours later.",
            chip: "policy",
            href: "https://www.theverge.com/ai-artificial-intelligence/907074/anthropic-openclaw-claude-subscription-ban",
            image: {
              src: "/images/anthropic-openclaw-email.jpg",
              href: "https://www.theverge.com/ai-artificial-intelligence/907074/anthropic-openclaw-claude-subscription-ban",
              alt: "Anthropic email explaining that Claude subscriptions no longer cover third-party harnesses including OpenClaw.",
              caption: "Anthropic email shown in reporting around the OpenClaw subscription cutoff",
            },
            embeds: [
              {
                type: "tweet",
                href: "https://twitter.com/bcherny/status/2040206444428189755?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/steipete/status/2042615534567457102?ref_src=twsrc%5Etfw",
              },
              {
                type: "tweet",
                href: "https://twitter.com/steipete/status/2042648934238097842?ref_src=twsrc%5Etfw",
              },
            ],
            linkPair: [
              "https://x.com/bcherny/status/2040206443094446558",
              "https://finance.sina.com.cn/tech/roll/2026-04-11/doc-inhucmsx9421750.shtml",
            ],
            notes:
              "The cheap Claude-inside-OpenClaw path is still clearly gone. The Peter suspension looks different: based on reporting and Anthropic employee replies, that one appears to have been a false positive, not a lasting creator-specific ban.",
          },
          {
            title: "OpenAI acquires TBPN",
            description:
              "OpenAI is acquiring TBPN, keeping the show intact while pulling the team into Strategy.",
            chip: "media",
            href: "https://openai.com/index/openai-acquires-tbpn/",
            linkPair: [
              "https://x.com/jordihays/status/2039756490387624327",
            ],
            notes:
              "This looks like a distribution move as much as a media deal. Owning the conversation is its own moat.",
          },
          {
            title: "Microsoft ships in-house MAI models",
            description:
              "Microsoft launches three in-house AI models through Foundry: MAI-Transcribe-1 (SOTA speech-to-text across 25 languages), MAI-Voice-1 (speech generation), and MAI-Image-2 (text-to-image). A clear signal of reducing OpenAI dependency.",
            chip: "strategy",
            href: "https://microsoft.ai/news/today-were-announcing-3-new-world-class-mai-models-available-in-foundry/",
            linkPair: [
              "https://aka.ms/mai-foundry-tcblog",
              "https://thenextweb.com/news/microsoft-mai-models-openai-independence",
            ],
            notes:
              "The real story is not the models themselves but what they mean: Microsoft is building first-party alternatives to OpenAI across speech, voice, and image. The renegotiated partnership is producing visible divergence.",
          },
          {
            title: "OpenAI pauses Stargate UK",
            description:
              "OpenAI pauses the Stargate UK data-centre project over high energy costs and regulatory uncertainty. The plan would have deployed up to 8,000 GPUs with NVIDIA and Nscale in North Tyneside.",
            chip: "strategy",
            href: "https://www.reuters.com/business/openai-pauses-uk-data-centre-project-over-regulation-costs/",
            linkPair: [
              "https://www.bbc.co.uk/news/articles/clyd032ej70o",
              "https://thenextweb.com/news/openai-pauses-stargate-uk-energy-costs-regulation",
            ],
            notes:
              "A reminder that compute expansion is still gated by energy costs and regulation, not just capital. OpenAI has the $122B but the physical infrastructure bottleneck is real.",
          },
          {
            title: "Two attacks on Sam Altman's home in one week",
            description:
              "On April 10 a 20-year-old threw a Molotov cocktail at Altman's San Francisco house, setting a perimeter gate on fire, then went to OpenAI's office and threatened arson before being arrested. Two days later on April 12, two suspects in a Honda fired a gun toward the same Lombard Street property; both were arrested for negligent discharge of a firearm. FBI raided the first suspect's Texas home. Altman was uninjured in both incidents.",
            chip: "news",
            href: "https://sfstandard.com/2026/04/12/sam-altman-s-home-targeted-second-attack/",
            linkPair: [
              "https://www.cnbc.com/2026/04/10/sam-altman-house-hit-with-molotov-cocktail-openai-office-threatened.html",
              "https://www.engadget.com/ai/two-suspects-have-been-arrested-for-allegedly-shooting-at-sam-altmans-san-francisco-home-142655579.html",
              "https://www.bbc.com/news/articles/czx91rdxpyeo",
              "https://www.wired.com/story/sam-altman-home-attack-openai-san-franisco-office/",
            ],
            notes:
              "Two unrelated attacks in 72 hours. The first suspect explicitly threatened OpenAI. Altman called AI a 'ring of power' dynamic that makes people do crazy things. Expect the physical security conversation around AI leaders to escalate.",
          },
        ],
      },
    ],
  },
  {
    id: "meetup-2026-04-01",
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
    id: "meetup-2026-03-18",
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
