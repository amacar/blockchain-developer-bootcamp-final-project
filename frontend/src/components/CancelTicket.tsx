import { FC, useState } from "react";
import { Button, TextField } from "@mui/material";

import { BoxItem } from "./BoxItem";
import { useCancelTicket } from "../hooks/useContractHooks";

const style = { marginRight: "5px" };

export const CancelTicket: FC = () => {
  const [plate, setPlate] = useState<string>("");
  const { cancelTicketTx, cancelTicket } = useCancelTicket();

  const handleCancelTicket = async () => {
    if (!plate) return;

    await cancelTicket(plate);
  };

  return (
    <BoxItem label="Cancel parking ticket">
      <TextField
        style={style}
        label="Car's plate"
        variant="outlined"
        value={plate}
        onChange={(e) => setPlate(e.target.value)}
      />
      <Button variant="contained" color="error" onClick={handleCancelTicket}>
        Cancel ticket
      </Button>
    </BoxItem>
  );
};
