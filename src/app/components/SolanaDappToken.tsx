// https://www.youtube.com/watch?v=sDTp21_Nyzw
import React, { useCallback, useMemo } from 'react'
import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base"
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider as ReactUIWalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter, SolletExtensionalWalletAdapter, SolletWalletAdapter, TorusWalletAdapter } from "@solana/wallet-adapter-wallets"
import { Cluster, clusterApiUrl } from '@solana/web3.js'

export default function SolanaDappToken() {
    const { autoConnect } = useAutoConnect()
    const { networkConfiguration } = useNetworkConfiguration()
    const network = networkConfiguration as WalletAdapterNetwork

    const originalEndPoint = useMemo(() => clusterApiUrl(network, [network]))

    let endpoint

    if (network == "mainnet-beta") {
        endpoint = "URL"
    } else {
        endpoint = originalEndPoint
    }

    const wallets = useMemo(() => [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
        new SolletWalletAdapter(),
        new SolletExtensionalWalletAdapter(),
        new TorusWalletAdapter
    ])

    return (
        <div>SolanaDappToken</div>
    )
}
