import { EventSubscriber } from "@/events";
import useEventSubscriber from "@/events/useEventSubscriber";
import { api } from "@/utils/api";
import useLocalIdRemap from "@/utils/useLocalIdRemap";
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
import { useState } from "react";
import Dart from "./Dart";

const createDartSubscriber = new EventSubscriber<{
  content?: string;
}>();

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
  const localIds = useLocalIdRemap();
  useEventSubscriber(createDartSubscriber, async ({ content }) => {
    await createDart({
      dartBoardId,
      text: content ?? "",
    });
    // console.log("result", result);
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
  const { mutateAsync: createDart } = api.dart.createDart.useMutation({
    onMutate: ({ text, dartBoardId }) => {
      const localId = localIds.newLocalId();
      setEdittedDartId(localId);
      setDarts((prev) => {
        if (prev === null) {
          return null;
        }
        return [
          ...prev,
          {
            id: localId,
            text,
            dartBoardId,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          },
        ];
      });

      return {
        localId,
      };
    },
    onSuccess: (data, variables, context) => {
      if (data !== null && context) {
        localIds.bindLocalId(context.localId, data.id);
      }
    },
    onError: (error, variables, context) => {
      if (!context) {
        return;
      }
      setDarts((prev) => {
        if (prev === null) {
          return null;
        }
        return prev.filter((d) => d.id !== context.localId);
      });
    },
  });
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

                  const runDeleteDart = (id: string) => {
                    void deleteDart(
                      {
                        dartId: id,
                      },
                      {
                        onError: (err) => {
                          console.error(err);
                          setDarts((prev) => {
                            if (prev === null) {
                              return null;
                            }
                            return [...prev, dart];
                          });
                        },
                      }
                    );
                  };

                  if (localIds.isLocalId(dart.id)) {
                    localIds.runForBounded(dart.id, runDeleteDart);
                    return;
                  }
                  runDeleteDart(dart.id);
                }}
                onRequestDuplicate={() => {
                  void createDart({
                    dartBoardId,
                    text: dart.text,
                  });
                }}
                onRequestClose={() => {
                  setEdittedDartId(null);
                }}
                onRequestSave={(content) => {
                  const runUpdateDart = (id: string) => {
                    void updateDart({
                      dartId: id,
                      text: content,
                    });
                  };

                  if (localIds.isLocalId(dart.id)) {
                    localIds.runForBounded(dart.id, runUpdateDart);
                    return;
                  }
                  runUpdateDart(dart.id);
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
