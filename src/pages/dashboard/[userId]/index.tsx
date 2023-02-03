import {
  Box,
  Button,
  Container,
  InputBase,
  List,
  ListItemButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import DashboardSidebar from "../../../components/DashboardSidebar";
import { api } from "../../../utils/api";

const Dashboard = () => {
  const { data, status } = useSession();
  const router = useRouter();
  const { data: dartBoards } = api.dart.getAllDartBoards.useQuery(
    {
      userId: data?.user?.id || "",
    },
    {
      enabled: status === "authenticated" && data?.user !== undefined,
    }
  );

  if (status === "loading") {
    return <></>;
  }
  if (status !== "authenticated") {
    void signIn();
    return <></>;
  }

  if (router.query.userId !== data?.user?.id) {
    void router.push(`/dashboard/${data?.user?.id || ""}`);
    return <></>;
  }

  return <DashboardSidebar dartBoards={dartBoards || []} />;
};

export default Dashboard;

Dashboard.auth = true;
