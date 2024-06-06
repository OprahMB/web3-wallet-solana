"use client"
import React from "react"
import Image from "next/image"
import Link from "next/link"
// import ConnectPhantom from "./components/connectPhantom";
// import PhantomWallet from './components/PhantomWallet'
import AppWalletProvider from "./components/AppWalletProvider"

export default function Home() {
  return (
    <main className="w-full h-screen bg-[#F4F2FE] text-center">
      {/* <PhantomWallet /> */}
      <AppWalletProvider />
    </main>
  );
}
