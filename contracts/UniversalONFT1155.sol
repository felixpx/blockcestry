// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

import "./ONFT1155.sol";

/// @title Interface of the UniversalONFT standard
contract UniversalONFT1155 is ONFT1155 {
    uint public nextMintId;
    uint public maxMintId;

    /// @notice Constructor for the UniversalONFT
    /// @param uri of the token
    /// @param _layerZeroEndpoint handles message transmission across chains
    /// @param _startMintId the starting mint number on this chain
    /// @param _endMintId the max number of mints on this chain
    constructor(string memory uri, address _layerZeroEndpoint, uint _startMintId, uint _endMintId) ONFT1155(uri, _layerZeroEndpoint) {
        nextMintId = _startMintId;
        maxMintId = _endMintId;
    }

    /// @notice Mint your ONFT
    function mint(string memory _tokenURI, uint quantity) external payable {
        require(nextMintId <= maxMintId, "UniversalONFT1155: max mint limit reached");

        uint newId = nextMintId;
        nextMintId++;

        _mint(msg.sender, newId, quantity , '0x00');
        _setURI(newId, _tokenURI);
        
    }
}