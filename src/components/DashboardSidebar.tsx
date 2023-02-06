import { api } from "@/utils/api";
import ClearIcon from "@mui/icons-material/Clear";
import type { SxProps, Theme } from "@mui/material";
import {
  Box,
  Button,
  InputBase,
  List,
  ListItemButton,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CreateDartBoardModal from "./CreateDartBoardModal";

const DashboardSidebar = ({
  sx,
  selectedDartBoardId,
  onSelectDartBoard,
  collapsable,
  onCollapse,
  userId,
}: {
  sx?: SxProps<Theme>;
  selectedDartBoardId?: string | null;
  onSelectDartBoard?: (dartBoardId: string | null) => void;
  collapsable?: boolean;
  onCollapse?: () => void;
  userId: string;
}) => {
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
    <Box sx={sx}>
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
      <Stack
        sx={{
          position: "relative",
        }}
        gap={1}
        direction="column"
      >
        <Stack
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
          bgcolor="grey.900"
          gap={1}
          direction="column"
        >
          {collapsable && (
            <Box>
              <Button
                sx={{
                  backgroundColor: "grey.800",
                }}
                onClick={() => {
                  onCollapse?.();
                }}
                variant="contained"
              >
                <ClearIcon />
              </Button>
            </Box>
          )}
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
              borderRadius: 2,
            }}
          >
            <InputBase
              sx={({ spacing }) => ({
                color: "grey.300",
                padding: spacing(1, 2),
              })}
              placeholder="Search Dart Board"
              name="Search Dart Board"
              fullWidth
            />
          </Box>
        </Stack>
        {dartBoards !== undefined && dartBoards.length > 0 ? (
          <List>
            {dartBoards
              .sort((a, b) => {
                return b.createdAt.getTime() - a.createdAt.getTime();
              })
              .map((dartBoard) => {
                return (
                  <ListItemButton
                    key={dartBoard.id}
                    onClick={() => {
                      onSelectDartBoard?.(dartBoard.id);
                    }}
                    selected={selectedDartBoardId === dartBoard.id}
                  >
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
    </Box>
  );
};

export default DashboardSidebar;
