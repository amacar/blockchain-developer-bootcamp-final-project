import { CSSProperties, FC } from "react";
import { useEthers } from "@usedapp/core";
import { Alert, Chip, Container, Divider, Stack } from "@mui/material";

import { useGetOwner } from "./hooks/useContractHooks";
import { BuyTicket, CancelTicket, ChangeZonePrice, CheckTicket, Header, TransferTicket, Withdraw } from "./components";

const appStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const alertStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
};

export const App: FC = () => {
  const { error, active, account } = useEthers();
  const owner = useGetOwner();

  return (
    <Container style={{ fontFamily: "Roboto", padding: 0, maxWidth: "100%" }}>
      <Header />
      <Stack spacing={2} style={appStyle}>
        {error && (
          <Alert style={alertStyle} variant="filled" severity="error">
            {error.message}
          </Alert>
        )}
        {!active && !error && (
          <Alert variant="filled" style={alertStyle} severity="warning">
            Please first connect wallet to use the app!
          </Alert>
        )}
        {!error && active && (
          <>
            <CheckTicket />
            <BuyTicket />
            <CancelTicket />
            <TransferTicket />
          </>
        )}
        {account && account === owner && (
          <>
            <Divider flexItem>
              <Chip color="warning" style={{ fontSize: "20px", marginBottom: "20px" }} label={"ADMIN Section"} />
            </Divider>
            <Withdraw />
            <ChangeZonePrice />
          </>
        )}
      </Stack>
    </Container>
  );
};

export default App;
