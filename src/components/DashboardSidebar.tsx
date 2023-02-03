import {
  Box,
  Button,
  Container,
  InputBase,
  List,
  ListItemButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { DartBoard } from "@prisma/client";
import { useState } from "react";

const DashboardSidebar = ({ dartBoards }: { dartBoards: DartBoard[] }) => {
  const [createDartBoardModal, setCreateDartBoardModal] = useState(false);

  return (
    <Container maxWidth="xl">
      <Modal
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        open={createDartBoardModal}
        onClose={() => {
          setCreateDartBoardModal(false);
        }}
        aria-labelledby="Create Dart Board"
        aria-describedby="Modal to create a dart board"
      >
        <Stack
          sx={({ palette, spacing }) => ({
            width: "80%",
            maxWidth: 720,
            overflow: "auto",
            backgroundColor: "grey.900",
            color: "grey.50",
            borderTopWidth: 10,
            borderTopStyle: "solid",
            borderColor: palette.primary.main,
            borderRadius: 2,
            padding: spacing(4, 4),
          })}
          direction="column"
          gap={4}
        >
          <Typography
            sx={{
              fontWeight: "bold",
            }}
            variant="h4"
            component="h2"
          >
            Create Dart Board
          </Typography>
          <Stack gap={1} direction="column">
            <Typography variant="body1" component="p" color="grey.300">
              Name the dart board
            </Typography>
            <TextField
              placeholder="Dart Board Name"
              name="Dart Board Name"
              fullWidth
            />
          </Stack>
          <Stack direction="row" gap={1}>
            <Button variant="contained" size="large">
              <Typography variant="body1" component="p">
                Create
              </Typography>
            </Button>
            <Button
              onClick={() => {
                setCreateDartBoardModal(false);
              }}
              variant="text"
              size="large"
            >
              <Typography variant="body1" component="p">
                Cancel
              </Typography>
            </Button>
          </Stack>
        </Stack>
      </Modal>
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
            <ListItemButton selected>
              <Typography variant="body1" component="p">
                Hello
              </Typography>
            </ListItemButton>
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
