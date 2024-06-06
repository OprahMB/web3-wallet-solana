"use client"
import React, { useState } from 'react'
import { UnifiedWalletProvider, UnifiedWalletButton } from "@jup-ag/wallet-adapter";
import WalletNotification from './WalletNotification';

export default function UnifiedWallet() {
    return (
        <div className='text-center'>
            <UnifiedWalletProvider
                wallets={[]}
                config={{
                    autoConnect: false,
                    env: "mainnet-beta",
                    metadata: {
                        name: "UnifiedWallet",
                        description: "UnifiedWallet",
                        url: "https://jup.ag",
                        iconUrls: ["https://jup.ag/favicon.ico"],
                    },
                    notificationCallback: WalletNotification,
                    walletlistExplanation: {
                        href: "https://station.jup.ag/docs/additional-topics/wallet-list",
                    },
                    theme: "dark",
                    lang: "en",
                }}
            >
                <div className='flex justify-center'>
                    <UnifiedWalletButton />
                </div>
            </UnifiedWalletProvider>
        </div>
    )
}