import { COMMUNITY_SLOT_LABEL, LINK_SUBMISSION_PATH, SHOWCASE_SUBMISSION_PATH } from "../../app/constants.js";
import RouteLink from "../../components/RouteLink.jsx";

export default function ArchiveShell({ children, onOpenRoute }) {
  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-left">
          <RouteLink to="/" onOpenRoute={onOpenRoute} className="brand brand-link">
            <span className="brand-mark">$</span>
            <div>
              <p className="eyebrow">Austin AI Club</p>
              <h1>austinai.club</h1>
            </div>
          </RouteLink>
        </div>
        <div className="topbar-right">
          <RouteLink to={LINK_SUBMISSION_PATH} onOpenRoute={onOpenRoute} className="topbar-link">
            submit link
          </RouteLink>
          <RouteLink to={SHOWCASE_SUBMISSION_PATH} onOpenRoute={onOpenRoute} className="topbar-link">
            showcase
          </RouteLink>
          <RouteLink to="/calendar" onOpenRoute={onOpenRoute} className="calendar-open-btn">
            calendar
          </RouteLink>
        </div>
      </header>

      {children}

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
          <RouteLink to={LINK_SUBMISSION_PATH} onOpenRoute={onOpenRoute}>
            Submit link
          </RouteLink>
          <RouteLink to={SHOWCASE_SUBMISSION_PATH} onOpenRoute={onOpenRoute}>
            {COMMUNITY_SLOT_LABEL}
          </RouteLink>
          <a href="/topics/README.md">Meetup notes</a>
        </div>
      </footer>
    </div>
  );
}
