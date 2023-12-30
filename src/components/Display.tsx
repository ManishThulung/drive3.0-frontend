import { Contract } from "ethers"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"

interface IProps {
  account: string
  contract: Contract | undefined
}

const IPFS_BASE_URL = "https://ipfs.io/ipfs"

const Display = ({ account, contract }: IProps) => {
  const [data, setData] = useState<string[]>()
  const [accessList, setAccessList] = useState<{ address: string; status: boolean }[]>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getData = async () => {
    try {
      setIsLoading(true)
      const res = await contract?.display(account)
      if (res) {
        setData(
          res
            .toString()
            .split(",")
            .filter((n: string) => n)
        )
      }
    } catch (error) {
      toast("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const getAccessList = async () => {
    try {
      setIsLoading(true)
      const res = await contract?.shareAccess(account)
      const newRes = res?.map(([address, status]) => ({
        address,
        status,
      }))
      setAccessList(newRes)
    } catch (error) {
      toast("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    getData()
    getAccessList()
  }, [account])

  return (
    <div className=" mt-16 flex gap-8">
      <div className="w-[70%]">
        <p className="text-3xl font-bold text-center mb-6">My Files</p>
        <div className="flex gap-5 flex-wrap justify-center">
          {data && data.length >= 1 ? (
            data?.map((item, i) => (
              <a key={i} href={`${item}`} className="cursor-pointer" target="_blank">
                <img
                  src={`${IPFS_BASE_URL}/${item?.substring(7)}`}
                  alt="image"
                  className="h-[200px] w-[200px] object-cover rounded-md"
                />
              </a>
            ))
          ) : (
            <p className="text-lg">You have not uploaded any image in this Drive</p>
          )}
        </div>
        {isLoading && <p>FETCHING.............</p>}
      </div>

      <div className="w-[30%]">
        <p className="text-3xl font-bold text-center">Access</p>
        {accessList && accessList?.length >= 1 ? (
          <>
            <p className="text-lg text-center py-4">
              You have shared the files with these addresses
            </p>
            <div className="flex gap-5 flex-wrap justify-center">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessList.map((item) => (
                    <TableRow key={item.address}>
                      <TableCell>{item.address}</TableCell>
                      <TableCell>{item.status ? "True" : "False"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <p className="text-lg text-center my-4">You have not shared this file with anyone.</p>
        )}
        {isLoading && <p>FETCHING.............</p>}
      </div>
    </div>
  )
}

export default Display
