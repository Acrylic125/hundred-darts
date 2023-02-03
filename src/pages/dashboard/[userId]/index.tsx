import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import DashboardSidebar from "../../../components/DashboardSidebar";

const Dashboard = () => {
  const { data, status } = useSession();
  const router = useRouter();

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

  return <DashboardSidebar userId={data?.user?.id || ""} />;
};

export default Dashboard;

Dashboard.auth = true;
