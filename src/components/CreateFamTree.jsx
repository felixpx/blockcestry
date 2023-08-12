"use client";
import Image from "next/image";
// import Header2 from "../../components/Header2";
import React, { useEffect, useRef, useState } from "react";
import FamilyTree from "../../src/components/familytree/familytree";
import { countryList } from "../../utils/utils";
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { useAccountAbstraction } from "../../context/accountContext";
import EnableEditButton from "../../src/components/EnableEditing";
import { useRouter, useSearchParams } from "next/navigation";
import { NFTStorage } from "nft.storage";
import Notification from "@/components/Notification/Notification";
import { formatIPFSURL } from "../../utils/utils";
import { Web3Storage, File } from "web3.storage";
import { familyTokenAddress, familyTokenABI } from "@/components/Contracts";
import { ethers } from "ethers";

export default function CreateFamilyTree() {
  const searchParams = useSearchParams();
  const [familyObject, setFamilyObject] = useState();
  const divRef = useRef();
  const imageRef = useRef();
  const fileInputRef = useRef(null);
  const router = useRouter();
  const [nftstorage] = useState(
    new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY })
  );
  const [storage] = useState(
    new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3_STORAGE_KEY })
  );

  // NOTIFICATIONS functions
  const [notificationTitle, setNotificationTitle] = useState();
  const [notificationDescription, setNotificationDescription] = useState();
  const [dialogType, setDialogType] = useState(1);
  const [show, setShow] = useState(false);
  const close = async () => {
    setShow(false);
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const {
    isEditingEnabled,
    isAuthenticated,
    ownerAddress,
    chainId,
    web3Provider,
    loginWeb3Auth,
    web3ProviderConnected, // ...other context values and functions you need
  } = useAccountAbstraction();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    try {
      const objectData = {
        name: "Image",
        description: "Profile Pic",
        image: file,
      };
      const metadata = await nftstorage.store(objectData);
      console.log(metadata);
      //console.log(metadata.data.image.href)
      const link = metadata.data.image.href;
      const imageUrl = formatIPFSURL(link);

      console.log(link);
      console.log(imageUrl);
      imageRef.current.value = imageUrl;
      navigator.clipboard.writeText(imageUrl);
      setDialogType(1); //Success
      setNotificationTitle("Upload Image");
      setNotificationDescription("Image link copied to clipboard.");
      setShow(true);
    } catch (error) {
      console.log(error);
      setDialogType(2); //Error
      setNotificationTitle("Upload Image");
      setNotificationDescription("Error uploading image.");
      setShow(true);
    }
  };

  const [nodes, setNodes] = useState([]);
  const [familyTree, setFamilyTree] = useState();
  useEffect(() => {
    setFamilyTree(
      new FamilyTree(divRef.current, {
        nodeTreeMenu: true,
        mode: "dark",
        template: "hugo",
        nodeBinding: {
          field_0: "name",
          field_1: "born",
          img_0: "photo",
        },
        editForm: {
          titleBinding: "name",
          photoBinding: "photo",
          addMoreBtn: "Add element",
          addMore: "Add more elements",
          addMoreFieldName: "Element name",
          generateElementsFromFields: false,
          elements: [
            { type: "textbox", label: "Full Name", binding: "name" },
            { type: "textbox", label: "Gender", binding: "gender" },

            { type: "textbox", label: "Email Address", binding: "email" },
            [
              { type: "textbox", label: "Phone", binding: "phone" },

              { type: "date", label: "Date Of Birth", binding: "born" },
              { type: "date", label: "Date Of Death", binding: "died" },
            ],
            [
              {
                type: "select",
                options: countryList,
                label: "Country",
                binding: "country",
              },
              { type: "textbox", label: "City", binding: "city" },
            ],
            {
              type: "textbox",
              label: "Photo Url",
              binding: "photo",
              btn: "Upload",
            },
          ],
        },
        nodeMenu: {
          edit: { text: "Edit" },
          details: { text: "Details" },
        },
        menu: {
          pdf: { text: "Export PDF" },
          png: { text: "Export PNG" },
          svg: { text: "Export SVG" },
          csv: { text: "Export CSV" },
          json: { text: "Export JSON" },
        },

        nodes: nodes,
        toolbar: {
          layout: true,
          zoom: true,
          fit: true,
          expandAll: false,
          fullScreen: true,
        },
      })
    );

    return () => {
      familyTree?.destroy();
    };
  }, [nodes]);

  const saveFamilyTree = async () => {
    console.log(familyTree?.nodes);
    console.log(nodes);
    const _cid = await storage.put([
      new File([JSON.stringify(familyTree?.nodes)], "family.json"),
    ]);
    console.log(_cid);
    familyObject.ipfsCid = _cid;

    const cid = await storage.put([
      new File([JSON.stringify(familyObject)], "metadata.json"),
    ]);
    console.log(cid);

    const tokenContract = new ethers.Contract(
      familyTokenAddress.get(chainId),
      familyTokenABI,
      web3Provider?.getSigner()
    );
    console.log(tokenContract);
    try {
      let tx1 = await tokenContract.callStatic.setURI(
        familyObject.nftId,
        `ipfs://${cid}/metadata.json`
      );
      let tx2 = await tokenContract.setURI(
        familyObject.nftId,
        `ipfs://${cid}/metadata.json`
      );

      await tx2.wait();

      setDialogType(1); //Success
      setNotificationTitle("Update Family Tree");
      setNotificationDescription("Family Tree updated successfully.");
      setShow(true);
    } catch (error) {
      if (error.code === "TRANSACTION_REVERTED") {
        console.log("Transaction reverted");
        // let revertReason = ethers.utils.parseRevertReason(error.data);
        setNotificationDescription("Reverted");
      } else if (error.code === "ACTION_REJECTED") {
        setNotificationDescription("Transaction rejected by user");
      } else {
        console.log(error);
        //const errorMessage = ethers.utils.revert(error.reason);
        setNotificationDescription(
          `Transaction failed with error: ${error.reason}`
        );
      }
      setDialogType(2); //Error
      setNotificationTitle("Update Family Tree");

      setShow(true);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    if (familyObject) {
      console.log(familyObject);
      if (familyObject.ipfsCid == "NOCID")
        setNodes([
          {
            id: 3,
            pids: [1, 2],
            gender: "female",
            photo: "",
            name: "Your Name",
            born: "1943-01-13",
            email: "",
            phone: "",
            city: "",
            country: "TT",
          },
        ]);
    }
  }, [familyObject]);

  useEffect(() => {
    setFamilyObject(JSON.parse(searchParams.get("q")));
    console.log(searchParams.get("q"));
    loginWeb3Auth();
  }, []);
  return (
    <main className="rounded-xl w-full ">
      {/* <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div> */}
      {/* <Header2 /> */}

      <div className="flex flex-col items-center mt-4">
        {/* <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          <FontAwesomeIcon
            icon={faPeopleGroup}
            className={"text-green-600 mr-2"}
          />
          Family Tree
        </h2> */}
        <section className="mt-2 w-full overflow-x-auto px-16 ">
          <div className="pt-11 ">
            {!isEditingEnabled && <EnableEditButton />}
            <button
              onClick={() =>
                router.push(
                  `/viewtimecapsule/${1}?q=${JSON.stringify(familyObject)}`
                )
              }
              className="ml-2 p-2 mb-5 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary px-5 text-base font-semibold text-white transition-all hover:text-teal-500 hover:border-teal-500"
            >
              Time Capsule
            </button>
            {isEditingEnabled && (
              <button
                onClick={saveFamilyTree}
                className="ml-2 p-2 mb-5 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary px-5 text-base font-semibold text-white transition-all hover:text-teal-500 hover:border-teal-500"
              >
                Save Family Tree
              </button>
            )}

            <input
              type="file"
              id="fileInput"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            {isEditingEnabled && (
              <button
                onClick={handleButtonClick}
                className="ml-2 p-2 mb-5 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary px-5 text-base font-semibold text-white transition-all hover:text-teal-500 hover:border-teal-500"
              >
                Upload Image
              </button>
            )}
            {isEditingEnabled && (
              <input
                id="image-url"
                type="text"
                ref={imageRef}
                className="mr-2 w-80 ml-2 py-2 px-3 bg-gray-800 border border-gray-300 rounded text-white focus:outline-none focus:border-gray-400"
                placeholder="Image URL"
              />
            )}

            <div id="tree" className="" ref={divRef}></div>
          </div>
        </section>
      </div>
      <Notification
        type={dialogType}
        show={show}
        close={close}
        title={notificationTitle}
        description={notificationDescription}
      />
    </main>
  );
}
