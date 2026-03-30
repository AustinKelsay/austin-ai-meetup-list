import { useEffect, useMemo, useRef } from "react";
import { COMMUNITY_SLOT_LABEL, TRACK_CATEGORY } from "../../app/constants.js";
import { buildSlides } from "./slides.js";
import { TopicMedia } from "./content.jsx";

function PresentationSlide({ slide, isFinale }) {
  const trackSlug = slide.type === "session-intro"
    ? "local-builds"
    : slide.type.startsWith("community")
      ? "community"
      : TRACK_CATEGORY[slide.track.title];

  if (slide.type === "session-intro") {
    return (
      <div className="pres-slide pres-slide--session-intro" data-track={trackSlug}>
        <span className="pres-intro-eyebrow">{slide.intro.eyebrow}</span>
        <h2 className="pres-intro-title">{slide.intro.title}</h2>
        <p className="pres-intro-blurb">{slide.intro.blurb}</p>
        <a className="pres-intro-link" href={slide.intro.ctaHref} target="_blank" rel="noreferrer">
          {slide.intro.ctaLabel}
        </a>
        <ul className="pres-intro-list">
          {slide.intro.bullets.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <p className="pres-intro-note">{slide.intro.hostNote}</p>
      </div>
    );
  }

  if (slide.type === "track-title") {
    return (
      <div className="pres-slide pres-slide--track" data-track={trackSlug}>
        <span className="pres-track-num">
          Track {slide.trackIndex + 1} of {slide.trackTotal}
        </span>
        <h2 className="pres-track-title">{slide.track.title}</h2>
        {slide.track.purpose ? <p className="pres-track-purpose">{slide.track.purpose}</p> : null}
        {slide.track.sectionNote ? <p className="pres-notes">{slide.track.sectionNote}</p> : null}
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

  if (slide.type === "community-title") {
    return (
      <div className="pres-slide pres-slide--track" data-track="community">
        <span className="pres-track-num">Final track</span>
        <h2 className="pres-track-title">{COMMUNITY_SLOT_LABEL}</h2>
        <p className="pres-track-purpose">
          Short three to five minute shares at the end of the meetup.
        </p>
        <span className="pres-topic-badge">
          {slide.itemTotal ? `${slide.itemTotal} slot${slide.itemTotal !== 1 ? "s" : ""}` : "open"}
        </span>
      </div>
    );
  }

  if (slide.type === "community-topic") {
    return (
      <div className={`pres-slide pres-slide--topic${isFinale ? " pres-slide--finale" : ""}`} data-track="community">
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
        <span className="source-chip">{slide.item.chip ?? "showcase"}</span>
        {slide.item.notes ? <p className="pres-notes">{slide.item.notes}</p> : null}
        <TopicMedia item={slide.item} />
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
      <TopicMedia item={slide.item} />
    </div>
  );
}

function PresentationProgress({ currentIndex, totalSlides, breadcrumb, slideLabel, trackSlug }) {
  const pct = ((currentIndex + 1) / totalSlides) * 100;

  return (
    <div className="pres-bottom" data-track={trackSlug}>
      <div className="pres-bottom-meta">
        <span className="pres-bottom-label">{slideLabel}</span>
        <span className="pres-bottom-breadcrumb">{breadcrumb}</span>
      </div>
      <div className="pres-progress-track">
        <div className="pres-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="pres-bottom-counter">
        {currentIndex + 1} / {totalSlides}
      </span>
    </div>
  );
}

export default function PresentationMode({ session, currentIndex, onNavigate, onExit }) {
  const slides = useMemo(() => buildSlides(session), [session]);
  const visitedRef = useRef(new Set());
  const touchStartRef = useRef(null);
  const slide = slides[currentIndex];

  if (!slide) {
    return null;
  }

  const isFirstVisit = !visitedRef.current.has(currentIndex);
  visitedRef.current.add(currentIndex);

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

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event) => {
    const start = touchStartRef.current;
    const touch = event.changedTouches[0];
    touchStartRef.current = null;

    if (!start || !touch) {
      return;
    }

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (Math.abs(deltaX) < 56 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) {
      return;
    }

    if (deltaX < 0) {
      goNext();
    } else {
      goPrev();
    }
  };

  useEffect(() => {
    const handler = (event) => {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        goNext();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "Escape") {
        onExit();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentIndex, isFirst, isLast, onExit, onNavigate]);

  useEffect(() => {
    if (window.twttr?.widgets?.load) {
      const timer = setTimeout(() => window.twttr.widgets.load(), 50);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const breadcrumb = slide.type === "topic"
    ? `${session.date} › ${slide.track.title} › Topic ${slide.itemIndex + 1} of ${slide.itemTotal}`
    : slide.type === "session-intro"
      ? `${session.date} › Welcome`
      : slide.type === "community-title"
        ? `${session.date} › ${COMMUNITY_SLOT_LABEL}`
        : slide.type === "community-topic"
          ? `${session.date} › ${COMMUNITY_SLOT_LABEL} › ${slide.itemIndex + 1} of ${slide.itemTotal}`
          : `${session.date} › ${slide.track.title}`;

  const slideLabel = slide.type === "session-intro"
    ? "Welcome"
    : slide.type === "topic"
      ? `Topic ${slide.itemIndex + 1} of ${slide.itemTotal}`
      : slide.type === "community-topic"
        ? `${COMMUNITY_SLOT_LABEL} ${slide.itemIndex + 1} of ${slide.itemTotal}`
        : slide.type === "community-title"
          ? `Track ${session.tracks.length + 1} of ${session.tracks.length + 1}`
          : slide.type === "track-outro"
            ? "Discussion prompt"
            : `Track ${slide.trackIndex + 1} of ${slide.trackTotal}`;

  const trackSlug = slide.type === "session-intro"
    ? "local-builds"
    : slide.type === "community-title" || slide.type === "community-topic"
      ? "community"
      : TRACK_CATEGORY[slide.track.title];

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

        <div className="pres-stage" key={currentIndex} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
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
        trackSlug={trackSlug}
      />
      <div className="pres-mobile-controls" data-track={trackSlug}>
        <button
          className="pres-mobile-btn"
          onClick={goPrev}
          disabled={isFirst}
          aria-label="Previous slide"
        >
          Prev
        </button>
        <span className="pres-mobile-hint">swipe or tap to navigate</span>
        <button
          className="pres-mobile-btn"
          onClick={goNext}
          disabled={isLast}
          aria-label="Next slide"
        >
          Next
        </button>
      </div>
    </div>
  );
}
