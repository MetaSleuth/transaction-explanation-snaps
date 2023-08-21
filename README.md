# @metamask/template-snap-monorepo

This repository demonstrates how to develop a snap with TypeScript. For detailed instructions, see [the MetaMask documentation](https://docs.metamask.io/guide/snaps.html#serving-a-snap-to-your-local-environment).

MetaMask Snaps is a system that allows anyone to safely expand the capabilities of MetaMask. A _snap_ is a program that we run in an isolated environment that can customize the wallet experience.

## Snaps is pre-release software

To interact with (your) Snaps, you will need to install [MetaMask Flask](https://metamask.io/flask/), a canary distribution for developers that provides access to upcoming features.

## Getting Started

Clone the template-snap repository [using this template](https://github.com/MetaMask/template-snap-monorepo/generate) and setup the development environment:

```shell
yarn install && yarn start
```
# Metadock Snap

Metadock Snap utilizes *pre-execution* and *ChatGPT* technology to predict the transactions and explain the transaction before signing transactions.

## Application Scenario
Web3 users leverage wallets to sign transactions to join the DeFi ecosystem, however, most users lack the understanding of transaction content and impact.
This ignorance causes users to be deceived by phishers, mistakenly sign malicious transactions, and cause losses to their own assets.

## Snap Features

### Transaction Movement Explanation

Metadock Snap first pre-executes the transaction and provides the ability to explain the transaction movement through chatGPT, allowing users to understand the transaction before signing.
## License

Snap is MIT licensed.

## About US
[BlockSec](https://blocksec.com/#about) is dedicated to building blockchain security infrastructure. The team is founded by top-notch security researchers and experienced experts from both academia and industry.
We have published multiple blockchain security papers in prestigious conferences, reported several zero-day attacks of DeFi applications, and successfully protected digital assets that are worth more than 5 million dollars by blocking multiple attacks.

