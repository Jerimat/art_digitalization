pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract digitized_NFT is ER721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    //asd
    mapping(uint256 => string) private _URIs;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {

    }

    function safeMint(address to, string memory uri) public returns (uint256) {
        _tokenIdCounter.increment();
        _safeMint(to, _tokenIdCounter.current());

        _URIs[_tokenIdCounter.current()] = uri;

        return _tokenIdCounter.current();
    }

    function getTokenURI(uint256 tokenID) public view override returns (string) {
        return _URIs[tokenID];
    }

}
