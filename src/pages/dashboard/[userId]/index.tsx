import { AllDartsContent, AllDartsExtras } from "@/components/AllDartsContent";
import DartBoardLayout from "@/components/DartBoardLayout";
import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Container,
  Box,
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
    <Box>
      <Stack direction="row" gap={0}>
        {isGreaterThanMd ? (
          <DashboardSidebar
            user={data?.user}
            selectedDartBoardId={selectedDartBoardId}
            onSelectDartBoard={setSelectedDartBoardId}
            sx={({ breakpoints }) => ({
              width: 420,
              height: "100vh",
              overflowY: "auto",
              [breakpoints.up("lg")]: {
                width: 480,
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
              user={data?.user}
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
              dartBoardId={selectedDartBoardId}
              topBar={<AllDartsExtras />}
            >
              <AllDartsContent
                key={selectedDartBoardId}
                dartBoardId={selectedDartBoardId}
              />
            </DartBoardLayout>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default Dashboard;

Dashboard.auth = true;
