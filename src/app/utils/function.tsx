import { Transaction, SystemProgram, Connection, PublicKey } from "@solana/web3.js"
import { PhantomProvider } from "../types"

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
        const anyWindow: any = window
        const provider = anyWindow.phantom?.solana
        return provider
    }
    return undefined
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