import { FC } from "react";
import { useEthers, useEtherBalance } from "@usedapp/core";
import { Button } from "@mui/material";

import { formatEtherToFixed } from "../utils";

export const ConnectWallet: FC = () => {
  const { activateBrowserWallet, account } = useEthers();
  const ethBalance = useEtherBalance(account);
  let ethFormat;
  if (ethBalance) {
    ethFormat = formatEtherToFixed(ethBalance);
  }

  return (
    <div style={{ position: "absolute", right: "15px" }}>
      {!account && (
        <Button variant="contained" onClick={() => activateBrowserWallet()}>
          Connect wallet
        </Button>
      )}
      {account && (
        <div>
          <div>
            {account.substr(0, 6)}...{account.substr(-6, 6)}
          </div>
          <div>{ethFormat} ETH</div>
        </div>
      )}
    </div>
  );
};
