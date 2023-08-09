"use client";
// components/TimeCapsule.js
import React from "react";
import "../styles/family-tree.css";
import { useRouter } from "next/navigation";
import UploadMediaDialog from "./UploadMediaDialog";
import ViewMediaDialog from "./ViewMediaDialog";
import { getMediaCategory } from "../../utils/utils";
import ShareDialog from "./ShareDialog";
import { useState } from "react";
import Notification from "@/components/Notification/Notification";
import { ethers } from "ethers";
import { useAccountAbstraction } from "../../context/accountContext";
import EnableEditButton from "./EnableEditing";

const TimeCapsules = [
  {
    name: "Adams Family",
    nftId: 1,
    image:
      "https://nft-cdn.alchemy.com/eth-goerli/3246a09e9116bbd185067af11cae720c",
  },
  {
    name: "Biden Family",
    nftId: 2,
    image:
      "https://nft-cdn.alchemy.com/eth-goerli/32191cd34600770965693be38f760676",
  },
];

const TimeCapsuleMedia = () => {
  const router = useRouter();
  const [openUploadMediaDialog, setOpenUploadMediaDialog] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [openViewMediaDialog, setOpenViewMediaDialog] = useState(false);

  const [refreshData, setRefreshData] = useState(new Date());
  const {
    isEditingEnabled,
    // ...other context values and functions you need
  } = useAccountAbstraction();

  // NOTIFICATIONS functions
  const [notificationTitle, setNotificationTitle] = useState();
  const [notificationDescription, setNotificationDescription] = useState();
  const [dialogType, setDialogType] = useState(1);
  const [show, setShow] = useState(false);
  const close = async () => {
    setShow(false);
  };

  const uploadMedia = async (_name, _description, _nftImage, _file) => {
    if (_name == "") {
      setDialogType(2); //Error
      setNotificationTitle("Upload Media");
      setNotificationDescription("You have not entered a name.");
      setShow(true);
      return;
    }

    if (_description == "") {
      setDialogType(2); //Error
      setNotificationTitle("Upload Media");
      setNotificationDescription("You have not entered a description.");
      setShow(true);
      return;
    }

    if (_nftImage == null) {
      setDialogType(2); //Error
      setNotificationTitle("Upload Media");
      setNotificationDescription("You have not selected an NFT image.");
      setShow(true);
      return;
    }

    if (_file == null) {
      setDialogType(2); //Error
      setNotificationTitle("Upload Media");
      setNotificationDescription("You have not selected a file.");
      setShow(true);
      return;
    }

    alert(getMediaCategory(_file.type));
  };

  const closeUploadMediaDialog = () => {
    setOpenUploadMediaDialog(false);
  };

  const closeViewMediaDialog = () => {
    setOpenViewMediaDialog(false);
  };

  const shareTimeCapsule = async (_userAddress) => {
    if (!ethers.utils.isAddress(_userAddress)) {
      setDialogType(2); //Error
      setNotificationTitle("Share Family Tree");
      setNotificationDescription("You have not entered a valid address.");
      setShow(true);
      return;
    }
  };

  const closeShareDialog = () => {
    setOpenShareDialog(false);
  };
  return (
    <section className="overflow-x-auto flex items-center justify-center mt-2 w-9/12 ">
      <div className=" bg-tarnsparent pt-11">
        {!isEditingEnabled && <EnableEditButton />}

        {isEditingEnabled && (
          <button
            onClick={() => setOpenUploadMediaDialog(true)}
            className="ml-4 p-2 mb-5 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary px-5 text-base font-semibold text-white transition-all hover:text-teal-500 hover:border-teal-500"
          >
            Upload Media
          </button>
        )}
        <div className="m-4 mb-12 ">
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {TimeCapsules.map((object, index) => (
              <div key={object.tokenId}>
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg sm:aspect-h-3 sm:aspect-w-2">
                  <img
                    onClick={() => router.push(`/webinar/${object.tokenId}`)}
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
                    onClick={() => setOpenViewMediaDialog(true)}
                    className="mb-5 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary px-5 text-base font-semibold text-white transition-all hover:text-teal-500 hover:border-teal-500"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <UploadMediaDialog
        open={openUploadMediaDialog}
        setOpen={closeUploadMediaDialog}
        uploadMedia={uploadMedia}
        refreshData={refreshData}
        type={2}
      />
      <ViewMediaDialog
        open={openViewMediaDialog}
        setOpen={closeViewMediaDialog}
        refreshData={refreshData}
        type={2}
      />

      <ShareDialog
        open={openShareDialog}
        setOpen={closeShareDialog}
        share={shareTimeCapsule}
        refreshData={refreshData}
        title={"Share Time Capsule"}
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

export default TimeCapsuleMedia;
