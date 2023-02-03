import { type NextPage } from "next";
import { useSession } from "next-auth/react";

import { api } from "../utils/api";

const Home: NextPage = () => {
  const { data, status } = useSession();
  const { data: dartBoards } = api.dart.getAllDartBoards.useQuery(
    {
      userId: data?.user?.id || "",
    },
    {
      enabled: status === "authenticated" && data?.user !== undefined,
    }
  );

  return <></>;
};

export default Home;

// const AuthShowcase: React.FC = () => {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//   );
// };
