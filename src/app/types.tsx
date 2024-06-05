import { PublicKey, Transaction, SendOptions } from "@solana/web3.js"

type DisplayEncoding = "utf8" | "hex"
type PhantomEvent = "disconnect" | "connect" | "accountChanged"
type PhantomReqestMethod = | "connect" | "disconnect" | "signAndSendTransacion" | "signTransaction" | "signAllTransactions" | "signMessage"

interface ConnectOpts {
    onlyIfTrusted: boolean
}

export interface PhantomProvider {
    publicKey: PublicKey | null
    isConnected: boolean | null
    signAndSendTransaction: ( transaction: Transaction, opts?: SendOptions ) => Promise<{ signature: string, publicKey: PublicKey }>
    signTransaction: (transaction: Transaction) => Promise<Transaction>
    signAllTransactions: (transaction: Transaction[]) => Promise<Transaction[]>
    signMessage: (message: Uint8Array | string, display?: DisplayEncoding) => Promise<any>
    connect: (opts?: Partial<ConnectOpts>) => Promise<{publicKey: PublicKey}>
    disconnect: () => Promise<void>
    on: (event: PhantomEvent, handler: (args: any) => void) => void
    request: (method: PhantomReqestMethod, params: any) => Promise<unknown>
}

export type Status = "success" | "warning" | "error" | "info"