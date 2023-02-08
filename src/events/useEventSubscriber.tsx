import { useEffect } from "react";
import type EventSubscriber from "./event-subscriber";
import type { Listener } from "./event-subscriber";

export default function useEventSubscriber<T>(
  eventSubscriber: EventSubscriber<T>,
  callback: Listener<T>
) {
  useEffect(() => {
    const subscription = eventSubscriber.subscribe(callback);

    return () => {
      subscription.unsubscribe();
    };
  }, [eventSubscriber, callback]);
}
