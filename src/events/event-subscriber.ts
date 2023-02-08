export default class EventSubscriber<T> {
  private listeners: Set<(val: T) => void> = new Set();

  public subscribe(listener: (val: T) => void): () => void {
    this.listeners.add(listener);
    return () => this.unsubscribe(listener);
  }

  public unsubscribe(listener: (val: T) => void): void {
    this.listeners.delete(listener);
  }

  public publish(val: T): void {
    this.listeners.forEach((listener) => listener(val));
  }
}
