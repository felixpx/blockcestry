"use client";
// components/FamilyTree.js
import React from "react";
import "../styles/family-tree.css";
import { useRouter } from "next/navigation";
import NFTDataDialog from "./NFTDataDialog";
import ShareDialog from "./ShareDialog";
import { useRef,useState,useEffect } from "react";
import Notification from "@/components/Notification/Notification";
import { ethers } from "ethers";
import { useAccountAbstraction } from "../../context/accountContext";
import EnableEditButton from "./EnableEditing";
import { NFTStorage } from "nft.storage";
import { getNFTBalances,getMintedTokenURIs,formatIPFSURL } from "../../utils/utils";
import { myFamilyContractAddress,myFamilyContractABI, familyTokenAddress, familyTokenABI } from "./Contracts";


const FamilyTreeList = () => {
const router = useRouter();
const [familytrees,setFamilyTrees] = useState([])
const familyId = useRef(null)
const [nftstorage] = useState(
  new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY})
);
const [openNFTDataDialog,setOpenNFTDataDialog] = useState(false)
const [openShareDialog,setOpenShareDialog] = useState(false)
const {
  isEditingEnabled,
  isAuthenticated,
  ownerAddress,
  chainId,
  web3Provider,
  loginWeb3Auth,
  web3ProviderConnected

 // ...other context values and functions you need
} = useAccountAbstraction();

  const [refreshData, setRefreshData] = useState(new Date());

  // NOTIFICATIONS functions
  const [notificationTitle, setNotificationTitle] = useState();
  const [notificationDescription, setNotificationDescription] = useState();
  const [dialogType, setDialogType] = useState(1);
  const [show, setShow] = useState(false);
  const close = async () => {
    setShow(false);
  };

const createFamilyTree = async(_name,_description,_file)=>{


    
  if(!isAuthenticated)
  {
     setDialogType(2) //Error
     setNotificationTitle("Create Family Tree")
     setNotificationDescription("You have not signed in.")
     setShow(true)
     
    return
  }

  if(_name == "")
  {
   setDialogType(2) //Error
   setNotificationTitle("Create Family Tree")
   setNotificationDescription("You have not entered a name.")
   setShow(true)
   return
  }

  if(_description == "")
  {
   setDialogType(2) //Error
   setNotificationTitle("Create Family Tree")
   setNotificationDescription("You have not entered a description.")
   setShow(true)
   return
  }

  if(_file == null)
  {
   setDialogType(2) //Error
   setNotificationTitle("Create Family Tree")
   setNotificationDescription("You have not selected an NFT image.")
   setShow(true)
   return
  }

  let metadata 
  try{
  const objectData = {name:_name, description:_description,image:_file,ipfsCid:"NOCID" }
  metadata = await nftstorage.store(objectData) 
  console.log(metadata)
  //console.log(metadata.data.image.href)
 const link =metadata.data.image.href
 const imageUrl = link.replace('ipfs://', 'https://').replace(/\/[^/]+$/, (match) => {
  return match.replace('/', '.ipfs.dweb.link/');
});    
console.log(link)
console.log(imageUrl)
  }catch(error)
  {
    console.log(error)
  }
  console.log(web3Provider)
  const myFamilyContract = new ethers.Contract(myFamilyContractAddress.get(chainId),myFamilyContractABI,web3Provider?.getSigner());
  console.log(myFamilyContract)
  
  
  try{
    let tx1 = await myFamilyContract.callStatic.createFamily(_name,metadata.url
    
     );
     let tx2 =await myFamilyContract.createFamily(_name,metadata.url,{
      gasLimit: 3000000}
    
      );
      await tx2.wait();

     setDialogType(1); //Success
     setNotificationTitle("Create Family Tree")
     setNotificationDescription("Family Tree created successfully.");
     setShow(true);
     setRefreshData(new Date())
   }
   catch(error)
   {
    if (error.code === 'TRANSACTION_REVERTED') {
      console.log('Transaction reverted');
     // let revertReason = ethers.utils.parseRevertReason(error.data);
      setNotificationDescription("Reverted");
    }  else if (error.code === 'ACTION_REJECTED') {
    setNotificationDescription('Transaction rejected by user');
  }else {
   console.log(error)
   //const errorMessage = ethers.utils.revert(error.reason);
    setNotificationDescription(`Transaction failed with error: ${error.reason}`);
  
}
    setDialogType(2) //Error
    setNotificationTitle("Create Family Tree")

    setShow(true)
   }
}


  const shareFamilyTree = async(_userAddress,relation,_familyId)=>{

    alert(familyId.current)
    
    if(!ethers.utils.isAddress(_userAddress))
    {
     setDialogType(2) //Error
     setNotificationTitle("Share Family Tree")
     setNotificationDescription("You have not entered a valid address.")
     setShow(true)
     return
    }
   
    if(relation==""){
      setDialogType(2) //Error
      setNotificationTitle("Share Family Tree")
      setNotificationDescription("Relation not selected.")
      setShow(true)
      return
     }

     const myFamilyContract = new ethers.Contract(myFamilyContractAddress.get(chainId),myFamilyContractABI,web3Provider?.getSigner());
  console.log(myFamilyContract)
  
  
  try{
    let tx1 = await myFamilyContract.callStatic.addFamilyMembers(_userAddress,familyId.current,relation
    
     );
     let tx2 =await myFamilyContract.addFamilyMembers(_userAddress,familyId.current,relation
    
      );
      await tx2.wait();

     setDialogType(1); //Success
     setNotificationTitle("Share Family Tree")
     setNotificationDescription("Family Tree shared successfully.");
     setShow(true);
     setRefreshData(new Date())
   }
   catch(error)
   {
    if (error.code === 'TRANSACTION_REVERTED') {
      console.log('Transaction reverted');
     // let revertReason = ethers.utils.parseRevertReason(error.data);
      setNotificationDescription("Reverted");
    }  else if (error.code === 'ACTION_REJECTED') {
    setNotificationDescription('Transaction rejected by user');
  }else {
   console.log(error)
   //const errorMessage = ethers.utils.revert(error.reason);
    setNotificationDescription(`Transaction failed with error: ${error.reason}`);
  
}
    setDialogType(2) //Error
    setNotificationTitle("Share Family Tree")

    setShow(true)
   }
    
  };

  const closeNFTDataDialog = () => {
    setOpenNFTDataDialog(false);
  };

  
  const closeShareDialog = () => {
    setOpenShareDialog(false);
  };

  const OpenShareDialog = (id)=>
  {

      familyId.current = id
      setOpenShareDialog(true)
  }

  useEffect(()=>{
    async function getFamilyTrees(){
      if(ownerAddress )
      {
        if(chainId == 0)
        {       
           const data = await getNFTBalances(ownerAddress)  
           console.log(data)
           
        } 
        else
        {
          console.log(chainId)
          console.log(ownerAddress)
          console.log(web3Provider)
          // const data = await getTokenMetadataForFamilyMember(familyTokenAddress.get(chainId),familyTokenABI,ownerAddress,web3Provider)
           
           //const data  = await getFamilyIdsForFamilyMember(myFamilyContractAddress.get(chainId),myFamilyContractABI,ownerAddress,web3Provider)
           console.log(ownerAddress)
           const data = await getMintedTokenURIs(familyTokenAddress.get(chainId),familyTokenABI,ownerAddress,web3Provider)
           console.log(data)
           let _trees = []
           for (const [key, value] of data.entries()) {
            _trees.push({name:value.tokenMetadata.name,description:value.tokenMetadata.description,nftId:key,image:formatIPFSURL( value.tokenMetadata.image),ipfsCid:value.tokenMetadata.ipfsCid})
          }
          setFamilyTrees(_trees)
          console.log(_trees)
        }
      } 
       
    }
     if(web3ProviderConnected) 
    getFamilyTrees()
   // else
    //loginWeb3Auth()

  },[refreshData,web3ProviderConnected])

  useEffect(()=>{
     loginWeb3Auth()
  },[])
  return (
    <section className="overflow-x-auto  mt-2 px-14 ">
      <div className="border-t border-white/10 bg-black bg-opacity-70 rounded-xl pt-11">
        {!isEditingEnabled && <EnableEditButton />}

        {isEditingEnabled && (
          <button
            onClick={() => setOpenNFTDataDialog(true)}
            className="ml-4 p-2 mb-5 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary px-5 text-base font-semibold text-white transition-all hover:text-indigo-500 hover:border-indigo-500"
          >
            Create Family Tree
          </button>
        )}
        <div className="m-4 mb-12 ">
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {familytrees.map((object, index) => (
              <div key={object.tokenId}>
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg sm:aspect-h-3 sm:aspect-w-2">
                  <img
                    onClick={() => router.push(`/createfamilytree?q=${JSON.stringify(object)}`)}
                    src={object.image}
                    alt="Image"
                    className="cursor-pointer h-[300px] w-full object-cover object-center group-hover:opacity-75"
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-base font-medium text-white">
                  <h3>{object.name}</h3>
                </div>
                <div className="mt-1 flex items-center justify-between text-base font-medium text-white">
                  <button
                    onClick={() => router.push(`/createfamilytree?q=${JSON.stringify(object)}`)}
                    className="mb-5 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary px-5 text-base font-semibold text-white transition-all hover:text-indigo-500 hover:border-indigo-500"
                  >
                    View
                  </button>
                  <button
                    onClick={() => OpenShareDialog(object.nftId)}
                    className="mb-5 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary px-5 text-base font-semibold text-white transition-all hover:text-indigo-500 hover:border-indigo-500"
                  >
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <NFTDataDialog
        open={openNFTDataDialog}
        setOpen={closeNFTDataDialog}
        createNFT={createFamilyTree}
        refreshData={refreshData}
        type={1}
      />
      <ShareDialog
        open={openShareDialog}
        setOpen={closeShareDialog}
        share={shareFamilyTree}
        refreshData={refreshData}
        title={"Share Family Tree"}
      />

      <Notification
        type={dialogType}
        show={show}
        close={close}
        title={notificationTitle}
        description={notificationDescription}
      />
    </section>
  );
};

export default FamilyTreeList;
