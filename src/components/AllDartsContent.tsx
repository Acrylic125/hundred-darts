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
  useEventSubscriber(createDartSubscriber, ({ content }) => {
    void createDart({
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
  const { mutateAsync: createDart } = api.dart.createDart.useMutation();

  return (
    <Grid spacing={2} container>
      {dartsIsLoading ? (
        <>
          <Grid item xs={12}>
            <Skeleton height={64} />
          </Grid>
        </>
      ) : (
        darts?.map((dart) => (
          <Grid key={dart.id} item xs={12} sm={6} lg={4}>
            <Dart
              content={dart.text}
              onRequestEdit={() => {
                setEdittedDartId(dart.id);
              }}
              onRequestClose={() => {
                setEdittedDartId(null);
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
