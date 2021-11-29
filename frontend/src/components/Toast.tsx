import { FC, useEffect, useState } from "react";
import { Alert, AlertColor, Snackbar } from "@mui/material";
import { TransactionStatus, getExplorerTransactionLink } from "@usedapp/core";

const txStatusToToSeverity = (isMining: boolean, isSuccess: boolean): AlertColor => {
  if (isMining) return "info";
  else if (isSuccess) return "success";
  else return "error";
};

export const Toast: FC<{ tx: TransactionStatus }> = ({ tx }) => {
  const [open, setOpen] = useState(false);
  const isMining = tx.status === "Mining";
  const isSuccess = tx.status === "Success";

  useEffect(() => {
    if (tx.status !== "None") {
      setOpen(true);
    }
  }, [tx.status]);

  const handleClose = () => setOpen(false);

  return (
    <Snackbar
      autoHideDuration={isMining ? null : 10000}
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity={txStatusToToSeverity(isMining, isSuccess)}>
        {isMining && <div>Sending transaction...</div>}
        {isSuccess && <div>Transaction confirmed...</div>}
        {tx.transaction && tx.chainId && (
          <a target="_blank" href={getExplorerTransactionLink(tx.transaction.hash, tx.chainId)} rel="noreferrer">
            View Transaction in Explorer
          </a>
        )}
        {tx.errorMessage}
      </Alert>
    </Snackbar>
  );
};
