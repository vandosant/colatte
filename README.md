# colatte
This is a basic environment to test smart contracts and deploy them to a test (Rinkeby) ethereum network.
---

# setup
Add a `secrets.json` at the root director with the format:
```
{
  "MNEMONIC": "blah x 12", // your secret phrase from a test https://metamask.io account
  "PROVIDER_URL": "YOUR_INFURA_URL_GOES_HERE" // get yours at https://infura.io
}
```

Then, you can deploy to your provider url:
`node deploy.js`
