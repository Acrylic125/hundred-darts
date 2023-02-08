import EventSubscriber from "./event-subscriber";

const subscribers = {
  darts: {
    create: new EventSubscriber<{
      content: string;
    }>(),
  },
};

export default subscribers;
