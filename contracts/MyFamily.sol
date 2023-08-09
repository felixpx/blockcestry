// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

import "./FamilyAssets.sol";
import "./ONFT1155.sol";

contract MyFamily {

    MyFamilyAssets public mfa ;
    ONFT1155 public oNFT1155 ;

    uint familyId;
    uint assetId;
    uint[] dummyArray;
    uint16 version = 1;
    uint256 value = 2000000;
    bytes adapterParams =abi.encodePacked(version,value);
     //'0x00010000000000000000000000000000000000000000000000000000000000030d40';

    event FamilyCreated( string indexed family, address indexed creator, uint indexed familyId);
    event NewFamilyMember(uint indexed familyId, address indexed familyMember, address indexed addedby, string relation);
    event NewFamilyAsset(uint indexed familyId, uint indexed assetId, address indexed addedBy);
    event FamilyAssetRemoved(uint indexed familyId, uint indexed assetId, address indexed removedBy);

    
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


    function addFamilyAssetAddress(address _address) public {
        mfa = MyFamilyAssets(_address);
    }


    function createFamily( string memory _familyName, string memory _URI) public {
        
        familyId++;
        require(family[familyId].creator == address(0), 'Family exists');
        family[familyId] = UserFamily(msg.sender, _familyName, familyId) ;
        addFamilyMembers(msg.sender, familyId, 'Self' );
        oNFT1155.setURI(familyId, _URI);
        emit FamilyCreated(_familyName, msg.sender,familyId);
    }

    function addFamilyMembers( address _member, uint _familyId, string memory relation) public payable {

        if(family[_familyId].creator != msg.sender) {
            require(familyMembers[msg.sender][_familyId].addedBy != address(0), 'You can only add members to family which you are part of');
        }
        
        familyMembers[_member][_familyId] = Relations(msg.sender, relation);
        oNFT1155.mint(_member, _familyId, 5 );        
        emit NewFamilyMember(_familyId, _member, msg.sender, relation);

    }


    // TO prevent spamming one can mint asset only if belongs to a family
    function addAsset( uint _familyId, string memory assetURI ) public payable {

        assetId++; 
        mfa.safeMint(msg.sender, assetId, assetURI);
        shareAsset(_familyId, assetId);               
    }

    function shareAsset(uint _familyId, uint _assetId) public {
                       
        require(oNFT1155.balanceOf(msg.sender, _familyId) > 0, "Family NFT is required");
        dummyArray = assetFamilyMapping[_familyId];
        dummyArray.push(_assetId);
        assetFamilyMapping[_familyId] = dummyArray;
        emit NewFamilyAsset(_familyId, _assetId, msg.sender);
        
    }

    function removeAsset(uint _familyId, uint  _assetId) public {
        require(mfa.ownerOf(_assetId) == msg.sender, "User is not the Owner");
        dummyArray = assetFamilyMapping[_familyId];
        for(uint i=0; i < dummyArray.length; i++) {
            if(dummyArray[i] == _assetId) {
                dummyArray[i] = dummyArray[dummyArray.length -1];
                dummyArray.pop();
            }
        }

        require (assetFamilyMapping[_familyId].length > dummyArray.length, 'Asset Not found in Family' );
        assetFamilyMapping[_familyId] = dummyArray;
        emit FamilyAssetRemoved(_familyId, _assetId, msg.sender);

    }

    function sendTokens(uint16 _dstChainId, uint _tokenId, address payable _targetAddress, uint _amount) public payable {

        bytes memory bAddress = abi.encodePacked(_targetAddress);
        (uint nfee, ) = oNFT1155.estimateSendFee( _dstChainId, bAddress, _tokenId, _amount, false, adapterParams);
        require(msg.value > nfee, 'msg.value is less that nfee');

        oNFT1155.sendFrom{value:msg.value}(_targetAddress, _dstChainId, bAddress, _tokenId, _amount, _targetAddress, _targetAddress, adapterParams);

    }
}