export type Listener<T> = (val: T) => void | Promise<void>;

export default class EventSubscriber<T> {
  private listeners: Set<Listener<T>> = new Set();

  public subscribe(listener: Listener<T>) {
    this.listeners.add(listener);

    const unsubscribe = () => this.unsubscribe(listener);

    return {
      unsubscribe,
    };
  }

  public unsubscribe(listener: Listener<T>): void {
    this.listeners.delete(listener);
  }

  public publish(val: T): void {
    this.listeners.forEach((listener) => void listener(val));
  }
}
