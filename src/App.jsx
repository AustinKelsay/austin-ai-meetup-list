import { useEffect, useState } from "react";
import { sessions } from "./data.js";
import { APP_ROUTE } from "./app/constants.js";
import { buildMeetupPath, getAppRoute, setPathname } from "./app/routes.js";
import ArchiveView from "./features/archive/ArchiveView.jsx";
import MeetupDetailView from "./features/archive/MeetupDetailView.jsx";
import {
  buildCalendarEntries,
  getNextSubmissionMeetup,
} from "./features/calendar/calendar.js";
import CalendarView from "./features/calendar/CalendarView.jsx";
import PresentationMode from "./features/presentation/PresentationMode.jsx";
import {
  buildSlideHash,
  buildSlides,
  findTopicSlideIndex,
  resolvePresentationHash,
} from "./features/presentation/slides.js";
import SubmissionScreen from "./features/submissions/SubmissionScreen.jsx";

const PRESENTATION_ENTRY_MODE = {
  FULL: "full",
  ITEM: "item",
};

export default function App() {
  const [presentationState, setPresentationState] = useState(() =>
    resolvePresentationHash(sessions, window.location.hash),
  );
  const [route, setRoute] = useState(() => getAppRoute(window.location.pathname));
  const calendarEntries = buildCalendarEntries(sessions);
  const nextMeetup = getNextSubmissionMeetup(sessions);
  const nextCalendarEntry =
    calendarEntries.find((entry) => new Date(entry.event.endAt).getTime() >= Date.now()) ?? null;

  const syncLocationState = (pathname = window.location.pathname, hash = window.location.hash) => {
    setRoute(getAppRoute(pathname));

    const next = resolvePresentationHash(sessions, hash);
    if (next?.invalidHash !== undefined) {
      setPresentationState(null);
      if (hash !== next.invalidHash) {
        setPathname(pathname, { replace: true, hash: next.invalidHash });
      }
      return;
    }

    setPresentationState(next);
  };

  const openRoute = (pathname, options = {}) => {
    setPathname(pathname, { hash: "", ...options });
    syncLocationState();
  };

  const goHome = (options = {}) => {
    openRoute("/", options);
  };

  const goToMeetup = (session, options = {}) => {
    if (!session?.slug) {
      goHome(options);
      return;
    }

    openRoute(buildMeetupPath(session.slug), options);
  };

  const goToNextMeetupOrHome = (options = {}) => {
    if (nextMeetup) {
      goToMeetup(nextMeetup, options);
      return;
    }

    goHome(options);
  };

  const getPresentationHistoryState = () => window.history.state?.presentation ?? null;

  useEffect(() => {
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
    const syncFromLocation = () => {
      syncLocationState(window.location.pathname, window.location.hash);
    };

    syncFromLocation();
    window.addEventListener("hashchange", syncFromLocation);
    window.addEventListener("popstate", syncFromLocation);

    return () => {
      window.removeEventListener("hashchange", syncFromLocation);
      window.removeEventListener("popstate", syncFromLocation);
    };
  }, []);

  useEffect(() => {
    if (route.name === APP_ROUTE.HOME || route.name === APP_ROUTE.MEETUP) {
      return undefined;
    }

    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        goToNextMeetupOrHome({ replace: true });
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [route, nextMeetup]);

  const openPresentation = (session, slideIndex = 0, options = {}) => {
    const slides = buildSlides(session);
    const slide = slides[slideIndex];
    if (!slide) {
      return;
    }

    const {
      entryMode = PRESENTATION_ENTRY_MODE.FULL,
      hasReturnEntry = false,
      replace = false,
      returnHash = "",
    } = options;
    const returnPath = buildMeetupPath(session.slug);
    const currentPresentationState = getPresentationHistoryState();
    const isAlreadyInPresentation = window.location.hash.startsWith("#/slides/");

    let nextReplace = replace;
    let nextState;

    if (isAlreadyInPresentation) {
      const mode = currentPresentationState?.mode ?? entryMode;
      const depth =
        mode === PRESENTATION_ENTRY_MODE.ITEM
          ? 1
          : (currentPresentationState?.depth ?? 0) + 1;

      nextReplace = mode === PRESENTATION_ENTRY_MODE.ITEM;
      nextState = {
        presentation: {
          mode,
          depth,
          hasReturnEntry: currentPresentationState?.hasReturnEntry ?? hasReturnEntry,
          returnPath: currentPresentationState?.returnPath ?? returnPath,
          returnHash: currentPresentationState?.returnHash ?? returnHash,
        },
      };
    } else {
      nextState = {
        presentation: {
          mode: entryMode,
          depth: 1,
          hasReturnEntry,
          returnPath,
          returnHash,
        },
      };
    }

    setPathname(returnPath, {
      hash: buildSlideHash(session, slide),
      replace: nextReplace,
      state: nextState,
    });
    syncLocationState();
  };

  const openPresentationFromItem = (session, item, returnHash) => {
    const slideIndex = findTopicSlideIndex(session, item);
    if (slideIndex === -1) {
      return;
    }

    const returnPath = buildMeetupPath(session.slug);
    setPathname(returnPath, {
      hash: returnHash,
      replace: true,
      state: window.history.state,
    });

    openPresentation(session, slideIndex, {
      entryMode: PRESENTATION_ENTRY_MODE.ITEM,
      hasReturnEntry: true,
      returnHash,
    });
  };

  const closePresentation = (session) => {
    const presentationState = getPresentationHistoryState();
    if (presentationState?.hasReturnEntry && presentationState?.depth) {
      window.history.go(-presentationState.depth);
      return;
    }

    goToMeetup(session, {
      replace: true,
      hash: presentationState?.returnHash ?? "",
    });
  };

  if (route.name === APP_ROUTE.CALENDAR) {
    return (
      <CalendarView
        calendarEntries={calendarEntries}
        nextSession={nextCalendarEntry}
        onClose={() => goToNextMeetupOrHome({ replace: true })}
        onOpenRoute={openRoute}
      />
    );
  }

  if (route.name === APP_ROUTE.SUBMIT_LINK) {
    return (
      <SubmissionScreen
        kind="link"
        meetup={nextMeetup}
        onBack={() => goToNextMeetupOrHome({ replace: true })}
        onOpenRoute={openRoute}
      />
    );
  }

  if (route.name === APP_ROUTE.SUBMIT_SHOWCASE) {
    return (
      <SubmissionScreen
        kind="showcase"
        meetup={nextMeetup}
        onBack={() => goToNextMeetupOrHome({ replace: true })}
        onOpenRoute={openRoute}
      />
    );
  }

  if (route.name === APP_ROUTE.MEETUP) {
    const session = sessions.find((candidate) => candidate.slug === route.meetupSlug) ?? null;

    return (
      <>
        <MeetupDetailView
          session={session}
          meetupSlug={route.meetupSlug}
          nextMeetupId={nextMeetup?.id ?? null}
          onOpenRoute={openRoute}
          onOpenPresentation={(candidate) =>
            openPresentation(candidate, 0, {
              entryMode: PRESENTATION_ENTRY_MODE.FULL,
              hasReturnEntry: true,
              returnHash:
                window.location.pathname === buildMeetupPath(candidate.slug) &&
                !window.location.hash.startsWith("#/slides/")
                  ? window.location.hash
                  : "",
            })
          }
          onOpenTopicPresentation={(item, topicId) =>
            openPresentationFromItem(session, item, `#${topicId}`)
          }
        />
        {presentationState?.session ? (
          <PresentationMode
            session={presentationState.session}
            currentIndex={presentationState.slideIndex}
            onNavigate={(slideIndex) => openPresentation(presentationState.session, slideIndex)}
            onExit={() => closePresentation(presentationState.session)}
          />
        ) : null}
      </>
    );
  }

  return (
    <>
      <ArchiveView
        sessions={sessions}
        onOpenRoute={openRoute}
      />
      {presentationState?.session ? (
        <PresentationMode
          session={presentationState.session}
          currentIndex={presentationState.slideIndex}
          onNavigate={(slideIndex) => openPresentation(presentationState.session, slideIndex)}
          onExit={() => closePresentation(presentationState.session)}
        />
      ) : null}
    </>
  );
}
