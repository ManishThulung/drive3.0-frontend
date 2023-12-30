import axios from "axios"
import { Contract } from "ethers"
import { useState } from "react"
import { toast } from "sonner"
import { cn } from "../lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Button } from "./ui/button"

interface IProps {
  account: string
  contract: Contract
}
const FileUpload = ({ account, contract }: IProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (file) {
        const formData = new FormData()
        formData.append("file", file)

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `${process.env.PINATA_API_KEY}`,
            pinata_secret_api_key: `${process.env.PINATA_API_SECRET}`,
            "Content-Type": "multipart/form-data",
          },
        })

        const ipfsLink = `ipfs://${resFile.data.IpfsHash}`

        await contract?.add(account, ipfsLink)

        setFile(null)

        toast("File uploaded successfully")
      }
    } catch (error: any) {
      toast("User denied the transaction")
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#3471e3] text-base font-semibold px-6 py-2 text-white rounded-lg text-center">
          Upload File
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Upload Files</DialogTitle>
          <DialogDescription>Choose people you want to share file with.</DialogDescription>
        </DialogHeader>

        <div>
          <form onSubmit={handleSubmit}>
            <input
              id="file"
              type="file"
              disabled={!account}
              onChange={(e) => {
                if (e?.target?.files) {
                  setFile(e?.target?.files[0])
                }
              }}
              className="my-3 text-black font-[400] text-base cursor-pointer"
            />
            <div className="w-full flex justify-end">
              <div className="bg-[#3471e3] text-base font-semibold px-6 py-2 mt-7 text-white rounded-lg text-center  flex gap-2 items-center w-fit ">
                <input
                  type="submit"
                  disabled={!file}
                  className={cn("cursor-pointer", !file && "cursor-not-allowed")}
                />
                {isLoading && <span> Loading...</span>}
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FileUpload
