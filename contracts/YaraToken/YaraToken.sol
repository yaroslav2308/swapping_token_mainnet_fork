// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../ERC20/ERC20.sol";

contract YaraToken is ERC20 {
    constructor() ERC20("YaraToken", "YTK") {}
}