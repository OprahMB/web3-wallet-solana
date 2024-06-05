"use client"
import React, { useEffect, useState } from 'react'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'
import { error } from 'console'

type PhantomEvent = "disconnect" | "connect" | "accountChanged"

interface ConnectOpts {
    ifTrusted: boolean
}

interface PhantomProvider {
    connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>
    disconnect: () => Promise<void>
    on: (event: PhantomEvent, callback: (args: any) => void) => void
    isPhantom: boolean
}

type WindowWithSolana = Window & {
    solana?: PhantomProvider
}

export default function ConnectPhantom() {
    const [walletAvailable, setWalletAvailable] = useState(false)
    const [provider, setProvider] = useState<PhantomProvider | null>(null)
    const [connected, setConnected] = useState(false)
    const [hasPublicKey, setHasPublicKey] = useState<PublicKey | null>(null)

    const connectHandler: React.MouseEventHandler<HTMLButtonElement> = (event: any) => {
        console.log("connect handler")
        provider?.connect()
            .catch((error: any) => console.log("connect error:", error))
    }

    const disconnectHandler: React.MouseEventHandler<HTMLButtonElement> = (event: any) => {
        console.log("disconnect handler")
        provider?.disconnect()
            .catch((error: any) => console.log("disconnect error: ", error))
    }

    useEffect(() => {
        if ("solana" in window) {
            const solanaWindow = window as WindowWithSolana
            if (solanaWindow?.solana?.isPhantom) {
                setProvider(solanaWindow.solana)
                setWalletAvailable(true)
                solanaWindow.solana.connect({ ifTrusted: true })
            }
        }
    }, [])
    
    useEffect(() => {
        provider?.on("connect", (publicKey: PublicKey) => {
            console.log(`connect event: ${publicKey}`)
            setConnected(true)
            setHasPublicKey(publicKey)
        })

        provider?.on("disconnect", () => {
            console.log("disconnect event")
            setConnected(false)
            setHasPublicKey(null)
        })
    }, [provider])

    return (
        <div className='w-full h-screen text-center bg-black text-white space-y-2 pt-20'>
            {walletAvailable ? 
                <>
                    <button disabled={connected} onClick={connectHandler} className='mx-auto border border-white px-4 py-2 rounded-lg'>Connect Wallet</button>
                    <br />
                    <button disabled={!connected} onClick={disconnectHandler} className='mx-auto border border-white px-4 py-2 rounded-lg'>Disconnect Wallet</button>
                    { connected ? <p>Public Key: {hasPublicKey?.toBase58()}</p> : null }
                </>
                :
                <>
                    <p>Opps! Phantom is not available. Please got <a href="https://phantom.app/">Phantom App</a>.</p>
                </>
            }
        </div>
    )
}