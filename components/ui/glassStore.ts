const cards = new Set<HTMLElement>();
const listeners = new Set<() => void>();

export function registerCard(el: HTMLElement) {
  cards.add(el);
  listeners.forEach((cb) => cb());
}

export function unregisterCard(el: HTMLElement) {
  cards.delete(el);
  listeners.forEach((cb) => cb());
}

export function subscribeCards(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getCardElements(): HTMLElement[] {
  return Array.from(cards);
}
