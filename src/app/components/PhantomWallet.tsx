"use client"
import React, { useState, useEffect, useMemo, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getProvider, signAllTransactions, signAndSendTransaction, signMessage, signTransaction, createTransferTransaction } from "@/app/utils/function"
import { Connection, PublicKey } from "@solana/web3.js"
// import ConnectPhantom from "./components/connectPhantom";

import logo from "@/assets/imgLogo.png"

export type ConnectedMethods =
  | { name: string; onClick: () => Promise<string> }
  | { name: string; onClick: () => Promise<void> }

interface Props {
  publicKey: PublicKey | null
  connectedMethods: ConnectedMethods[]
  handleConnect: () => Promise<void>
}

const useProps = (): Props => {
  const provider = getProvider()
  const connection = new Connection('https://api.devnet.solana.com')
  const message = "sign for auth"

  const handleSignAndSendTransaction = useCallback(async () => {
    if (!provider || !provider.publicKey) return
    try {
      const transaction = await createTransferTransaction(provider.publicKey, connection)
      console.log('requesting signature:', JSON.stringify(transaction))

      const signature = await signAndSendTransaction(provider, transaction)
      console.log('signed and submitted transaction', signature)
    } catch (error: any) {
      console.log('sign and send transaction:', error.message)
    }
  }, [provider, connection])

  const handleSignTransaction = useCallback(async () => {
    if (!provider || !provider.publicKey) return
    try {
      const transaction = await createTransferTransaction(provider.publicKey, connection)
      console.log('requesting signature:', JSON.stringify(transaction))

      const signedTransaction = await signTransaction(provider, transaction)
      console.log('sucess to sign all transactions', JSON.stringify(signedTransaction))
    } catch (error: any) {
      console.log('sign transaction:', error.message)
    }
  }, [provider, connection])

  const handleSignAllTransactions = useCallback(async (): Promise<void> => {
    if (!provider || !provider.publicKey) return
    try {
      const transactions = [
        await createTransferTransaction(provider.publicKey, connection),
        await createTransferTransaction(provider.publicKey, connection),
      ]
      console.log('requesting signature:', JSON.stringify(transactions))

      const signedTransactions = await signAllTransactions(provider, transactions[0], transactions[1])
      console.log('sucess to sign all transactions', JSON.stringify(signedTransactions))
    } catch (error: any) {
      console.log('sign all transactions:', error.message)
    }
  }, [provider, connection])

  const handleSignMessage = useCallback(async (): Promise<void> => {
    if (!provider) return
    try {
      const signedMessage = await signMessage(provider, message)
      console.log('success', signedMessage)
      return
    } catch (error: any) {
      console.log('sign message:', error.message)
    }
  }, [provider])

  const handleConnect = useCallback(async (): Promise<void> => {
    if (!provider) {
      console.log('Provider not available.');
      return;
    }

    try {
      // Check if already connected
      if (provider.isConnected) {
        console.log('Provider is already connected.');
        return;
      }

      // Connect
      await provider.connect();
    } catch (error: any) {
      console.error('Error connecting to provider:', error.message);
    }
  }, [provider])

  const handleDisconnect = useCallback(async (): Promise<void> => {
    if (!provider) return
    try {
      await provider.disconnect()
    } catch (error: any) {
      console.log('disconnect:', error.message)
    }
  }, [provider])

  const connectedMethods: ConnectedMethods[] = useMemo(() => [
    { name: 'Sign and Send Transaction', onClick: handleSignAndSendTransaction },
    { name: 'Sign Transaction', onClick: handleSignTransaction },
    { name: 'Sign All Transaction', onClick: handleSignAllTransactions },
    { name: 'Sign Message', onClick: handleSignMessage },
    { name: 'Disconnect', onClick: handleDisconnect },
  ], [handleSignAndSendTransaction, handleSignTransaction, handleSignAllTransactions, handleDisconnect, handleSignMessage, handleConnect])

  return {
    publicKey: provider?.publicKey || null,
    connectedMethods,
    handleConnect,
  }
}

export default function App() {
  const props = useProps()
  const router = useRouter()
  const { publicKey, connectedMethods, handleConnect } = props

  return (
    <main className="w-full h-screen bg-[#F4F2FE] text-center py-20 text-[#3C315B]">
      <Image priority src={logo} alt="Phantom" width="200" height="100" className="mx-auto w-auto h-auto" />
        <button onClick={handleConnect} className="mt-4 cursor-pointer bg-[#AB9EF3] px-6 py-4 rounded-2xl hover:opacity-50">
          Please Connect Wallet
        </button>
      
        <div className="space-y-4 mt-4">
          <h1>You connected as Solana Wallet.</h1>
          <div className="space-y-2 w-1/2 mx-auto">
            {connectedMethods.map((method, i) => (
              <div key={`${method.name}-${i}`} onClick={method.onClick} className="mt-4 cursor-pointer bg-[#AB9EF3] border-white px-6 py-4 rounded-2xl hover:opacity-50">
                {method.name}
              </div>
            ))}
          </div>
        </div>
    </main>
  );
}
