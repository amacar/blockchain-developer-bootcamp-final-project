import { useContractCall, useContractFunction, TransactionStatus } from "@usedapp/core";
import { Interface } from "@ethersproject/abi";
import { Contract } from "@ethersproject/contracts";
import { BigNumber } from "@ethersproject/bignumber";

import { abi } from "../Parking.json";
import { Zone } from "../constants";

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || "";
console.log("ajmo", process.env);

const contractInterface = new Interface(abi);
const contract = new Contract(CONTRACT_ADDRESS, contractInterface);

const useContractFetch = (method: string, args: any[] = []) =>
  useContractCall({ abi: contractInterface, address: CONTRACT_ADDRESS, args, method }) || [];

const useContract = (method: string, options: object = {}) => useContractFunction(contract, method, options);

export const useGetOwner = (): string | undefined => {
  const [owner] = useContractFetch("owner");
  return owner;
};

export const useGetZonePrice = (zone: Zone): BigNumber => {
  const [price] = useContractFetch("zonePricePerMinute", [zone]);
  return price || BigNumber.from(0);
};

export const useSetZonePrice = (): {
  zonePriceTx: TransactionStatus;
  setZonePrice: (price: BigNumber, zone: Zone) => Promise<void>;
} => {
  const { state: zonePriceTx, send: setZonePrice } = useContract("changeZonePrice");
  return { zonePriceTx, setZonePrice };
};

export const useGetTicketInfo = (plate: string): { expiration: number; zone: Zone } => {
  const [expiration, zone] = useContractFetch("getTicket", [plate]);
  return { expiration: expiration ? expiration.toNumber() : undefined, zone };
};

export const useBuyTicket = (): {
  buyTicketTx: TransactionStatus;
  buyTicket: (plate: string, duration: number, zone: Zone, value: { value: BigNumber }) => Promise<void>;
} => {
  const { state: buyTicketTx, send: buyTicket } = useContract("buyTicket");
  return { buyTicketTx, buyTicket };
};

export const useCancelTicket = (): {
  cancelTicketTx: TransactionStatus;
  cancelTicket: (plate: string) => Promise<void>;
} => {
  const { state: cancelTicketTx, send: cancelTicket } = useContract("cancelTicket");
  return { cancelTicketTx, cancelTicket };
};

export const useTransferTicket = (): {
  transferTicketTx: TransactionStatus;
  transferTicket: (oldPlate: string, newPlate: string, newOwner: string) => Promise<void>;
} => {
  const { state: transferTicketTx, send: transferTicket } = useContract("transferTicket");
  return { transferTicketTx, transferTicket };
};

export const useWithdraw = (): {
  withdrawTx: TransactionStatus;
  withdraw: (amount: BigNumber) => Promise<void>;
} => {
  const { state: withdrawTx, send: withdraw } = useContract("withdraw");
  return { withdrawTx, withdraw };
};
