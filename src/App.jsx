import { useEffect, useMemo, useRef, useState } from "react";
import { sessions } from "./data.js";

const TRACK_CATEGORY = {
  "Local Builds & Projects": "local-builds",
  "Agent Infrastructure": "agent-infra",
  "Models & Research": "models",
  Security: "security",
  "Big Tech Moves": "platform",
};

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getTrackRouteSlug(track) {
  return slugify(track.title);
}

function getSlideRouteSlug(slide) {
  if (slide.type === "track-title") {
    return "intro";
  }
  if (slide.type === "track-outro") {
    return "outro";
  }
  return slugify(slide.item.title);
}

function buildSlideHash(session, slide) {
  return `#/slides/${session.slug}/${getTrackRouteSlug(slide.track)}/${getSlideRouteSlug(slide)}`;
}

function parseSlideHash(hash) {
  const normalized = (hash || "").replace(/^#\/?/, "");
  const parts = normalized.split("/").filter(Boolean);

  if (parts[0] !== "slides" || parts.length < 4) {
    return null;
  }

  const [, sessionSlug, trackSlug, slideSlug] = parts;
  return {
    sessionSlug: decodeURIComponent(sessionSlug),
    trackSlug: decodeURIComponent(trackSlug),
    slideSlug: decodeURIComponent(slideSlug),
  };
}

// X embeds are rendered client-side by Twitter's widget script.
function TopicEmbed({ embed }) {
  if (!embed) {
    return null;
  }

  if (embed.type === "tweet") {
    return (
      <div className="embed-wrap">
        <blockquote className="twitter-tweet" data-theme="dark">
          {embed.quote ? (
            <p lang="en" dir="ltr">
              {embed.quote} <a href={embed.href}>link</a>
            </p>
          ) : null}
          {embed.author ? <>— {embed.author} </> : null}
          <a href={embed.href}>
            {embed.date ?? embed.href.replace("?ref_src=twsrc%5Etfw", "")}
          </a>
        </blockquote>
      </div>
    );
  }

  return null;
}

// Video embeds always keep a direct-link escape hatch in the caption.
function VideoEmbed({ video }) {
  if (!video) {
    return null;
  }

  return (
    <div className="video-embed">
      <div className="video-frame">
        <iframe
          src={video.embedHref}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <span className="video-caption">
        {video.caption}{" "}
        <a href={video.href} target="_blank" rel="noreferrer">
          open direct
        </a>
      </span>
    </div>
  );
}

// Topic is the smallest archive unit. Rich media stays in presentation mode.
function Topic({ item }) {
  return (
    <li className="topic">
      <div className="topic-main">
        <h4>
          {item.href ? (
            <a href={item.href} target="_blank" rel="noreferrer">
              {item.title}
            </a>
          ) : (
            item.title
          )}
        </h4>
        <p>{item.description}</p>
      </div>
      <span className="source-chip">{item.chip}</span>
    </li>
  );
}

// Parse a URL into parts for rich link cards in presentation mode.
function parseLinkMeta(href) {
  try {
    const url = new URL(href);
    const host = url.hostname.replace(/^www\./, "");
    const path = url.pathname.replace(/\/$/, "");

    if (host === "github.com") {
      const parts = path.split("/").filter(Boolean);
      const owner = parts[0] || "";
      const repo = parts[1] || "";
      return { kind: "github", host, owner, repo, href };
    }
    if (host === "x.com" || host === "twitter.com") {
      return { kind: "x", host, path, href };
    }
    return { kind: "generic", host, path, href };
  } catch {
    return { kind: "generic", host: href, path: "", href };
  }
}

function LinkCard({ href }) {
  const meta = parseLinkMeta(href);

  if (meta.kind === "github") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="link-card link-card--github"
      >
        <svg className="link-card-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
        <div className="link-card-body">
          <span className="link-card-domain">github.com</span>
          <span className="link-card-title">{meta.owner}/{meta.repo}</span>
          <span className="link-card-hint">Open repository →</span>
        </div>
      </a>
    );
  }

  if (meta.kind === "x") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="link-card link-card--x"
      >
        <svg className="link-card-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <div className="link-card-body">
          <span className="link-card-domain">x.com</span>
          <span className="link-card-title">View post</span>
          <span className="link-card-hint">Open on X →</span>
        </div>
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="link-card link-card--generic"
    >
      <svg className="link-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
      <div className="link-card-body">
        <span className="link-card-domain">{meta.host}</span>
        {meta.path ? <span className="link-card-title">{meta.path}</span> : null}
        <span className="link-card-hint">Open link →</span>
      </div>
    </a>
  );
}

function LinkPair({ links }) {
  if (!links?.length) {
    return null;
  }

  return (
    <div className="link-pair">
      {links.map((href) => (
        <LinkCard key={href} href={href} />
      ))}
    </div>
  );
}

// Flatten tracks into a linear sequence so presentation mode can move one story at a time.
function buildSlides(session) {
  const slides = [];
  session.tracks.forEach((track, trackIndex) => {
    slides.push({
      type: "track-title",
      track,
      trackIndex,
      trackTotal: session.tracks.length,
    });
    track.items.forEach((item, itemIndex) => {
      slides.push({
        type: "topic",
        track,
        trackIndex,
        trackTotal: session.tracks.length,
        item,
        itemIndex,
        itemTotal: track.items.length,
        isLastInTrack: itemIndex === track.items.length - 1,
      });
    });
    if (track.outro) {
      slides.push({
        type: "track-outro",
        track,
        trackIndex,
        trackTotal: session.tracks.length,
        outro: track.outro,
      });
    }
  });
  return slides;
}

function findSlideIndex(session, route) {
  const slides = buildSlides(session);
  return slides.findIndex(
    (slide) =>
      getTrackRouteSlug(slide.track) === route.trackSlug &&
      getSlideRouteSlug(slide) === route.slideSlug,
  );
}

function resolvePresentationHash(hash) {
  const route = parseSlideHash(hash);
  if (!route) {
    return null;
  }

  const session = sessions.find((candidate) => candidate.slug === route.sessionSlug);
  if (!session) {
    return {
      invalidHash: sessions[0] ? `#${sessions[0].id}` : "",
    };
  }

  const slideIndex = findSlideIndex(session, route);
  if (slideIndex === -1) {
    return {
      invalidHash: `#${session.id}`,
    };
  }

  return { session, slideIndex };
}

function setHash(hash) {
  if (window.location.hash === hash) {
    return;
  }
  window.location.hash = hash;
}

function PresentationSlide({ slide, isFinale }) {
  const trackSlug = TRACK_CATEGORY[slide.track.title];
  if (slide.type === "track-title") {
    return (
      <div className="pres-slide pres-slide--track" data-track={trackSlug}>
        <span className="pres-track-num">
          Track {slide.trackIndex + 1} of {slide.trackTotal}
        </span>
        <h2 className="pres-track-title">{slide.track.title}</h2>
        {slide.track.purpose ? (
          <p className="pres-track-purpose">{slide.track.purpose}</p>
        ) : null}
        <span className="pres-topic-badge">
          {slide.track.items.length} topic{slide.track.items.length !== 1 ? "s" : ""}
        </span>
      </div>
    );
  }

  if (slide.type === "track-outro") {
    return (
      <div className="pres-slide pres-slide--track pres-slide--outro" data-track={trackSlug}>
        <span className="pres-track-num">
          Track {slide.trackIndex + 1} of {slide.trackTotal}
        </span>
        <h2 className="pres-track-title">{slide.outro.title}</h2>
        <p className="pres-track-purpose">{slide.outro.body}</p>
        <span className="pres-topic-badge">discussion prompt</span>
      </div>
    );
  }

  return (
    <div className={`pres-slide pres-slide--topic${isFinale ? " pres-slide--finale" : ""}`} data-track={trackSlug}>
      <h3 className="pres-topic-title">
        {slide.item.href ? (
          <a href={slide.item.href} target="_blank" rel="noreferrer">
            {slide.item.title}
          </a>
        ) : (
          slide.item.title
        )}
      </h3>
      <p className="pres-topic-desc">{slide.item.description}</p>
      <span className="source-chip">{slide.item.chip}</span>
      {slide.item.notes ? <p className="pres-notes">{slide.item.notes}</p> : null}
      {slide.item.embed ? <TopicEmbed embed={slide.item.embed} /> : null}
      {slide.item.video ? <VideoEmbed video={slide.item.video} /> : null}
      {slide.item.mediaPair ? (
        <div className="media-pair">
          <VideoEmbed video={slide.item.mediaPair.video} />
          <TopicEmbed embed={slide.item.mediaPair.reaction} />
        </div>
      ) : null}
      {slide.item.linkPair ? <LinkPair links={slide.item.linkPair} /> : null}
      {slide.item.href &&
      !slide.item.embed &&
      !slide.item.video &&
      !slide.item.mediaPair &&
      !slide.item.linkPair ? (
        <LinkCard href={slide.item.href} />
      ) : null}
    </div>
  );
}

function PresentationProgress({ currentIndex, totalSlides, breadcrumb, slideLabel, trackSlug }) {
  const pct = ((currentIndex + 1) / totalSlides) * 100;
  return (
    <div className="pres-bottom" data-track={trackSlug}>
      <span className="pres-bottom-label">{slideLabel}</span>
      <div className="pres-progress-track">
        <div className="pres-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="pres-bottom-counter">
        {currentIndex + 1} / {totalSlides}
      </span>
    </div>
  );
}

// Presentation mode is intentionally lightweight: URL drives the active slide.
function PresentationMode({ session, currentIndex, onNavigate, onExit }) {
  const slides = useMemo(() => buildSlides(session), [session]);
  const visitedRef = useRef(new Set());
  const slide = slides[currentIndex];
  if (!slide) {
    return null;
  }

  // Track first visits for one-time animations (e.g. finale slide).
  const isFirstVisit = !visitedRef.current.has(currentIndex);
  visitedRef.current.add(currentIndex);

  // The last topic of the final track gets a special entrance on first visit.
  const isFinale =
    isFirstVisit &&
    slide.isLastInTrack &&
    slide.trackIndex === slide.trackTotal - 1;

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === slides.length - 1;

  const goNext = () => {
    if (!isLast) {
      onNavigate(currentIndex + 1);
    }
  };
  const goPrev = () => {
    if (!isFirst) {
      onNavigate(currentIndex - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Escape") {
        onExit();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentIndex, isFirst, isLast, onExit, onNavigate]);

  // Twitter embed re-render
  useEffect(() => {
    if (window.twttr?.widgets?.load) {
      const timer = setTimeout(() => window.twttr.widgets.load(), 50);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const breadcrumb = slide.type === "topic"
    ? `${session.date} › ${slide.track.title} › Topic ${slide.itemIndex + 1} of ${slide.itemTotal}`
    : `${session.date} › ${slide.track.title}`;

  const slideLabel =
    slide.type === "topic"
      ? `Topic ${slide.itemIndex + 1} of ${slide.itemTotal}`
      : slide.type === "track-outro"
        ? "Discussion prompt"
        : `Track ${slide.trackIndex + 1} of ${slide.trackTotal}`;

  const trackSlug = TRACK_CATEGORY[slide.track.title];

  return (
    <div className="pres-overlay" data-track={trackSlug}>
      <div className="pres-topbar">
        <span className="pres-breadcrumb">{breadcrumb}</span>
        <button className="pres-exit-btn" onClick={onExit}>
          esc exit
        </button>
      </div>

      <div className="pres-content">
        <button
          className="pres-nav pres-nav--prev"
          onClick={goPrev}
          disabled={isFirst}
          aria-label="Previous slide"
        >
          ‹
        </button>

        <div className="pres-stage" key={currentIndex}>
          <PresentationSlide slide={slide} isFinale={isFinale} />
        </div>

        <button
          className="pres-nav pres-nav--next"
          onClick={goNext}
          disabled={isLast}
          aria-label="Next slide"
        >
          ›
        </button>
      </div>

      <PresentationProgress
        currentIndex={currentIndex}
        totalSlides={slides.length}
        breadcrumb={breadcrumb}
        slideLabel={slideLabel}
        trackSlug={TRACK_CATEGORY[slide.track.title]}
      />
    </div>
  );
}

function Track({ track, index }) {
  return (
    <details className="track" id={track.id} data-track={TRACK_CATEGORY[track.title]}>
      <summary className="track-header">
        <h3>
          <span className="track-chevron" aria-hidden="true"></span>
          <span className="track-num">{String(index + 1).padStart(2, "0")}</span>{" "}
          {track.title}
        </h3>
        <span className="track-count">
          {track.items.length} topic{track.items.length !== 1 ? "s" : ""}
        </span>
      </summary>
      <ul className="topic-list">
        {track.items.map((item) => (
          <Topic key={item.title} item={item} />
        ))}
      </ul>
    </details>
  );
}

// Session owns summary metadata like total topic count and anchor navigation.
function Session({ session, onPresent }) {
  const topicCount = session.tracks.reduce(
    (sum, track) => sum + track.items.length,
    0,
  );

  return (
    <details className="session" id={session.id} open={session.open}>
      <summary className="session-header">
        <div className="session-date">
          <span className="chevron" aria-hidden="true"></span>
          <h2>{session.date}</h2>
          <button
            className="pres-enter-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPresent(session);
            }}
          >
            ▶ slideshow mode
          </button>
        </div>
        <p className="session-meta">
          {topicCount} topics &middot; {session.tracks.length} tracks
        </p>
        <nav className="track-nav" aria-label={`${session.date} tracks`}>
          {session.tracks.map((track) => (
            <a key={track.id} href={`#${track.id}`} data-track={TRACK_CATEGORY[track.title]}>
              {track.title.toLowerCase()}
            </a>
          ))}
        </nav>
      </summary>

      <div className="session-body">
        {session.tracks.map((track, index) => (
          <Track key={track.id} track={track} index={index} />
        ))}
      </div>
    </details>
  );
}

export default function App() {
  const [presentationState, setPresentationState] = useState(() =>
    resolvePresentationHash(window.location.hash),
  );

  useEffect(() => {
    // Reuse the widget loader when possible so React re-renders do not pile up scripts.
    const existing = window.twttr;
    if (existing?.widgets?.load) {
      existing.widgets.load();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const syncFromHash = () => {
      const next = resolvePresentationHash(window.location.hash);

      if (next?.invalidHash !== undefined) {
        setPresentationState(null);
        if (next.invalidHash) {
          setHash(next.invalidHash);
        }
        return;
      }

      setPresentationState(next);
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const openPresentation = (session, slideIndex = 0) => {
    const slides = buildSlides(session);
    const slide = slides[slideIndex];
    if (!slide) {
      return;
    }

    setHash(buildSlideHash(session, slide));
  };

  const closePresentation = (session) => {
    setHash(`#${session.id}`);
  };

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-left">
          <div className="window-controls" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="brand">
            <span className="brand-mark">$</span>
            <div>
              <p className="eyebrow">Austin AI Club</p>
              <h1>austinai.club</h1>
            </div>
          </div>
        </div>
      </header>

      <nav className="session-index" aria-label="Austin AI Club dates">
        {sessions.map((session) => (
          <a key={session.id} href={`#${session.id}`} className="index-link">
            {session.slug}
          </a>
        ))}
      </nav>

      <main className="archive">
        {sessions.map((session) => (
          <Session
            key={session.id}
            session={session}
            onPresent={(targetSession) => openPresentation(targetSession, 0)}
          />
        ))}
      </main>

      {presentationState?.session && (
        <PresentationMode
          session={presentationState.session}
          currentIndex={presentationState.slideIndex}
          onNavigate={(slideIndex) => openPresentation(presentationState.session, slideIndex)}
          onExit={() => closePresentation(presentationState.session)}
        />
      )}

      <footer className="footer">
        <div className="footer-brand">
          <p className="footer-label">Austin AI Club</p>
          <p className="footer-copy">
            Local archive and presentation layer for monthly topics, demos, and discussion.
          </p>
        </div>
        <div className="footer-links">
          <a
            href="https://github.com/AustinKelsay/austin-ai-meetup-list"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a href="./topics/2026-03-18.md">March 18 notes</a>
          <a href="./topics/README.md">Topic archive</a>
        </div>
      </footer>
    </div>
  );
}
