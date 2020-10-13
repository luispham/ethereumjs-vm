import { Account, BN, toBuffer, pubToAddress, bufferToHex } from 'ethereumjs-util'
import { Transaction, TxData } from '@ethereumjs/tx'
import VM from '../..'

async function main() {
  const vm = new VM()

  // import the key pair
  // used to sign transactions and generate addresses
  const keyPair = require('./key-pair')
  const privateKey = toBuffer(keyPair.secretKey)

  const publicKeyBuf = toBuffer(keyPair.publicKey)
  const address = pubToAddress(publicKeyBuf, true)

  console.log('---------------------')
  console.log('sender address: ', bufferToHex(address))

  // create a new account
  const account = new Account(new BN(0), new BN(100).pow(new BN(18)))

  // Save the account
  await vm.stateManager.putAccount(address, account)

  const txData1 = require('./raw-tx1')
  const txData2 = require('./raw-tx2')

  // The first transaction deploys a contract
  const createdAddress = (await runTx(vm, txData1, privateKey))!

  // The second transaction calls that contract
  await runTx(vm, txData2, privateKey)

  // Now let's look at what we created. The transaction
  // should have created a new account for the contract
  // in the state. Let's test to see if it did.

  const createdAccount = await vm.stateManager.getAccount(createdAddress)

  console.log('-------results-------')
  console.log('nonce: ' + createdAccount.nonce.toString())
  console.log('balance in wei: ', createdAccount.balance.toString())
  console.log('stateRoot: 0x' + createdAccount.stateRoot.toString('hex'))
  console.log('codeHash: 0x' + createdAccount.codeHash.toString('hex'))
  console.log('---------------------')
}

async function runTx(vm: VM, txData: TxData, privateKey: Buffer) {
  const tx = Transaction.fromTxData(txData).sign(privateKey)

  console.log('----running tx-------')
  const results = await vm.runTx({ tx })

  console.log('gas used: ' + results.gasUsed.toString())
  console.log('returned: ' + results.execResult.returnValue.toString('hex'))

  const createdAddress = results.createdAddress

  if (createdAddress) {
    console.log('address created: 0x' + createdAddress.toString('hex'))
    return createdAddress
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
