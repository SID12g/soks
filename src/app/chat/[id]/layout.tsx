import { Container, Stack } from "@mui/material";
import BackButton from "@/components/BackButton";
import { SocketProvider } from "@/providers/SocketProvider";
import SocketIndicator from "@/components/SocketIndicator";
import AuthSession from "@/providers/AuthSession";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
  return (
    <AuthSession>
      <SocketProvider>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <BackButton />
          <h1>Chat</h1>
          <SocketIndicator />
        </Stack>
        <Container maxWidth="sm">
          <main>{props.children}</main>
        </Container>
      </SocketProvider>
    </AuthSession>
  );
};

export default Layout;
