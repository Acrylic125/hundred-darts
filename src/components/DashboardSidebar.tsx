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
import type { Session } from "next-auth";
import Image from "next/image";
import { useState } from "react";
import CreateDartBoardModal from "./CreateDartBoardModal";

const DashboardSidebar = ({
  sx,
  user,
  selectedDartBoardId,
  onSelectDartBoard,
  collapsable,
  onCollapse,
  userId,
}: {
  sx?: SxProps<Theme>;
  user: Session["user"];
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
        sx={({ spacing }) => ({
          position: "relative",
          paddingX: spacing(2),
        })}
        gap={1}
        direction="column"
      >
        <Stack
          sx={({ spacing }) => ({
            position: "sticky",
            paddingTop: spacing(4),
            top: 0,
            zIndex: 1,
          })}
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
            sx={({ shadows }) => ({
              backgroundColor: "grey.800",
              borderRadius: 2,
              boxShadow: shadows[4],
            })}
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
        <Stack
          sx={{
            position: "sticky",
            backgroundColor: "grey.900",
            paddingY: 2,
            bottom: 0,
            zIndex: 1,
            alignItems: "center",
          }}
          gap={2}
          direction="row"
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              position: "relative",
            }}
          >
            <Image
              src={user.image ?? "/default_pfp.png"}
              alt={(user.name ?? "User") + " Profile Picture"}
              fill
            />
          </Box>
          <Stack
            sx={{
              flexGrow: 1,
              justifyContent: "center",
            }}
            direction="column"
          >
            <Typography
              sx={{
                fontWeight: "bold",
              }}
              color="grey.100"
              variant="body2"
              component="h3"
            >
              {user.name ?? "User"}
            </Typography>
            <Typography
              sx={{
                wordBreak: "break-all",
              }}
              color="grey.500"
              variant="caption"
              component="p"
            >
              {user.email ?? "No Email"}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default DashboardSidebar;
