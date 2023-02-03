import {
  Box,
  Button,
  Container,
  InputBase,
  List,
  ListItemButton,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { api } from "../utils/api";
import CreateDartBoardModal from "./CreateDartBoardModal";

const DashboardSidebar = ({ userId }: { userId: string }) => {
  const utils = api.useContext();
  const [createDartBoardModal, setCreateDartBoardModal] = useState(false);
  const { data: dartBoards } = api.dart.getAllDartBoards.useQuery({
    userId,
  });
  const { mutateAsync: createDartBoard, isLoading: createDartBoardIsLoading } =
    api.dart.createDartBoard.useMutation({
      onSuccess: async () => {
        await utils.dart.getAllDartBoards.invalidate();
      },
    });

  return (
    <Container maxWidth="xl">
      <CreateDartBoardModal
        open={createDartBoardModal}
        loading={createDartBoardIsLoading}
        onClose={() => {
          setCreateDartBoardModal(false);
        }}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onCreate={async ({ name }) => {
          await createDartBoard({
            name,
            userId,
          });
          setCreateDartBoardModal(false);
        }}
      />
      <Stack gap={1} direction="column">
        <Stack
          direction="row"
          gap={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            sx={{
              fontWeight: "bold",
              color: "grey.300",
            }}
            variant="body1"
            component="h2"
          >
            Dart Boards
          </Typography>
          <Button
            onClick={() => {
              setCreateDartBoardModal(true);
            }}
            variant="contained"
            color="primary"
            size="medium"
          >
            Create
          </Button>
        </Stack>
        <Box
          sx={{
            backgroundColor: "grey.800",
          }}
        >
          <InputBase
            sx={({ spacing }) => {
              return {
                color: "grey.300",
                padding: spacing(1, 2),
              };
            }}
            placeholder="Search Dart Board"
            name="Search Dart Board"
            fullWidth
          />
        </Box>
        {dartBoards !== undefined && dartBoards.length > 0 ? (
          <List>
            {dartBoards
              .sort((a, b) => {
                return b.createdAt.getTime() - a.createdAt.getTime();
              })
              .map((dartBoard) => {
                return (
                  <ListItemButton key={dartBoard.id}>
                    <Typography variant="body1" component="p">
                      {dartBoard.name}
                    </Typography>
                  </ListItemButton>
                );
              })}
          </List>
        ) : (
          <Typography variant="body1" component="p">
            No dart boards found
          </Typography>
        )}
      </Stack>
    </Container>
  );
};

export default DashboardSidebar;
