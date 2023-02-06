import DashboardSidebar from "@/components/DashboardSidebar";
import { api } from "@/utils/api";
import {
  Box,
  Button,
  Container,
  Modal,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

const DartBoard = ({ dartBoardId }: { dartBoardId: string }) => {
  const [dart, setDart] = useState("");
  const { data: dartBoard, isLoading: dartBoardIsLoading } =
    api.dart.getDartBoard.useQuery({
      dartBoardId,
    });
  const { data: darts, isLoading: dartsIsLoading } =
    api.dart.getAllDartsForBoard.useQuery({
      dartBoardId,
    });
  const { mutateAsync: createDart } = api.dart.createDart.useMutation();

  return (
    <Stack direction="column" gap={2}>
      <Typography
        sx={{
          width: "50%",
          fontWeight: "bold",
        }}
        variant="h4"
        component="h1"
      >
        {dartBoardIsLoading ? <Skeleton /> : dartBoard?.name}
      </Typography>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={async (e) => {
          e.preventDefault();
          await createDart({
            dartBoardId,
            text: dart,
          });
          setDart("");
        }}
      >
        <Stack direction="row" gap={1}>
          {dartBoardIsLoading ? (
            <Skeleton
              sx={{
                width: "100%",
                height: 64,
              }}
            />
          ) : (
            <>
              <TextField
                name="Type out your dart here"
                placeholder="Type out your dart here"
                value={dart}
                onChange={(e) => setDart(e.target.value)}
                multiline
                fullWidth
              />
              <Button variant="contained" type="submit">
                <Typography variant="button">Add</Typography>
              </Button>
            </>
          )}
        </Stack>
      </form>

      <Grid spacing={2} container>
        {dartsIsLoading ? (
          <>
            <Grid item xs={12}>
              <Skeleton />
            </Grid>
            <Grid item xs={12}>
              <Skeleton />
            </Grid>
          </>
        ) : (
          darts?.map((dart) => (
            <Grid key={dart.id} item xs={12} sm={6} lg={4}>
              <Box
                sx={{
                  backgroundColor: "grey.800",
                  padding: 2,
                  borderRadius: 2,
                }}
              >
                {dart.text}
              </Box>
            </Grid>
          ))
        )}
      </Grid>
    </Stack>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const isGreaterThanMd = useMediaQuery(theme.breakpoints.up("md"));
  const [smallVPSidebarCollapsed, setSmallVPSidebarCollapsed] = useState(false);
  const { data, status } = useSession({
    required: true,
  });
  const [selectedDartBoardId, setSelectedDartBoardId] = useState<string | null>(
    null
  );
  const router = useRouter();

  if (status === "loading") {
    return <></>;
  }
  // if (status !== "authenticated") {
  //   void signIn();
  //   return <></>;
  // }

  if (router.query.userId !== data?.user?.id) {
    void router.push(`/dashboard/${data?.user?.id || ""}`);
    return <></>;
  }

  return (
    <Container maxWidth="xl">
      <Stack
        sx={({ spacing }) => ({
          padding: spacing(6, 4),
        })}
        direction="row"
        gap={4}
      >
        {isGreaterThanMd ? (
          <DashboardSidebar
            selectedDartBoardId={selectedDartBoardId}
            onSelectDartBoard={setSelectedDartBoardId}
            sx={({ breakpoints }) => ({
              width: 280,
              height: "100%",
              [breakpoints.up("lg")]: {
                width: 340,
              },
            })}
            userId={data?.user?.id || ""}
          />
        ) : (
          <Modal
            open={!smallVPSidebarCollapsed}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
            onClose={() => {
              setSmallVPSidebarCollapsed(true);
            }}
          >
            <Box
              sx={({ spacing }) => ({
                width: "70%",
                maxHeight: "100vh",
                backgroundColor: "grey.900",
                padding: spacing(4, 4),
                color: "grey.50",
              })}
            >
              <DashboardSidebar
                collapsable
                onCollapse={() => {
                  setSmallVPSidebarCollapsed(true);
                }}
                sx={() => ({
                  height: "100%",
                  overflow: "auto",
                  backgroundColor: "grey.900",
                  color: "grey.50",
                })}
                userId={data?.user?.id || ""}
              />
            </Box>
          </Modal>
        )}
        <Stack
          sx={{
            flexGrow: 1,
          }}
          direction="column"
        >
          <DartBoard dartBoardId={selectedDartBoardId || ""} />
        </Stack>
      </Stack>
    </Container>
  );
};

export default Dashboard;

Dashboard.auth = true;
