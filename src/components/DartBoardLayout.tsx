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
