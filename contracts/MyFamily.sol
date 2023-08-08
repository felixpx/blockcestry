// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

import "./ONFT721.sol";
import "./ONFT1155.sol";

contract MyFamily {

    ONFT721 oNFT721 ;
    ONFT1155 oNFT1155 ;

    uint familyId;
    uint assetId;
    uint16 version = 1;
    uint256 value = 2000000;
    bytes adapterParams =abi.encodePacked(version,value);
     //'0x00010000000000000000000000000000000000000000000000000000000000030d40';

    struct UserFamily{
        address creator;
        string familyName;
        uint familyId;
    }

    struct Relations {
        address addedBy;
        string relation;
    }

    mapping (uint => UserFamily) public family;
    mapping (address => mapping( uint => Relations) ) public familyMembers;
    mapping (uint => uint[]) public assetFamilyMapping;


    function add1155Address(address _address) public {
        oNFT1155 = ONFT1155(_address);
    }


    function add721Address(address _address) public {
        oNFT721 = ONFT721(_address);
    }


    function createFamily( string memory _familyName, string memory _URI) public {

        require(family[familyId].creator == address(0), 'Family Name exists');
        family[familyId] = UserFamily(msg.sender, _familyName, familyId) ;
        addFamilyMembers(msg.sender, familyId, 'Self' );
        oNFT1155.setURI(familyId, _URI);
        familyId++;
    }

    function addFamilyMembers( address _member, uint _familyId, string memory relation) public payable {

        if(family[_familyId].creator != msg.sender) {
            require(familyMembers[msg.sender][_familyId].addedBy != address(0), 'You can only add members to family which you are part of');
        }
        
        familyMembers[_member][_familyId] = Relations(msg.sender, relation);
        oNFT1155.mint(_member, _familyId, 5 );        

    }

    function addAsset( uint _familyId, string memory assetURI ) public payable {

        require(oNFT1155.balanceOf(msg.sender, _familyId) > 0, "Family NFT is required");
        uint[] memory dummyArray = assetFamilyMapping[_familyId];
        oNFT721.mint(msg.sender, assetId, assetURI);
        dummyArray[dummyArray.length] = assetId;
        assetFamilyMapping[_familyId] = dummyArray;
        assetId++;        
    }

    function sendTokens(uint16 _dstChainId, uint _tokenId, address payable _targetAddress, uint _amount) public payable {

        bytes memory bAddress = abi.encodePacked(_targetAddress);
        (uint nfee, ) = oNFT1155.estimateSendFee( _dstChainId, bAddress, _tokenId, _amount, false, adapterParams);
        require(msg.value > nfee, 'msg.value is less that nfee');

        oNFT1155.sendFrom{value:msg.value}(_targetAddress, _dstChainId, bAddress, _tokenId, _amount, _targetAddress, _targetAddress, adapterParams);

    }
}