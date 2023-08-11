const optimismGoerli=0
const base=1


export const familyTokenAddress = new Map([[optimismGoerli,"0xD238246168278E2dE843b573f9Ff04db8c22f1aC"]
,[base,"0x564a4aC7716F9c5540E0afE163391146e99AA10d"]
])
export const familyTokenABI = ['function uri(uint256 tokenId) external view returns (string memory)',
'function balanceOf(address account, uint256 id) external view returns (uint256)','function setURI( uint tokenId, string memory _tokenURI ) external']


export const timeCapsuleTokenAddress = new Map([[optimismGoerli,""]
,[base,"0xd9290123C280203e553d210e0a6C13a005BAe46B"]
])

export const timeCapsuleTokenABI = []


export const myFamilyContractAddress = new Map([[optimismGoerli,"0x9580393a703F1087b50299F464b311afd74E9f59"]
,[base,"0x2BC267B005Ab0ac97EE454D8e2dB2fDfaF9AB052"]
])

export const  myFamilyContractABI = [
    // Define function signatures here
    'function add1155Address(address _address)',
    'function addFamilyAssetAddress(address _address)',
    'function createFamily(string memory _familyName, string memory _URI)',
    'function addFamilyMembers(address _member, uint _familyId, string memory relation)',
    'function addAsset(uint _familyId, string memory assetURI)',
    'function shareAsset(uint _familyId, uint _assetId)',
    'function removeAsset(uint _familyId, uint _assetId)',
    'function sendTokens(uint16 _dstChainId, uint _tokenId, address payable _targetAddress, uint _amount)',
    'event NewFamilyMember(uint indexed familyId, address indexed familyMember, address indexed addedby, string relation)'
  ]

  export const myFamilyAssetsContractAddress = new Map([[optimismGoerli,"0xB2cF9fFd277cC5B1F0ec6387a0ccCF9d57E53409"]
  ,[base,"0xd9290123C280203e553d210e0a6C13a005BAe46B "]
  ])
  
  export const  myFamilyAssetsContractABI =  [
    'function constructor()',
    'function safeMint(address to, uint256 tokenId, string memory uri)',
    'function _burn(uint256 tokenId)',
    'function _setTokenURI(uint256 tokenId, string memory uri)',
    'function tokenURI(uint256 tokenId) returns (string memory)',
    'function supportsInterface(bytes4 interfaceId) returns (bool)'
  ];
   