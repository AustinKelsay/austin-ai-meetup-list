export function TopicEmbed({ embed }) {
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
          {embed.author ? <>- {embed.author} </> : null}
          <a href={embed.href}>
            {embed.date ?? embed.href.replace("?ref_src=twsrc%5Etfw", "")}
          </a>
        </blockquote>
        <span className="embed-caption">
          Embedded post{" "}
          <a href={embed.href} target="_blank" rel="noreferrer">
            open direct
          </a>
        </span>
      </div>
    );
  }

  return null;
}

export function VideoEmbed({ video }) {
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

export function Topic({ item }) {
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

export function LinkCard({ href }) {
  const meta = parseLinkMeta(href);

  if (meta.kind === "github") {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="link-card link-card--github">
        <svg className="link-card-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
        <div className="link-card-body">
          <span className="link-card-domain">github.com</span>
          <span className="link-card-title">{meta.owner}/{meta.repo}</span>
          <span className="link-card-hint">Open repository -&gt;</span>
        </div>
      </a>
    );
  }

  if (meta.kind === "x") {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="link-card link-card--x">
        <svg className="link-card-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <div className="link-card-body">
          <span className="link-card-domain">x.com</span>
          <span className="link-card-title">View post</span>
          <span className="link-card-hint">Open on X -&gt;</span>
        </div>
      </a>
    );
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className="link-card link-card--generic">
      <svg className="link-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
      <div className="link-card-body">
        <span className="link-card-domain">{meta.host}</span>
        {meta.path ? <span className="link-card-title">{meta.path}</span> : null}
        <span className="link-card-hint">Open link -&gt;</span>
      </div>
    </a>
  );
}

export function LinkPair({ links }) {
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
