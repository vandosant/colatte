# colatte
This is a basic environment to test smart contracts and deploy them to a test (Rinkeby) ethereum network.
---

# setup
Add a `secrets.json` at the root directory with the format:
```
{
  "MNEMONIC": "blah x 12", // your secret phrase from a test https://metamask.io account
  "PROVIDER_URL": "YOUR_INFURA_URL_GOES_HERE" // get yours at https://infura.io
}
```

Then, you can deploy the test contract to your provider url:
`node deploy.js`

To interact with it on the network, enter your deployed address key on https://remix.ethereum.org
- Go to the `Run` tab
- Enter your address into the `At Address` input field

# tools
- Web3: js lib to interact with the ethereum network
- Ganache: local-hosted test network; reduces testing latency
- Solc: compiles solidity smart-contracts to bytecode
- truffle-hdwallet-provider: takes a metamask mnemonic
