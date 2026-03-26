import { useEffect, useState } from "react";
import { sessions } from "./data.js";
import { APP_ROUTE } from "./app/constants.js";
import { getAppRoute, setHash, setPathname } from "./app/routes.js";
import ArchiveView from "./features/archive/ArchiveView.jsx";
import {
  buildCalendarEntries,
  getNextSubmissionMeetup,
} from "./features/calendar/calendar.js";
import CalendarView from "./features/calendar/CalendarView.jsx";
import PresentationMode from "./features/presentation/PresentationMode.jsx";
import {
  buildSlideHash,
  buildSlides,
  resolvePresentationHash,
} from "./features/presentation/slides.js";
import SubmissionScreen from "./features/submissions/SubmissionScreen.jsx";

export default function App() {
  const [presentationState, setPresentationState] = useState(() =>
    resolvePresentationHash(sessions, window.location.hash),
  );
  const [route, setRoute] = useState(() => getAppRoute(window.location.pathname));
  const calendarEntries = buildCalendarEntries(sessions);
  const nextMeetup = getNextSubmissionMeetup(sessions);
  const nextSession =
    calendarEntries.find((entry) => new Date(entry.event.endAt).getTime() >= Date.now()) ?? null;

  const openRoute = (pathname, options = {}) => {
    setPathname(pathname, options);
    setRoute(getAppRoute(pathname));
  };

  const closeAuxRoute = () => {
    openRoute("/", { replace: true });
  };

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
      setRoute(getAppRoute(window.location.pathname));
      const next = resolvePresentationHash(sessions, window.location.hash);

      if (next?.invalidHash !== undefined) {
        setPresentationState(null);
        if (next.invalidHash) {
          setHash(next.invalidHash);
        }
        return;
      }

      setPresentationState(next);
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
    if (route === APP_ROUTE.HOME) {
      return undefined;
    }

    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        closeAuxRoute();
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [route]);

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

  if (route === APP_ROUTE.CALENDAR) {
    return (
      <CalendarView
        calendarEntries={calendarEntries}
        nextSession={nextSession}
        onClose={closeAuxRoute}
      />
    );
  }

  if (route === APP_ROUTE.SUBMIT_LINK) {
    return (
      <SubmissionScreen
        kind="link"
        meetup={nextMeetup}
        onBack={closeAuxRoute}
        onOpenRoute={openRoute}
      />
    );
  }

  if (route === APP_ROUTE.SUBMIT_SHOWCASE) {
    return (
      <SubmissionScreen
        kind="showcase"
        meetup={nextMeetup}
        onBack={closeAuxRoute}
        onOpenRoute={openRoute}
      />
    );
  }

  return (
    <>
      <ArchiveView
        sessions={sessions}
        nextMeetupId={nextMeetup?.id ?? null}
        onOpenRoute={openRoute}
        onOpenPresentation={(session) => openPresentation(session, 0)}
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
