export function createLatestValueRef(initialValue) {
  return { current: initialValue };
}

export function updateLatestValueRef(ref, value) {
  ref.current = value;
  return ref;
}
