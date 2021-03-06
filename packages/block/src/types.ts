import { Address, BN, BNLike, BufferLike } from 'ethereumjs-util'
import Common from '@ethereumjs/common'
import { TxData, JsonTx } from '@ethereumjs/tx'
import { Block } from './block'

/**
 * An object to set to which blockchain the blocks and their headers belong. This could be specified
 * using a Common object, or `chain` and `hardfork`. Defaults to mainnet without specifying a
 * hardfork.
 */
export interface BlockOptions {
  /**
   * A Common object defining the chain and the hardfork a block/block header belongs to.
   *
   * Default: `Common` object set to `mainnet` and the HF currently defined as the default
   * hardfork in the `Common` class.
   *
   * Current default hardfork: `istanbul`
   */
  common?: Common
  /**
   * Determine the HF by the block number
   *
   * Default: `false` (HF is set to whatever default HF is set by the Common instance)
   */
  hardforkByBlockNumber?: boolean
  /**
   * Turns the block header into the canonical genesis block header
   *
   * If set to `true` all other header data is ignored.
   *
   * If a Common instance is passed the instance need to be set to `chainstart` as a HF,
   * otherwise usage of this option will throw
   *
   * Default: `false`
   */
  initWithGenesisHeader?: boolean
}

/**
 * A block header's data.
 */
export interface HeaderData {
  parentHash?: BufferLike
  uncleHash?: BufferLike
  coinbase?: AddressLike
  stateRoot?: BufferLike
  transactionsTrie?: BufferLike
  receiptTrie?: BufferLike
  bloom?: BufferLike
  difficulty?: BNLike
  number?: BNLike
  gasLimit?: BNLike
  gasUsed?: BNLike
  timestamp?: BNLike
  extraData?: BufferLike
  mixHash?: BufferLike
  nonce?: BufferLike
}

/**
 * A block's data.
 */
export interface BlockData {
  /**
   * Header data for the block
   */
  header?: HeaderData
  transactions?: Array<TxData>
  uncleHeaders?: Array<HeaderData>
}

export type BlockBuffer = [BlockHeaderBuffer, TransactionsBuffer, UncleHeadersBuffer]
export type BlockHeaderBuffer = Buffer[]
export type BlockBodyBuffer = [TransactionsBuffer, UncleHeadersBuffer]
export type TransactionsBuffer = Buffer[][]
export type UncleHeadersBuffer = Buffer[][]

/**
 * An object with the block's data represented as strings.
 */
export interface JsonBlock {
  /**
   * Header data for the block
   */
  header?: JsonHeader
  transactions?: JsonTx[]
  uncleHeaders?: JsonHeader[]
}

/**
 * An object with the block header's data represented as strings.
 */
export interface JsonHeader {
  parentHash?: string
  uncleHash?: string
  coinbase?: string
  stateRoot?: string
  transactionsTrie?: string
  receiptTrie?: string
  bloom?: string
  difficulty?: string
  number?: string
  gasLimit?: string
  gasUsed?: string
  timestamp?: string
  extraData?: string
  mixHash?: string
  nonce?: string
}

export interface Blockchain {
  getBlock(hash: Buffer): Promise<Block>
}

/**
 * A type that represents an Address-like value.
 * To convert to address, use `new Address(toBuffer(value))
 * TODO: Move to ethereumjs-util
 */
export type AddressLike = Address | Buffer | string

/**
 * Convert BN to 0x-prefixed hex string.
 * TODO: Move to ethereumjs-util
 */
export function bnToHex(value: BN): string {
  return `0x${value.toString(16)}`
}
