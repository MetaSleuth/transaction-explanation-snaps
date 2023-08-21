import {
  OnRpcRequestHandler,
  OnTransactionHandler,
  OnTransactionResponse
} from '@metamask/snap-types';
import { copyable, divider, heading, panel, text } from '@metamask/snaps-ui';

/**
 * Handle incoming Transaction requests.
 *
 * @param args - The request handler args as object.
 * @param args.transaction - The  transaction object of the request, from metamask.
 * @param args.chainId - The chainId of the request.
 * @returns insights if the request succeeded.
 * @throws If the `simulationTx` call failed.
 */
export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
}) => {
  try {
    console.log(transaction, chainId)
    const chain_ID = chainId.includes(':') ? roughScale(chainId.split(':')[1], 16) : roughScale(chainId, 16);
    if (chain_ID != 1 && chain_ID != 56) {
      const insights = { 'Warning': ' Snap does not support this chain yet.' }
      return { insights }
    } else {
      const AIretObj = await AIsimulationTx(transaction, chainId)
      const response = await AIDashBoard(AIretObj)
      return response;
    }
  } catch (e) {
    console.log(e)
    throw e
  }
};


export interface Assets {
  token: string
  amount: number
  asvalue: number
  decimals: number
}

export interface Bundle {
  in: Assets[]
  out: Assets[]
  total: number
}

export interface Sec {
  reciver: string[]
  token: string[]
  approve: number
}

export interface Ret {
  code: number
  bundle: Bundle
  security: Sec
  msg?: string
}

export interface AIret {
  code:number
  msg?:string
  data: {
    template:number,
    content:string
  }
}

const roughScale = (x: string, base: number) => {
  const parsed = parseInt(x, base);
  if (isNaN(parsed)) { return 0; }
  return parsed;
}

/**
 * Transaction Security Check API requests.
 *
 * @param args - The request handler args as object.
 * @param args.transaction - The  transaction object of the request, from metamask.
 * @param args.chainId - The chainId of the request.
 * @returns Retuen Json Object if the request succeeded.
 * @throws If the CORS HTTPs request call failed.
 */
export const AIsimulationTx = async (transaction: any, chainId: string) => {
  const TX_API_ENDPOINT =
    'https://metasearch.blocksec.com/api/v1/explain/prerun/tx';
  // POST body
  const body = {
    // isPrerun : true,
    sender: transaction.from.toLowerCase(),
    chain: "eth",
    inputData: transaction.data ?
      transaction.data.toLowerCase() : "0x",
    value: (roughScale(transaction.value, 16)/ Math.pow(10,18)) .toString(),
    gasLimit: 350000,
    // gasLimit:
    // transaction.gas ?
      // roughScale(transaction.gas, 16) : 28500000,
    gasPrice: transaction.gasPrice ?
      roughScale(transaction.gasPrice, 16).toString() : "100",
    receiver: transaction.to.toLowerCase(),
  };

  console.log(`metamsk data${JSON.stringify(transaction)}`)
  console.log(`raw data${JSON.stringify(body)}`);

  // Only allow Content-Type, X-CSRF-Token, Authorization, AccessToken, Token in MetaMask Flask
  const res = await fetch(TX_API_ENDPOINT, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error('Bad response from server');
  }
  const json = await res.json();
  console.log(`return data${JSON.stringify(json)}`);
  const retObj: AIret = JSON.parse(JSON.stringify(json));
  console.log(retObj.msg)
  return retObj;
};

export type DashBoardHandler = (retObj: AIret) => Promise<OnTransactionResponse>;


const splitThousandSeparator = (num: number, dec: number, unit: string) => {
  if (Math.abs(num) < 1e-8) {
    return unit + "0"
  }
  let head: string = "";
  if (num < 0) {
    num *= -1;
    head = "-";
  } else {
    head = "+";
  }
  let DIGIT_PATTERN = /(^|\s)\d+(?=\.?\d*($|\s))/g;
  let MILI_PATTERN = /(?=(?!\b)(\d{3})+\.?\b)/g;
  let str: string = num.toFixed(dec).replace(DIGIT_PATTERN, (m) => m.replace(MILI_PATTERN, ','));
  return " " + head + " " + unit + str
}
//MetaMask flask only accept OnTransactionResponse{[key:string]:string} input, We  
//try our best to imporve the dashboard using '' to replace '\r'.
/**
 * Transaction Security Check API requests.
 *
 * @param args - The request handler args as object.
 * @param args.retObj - The Json Object from API.
 * @returns Retuen OnTransactionResponse Object.
 */
const AIDashBoard: DashBoardHandler = async (
  retObj,
) => {
  let inValue = 0
  if (retObj.code != 200) {
    const insights = {
      content: panel([
        heading('Snap Warning'),
        text(
          `Metadock Snap shows the transaction will fail.`,
        ),
      ]),
    };
    console.log(`Error at ${retObj.msg}`)
    return insights
  } else {
    const insights = {
      content: panel([
        heading('Metadock Explanation'),
        text(
          retObj.data.content,
        ),
      ]),
    };
    return insights
  }
}