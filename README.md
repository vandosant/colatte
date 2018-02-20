# colatte
Basic ethereum dev framework; Work from udemy course http://bit.ly/2GuJj9r

---
This is a basic environment to test smart contracts and deploy them to a test (Rinkeby) ethereum network.
---

# setup
Add a `secrets.json` at the root director with the format:
```
{
  "MNEMONIC": "blah blah blah blah blah blah blah blah blah blah blah blah", // secret phrase from a https://metamask.io account
  "PROVIDER_URL": "YOUR_INFURA_URL_GOES_HERE" // get yours at https://infura.io
}
```

Then, you can deploy to your provider url:
`node deploy.js`
