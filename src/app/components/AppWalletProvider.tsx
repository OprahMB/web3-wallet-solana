"use client";
import React, { useMemo } from "react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { PublicKey, clusterApiUrl } from "@solana/web3.js"

import WalletAirdropSOL from '@/app/address/page'

require("@solana/wallet-adapter-react-ui/styles.css");

export default function AppWalletProvider() {
    const network = WalletAdapterNetwork.Devnet
    const endpoint = useMemo(() => clusterApiUrl(network), [network])
    const wallets = useMemo(
        () => [

        ],
        [network]
    )

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <main className="flex flex-col items-center justify-center">
                        <div className="border hover:border-slate-900 rounded">
                            <WalletMultiButton />
                        </div>
                        <WalletAirdropSOL />
                    </main>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}