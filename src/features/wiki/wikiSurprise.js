export function pickRandomPage(pages, { excludeMeetups = true, excludeId } = {}) {
  if (!pages?.length) {
    return null;
  }

  const candidates = pages.filter((page) => {
    if (excludeMeetups && page.type === "meetup") {
      return false;
    }
    if (excludeId && page.id === excludeId) {
      return false;
    }
    return true;
  });

  const pool = candidates.length > 0 ? candidates : pages;

  if (pool.length === 0) {
    return null;
  }

  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}
