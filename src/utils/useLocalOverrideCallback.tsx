import { useEffect, useRef } from "react";

export default function useLocalOverrideTimeout(
  callback: () => void,
  delay: number
) {
  const savedCallback = useRef<ReturnType<typeof setTimeout> | null>();

  // Set up the timeout.
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (savedCallback.current) clearTimeout(savedCallback.current);
    };
  }, []);

  return {
    start: () => {
      if (savedCallback.current) clearTimeout(savedCallback.current);
      savedCallback.current = setTimeout(callback, delay);
    },
    cancelCurrent: () => {
      if (savedCallback.current) clearTimeout(savedCallback.current);
    },
  };
}
