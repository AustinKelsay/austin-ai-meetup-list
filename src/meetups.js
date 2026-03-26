export function nextMeetupFromSessions(sessionList, now = Date.now()) {
  return sessionList
    .filter((session) => session.event && new Date(session.event.endAt).getTime() >= now)
    .sort((a, b) => new Date(a.event.startAt).getTime() - new Date(b.event.startAt).getTime())[0] ?? null;
}
