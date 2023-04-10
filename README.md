# 311581012-bdaf-lab5

## ERC20 token contract: 
    - 18 decimals.
    - Minting and burning capability with onlyOwner access control.
    - Ability to transfer ownership
    
## Contract link 
- ERC20 Token was deployed [here](https://goerli.etherscan.io/address/0x231e291f97ab4e0815e41e42d9116bc581b32122).

# ERC20 Token Re-implement
## Install
With [npm](https://npmjs.org/) installed, run

    npm install 
    
## Create a .env file and set your personal key
  set your PRIVATE_KEY, infura ENDPOINT_URL (goerli) and ETHERSCAN_API_KEY

    PRIVATE_KEY = ""
    ENDPOINT_URL = ""
    ETHERSCAN_API_KEY = ""
    
## Compile
    npx hardhat compile

## Test Token function
    npx hardhat test

## Deploy to goerli    
    npx hardhat run scripts/deploy.js --network goerli
    
## Etherscan verify  
    npx hardhat verify DEPLOYED_CONTRACT_ADDRESS
