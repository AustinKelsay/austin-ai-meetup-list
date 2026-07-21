import { createElement } from "react";
import { buildWikiPath } from "../../app/routes.js";
import RouteLink from "../../components/RouteLink.jsx";
import { normalizeWikiId } from "./wikiIds.js";

function renderInline(text, onOpenRoute, pagesById) {
  const pattern = /(\[\[[^\]\n]+\]\]|\[[^\]\n]+\]\([^)\n]+\)|\*\*[^*\n]+\*\*|`[^`\n]+`)/g;
  const parts = [];
  let cursor = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) {
      parts.push(text.slice(cursor, match.index));
    }

    const token = match[0];
    const key = `${match.index}-${token}`;

    if (token.startsWith("[[")) {
      const [rawTarget, alias] = token.slice(2, -2).split("|");
      const target = rawTarget.trim();
      const targetId = normalizeWikiId(target);
      const label = (alias || target).trim();
      if (pagesById[targetId]) {
        parts.push(
          <RouteLink
            key={key}
            to={buildWikiPath(targetId)}
            onOpenRoute={onOpenRoute}
            className="wiki-markdown-wikilink"
          >
            {label}
          </RouteLink>,
        );
      } else {
        parts.push(
          <span key={key} className="wiki-markdown-wikilink--unresolved">
            {label}
          </span>,
        );
      }
    } else if (token.startsWith("[")) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      const href = linkMatch[2];
      const external = /^https?:\/\//i.test(href);
      parts.push(
        <a
          key={key}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
        >
          {linkMatch[1]}
        </a>,
      );
    } else if (token.startsWith("**")) {
      parts.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else {
      parts.push(<code key={key}>{token.slice(1, -1)}</code>);
    }

    cursor = pattern.lastIndex;
  }

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return parts;
}

function parseMarkdownBlocks(markdown, pageTitle) {
  const lines = markdown.split("\n");
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line) {
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2].trim();
      if (!(level === 1 && text === pageTitle)) {
        blocks.push({ type: "heading", level, text });
      }
      index += 1;
      continue;
    }

    const listItem = line.match(/^([-*+]\s+|\d+\.\s+)(.+)$/);
    if (listItem) {
      const ordered = /^\d/.test(listItem[1]);
      const items = [];
      while (index < lines.length) {
        const next = lines[index].trim().match(/^([-*+]\s+|\d+\.\s+)(.+)$/);
        if (!next || /^\d/.test(next[1]) !== ordered) {
          break;
        }
        items.push(next[2]);
        index += 1;
      }
      blocks.push({ type: "list", ordered, items });
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (index < lines.length) {
      const next = lines[index].trim();
      if (!next || /^(#{1,6})\s+/.test(next) || /^([-*+]\s+|\d+\.\s+)/.test(next)) {
        break;
      }
      paragraph.push(next);
      index += 1;
    }
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }

  return blocks;
}

export function WikiMarkdownBody({ markdown, pageTitle, pagesById, onOpenRoute }) {
  if (!markdown) {
    return null;
  }

  const blocks = parseMarkdownBlocks(markdown, pageTitle);

  return (
    <section className="wiki-markdown-reading" aria-label={`${pageTitle} Wiki page body`}>
      <p className="eyebrow">Read Wiki Page</p>
      <div className="wiki-markdown-body">
        {blocks.map((block, index) => {
          if (block.type === "heading") {
            return createElement(
              `h${block.level}`,
              { key: `heading-${index}` },
              renderInline(block.text, onOpenRoute, pagesById),
            );
          }

          if (block.type === "list") {
            const List = block.ordered ? "ol" : "ul";
            return (
              <List key={`list-${index}`}>
                {block.items.map((item, itemIndex) => (
                  <li key={`${itemIndex}-${item}`}>
                    {renderInline(item, onOpenRoute, pagesById)}
                  </li>
                ))}
              </List>
            );
          }

          return (
            <p key={`paragraph-${index}`}>
              {renderInline(block.text, onOpenRoute, pagesById)}
            </p>
          );
        })}
      </div>
    </section>
  );
}
