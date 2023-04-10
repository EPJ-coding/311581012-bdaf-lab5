//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract SafeToken is ERC20 {

  address public owner;

  modifier onlyOwner() {
      require(msg.sender == owner, "Only owner can call this function");
      _;
  }

  constructor() ERC20("SafeToken", "SAFE") {
    _mint(msg.sender, 1000 * 10 ** decimals());
    owner = msg.sender;
  }

  function mint( uint256 amount) external onlyOwner  {
    _mint(msg.sender, amount);
  }

  function burn(uint256 amount) external onlyOwner  {
    _burn(msg.sender, amount);
  }

  function changeOwner(address newOwner) external onlyOwner  {
    owner = newOwner;
  }

}