import { Contract, ethers } from "ethers"
import { useEffect, useState } from "react"
import uploadABI from "./artifacts/contracts/Upload.sol/Upload.json"
import Display from "./components/Display"
import FileUpload from "./components/FileUpload"
import Modal from "./components/Modal"

function App() {
  const [account, setAccount] = useState<string>("")
  const [contract, setContract] = useState<Contract | undefined>()

  useEffect(() => {
    const provider = new ethers.BrowserProvider(window?.ethereum)

    const loadProvider = async () => {
      try {
        if (provider) {
          // if chain chages, reload
          window?.ethereum.on("chainChanged", () => {
            window.location.reload()
          })

          // if accounts chage, reload
          window?.ethereum.on("accountsChanged", () => {
            window.location.reload()
          })

          await provider.send("eth_requestAccounts", [])
          const signer = await provider.getSigner()
          const address = await signer.getAddress()
          setAccount(address)
          let contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"

          // creating instance
          const contract = new ethers.Contract(contractAddress, uploadABI.abi, signer)

          setContract(contract)
          // console.log(signer, "signer")
          // console.log(contract, "contract")
        } else {
          console.error("metamask not installed")
        }
      } catch (err) {
        alert("You dont have metamask please install it first")
      }
    }
    provider && loadProvider()
  }, [])
  return (
    <div className="mx-8">
      <h1 className="text-4xl font-bold pt-20 pb-8 text-center">Drive 3.0</h1>

      <p className="text-lg font-medium text-center">
        My Account: {account ? account : "Please connect to metamask"}
      </p>
      {contract && (
        <>
          <Display account={account} contract={contract} />
          <div className="flex gap-8 mt-16 justify-center">
            <FileUpload account={account} contract={contract} />
            <Modal contract={contract} />
          </div>
        </>
      )}
    </div>
  )
}

export default App
