import { useEffect, useRef } from "react";

export type LocalId = string;

export default function useLocalIdRemap() {
  const localIdRemapRef = useRef(new Map<LocalId, string | null>());
  const unboundedLocalIdSubscriptions = useRef(
    new Map<LocalId, ((boundedId: string) => void)[]>()
  );
  const counter = useRef(0);

  return {
    clear: () => {
      localIdRemapRef.current.clear();
      unboundedLocalIdSubscriptions.current.clear();
      counter.current = 0;
    },
    newLocalId: (): LocalId => {
      const newLocalId = `local-${counter.current}`;
      counter.current += 1;
      localIdRemapRef.current.set(newLocalId, null);
      unboundedLocalIdSubscriptions.current.set(newLocalId, []);
      return newLocalId;
    },
    bindLocalId: (localId: LocalId, boundedId: string) => {
      if (localIdRemapRef.current.get(localId) !== null) {
        throw new Error("Local ID already bound");
      }
      localIdRemapRef.current.set(localId, boundedId);
      unboundedLocalIdSubscriptions.current
        .get(localId)
        ?.forEach((callback) => callback(boundedId));
      unboundedLocalIdSubscriptions.current.delete(localId);
    },
    isLocalId: (id: string) => {
      return id.startsWith("local-") && localIdRemapRef.current.has(id);
    },
    isLocalIdBounded: (id: string) => {
      return localIdRemapRef.current.get(id) !== null;
    },
    getMappedId: (localId: LocalId) => {
      return localIdRemapRef.current.get(localId);
    },
    getLocalId: (boundedId: string) => {
      for (const [localId, maybeRemoteId] of localIdRemapRef.current) {
        if (maybeRemoteId === boundedId) {
          return localId;
        }
      }
      return null;
    },
    runForBounded: (
      localId: LocalId,
      callback: (boundedId: string) => void
    ) => {
      const maybeBoundedId = localIdRemapRef.current.get(localId);
      if (maybeBoundedId !== null && maybeBoundedId !== undefined) {
        callback(maybeBoundedId);
        return;
      }
      const callbacks = unboundedLocalIdSubscriptions.current.get(localId);
      if (callbacks === undefined) {
        unboundedLocalIdSubscriptions.current.set(localId, [callback]);
        return;
      }
      callbacks.push(callback);
    },
  };
}
