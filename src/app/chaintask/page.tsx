import React, { useEffect } from 'react'

export default function page() {
    const web3 = require("@solana/web3.js")
    const bs58 = require("bs58")
    const splToken = require("@solana/spl-token")
    const connection = new web3.Connection(
        "https://nd-028-544-756.p2pify.com/61dd2ffba4aedd643377a8ac57edab61",
        { wssEndpoint: "wss://ws-nd-028-544-756.p2pify.com/61dd2ffba4aedd643377a8ac57edab61" }
    ) //nodes from chainstack
    // const privateKey = new Uint8Array(bs58.decode(process.env['CJPfdUsQLMBCSbZEg8Tm4Csy1LHzgeqoRe9k1Thze7cd']))
    // const fromPubKey = web3.KeyPair.fromSecretKey(privateKey)
    // const targetAccount = web3.KeyPair.generate()
    const fromPubKey = new web3.PublicKey('CJPfdUsQLMBCSbZEg8Tm4Csy1LHzgeqoRe9k1Thze7cd')
    const toPubKey = new web3.PublicKey('G46nGamK5vSnAKERKZkChT2kM3HsuHcEtzfRKxgmViHa')

    async function token() {
        let balance = await connection.getBalance(fromPubKey)
        console.log(balance / web3.LAMPORTS_PER_SOL)

        // define a mint varialbe
        const mint = await splToken.createMint(
            connection, fromPubKey, fromPubKey.publicKey, null, 9, undefined, {}, splToken.TOKEN_PROGRAM_ID,
        )

        // create a token fromPubKey
        const tokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
            connection, fromPubKey, mint, fromPubKey.publicKey,
        )

        // mint token
        await splToken.mintTo(
            connection, fromPubKey, mint, tokenAccount.address, fromPubKey.publicKey, 1000000000000,
        )

        // define transaction
        const transaction = new web3.Transaction().add(
            web3.SystemProgram.transfer({
                fromPubKey: fromPubKey,
                toPubKey: toPubKey,
                lamports: web3.LAMPORTS_PER_SOL * 0.001,
            }),
        )

        // send transaction and save signature
        const signature = await web3.sendAndConfirmTransaction(
            connection, transaction, [fromPubKey]
        )
    }

    useEffect(() => {
        token()
    })

    return (
        <div>page</div>
    )
}
