import { useState } from "react";
import { api } from "@/utils/api";
import { Skeleton, Stack, Tabs, Tab, Typography, Box } from "@mui/material";

const DartBoardLayout = ({
  dartBoardId,
  topBar,
  children,
}: {
  dartBoardId: string;
  topBar?: React.ReactNode;
  children?: React.ReactNode;
}) => {
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
    >
      <Stack
        sx={{
          position: "sticky",
          top: 0,
          paddingTop: ({ spacing }) => spacing(4),
          paddingX: ({ spacing }) => spacing(4),
          borderBottom: "2px solid",
          borderColor: "grey.800",
          backgroundColor: "grey.900",
          zIndex: 1,
        }}
        direction="column"
      >
        <Typography
          sx={{
            width: "50%",
            fontWeight: "bold",
          }}
          variant="h5"
          component="h1"
        >
          {dartBoardIsLoading ? <Skeleton /> : dartBoard?.name}
        </Typography>
        {topBar}
      </Stack>
      <Box
        sx={{
          // display: "flex",
          flexGrow: 1,
        }}
      >
        {children}
      </Box>
    </Stack>
  );
};

export default DartBoardLayout;
