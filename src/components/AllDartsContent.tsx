import { EventSubscriber } from "@/events";
import useEventSubscriber from "@/events/useEventSubscriber";
import { api } from "@/utils/api";
import {
  Box,
  Button,
  Grid,
  InputBase,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import type { Dart as DartType } from "@prisma/client";
import { useRef, useState } from "react";
import Dart from "./Dart";

const createDartSubscriber = new EventSubscriber<{
  content?: string;
}>();

type LocalId = string;

function useLocalIdRemap() {
  const [localIdRemap, setLocalIdRemap] = useState<Map<LocalId, string | null>>(
    new Map()
  );
  const counter = useRef(0);

  return {
    newLocalId: (): LocalId => {
      const newId = `local-${counter.current}`;
      counter.current += 1;
      setLocalIdRemap((prev) => {
        const newMap = new Map(prev);
        newMap.set(newId, null);
        return newMap;
      });
      return newId;
    },
    bindLocalId: (localId: LocalId, remoteId: string) => {
      setLocalIdRemap((prev) => {
        const newMap = new Map(prev);
        newMap.set(localId, remoteId);
        return newMap;
      });
    },
    getMappedId: (localId: LocalId) => {
      return localIdRemap.get(localId);
    },
  };
}

const AllDartsExtras = () => {
  return (
    <Stack direction="row" gap={1}>
      <Stack direction="row" gap={1}>
        <Box
          sx={() => ({
            backgroundColor: "grey.800",
            borderRadius: 2,
          })}
        >
          <InputBase
            sx={({ spacing }) => ({
              color: "grey.300",
              padding: spacing(1, 2),
            })}
            placeholder="Search"
            name="Search"
            fullWidth
          />
        </Box>
        <Button
          onClick={() => {
            createDartSubscriber.publish({});
          }}
          variant="contained"
        >
          <Typography variant="button">New Dart</Typography>
        </Button>
      </Stack>
    </Stack>
  );
};

const AllDartsContent = ({ dartBoardId }: { dartBoardId: string }) => {
  const [edittedDartId, setEdittedDartId] = useState<string | null>(null);
  const [darts, setDarts] = useState<DartType[] | null>(null);
  const { newLocalId, bindLocalId, getMappedId } = useLocalIdRemap();
  useEventSubscriber(createDartSubscriber, ({ content }) => {
    const localId = newLocalId();
    setEdittedDartId(localId);
    setDarts((prev) => {
      if (prev === null) {
        return null;
      }
      return [
        ...prev,
        {
          id: localId,
          text: content ?? "",
          dartBoardId,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];
    });
    void createDart(
      {
        dartBoardId,
        text: content ?? "",
      },
      {
        onSuccess: (data) => {
          if (data !== null) {
            bindLocalId(localId, data.id);
          }
        },
      }
    );
  });
  const { isLoading: dartsIsLoading } = api.dart.getAllDartsForBoard.useQuery(
    {
      dartBoardId,
    },
    {
      onSuccess: (data) => {
        setDarts(data);
      },
    }
  );
  const { mutateAsync: createDart } = api.dart.createDart.useMutation();
  const { mutateAsync: updateDart } = api.dart.updateDart.useMutation();
  const { mutateAsync: deleteDart } = api.dart.deleteDart.useMutation();

  return (
    <Grid spacing={2} container>
      {dartsIsLoading ? (
        <>
          <Grid item xs={12}>
            <Skeleton height={64} />
          </Grid>
        </>
      ) : (
        darts
          ?.sort((a, b) => {
            return b.createdAt.getTime() - a.createdAt.getTime();
          })
          .map((dart) => (
            <Grid key={dart.id} item xs={12} sm={6} lg={4}>
              <Dart
                content={dart.text}
                onRequestEdit={() => {
                  setEdittedDartId(dart.id);
                }}
                onRequestDelete={() => {
                  setDarts((prev) => {
                    if (prev === null) {
                      return null;
                    }
                    return prev.filter((d) => d.id !== dart.id);
                  });
                  void deleteDart(
                    {
                      dartId: getMappedId(dart.id) ?? dart.id,
                    },
                    {
                      onError: () => {
                        setDarts((prev) => {
                          if (prev === null) {
                            return null;
                          }
                          return [...prev, dart];
                        });
                      },
                    }
                  );
                }}
                onRequestDuplicate={() => {
                  const localId = newLocalId();
                  setEdittedDartId(null);
                  setDarts((prev) => {
                    if (prev === null) {
                      return null;
                    }
                    return [
                      ...prev,
                      {
                        id: localId,
                        text: dart.text + " duplicated",
                        dartBoardId,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        deletedAt: null,
                      },
                    ];
                  });
                  void createDart(
                    {
                      dartBoardId,
                      text: dart.text,
                    },
                    {
                      onSuccess: (data) => {
                        if (data !== null) {
                          bindLocalId(localId, data.id);
                        }
                      },
                      onError: () => {
                        setDarts((prev) => {
                          if (prev === null) {
                            return null;
                          }
                          return prev.filter((d) => d.id !== localId);
                        });
                      },
                    }
                  );
                }}
                onRequestClose={() => {
                  setEdittedDartId(null);
                }}
                onRequestSave={(content) => {
                  void updateDart({
                    dartId: getMappedId(dart.id) ?? dart.id,
                    text: content,
                  });
                }}
                editMode={edittedDartId === dart.id}
                autoFocusOnEdit
              />
            </Grid>
          ))
      )}
    </Grid>
  );
};

export { AllDartsContent, AllDartsExtras };
