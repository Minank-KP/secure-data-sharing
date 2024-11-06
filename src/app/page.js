"use client";
import { useEffect, useState, useRef } from "react";
import { ethers } from "ethers";
import SecureShare from "../../artifacts/contracts/SecureShare.sol/SecureShare.json";

const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const contractABI = SecureShare.abi;

export default function Home() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  const [file, setFile] = useState();
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const recipientRef = useRef();
  const cidRef = useRef();

  const uploadFile = async () => {
    try {
      if (!file) {
        alert("No file selected");
        return;
      }

      setUploading(true);
      const data = new FormData();
      data.set("file", file);
      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      const signedUrl = await uploadRequest.json();
      setUrl(signedUrl);

      // const shareRequest = await fetch("/api/share", {
      //   method: "POST",
      //   body: JSON.stringify({ url: signedUrl }),
      // });

      // const shareResponse = await shareRequest.json();
      // console.log(shareResponse);

      const tx = await contract.addCID(signedUrl);
      await tx.wait();
      fetchCIDs();

      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const handleChange = (e) => {
    setFile(e.target?.files?.[0]);
  };

  const [cids, setCids] = useState([]);
  const [shareCIDs, setShareCIDs] = useState([]);

  const fetchCIDs = async () => {
    const firstOwner = await account;
    if (contract) {
      try {
        const cids = await contract.getUploadedCIDs(
          firstOwner
        );
        console.log("CIDs", cids);
        setCids(cids);

        const shareCIDs = await contract.getSharedCIDs(
          firstOwner
        );
        console.log("Shared CIDs", shareCIDs);
        setShareCIDs(shareCIDs);
      } catch (error) {
        console.error("Error fetching CIDs", error);
      }
    }
  };

  useEffect(() => {
    fetchCIDs();
  }, [contract]);

  const handleConnect = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner(0);
        const accounts = (await signer).getAddress();
        setAccount(accounts);

        const contractInstance = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        setContract(contractInstance);
      } catch (error) {
        console.error("Error connecting to Metamask", error);
      }
    } else {
      console.error("Metamask not found");
    }
  };

  return (
    <div>
      <nav className="bg-blue-500 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl">Home</h1>
          {account ? (
            <p className="text-white">Connected: {account}</p>
          ) : (
            <button
              onClick={handleConnect}
              className="bg-white text-blue-500 px-4 py-2 rounded"
            >
              Connect to MetaMask
            </button>
          )}
        </div>
      </nav>
      <div className="container mx-auto mt-4">
        {account ? <p>Connected account: {account}</p> : <p>Not connected</p>}
      </div>
      <div className="min-h-screen bg-gray-100">
        <main className="container mx-auto flex flex-col justify-center items-center py-10">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <input
              type="file"
              onChange={handleChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              onClick={uploadFile}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
            {url && (
              <div className="mt-4 p-4 bg-gray-200 rounded text-center">
                <a
                  className="text-blue-500"
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {url}
                </a>
              </div>
            )}
          </div>

          {cids.length > 0 && (
            <div className="mt-8 w-full max-w-full px-2">
              <h2 className="text-xl font-semibold mb-4">Uploaded CIDs</h2>
              <ul className="bg-white p-4 rounded shadow-md">
                {cids.map((cid, index) => (
                  <li
                    key={index}
                    className="mb-2 text-clip overflow-clip p-4 bg-teal-500"
                  >
                    <span className="text-clip w-64 overflow-clip">{cid}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <input id="recipient" type="text" ref={recipientRef} />
          <input id="cid" type="text" ref={cidRef} />
          <button
            onClick={async () => {
              const recipient = recipientRef.current.value;
              const cid = cidRef.current.value;
              const tx = await contract.share(cid, recipient);
              await tx.wait();
              fetchCIDs();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Share
          </button>

          {shareCIDs.length > 0 && (
            <div className="mt-8 w-full max-w-full px-2">
              <h2 className="text-xl font-semibold mb-4">Shared CIDs</h2>
              <ul className="bg-white p-4 rounded shadow-md">
                {shareCIDs.map((cid, index) => (
                  <li
                    key={index}
                    className="mb-2 text-clip overflow-clip p-4 bg-teal-500"
                  >
                    <span className="text-clip w-64 overflow-clip">{cid}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
