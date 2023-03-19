import { useState } from "react";
import { api } from "@/utils/api";
import { Skeleton, Stack, Tabs, Tab, Typography, Box } from "@mui/material";

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
    <Stack
      sx={{
        height: "100vh",
        position: "relative",
        overflow: "auto",
      }}
      direction="column"
      // gap={2}
    >
      <Stack
        sx={{
          position: "sticky",
          top: 0,
          backgroundColor: "grey.900",
          zIndex: 1,
        }}
        direction="column"
        gap={2}
      >
        <Typography
          sx={{
            width: "50%",
            fontWeight: "bold",
            paddingTop: ({ spacing }) => spacing(4),
            paddingX: ({ spacing }) => spacing(4),
          }}
          variant="h5"
          component="h1"
        >
          {dartBoardIsLoading ? <Skeleton /> : dartBoard?.name}
        </Typography>
      </Stack>
      <Box
        sx={{
          // display: "flex",
          flexGrow: 1,
        }}
      >
        {selectedTab && tabs[selectedTab]?.content}
      </Box>
    </Stack>
  );
};

export default DartBoardLayout;
