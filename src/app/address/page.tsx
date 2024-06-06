"use client"
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import React, { useEffect, useState } from "react";

export default function Address() {
    const { connection } = useConnection()
    const { publicKey } = useWallet()  
    const [balance, setBalance] = useState

    return (
        <></>
    )
}