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
import Image from "next/image";
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
  const { mutateAsync: deleteDart } = api.dart.deleteDart.useMutation({
    onMutate: ({ dartId: $dartId }) => {
      const maybeLocalId = localIds.getLocalId($dartId);
      const dartId = maybeLocalId ?? $dartId;

      const dart = darts?.find((dart) => dart.id === dartId);
      setDarts((prev) => {
        if (prev === null) {
          return null;
        }
        return prev.filter((d) => d.id !== dartId);
      });

      return {
        dart,
      };
    },
    onError: (error, variables, context) => {
      if (!context) {
        return;
      }
      setDarts((prev) => {
        if (prev === null) {
          return null;
        }
        if (context.dart === undefined) {
          return prev;
        }
        return [...prev, context.dart];
      });
    },
  });

  if (!dartsIsLoading && darts && darts.length === 0) {
    return (
      <Stack
        sx={({ spacing }) => ({
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          paddingY: spacing(8),
        })}
        gap={5}
      >
        <Box
          sx={({ breakpoints }) => ({
            position: "relative",
            width: 96,
            height: 96,
            [breakpoints.up("md")]: {
              width: 128,
              height: 128,
            },
            [breakpoints.up("lg")]: {
              width: 186,
              height: 186,
            },
          })}
        >
          <Image src="/empty_blob.svg" alt="Empty Blob" fill />
        </Box>
        <Stack
          sx={{
            alignItems: "center",
          }}
          gap={1}
        >
          <Typography
            sx={{
              color: "grey.100",
              fontWeight: "bold",
              textAlign: "center",
            }}
            variant="h5"
            component="h4"
          >
            No Darts
          </Typography>
          <Typography
            sx={{
              color: "grey.400",
              textAlign: "center",
            }}
            variant="body1"
            component="p"
          >
            Click “New Dart” to add a dart
            <br />
            to this dart board
          </Typography>
        </Stack>
      </Stack>
    );
  }

  return (
    <Grid
      sx={({ spacing }) => ({
        paddingY: spacing(2),
      })}
      spacing={2}
      container
    >
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
                  const runDeleteDart = (id: string) => {
                    void deleteDart({
                      dartId: id,
                    });
                  };

                  if (localIds.isLocalId(dart.id)) {
                    localIds.runForBounded(dart.id, (boundedId) => {
                      runDeleteDart(boundedId);
                    });
                    return;
                  }
                  runDeleteDart(dart.id);
                }}
                onRequestDuplicate={(text) => {
                  void createDart({
                    dartBoardId,
                    text,
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
