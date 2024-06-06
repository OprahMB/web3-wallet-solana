import { Transaction, SystemProgram, Connection, PublicKey, SendOptions } from "@solana/web3.js"

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

interface WindowWithSolana extends Window {
    phantom?: {
        solana?: PhantomProvider;
    };
}

export async function createTransferTransaction(
    publicKey: PublicKey, connection: Connection
): Promise<Transaction> {
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: publicKey,
            lamports: 100
        })
    )
    transaction.feePayer = publicKey

    const anyTransaction: any = transaction
    anyTransaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash

    return transaction
}

export function getProvider(): PhantomProvider | undefined {
    if (typeof window !== "undefined" && "phantom" in window) {
        const { phantom } = window as WindowWithSolana;
        console.log('Phantom wallet detected:', phantom);

        if (phantom) {
            console.log('Phantom wallet is connected:', phantom.solana);
            return phantom.solana;
        }
    } else {
        console.log('Window object or Phantom wallet not found.');
    }
}

export async function signAllTransactions(
    provider: PhantomProvider,
    transaction1: Transaction,
    transaction2: Transaction
): Promise<Transaction[]> {
    try {
        return await provider.signAllTransactions([transaction1, transaction2])
    } catch (error: any) {
        console.warn(error)
        throw new Error(error.message)
    }
}

export async function signAndSendTransaction(
    provider: PhantomProvider,
    transaction: Transaction,
): Promise<string> {
    try {
        const { signature } = await provider.signAndSendTransaction(transaction)
        return signature
    } catch (error: any) {
        console.warn(error)
        throw new Error(error.message)
    }
}

export async function signTransaction(
    provider: PhantomProvider,
    transction: Transaction
): Promise<Transaction> {
    try {
        return await provider.signTransaction(transction)
    } catch (error: any) {
        console.warn(error)
        throw new Error(error.message)
    }
}

export async function signMessage(
    provider: PhantomProvider, message: string
): Promise<string> {
    try {
        const encodedMesssage = new TextEncoder().encode(message)
        return await provider.signMessage(encodedMesssage)
    } catch (error: any) {
        console.warn(error)
        throw new Error(error.message)
    }
}

export default { getProvider, signAllTransactions, signMessage }