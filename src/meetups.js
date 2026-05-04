export function nextMeetupFromMeetups(meetupList, now = Date.now()) {
  return meetupList
    .filter((meetup) => meetup.event && new Date(meetup.event.endAt).getTime() >= now)
    .sort((a, b) => new Date(a.event.startAt).getTime() - new Date(b.event.startAt).getTime())[0] ?? null;
}
