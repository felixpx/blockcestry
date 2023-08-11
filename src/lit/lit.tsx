import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { ethConnect } from '@lit-protocol/auth-browser';
import { ethers } from "ethers";
const client = new LitJsSdk.LitNodeClient({});
const chain = "ethereum";

class Lit {
    public litNodeClient:any
  
    async connect() {
      await client.connect()
      this.litNodeClient = client
    }
  }


  export const encryptString = async(_string:string,tokenId:string,tokenAddress:string,walletAddress:string,web3Provider:ethers.providers.Web3Provider)=>{
    
    const client = new Lit()

    if (!client.litNodeClient) {
        await client.connect()
      }
      const chain = "ethereum"
   
      const accessControlConditions = [
        {
            contractAddress: tokenAddress,
            standardContractType: "ERC1155",
            chain: "optemismGoerli",
            method: "balanceOf",
            parameters: [":userAddress", tokenId],
            returnValueTest: {
              comparator: ">",
              value: "0",
            },
          },
      ]
    //const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "ethereum" });

const authSig = await ethConnect.signAndSaveAuthMessage({
  web3: web3Provider,
  account: walletAddress,
  chainId: 1,
  expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
});
    
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
        _string
      );
      const encryptedSymmetricKey = await client.litNodeClient.saveEncryptionKey({
        accessControlConditions,
        symmetricKey,
        authSig,
        chain
      });

      return {
         encryptedString:encryptedString
,
        encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
      }
  }


  export const decryptString = async(_string:Blob,tokenId:string,tokenAddress:string,encryptedSymmetricKey:string,walletAddress:string,web3Provider:ethers.providers.Web3Provider)=>{
    
    const client = new Lit()

    if (!client.litNodeClient) {
        await client.connect()
      }
      //const chain = "ethereum"
   
      const accessControlConditions = [
        {
            contractAddress: tokenAddress,
            standardContractType: "ERC1155",
            chain: "optemismGoerli",
            method: "balanceOf",
            parameters: [":userAddress", tokenId],
            returnValueTest: {
              comparator: ">",
              value: "0",
            },
          },
      ]

      const authSig = await ethConnect.signAndSaveAuthMessage({
        web3: web3Provider,
        account: walletAddress,
        chainId: 1,
        expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      });
          const symmetricKey = await client.litNodeClient.getEncryptionKey({
        accessControlConditions,
        toDecrypt: encryptedSymmetricKey,
        chain,
        authSig,
      });
      
    const decryptedString = await LitJsSdk.decryptString(
         _string,
        symmetricKey
      );
  
    return { decryptedString }
  }


export  const encrypt = async(tokenId:string,tokenAddress:string,walletAddress:string,web3Provider:ethers.providers.Web3Provider,file:any,chain:string)=> {

    const accessControlConditions = [
      {
          contractAddress: tokenAddress,
          standardContractType: "ERC1155",
          chain: "optimismGoerli",
          method: "balanceOf",
          parameters: [":userAddress", "1"],
          returnValueTest: {
            comparator: "=",
            value: "0",
          },
        },
    ]


    const client = new Lit()

    if (!client.litNodeClient) {
        await client.connect()
      }
      const chain = "optimismGoerli"
     
  
const authSig = await ethConnect.signAndSaveAuthMessage({
web3: web3Provider,
account: walletAddress,
chainId: 402,
expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
});
  
    const ipfsCid = await LitJsSdk.encryptToIpfs({
      authSig,
      accessControlConditions,
      chain,
      
       file:file, // If you want to encrypt a file instead of a string
      litNodeClient: client.litNodeClient,
      infuraId: process.env.NEXT_PUBLIC_INFURA_API_KEY
      ,
      infuraSecretKey: process.env.NEXT_PUBLIC_INFURA_API_SECRET
      ,
    });

    return ipfsCid
}

export const decrypt = async(ipfsCid:string,walletAddress:string,web3Provider:ethers.providers.Web3Provider) =>{

  const client = new Lit()

  if (!client.litNodeClient) {
      await client.connect()
    }
    const chain = "optimismGoerli"
    const authSig = await ethConnect.signAndSaveAuthMessage({
      web3: web3Provider,
      account: walletAddress,
      chainId: 402,
      expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      });
      
    const decryptedFile= await LitJsSdk.decryptFromIpfs({
      authSig,
      ipfsCid, // This is returned from the above encryption
      litNodeClient: client.litNodeClient,
    });

    return decryptedFile
}