import DashboardSidebar from "@/components/DashboardSidebar";
import { api } from "@/utils/api";
import {
  Box,
  Button,
  Container,
  Modal,
  Skeleton,
  Stack,
  InputBase,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

function useLocalIdRemap() {
  const [localIdRemap, setLocalIdRemap] = useState<Map<string, string>>(
    new Map()
  );
  const [localIdCounter, setLocalIdCounter] = useState(0);

  return {
    newLocalId: () => {
      const newId = `local-${localIdCounter}`;
      setLocalIdCounter((prev) => prev + 1);
      return newId;
    },
    bindLocalId: (localId: string, remoteId: string) => {
      setLocalIdRemap((prev) => {
        const newMap = new Map(prev);
        newMap.set(localId, remoteId);
        return newMap;
      });
    },
    getMappedId: (localId: string) => {
      return localIdRemap.get(localId);
    },
  };
}

const DartBoardLayout = <
  T extends Record<
    string,
    {
      content: React.ReactNode;
      extras?: React.ReactNode;
    }
  >
>({
  dartBoardId,
  defaultSelectedTab,
  tabs,
}: {
  dartBoardId: string;
  defaultSelectedTab: keyof T;
  tabs: T;
}) => {
  const [selectedTab, setSelectedTab] = useState(defaultSelectedTab);
  const { data: dartBoard, isLoading: dartBoardIsLoading } =
    api.dart.getDartBoard.useQuery({
      dartBoardId,
    });

  return (
    <Stack direction="column" gap={2}>
      <Typography
        sx={({ spacing }) => ({
          width: "50%",
          paddingTop: spacing(4),
          fontWeight: "bold",
        })}
        variant="h4"
        component="h1"
      >
        {dartBoardIsLoading ? <Skeleton /> : dartBoard?.name}
      </Typography>
      <Stack direction="row" gap={1}>
        {dartBoardIsLoading ? (
          <Skeleton
            sx={{
              width: "100%",
              height: 64,
            }}
          />
        ) : (
          <Stack
            sx={{
              width: "100%",
              borderBottom: "1px solid",
              borderColor: "grey.700",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            direction="row"
          >
            <Tabs
              value={selectedTab}
              onChange={(e, value) => {
                if (typeof value === "string") setSelectedTab(value);
              }}
              aria-label="dashboard tabs"
            >
              {Object.keys(tabs).map((tab) => {
                return (
                  <Tab
                    sx={({ spacing }) => ({
                      paddingY: spacing(3),
                    })}
                    key={tab}
                    value={tab}
                    label={tab}
                  />
                );
              })}
            </Tabs>
            <Box>{selectedTab && tabs[selectedTab]?.extras}</Box>
          </Stack>
        )}
      </Stack>
      <Box>{selectedTab && tabs[selectedTab]?.content}</Box>
    </Stack>
  );
};

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
        <Button variant="contained">
          <Typography variant="button">New Dart</Typography>
        </Button>
      </Stack>
    </Stack>
  );
};

const AllDartsContent = ({ dartBoardId }: { dartBoardId: string }) => {
  const [edittedDartId, setEdittedDartId] = useState<string | null>(null);
  const { data: darts, isLoading: dartsIsLoading } =
    api.dart.getAllDartsForBoard.useQuery({
      dartBoardId,
    });
  const { mutateAsync: createDart } = api.dart.createDart.useMutation({
    // onSuccess: async () => {
    //   await utils.dart.getAllDartsForBoard.invalidate({
    //     dartBoardId,
    //   });
    // },
  });
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

// const AllDartsDartBoardContent = ({ dartBoardId }: { dartBoardId: string }) => {
//   const utils = api.useContext();
//   const [edittedDartId, setEdittedDartId] = useState<string | null>(null);
//   const { data: dartBoard, isLoading: dartBoardIsLoading } =
//     api.dart.getDartBoard.useQuery({
//       dartBoardId,
//     });
//   const { data: darts, isLoading: dartsIsLoading } =
//     api.dart.getAllDartsForBoard.useQuery({
//       dartBoardId,
//     });
//   const { mutateAsync: createDart } = api.dart.createDart.useMutation({
//     // onSuccess: async () => {
//     //   await utils.dart.getAllDartsForBoard.invalidate({
//     //     dartBoardId,
//     //   });
//     // },
//   });

//   return (
//     <DartBoardLayout
//       defaultSelectedTab="all"
//       dartBoardName={dartBoard?.name}
//       isLoading={dartBoardIsLoading}
//       extras={
//         <Stack direction="row" gap={1}>
//           {dartBoardIsLoading ? (
//             <Skeleton
//               sx={{
//                 width: "100%",
//                 height: 64,
//               }}
//             />
//           ) : (
//             <Stack direction="row" gap={1}>
//               <Box
//                 sx={() => ({
//                   backgroundColor: "grey.800",
//                   borderRadius: 2,
//                 })}
//               >
//                 <InputBase
//                   sx={({ spacing }) => ({
//                     color: "grey.300",
//                     padding: spacing(1, 2),
//                   })}
//                   placeholder="Search"
//                   name="Search"
//                   fullWidth
//                 />
//               </Box>
//               <Button variant="contained">
//                 <Typography variant="button">New Dart</Typography>
//               </Button>
//             </Stack>
//           )}
//         </Stack>
//       }
//     >
//       <Grid spacing={2} container>
//         {dartsIsLoading ? (
//           <>
//             <Grid item xs={12}>
//               <Skeleton height={64} />
//             </Grid>
//           </>
//         ) : (
//           darts?.map((dart) => (
//             <Grid key={dart.id} item xs={12} sm={6} lg={4}>
//               <Dart
//                 content={dart.text}
//                 onRequestEdit={() => {
//                   setEdittedDartId(dart.id);
//                 }}
//                 onRequestClose={() => {
//                   setEdittedDartId(null);
//                 }}
//                 editMode={edittedDartId === dart.id}
//                 autoFocusOnEdit
//               />
//             </Grid>
//           ))
//         )}
//       </Grid>
//     </DartBoardLayout>
//   );
// };

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
      <Stack direction="row" gap={4}>
        {isGreaterThanMd ? (
          <DashboardSidebar
            selectedDartBoardId={selectedDartBoardId}
            onSelectDartBoard={setSelectedDartBoardId}
            sx={({ breakpoints }) => ({
              width: 320,
              height: "100vh",
              overflowY: "auto",
              [breakpoints.up("lg")]: {
                width: 360,
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
            <DashboardSidebar
              collapsable
              onCollapse={() => {
                setSmallVPSidebarCollapsed(true);
              }}
              sx={() => ({
                width: "70%",
                height: "100vh",
                overflowY: "auto",
                backgroundColor: "grey.900",
                color: "grey.50",
              })}
              userId={data?.user?.id || ""}
            />
          </Modal>
        )}
        <Stack
          sx={{
            width: "100%",
          }}
          direction="column"
        >
          {selectedDartBoardId && (
            <DartBoardLayout
              defaultSelectedTab="all"
              dartBoardId={selectedDartBoardId}
              tabs={{
                all: {
                  content: (
                    <AllDartsContent dartBoardId={selectedDartBoardId} />
                  ),
                  extras: <AllDartsExtras />,
                },
              }}
            />
          )}
        </Stack>
      </Stack>
    </Container>
  );
};

export default Dashboard;

Dashboard.auth = true;
