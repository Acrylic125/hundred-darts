import { AllDartsContent, AllDartsExtras } from "@/components/AllDartsContent";
import DartBoardLayout from "@/components/DartBoardLayout";
import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Container,
  Modal,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

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
