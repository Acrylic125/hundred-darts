import GoogleIcon from "@mui/icons-material/Google";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SignIn({}: {
  // providers: ReturnType<typeof getProviders>;
}) {
  return (
    <Container
      sx={(theme) => {
        return {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          minHeight: "100vh",
          padding: theme.spacing(2),
        };
      }}
    >
      <Box
        sx={({ breakpoints }) => {
          return {
            position: "relative",
            width: 48,
            height: 48,
            [breakpoints.up("md")]: {
              width: 72,
              height: 72,
            },
            [breakpoints.up("lg")]: {
              width: 96,
              height: 96,
            },
          };
        }}
      >
        <Image src="/favicon.svg" alt="Favicon" fill />
      </Box>
      <Stack
        sx={{
          alignItems: "center",
        }}
        gap={2}
        direction="column"
      >
        <Typography
          sx={{
            fontWeight: "bold",
          }}
          color="grey.50"
          variant="h3"
          component="h1"
        >
          Welcome!
        </Typography>
        <Typography color="grey.50" variant="body1" component="p">
          Sign in to or create your account
        </Typography>
      </Stack>
      <Stack>
        <Button
          sx={(theme) => {
            return {
              display: "flex",
              gap: 1,
              padding: theme.spacing(2, 4),
              backgroundColor: theme.palette.grey[800],
              color: theme.palette.grey[50],
              "&:hover": {
                backgroundColor: theme.palette.grey[700],
              },
            };
          }}
          size="large"
          fullWidth
          onClick={() => {
            void signIn("google");
          }}
        >
          <GoogleIcon />
          <Typography variant="button" component="p">
            Sign in with Google
          </Typography>
        </Button>
      </Stack>
    </Container>
  );
}

// export const handler: GetServerSideProps = async ({ req, res }) => {
//   // const providers = await getProviders();
//   return {
//     props: { providers },
//   };
// };
