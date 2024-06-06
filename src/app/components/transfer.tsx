"use client"
import React, { useEffect, useState } from 'react'
import { clusterApiUrl, Keypair, PublicKey, SystemProgram, Transaction, Connection, VersionedTransaction } from '@solana/web3.js'


export async function createTransfer(): Promise<{encoded_transaction: string}> {
    const fromPubKey = new PublicKey('CJPfdUsQLMBCSbZEg8Tm4Csy1LHzgeqoRe9k1Thze7cd')
    const tx = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: fromPubKey,
            toPubkey: new PublicKey('G46nGamK5vSnAKERKZkChT2kM3HsuHcEtzfRKxgmViHa'),
            lamports: 100000000,
        })
    )
    
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
    const blockHash = (await connection.getLatestBlockhash('finalized')).blockhash

    tx.feePayer = fromPubKey
    tx.recentBlockhash = blockHash

    const serializedTransaction = tx.serialize({ requireAllSignatures: false, verifySignatures: true })
    const transactionBase64 = Buffer.from(serializedTransaction).toString('base64')

    return { encoded_transaction: transactionBase64 }
}

export async function signTransaction(encodedTransaction: string, fromPrivateKey: string): Promise<string | undefined> {
    try {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
        const feePayer = Keypair.fromSecretKey(Buffer.from(fromPrivateKey, 'base64'))
        
        const recoveredTransaction = await getRawTransaction(encodedTransaction);

        if (recoveredTransaction instanceof VersionedTransaction) {
            recoveredTransaction.sign([feePayer]);
        } else {
            recoveredTransaction.partialSign(feePayer);
        }

        const txnSignature = await connection.sendRawTransaction(recoveredTransaction.serialize())
        return txnSignature
    } catch (error) {
        console.log(error)
        return undefined
    }
} 

export async function getRawTransaction(encodedTransaction: string): Promise<Transaction | VersionedTransaction> {
    try {
        const transaction = Transaction.from(Buffer.from(encodedTransaction, 'base64'));
        return transaction;
    } catch (error) {
        const versionedTransaction = VersionedTransaction.deserialize(Buffer.from(encodedTransaction, 'base64'));
        return versionedTransaction;
    }
}

export default function Transfer({pubKey}: any) {
    const [encodedTransaction, setEncodedTransaction] = useState<string>('')

    useEffect(() => {
        async function fetchData() {
            const { encoded_transaction } = await createTransfer()
            setEncodedTransaction(encoded_transaction)
            signTransaction(encoded_transaction, 'CJPfdUsQLMBCSbZEg8Tm4Csy1LHzgeqoRe9k1Thze7cd')
            getRawTransaction(encoded_transaction)
        }
        fetchData()
    }, [])

    return (
        <div className='w-full mb-4 space-y-2'>
            <h1>Encoded Transaction:</h1>
            <div className='w-1/2 mx-auto'>
            <small><samp className='break-words'>{encodedTransaction}</samp></small>
            </div>
            <br />
            <button className='bg-black text-white p-2 rounded-md' onClick={() => signTransaction(encodedTransaction, pubKey)}>SignTransaction</button>
            <br />
            <button className='bg-black text-white p-2 rounded-md' onClick={() => getRawTransaction(encodedTransaction)}>GetRawTransaction</button>
        </div>
    )
}