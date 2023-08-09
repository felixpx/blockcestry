import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import { useAccountAbstraction } from "../../context/accountContext";
export default function EnableEditButton() {
  const {
    setEditingEnabled,
    // ...other context values and functions you need
  } = useAccountAbstraction();

  const onSuccess = () => {
    setEditingEnabled(true);
  };

  const handleVerify = async (proof: ISuccessResult) => {
    console.log(proof);
    const requestOptions = {
      method: "POST", // HTTP method (GET, POST, PUT, DELETE, etc.)
      headers: {
        "Content-Type": "application/json", // Specify JSON format for the request body
      },
      body: JSON.stringify(proof), // Convert the JavaScript object to JSON
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_URL}/api/verify`,
        requestOptions
      );
      const data = await response.json();
      console.log("API response:", data);
    } catch (error) {
      console.error("API request error:", error);
    }
  };

  return (
    <IDKitWidget
      app_id={process.env.NEXT_PUBLIC_WLD_APP_ID} // obtained from the Developer Portal
      action="proof-of-person" // this is your action name from the Developer Portal
      onSuccess={onSuccess} // callback when the modal is closed
      handleVerify={handleVerify} // optional callback when the proof is received
      credential_types={["orb", "phone"]} // optional, defaults to ['orb']
      enableTelemetry // optional, defaults to false
    >
      {({ open }) => (
        <button
          className="ml-4 p-2 mb-5 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary px-5 text-base font-semibold text-white transition-all hover:text-indigo-500 hover:border-indigo-500"
          onClick={open}
        >
          Enable Editing
        </button>
      )}
    </IDKitWidget>
  );
}
