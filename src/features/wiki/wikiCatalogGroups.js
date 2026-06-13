const DEFAULT_GROUP_ORDER = ["meetup", "entity", "concept", "comparison", "query", "summary"];

export function getGroupOrder(knownTypes) {
  const knownList = [...knownTypes];
  const order = [...DEFAULT_GROUP_ORDER];
  const seen = new Set(order);

  for (const type of knownList) {
    if (!seen.has(type)) {
      order.push(type);
      seen.add(type);
    }
  }

  return order.filter((type) => knownTypes instanceof Set ? knownTypes.has(type) || DEFAULT_GROUP_ORDER.includes(type) : knownList.includes(type) || DEFAULT_GROUP_ORDER.includes(type));
}

export function groupPagesByType(pages, knownTypes) {
  const observedTypes = new Set(pages.map((page) => page.type));
  const combined =
    knownTypes instanceof Set
      ? new Set([...knownTypes, ...observedTypes])
      : new Set([...(knownTypes ?? []), ...observedTypes]);

  const order = getGroupOrder(combined);
  const groups = new Map(order.map((type) => [type, []]));

  for (const page of pages) {
    if (!groups.has(page.type)) {
      groups.set(page.type, []);
    }
    groups.get(page.type).push(page);
  }

  return order
    .map((type) => ({ type, pages: groups.get(type) ?? [] }))
    .filter((group) => group.pages.length > 0);
}
