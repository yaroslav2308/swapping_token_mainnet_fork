// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../ERC20/ERC20.sol";
import "../Utils/Ownable.sol";
import "../ERC20/ERC20Burnable.sol";

contract YaraToken is ERC20, Ownable, ERC20Burnable {
    constructor(uint initialSupply_) ERC20("YaraToken", "YTK", initialSupply_) {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}