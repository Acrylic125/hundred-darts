import { useEffect } from "react";
import type EventSubscriber from "./event-subscriber";

export default function useEventSubscriber<M>(
  eventSubscriber: EventSubscriber<M>,
  callback: (message: M) => void
) {
  useEffect(() => {
    const subscription = eventSubscriber.subscribe(callback);

    return () => {
      subscription.unsubscribe();
    };
  }, [eventSubscriber, callback]);
}
