"use client"
import React from "react"
import Image from "next/image"
import Link from "next/link"
import ConnectPhantom from "./components/connectPhantom";
import PhantomWallet from './components/PhantomWallet'
import AppWalletProvider from "./components/AppWalletProvider"
import WalletAirdrop from "@/app/address/page"
import UnifiedWalletKit from "@/app/components/UnifiedWalletKit"
import ChainStack from "@/app/chaintask/page"

export default function Home() {
  return (
    <main className="w-full py-24 min-h-screen bg-[#F4F2FE] text-center">
      <div className="space-y-2">
        <p>Unified Wallet Adapter:</p>
        <UnifiedWalletKit />
      </div>
      <PhantomWallet />
    </main>
  );
}
