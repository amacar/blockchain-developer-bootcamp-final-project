import { FC, useState } from "react";
import { Button, TextField } from "@mui/material";
import { parseEther } from "@ethersproject/units";
import { useEtherBalance } from "@usedapp/core";

import { BoxItem } from "./BoxItem";
import { useWithdraw } from "../hooks/useContractHooks";
import { formatEtherToFixed } from "../utils";

const style = { marginRight: "5px" };

export const Withdraw: FC = () => {
  const [amount, setAmount] = useState<string>("");
  const { withdrawTx, withdraw } = useWithdraw();
  const balance = useEtherBalance(process.env.REACT_APP_CONTRACT_ADDRESS);

  const handleWithdraw = async () => {
    if (!amount) return;

    await withdraw(parseEther(amount));
  };

  return (
    <BoxItem label="Withdraw ETH">
      <TextField
        style={style}
        label="Amount (in ETH)"
        variant="outlined"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        helperText={balance && <div>Balance in contract: {formatEtherToFixed(balance, 18)} ETH</div>}
      />
      <Button style={{ maxHeight: "56px" }} variant="contained" color="error" onClick={handleWithdraw}>
        Withdraw ETH
      </Button>
    </BoxItem>
  );
};
