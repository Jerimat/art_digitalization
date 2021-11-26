// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract digitized_artwork is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function safeMint(address minter, string memory tokenURI) public returns (uint256) {
        _tokenIDs.increment();
        uint256 tokenID = _tokenIDs.current();

        _safeMint(minter, tokenID);
        _setTokenURI(tokenID, tokenURI);

        return tokenID;
    }

}
