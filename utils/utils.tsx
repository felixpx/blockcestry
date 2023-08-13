import axios from "axios";
import { ethers } from "ethers";
export function getMediaCategory(mimeType:string) {
    const parts = mimeType.split('/');
    if (parts.length >= 2) {
      const type = parts[0].toLowerCase();
      if (type === 'video' || type === 'image') {
        return type;
      }
    }
    return 'file';
  }


  export async function getNFTBalances(walletAddress:string) {
    const headers = {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_COVALENT_API_KEY}`
    };
  
    const apiUrl = `https://api.covalenthq.com/v1/optimism-goerli/address/${walletAddress}/balances_nft/?with-uncached=true`;
  
    try {
      const response = await fetch(apiUrl,  {method: 'GET', headers: headers});
      const data = await response.json();
      const mintedTokenURIs = new Map();
      console.log(data)
      const items = data.items;      
      for (const index in items)
      {
          
                         
           mintedTokenURIs.set(items[index].nft_data[0].token_id, {nftId:items[index].nft_data[0].token_id,image:items[index].nft_data[0].external_data.image,name:items[index].nft_data[0].external_data.name,description:items[index].nft_data[0].external_data.description,ipfsCid:items[index].nft_data[0].external_data?.ipfsCid})   
         
         
      }

      return mintedTokenURIs; // Return the fetched data
    } catch (error) {
      console.error('Error:', error);
      return null; // Return null in case of an error
    }
  }


  export async function getNFTMetadata(contractAddress:string, tokenId:string) {
    
    const headers = {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_COVALENT_API_KEY}`
    };
    
    const apiUrl = `https://api.covalenthq.com/v1/eth-goerli/nft/${contractAddress}/metadata/${tokenId}/`;
  
    try {
      const response = await axios.get(apiUrl, { headers });
      const data = response.data;
      console.log(data);
      return data
    } catch (error) {
      console.error('Error:', error);
      return null
    }
  }
    
  export async function getFamilyAssets(familyId:number, contractAddress: string,
    contractABI: any[], // Use correct ABI type
    provider: ethers.providers.Web3Provider
 )
  {
    let  familyAssets:any = [];
 
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    let index = 0
    try {
      while (true) {
          const assetId = await contract.assetFamilyMapping(familyId, index++);
         familyAssets.push(assetId.toNumber())
       }
  } catch (error) {
      console.error('Error:', error);
  }
    return familyAssets
  }

  export async function getTokenMetadata(mapping:any[],  contractAddress:string,contractABI:any[], provider:ethers.providers.Web3Provider) {
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    const tokenMetadataMapping =  new Map();

    for (const tokenId in mapping) {
        try {
            const tokenURI = await contract.tokenURI(mapping[tokenId]);
            const response = await axios.get(formatIPFSURL( tokenURI));

            if (response.data) {
                tokenMetadataMapping.set(tokenId,response.data);
            } else {
                console.error(`No metadata found for tokenId ${tokenId}`);
            }
        } catch (error) {
            console.error(`Error fetching metadata for tokenId ${tokenId}:`, error);
        }
    }

    return tokenMetadataMapping;
}
export async function fetchIPFSFile(cid:string) {
  const ipfsGateway = 'https://ipfs.io/ipfs/';

  const url = `${ipfsGateway}${cid}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch IPFS file');
    }
    
    const blob = await response.blob();
    
    // Now you have the file content as a Blob object
    return blob;
  } catch (error) {
    console.error('Error fetching IPFS file:', error);
    throw error;
  }
}


export function getFileTypeByFilename(fileName:string) {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  const videoExtensions = ['mp4', 'avi', 'mov', 'mkv'];

  const fileExtension = fileName.split('.').pop().toLowerCase();

  if (imageExtensions.includes(fileExtension)) {
    return 2; // Image
  } else if (videoExtensions.includes(fileExtension)) {
    return 1; // Video
  } else {
    return 3; // Other
  }
}



  export async function getMintedTokenURIs(
    contractAddress: string,
    contractABI: any[], // Use correct ABI type
    userAddress: string,
    provider: ethers.providers.Web3Provider
  ): Promise<Map<number, string>> {
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
  
    const mintedTokenURIs = new Map();
    let tokenId = 1;
    console.log(tokenId)
    console.log(provider)
  
    while (true) {
      try {
        const tokenURI = await contract.uri(tokenId);
        // Here you might want to validate the tokenURI to ensure it's not an error message
        if (tokenURI !== 'Family') {
          const balance = await contract.balanceOf(userAddress, tokenId);
          console.log(balance)
          if (balance.gt(0)) {

            const metadataurl =formatIPFSURL(tokenURI)
            console.log(metadataurl)
             // Use Axios to fetch the token metadata
          const response = await axios.get(metadataurl);
          const tokenMetadata = response.data; // Assuming the response contains JSON metadata

            mintedTokenURIs.set(tokenId, {tokenURI,tokenMetadata});
          }
        }
  
        // Exit the loop if tokenURI is 'Family'
        if (tokenURI === 'Family') {
          break;
        }
  
        tokenId++;
      } catch (error) {
        // Handle errors, such as tokens that don't exist
        console.log(error)
        break; // Exit the loop if an error occurs
      }
    }
  
    return mintedTokenURIs;
  }

 export  function formatIPFSURL(url: string): string {
    const formattedURL = url
      .replace('ipfs://', 'https://')
      .replace(/\/[^/]+$/, (match: string) => match.replace('/', '.ipfs.w3s.link/'));
  
    return formattedURL;
  }
  

  export async function fetchJsonFromIpfs(cid:string) {
    try {
      const url = `https://ipfs.io/ipfs/${cid}/family.json`; // IPFS gateway URL
      const response = await axios.get(url);
      const jsonData = response.data;
  
      return jsonData;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  
  
export const  countryList = 


[  { "value": "AF", "text": "Afghanistan" },
    { "value": "AX", "text": "Aland Islands" },
    { "value": "AL", "text": "Albania" },
    { "value": "DZ", "text": "Algeria" },
    { "value": "AS", "text": "American Samoa" },
    { "value": "AD", "text": "Andorra" },
    { "value": "AO", "text": "Angola" },
    { "value": "AI", "text": "Anguilla" },
    { "value": "AQ", "text": "Antarctica" },
    { "value": "AG", "text": "Antigua and Barbuda" },
    { "value": "AR", "text": "Argentina" },
    { "value": "AM", "text": "Armenia" },
    { "value": "AW", "text": "Aruba" },
    { "value": "AU", "text": "Australia" },
	{ "value": "AT", "text": "Austria" },
    { "value": "AZ", "text": "Azerbaijan" },
    { "value": "BS", "text": "Bahamas" },
    { "value": "BH", "text": "Bahrain" },
    { "value": "BD", "text": "Bangladesh" },
    { "value": "BB", "text": "Barbados" },
    { "value": "BY", "text": "Belarus" },
    { "value": "BE", "text": "Belgium" },
    { "value": "BZ", "text": "Belize" },
    { "value": "BJ", "text": "Benin" },
    { "value": "BM", "text": "Bermuda" },
    { "value": "BT", "text": "Bhutan" },
    { "value": "BO", "text": "Bolivia" },
    { "value": "BQ", "text": "Bonaire, Sint Eustatius and Saba" },
    { "value": "BA", "text": "Bosnia and Herzegovina" },
    { "value": "BW", "text": "Botswana" },
    { "value": "BV", "text": "Bouvet Island" },
    { "value": "BR", "text": "Brazil" },
    { "value": "IO", "text": "British Indian Ocean Territory" },
    { "value": "BN", "text": "Brunei Darussalam" },
    { "value": "BG", "text": "Bulgaria" },
    { "value": "BF", "text": "Burkina Faso" },
    { "value": "BI", "text": "Burundi" },
    { "value": "KH", "text": "Cambodia" },
    { "value": "CM", "text": "Cameroon" },
    { "value": "CA", "text": "Canada" },
    { "value": "CV", "text": "Cape Verde" },
    { "value": "KY", "text": "Cayman Islands" },
    { "value": "CF", "text": "Central African Republic" },
    { "value": "TD", "text": "Chad" },
    { "value": "CL", "text": "Chile" },
    { "value": "CN", "text": "China" },
    { "value": "CX", "text": "Christmas Island" },
    { "value": "CC", "text": "Cocos (Keeling) Islands" },
    { "value": "CO", "text": "Colombia" },
    { "value": "KM", "text": "Comoros" },
    { "value": "CG", "text": "Congo" },
    { "value": "CD", "text": "Congo, Democratic Republic of the Congo" },
    { "value": "CK", "text": "Cook Islands" },
    { "value": "CR", "text": "Costa Rica" },
	
    { "value": "CI", "text": "Cote D'Ivoire" },
    { "value": "HR", "text": "Croatia" },
    { "value": "CU", "text": "Cuba" },
    { "value": "CW", "text": "Curacao" },
    { "value": "CY", "text": "Cyprus" },
    { "value": "CZ", "text": "Czech Republic" },
    { "value": "DK", "text": "Denmark" },
    { "value": "DJ", "text": "Djibouti" },
    { "value": "DM", "text": "Dominica" },
    { "value": "DO", "text": "Dominican Republic" },
    { "value": "EC", "text": "Ecuador" },
    { "value": "EG", "text": "Egypt" },
    { "value": "SV", "text": "El Salvador" },
    { "value": "GQ", "text": "Equatorial Guinea" },
    { "value": "ER", "text": "Eritrea" },
    { "value": "EE", "text": "Estonia" },
    { "value": "ET", "text": "Ethiopia" },
    { "value": "FK", "text": "Falkland Islands (Malvinas)" },
    { "value": "FO", "text": "Faroe Islands" },
    { "value": "FJ", "text": "Fiji" },
    { "value": "FI", "text": "Finland" },
    { "value": "FR", "text": "France" },
    { "value": "GF", "text": "French Guiana" },
    { "value": "PF", "text": "French Polynesia" },
    { "value": "TF", "text": "French Southern Territories" },
    { "value": "GA", "text": "Gabon" },
    { "value": "GM", "text": "Gambia" },
    { "value": "GE", "text": "Georgia" },
    { "value": "DE", "text": "Germany" },
    { "value": "GH", "text": "Ghana" },
    { "value": "GI", "text": "Gibraltar" },
    { "value": "GR", "text": "Greece" },
    { "value": "GL", "text": "Greenland" },
    { "value": "GD", "text": "Grenada" },
    { "value": "GP", "text": "Guadeloupe" },
    { "value": "GU", "text": "Guam" },
    { "value": "GT", "text": "Guatemala" },
    { "value": "GG", "text": "Guernsey" },
    { "value": "GN", "text": "Guinea" },
    { "value": "GW", "text": "Guinea-Bissau" },
    { "value": "GY", "text": "Guyana" },
    { "value": "HT", "text": "Haiti" },
    { "value": "HM", "text": "Heard Island and Mcdonald Islands" },
    { "value": "VA", "text": "Holy See (Vatican City State)" },
    { "value": "HN", "text": "Honduras" },
    { "value": "HK", "text": "Hong Kong" },
    { "value": "HU", "text": "Hungary" },
    { "value": "IS", "text": "Iceland" },
    { "value": "IN", "text": "India" },
    { "value": "ID", "text": "Indonesia" },
    { "value": "IR", "text": "Iran, Islamic Republic of" },
    { "value": "IQ", "text": "Iraq" },
    { "value": "IE", "text": "Ireland" },
    { "value": "IM", "text": "Isle of Man" },
    { "value": "IL", "text": "Israel" },
    { "value": "IT", "text": "Italy" },
    { "value": "JM", "text": "Jamaica" },
    { "value": "JP", "text": "Japan" },
    { "value": "JE", "text": "Jersey" },
    { "value": "JO", "text": "Jordan" },
    { "value": "KZ", "text": "Kazakhstan" },
    { "value": "KE", "text": "Kenya" },
    { "value": "KI", "text": "Kiribati" },
    { "value": "KP", "text": "Korea, Democratic People's Republic of" },
    { "value": "KR", "text": "Korea, Republic of" },
    { "value": "XK", "text": "Kosovo" },
    { "value": "KW", "text": "Kuwait" },
    { "value": "KG", "text": "Kyrgyzstan" },
    { "value": "LA", "text": "Lao People's Democratic Republic" },
    { "value": "LV", "text": "Latvia" },
    { "value": "LB", "text": "Lebanon" },
    { "value": "LS", "text": "Lesotho" },
    { "value": "LR", "text": "Liberia" },
    { "value": "LY", "text": "Libyan Arab Jamahiriya" },
	
    { "value": "LI", "text": "Liechtenstein" },
    { "value": "LT", "text": "Lithuania" },
    { "value": "LU", "text": "Luxembourg" },
    { "value": "MO", "text": "Macao" },
    { "value": "MK", "text": "Macedonia, the Former Yugoslav Republic of" },
    { "value": "MG", "text": "Madagascar" },
    { "value": "MW", "text": "Malawi" },
    { "value": "MY", "text": "Malaysia" },
    { "value": "MV", "text": "Maldives" },
    { "value": "ML", "text": "Mali" },
    { "value": "MT", "text": "Malta" },
    { "value": "MH", "text": "Marshall Islands" },
    { "value": "MQ", "text": "Martinique" },
    { "value": "MR", "text": "Mauritania" },
    { "value": "MU", "text": "Mauritius" },
    { "value": "YT", "text": "Mayotte" },
    { "value": "MX", "text": "Mexico" },
    { "value": "FM", "text": "Micronesia, Federated States of" },
    { "value": "MD", "text": "Moldova, Republic of" },
    { "value": "MC", "text": "Monaco" },
    { "value": "MN", "text": "Mongolia" },
    { "value": "ME", "text": "Montenegro" },
    { "value": "MS", "text": "Montserrat" },
    { "value": "MA", "text": "Morocco" },
    { "value": "MZ", "text": "Mozambique" },
    { "value": "MM", "text": "Myanmar" },
    { "value": "NA", "text": "Namibia" },
    { "value": "NR", "text": "Nauru" },
    { "value": "NP", "text": "Nepal" },
    { "value": "NL", "text": "Netherlands" },
    { "value": "AN", "text": "Netherlands Antilles" },
    { "value": "NC", "text": "New Caledonia" },
    { "value": "NZ", "text": "New Zealand" },
    { "value": "NI", "text": "Nicaragua" },
    { "value": "NE", "text": "Niger" },
    { "value": "NG", "text": "Nigeria" },
    { "value": "NU", "text": "Niue" },
    { "value": "NF", "text": "Norfolk Island" },
    { "value": "MP", "text": "Northern Mariana Islands" },
    { "value": "NO", "text": "Norway" },
    { "value": "OM", "text": "Oman" },
    { "value": "PK", "text": "Pakistan" },
    { "value": "PW", "text": "Palau" },
    { "value": "PS", "text": "Palestinian Territory, Occupied" },
    { "value": "PA", "text": "Panama" },
    { "value": "PG", "text": "Papua New Guinea" },
    { "value": "PY", "text": "Paraguay" },
    { "value": "PE", "text": "Peru" },
    { "value": "PH", "text": "Philippines" },
    { "value": "PN", "text": "Pitcairn" },
    { "value": "PL", "text": "Poland" },
    { "value": "PT", "text": "Portugal" },
    { "value": "PR", "text": "Puerto Rico" },
    { "value": "QA", "text": "Qatar" },
    { "value": "RE", "text": "Reunion" },
    { "value": "RO", "text": "Romania" },
    { "value": "RU", "text": "Russian Federation" },
    { "value": "RW", "text": "Rwanda" },
	{ "value": "BL", "text": "Saint Barthelemy" },
{ "value": "SH", "text": "Saint Helena" },
{ "value": "KN", "text": "Saint Kitts and Nevis" },
{ "value": "LC", "text": "Saint Lucia" },
{ "value": "MF", "text": "Saint Martin" },
{ "value": "PM", "text": "Saint Pierre and Miquelon" },
{ "value": "VC", "text": "Saint Vincent and the Grenadines" },
{ "value": "WS", "text": "Samoa" },
{ "value": "SM", "text": "San Marino" },
{ "value": "ST", "text": "Sao Tome and Principe" },
{ "value": "SA", "text": "Saudi Arabia" },
{ "value": "SN", "text": "Senegal" },
{ "value": "RS", "text": "Serbia" },
{ "value": "CS", "text": "Serbia and Montenegro" },
{ "value": "SC", "text": "Seychelles" },
{ "value": "SL", "text": "Sierra Leone" },
{ "value": "SG", "text": "Singapore" },
{ "value": "SX", "text": "Sint Maarten" },
{ "value": "SK", "text": "Slovakia" },
{ "value": "SI", "text": "Slovenia" },
{ "value": "SB", "text": "Solomon Islands" },
{ "value": "SO", "text": "Somalia" },
{ "value": "ZA", "text": "South Africa" },
{ "value": "GS", "text": "South Georgia and the South Sandwich Islands" },
{ "value": "SS", "text": "South Sudan" },
{ "value": "ES", "text": "Spain" },
{ "value": "LK", "text": "Sri Lanka" },
{ "value": "SD", "text": "Sudan" },
{ "value": "SR", "text": "Suriname" },
{ "value": "SJ", "text": "Svalbard and Jan Mayen" },
{ "value": "SZ", "text": "Swaziland" },
{ "value": "SE", "text": "Sweden" },
{ "value": "CH", "text": "Switzerland" },
{ "value": "SY", "text": "Syrian Arab Republic" },
{ "value": "TW", "text": "Taiwan, Province of China" },
{ "value": "TJ", "text": "Tajikistan" },
{ "value": "TZ", "text": "Tanzania, United Republic of" },
{ "value": "TH", "text": "Thailand" },
{ "value": "TL", "text": "Timor-Leste" },
{ "value": "TG", "text": "Togo" },
{ "value": "TK", "text": "Tokelau" },
{ "value": "TO", "text": "Tonga" },
{ "value": "TT", "text": "Trinidad and Tobago" },
{ "value": "TN", "text": "Tunisia" },
{ "value": "TR", "text": "Turkey" },
{ "value": "TM", "text": "Turkmenistan" },
{ "value": "TC", "text": "Turks and Caicos Islands" },
{ "value": "TV", "text": "Tuvalu" },
{ "value": "UG", "text": "Uganda" },
{ "value": "UA", "text": "Ukraine" },
{ "value": "AE", "text": "United Arab Emirates" },
{ "value": "GB", "text": "United Kingdom" },
{ "value": "US", "text": "United States" },
{ "value": "UM", "text": "United States Minor Outlying Islands" },
{ "value": "UY", "text": "Uruguay" },
{ "value": "UZ", "text": "Uzbekistan" },
{ "value": "VU", "text": "Vanuatu" },
{ "value": "VE", "text": "Venezuela" },
{ "value": "VN", "text": "Viet Nam" },
{ "value": "VG", "text": "Virgin Islands, British" },
{ "value": "VI", "text": "Virgin Islands, U.s." },
{ "value": "WF", "text": "Wallis and Futuna" },
{ "value": "EH", "text": "Western Sahara" },
{ "value": "YE", "text": "Yemen" },
{ "value": "ZM", "text": "Zambia" },
{ "value": "ZW", "text": "Zimbabwe" }

]
