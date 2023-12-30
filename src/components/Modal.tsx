import { zodResolver } from "@hookform/resolvers/zod"
import { Contract } from "ethers"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { cn } from "../lib/utils"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"

interface IProps {
  account?: string
  contract: Contract
}

const formSchema = z.object({
  address: z.string().min(1, {
    message: "Address is required.",
  }),

  // type: z.nativeEnum(ChannelType),
})

function Modal({ contract }: IProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)

      await contract?.allow(data?.address)
      toast("File shared successfully")
    } catch (error) {
      toast("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#3471e3] text-base font-semibold px-6 py-2 text-white rounded-lg text-center">
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Share Files</DialogTitle>
          <DialogDescription>Choose people you want to share file with.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter the address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <div className="bg-[#3471e3] text-base font-semibold px-6 py-2 text-white rounded-lg text-center flex gap-2 items-center w-fit">
                <input
                  type="submit"
                  disabled={isLoading}
                  className={cn("cursor-pointer", isLoading && "cursor-not-allowed")}
                />
                {isLoading && <span> Loading...</span>}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default Modal
