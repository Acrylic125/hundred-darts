import { useRef } from "react";

export type LocalId = string;

export default function useLocalIdRemap() {
  const localIdRemapRef = useRef(new Map<LocalId, string | null>());
  const unboundedLocalIdSubscriptions = useRef(
    new Map<LocalId, ((boundedId: string) => void)[]>()
  );
  const counter = useRef(0);

  return {
    newLocalId: (): LocalId => {
      const newLocalId = `local-${counter.current}`;
      counter.current += 1;
      localIdRemapRef.current.set(newLocalId, null);
      unboundedLocalIdSubscriptions.current.set(newLocalId, []);
      return newLocalId;
    },
    bindLocalId: (localId: LocalId, remoteId: string) => {
      if (localIdRemapRef.current.get(localId) !== null) {
        throw new Error("Local ID already bound");
      }
      localIdRemapRef.current.set(localId, remoteId);
      unboundedLocalIdSubscriptions.current
        .get(localId)
        ?.forEach((callback) => callback(remoteId));
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
