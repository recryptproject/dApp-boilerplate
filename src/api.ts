import {
  ConfirmedTransaction,
  Contract,
  IContractInfo,
  RecryptRPC,
} from "recryptjs"

const rpc = new RecryptRPC(RECRYPT_RPC)
const counter = new Contract(rpc, CONTRACTS.counter)

export async function getCount(): Promise<number> {
  const r = await counter.call("getCount")
  const [count] = r.outputs

  // count is a BN.js instance (big number)
  return count.toNumber()
}

interface IIncrementResult {
  gasUsed: number
  n: number
}

export async function increment(n: number): Promise<IIncrementResult> {
  const r = await counter.send("increment", [n])

  // Expect exactly one log item, of type `CounterChanged(uint256 n)`;
  const log = r.logs[0]

  // Use the event parameter's name to get the new counter value
  const newN = log.n.toNumber()

  return {
    gasUsed: r.receipt.gasUsed,
    n: newN,
  }
}
