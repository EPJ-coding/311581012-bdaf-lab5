const hre = require("hardhat");

async function main() {
  const SafeToken = await hre.ethers.getContractFactory("SafeToken");
  const token = await SafeToken.deploy();

  await token.deployed();

  console.log("Deployed to:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });