"use client"
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import React, { useEffect, useState } from "react";

import SolanaTransactions from "@/app/components/transfer"

export default function Address() {
    const { connection } = useConnection()
    const { publicKey } = useWallet()
    const [balance, setBalance] = useState<number | null>(null)

    // performing an airdrop
    const getAirdropOnClick = async () => {
        try {
            if (!publicKey) {
                throw new Error("Wallet is not connected")
            }

            const [latestBlockhash, signature] = await Promise.all([
                connection.getLatestBlockhash(),
                connection.requestAirdrop(publicKey, 1 * LAMPORTS_PER_SOL)
            ])

            const signResult = await connection.confirmTransaction(
                { signature, ...latestBlockhash }, "confirmed"
            )
            if (signResult) {
                alert("Airdrop was confirmed!")
            }
        } catch (error) {
            alert("You are rate limited for Airdrop")
        }
    }

    // get wallet balance
    useEffect(() => {
        if (publicKey) {
            (async function getBalaceEvery10Seconds() {
                const newBalance = await connection.getBalance(publicKey)
                setBalance(newBalance / LAMPORTS_PER_SOL)
                setInterval(getBalaceEvery10Seconds, 900000)
            })()
        }
    }, [balance, connection, publicKey])

    return (
        <div className="flex py-10 flex-col items-center justify-evenly p-24 text-black">
            {publicKey ? (
                <div className="flex flex-col gap-4 justify-center">
                    <h1>
                        Your Public key is: <b>{publicKey?.toString()}</b>
                    </h1>
                    <h2>
                        Your Blanace is: <b>{balance} SOL</b>
                    </h2>
                    <div className="mx-auto w-full">
                        <button type="button" onClick={getAirdropOnClick}
                            className="w-2/5 text-white bg-[#512DA8] focus:outline-none hover:bg-black focus:ring-4 focus:ring-gray-100 font-medium rounded-md text-sm px-5 py-2.5 me-2 mb-2">
                            Get Airdrop 1 SOL
                        </button>
                    </div>
                    
                    {/* <SolanaTransactions pubKey={publicKey} /> */}
                </div>
            ) : <h1>Wallet is not connected</h1>
            }
        </div>
    )
}