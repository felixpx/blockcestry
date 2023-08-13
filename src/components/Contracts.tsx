const optimismGoerli=0
const base=1
const zora=2
const mode=3

export const familyTokenAddress = new Map([[optimismGoerli,"0xD238246168278E2dE843b573f9Ff04db8c22f1aC"]
,[base,"0x564a4aC7716F9c5540E0afE163391146e99AA10d"],[zora,"0x8d5862b0568A2d644be4C406bf6763C025dd8535"],[mode,"0x64C5668B710E751D4C0F068cf6D45FF07fFdB32a"]
])
export const familyTokenABI = ['function uri(uint256 tokenId) external view returns (string memory)',
'function balanceOf(address account, uint256 id) external view returns (uint256)'
,'function setURI( uint tokenId, string memory _tokenURI ) external'
,'function setApprovalForAll(address operator, bool approved) external']


/*export const timeCapsuleTokenAddress = new Map([[optimismGoerli,""]
,[base,"0xd9290123C280203e553d210e0a6C13a005BAe46B"],[zora,""],[mode,""]
])

export const timeCapsuleTokenABI = []
*/

export const myFamilyContractAddress = new Map([[optimismGoerli,"0x9580393a703F1087b50299F464b311afd74E9f59"]
,[base,"0x825Dd1B91f2811eDb469C803410a1078c1617f4B"],[zora,"0x64C5668B710E751D4C0F068cf6D45FF07fFdB32a"],[mode,"0x8d5862b0568A2d644be4C406bf6763C025dd8535"]
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
    'function sendTokens(uint16 _dstChainId, uint _tokenId, address payable _targetAddress, uint _amount) public payable',
    'event NewFamilyMember(uint indexed familyId, address indexed familyMember, address indexed addedby, string relation)',
    'function assetFamilyMapping(uint256 ,uint256 ) public view returns (uint256)'
  ]

  export const myFamilyAssetsContractAddress = new Map([[optimismGoerli,"0xB2cF9fFd277cC5B1F0ec6387a0ccCF9d57E53409"]
  ,[base,"0xa059f70E2D5ecDe3340a4AD5F77942C84C3c4540"],[zora,"0x537Debc329cd16867739b09C1cD82E3e36cbCc51"],[mode,"0x99996dDBeF44284298aE101DF6D284bcc8360eAe"]
  ])
  
  export const  myFamilyAssetsContractABI =  [
    'function constructor()',
    'function safeMint(address to, uint256 tokenId, string memory uri)',
    'function _burn(uint256 tokenId)',
    'function _setTokenURI(uint256 tokenId, string memory uri)',
    'function tokenURI(uint256 tokenId)  external view returns (string memory)',
    'function supportsInterface(bytes4 interfaceId) returns (bool)',
  ];
   