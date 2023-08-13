import { Fragment, useRef, useEffect,useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faCloudArrowDown } from '@fortawesome/free-solid-svg-icons'
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Web3Storage, File } from "web3.storage";
import { getMediaCategory,fetchIPFSFile,getFileTypeByFilename } from '../../utils/utils'
export default function UploadMediaDialog(props:any) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [filename,setFilename] = useState()
    const [selectedMediaFile, setSelectedMediaFile] = useState(null);
    const [filetype,setFiletype] = useState(3)
    const mediaUrl = useRef();


    const [storage] = useState(
      new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3_STORAGE_KEY })
    );
    const handleFileChange = (event:any) => {
      const file = event.target.files[0];
      setSelectedFile(file);
    };

  
    const handleMediaFileChange = (event:any) => {
        const file = event.target.files[0];
        setSelectedMediaFile(file);
      };  

      async function downloadFile() {
        try {
          const response = await fetch(mediaUrl.current);
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
      
          const anchor = document.createElement('a');
          anchor.href = blobUrl;
          anchor.download = filename;
          anchor.style.display = 'none';
      
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
      
          // Clean up the Blob URL
          URL.revokeObjectURL(blobUrl);
        } catch (error) {
          console.error('Error downloading file:', error);
        }      }

  useEffect(()=>{

    async function getMedia(){

      const res = await storage.get(props.media.ipfsCid)
      console.log(`Got a response! [${res.status}] ${res.statusText}`)
      if (!res.ok) {
        throw new Error(`failed to get ${cid} - [${res.status}] ${res.statusText}`)
      }
    
      // unpack File objects from the response
     const files = await res.files()
     /* for (const file of files) {
        console.log(file)
        console.log(`${file.cid} -- ${file.type} -- ${file.size}`)
      }
       const x = await files[0].async("blob")
      console.log(x)*/

       //const x = await fetchIPFSFile(props.media.ipfsCid)
      // console.log(x)
      // const y = new File([x],files[0].name) 
       //console.log(y)
       setFiletype(getFileTypeByFilename(files[0].name))
       mediaUrl.current = `https://ipfs.io/ipfs/${props.media.ipfsCid}/${files[0].name}`
       setFilename(files[0].name)
    }
    if(props.media?.ipfsCid)
       getMedia()
  },[props])
  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog as="div" className="relative z-10"  onClose={props.setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                 <FontAwesomeIcon icon={faCloudArrowDown}   className={"text-4xl text-green-600"} />
                  </div>
                  <div className="mt-2 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-3xl font-bold leading-6 text-gray-900">
                      View Media
                    </Dialog.Title>
                   
                  </div>
                  <div className="flex">
  <div className="flex-1 mr-4">
    <div className="mt-1">
      <label htmlFor="name" className="block text-base font-medium text-black mt-2 mb-2">
        Name
      </label>
       <span>{props.media?.name}</span>
    </div>
  </div>
  
</div>
<div className="mt-2">

{filetype == 1 && <video controls width="600">
    <source src={mediaUrl.current} />    <p>Your browser doesn't support HTML5 video.</p>
  </video>} {filetype == 2 && <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg sm:aspect-h-3 sm:aspect-w-2">
                <img 
                     
                  src={mediaUrl.current}
                  alt="Image"
                  className="cursor-pointer h-[300px] w-full object-cover object-center group-hover:opacity-75"
                />
              </div>}
</div>             
            <div className="mt-2">
            <label htmlFor="description" className="block text-base font-medium text-black mt-2 mb-2">
        Description
      </label>   
              <textarea
                  id="description"
                  name="description"
                  rows={5}
                  readOnly={true}
                  
                  className="mb-2 p-2 block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={props.media?.description}
                />
   </div>
   
  
                </div>
                <div className="mt-2 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                   onClick={()=>downloadFile()}
                
                  >
                    Download
                  </button>
                  <button
                    type="button"
                    className="mt-2 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={() => props.setOpen(false)}
                    
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
