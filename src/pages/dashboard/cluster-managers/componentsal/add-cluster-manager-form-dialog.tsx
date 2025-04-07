import { Button } from 'src/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'src/components/ui/dialog'
import { Divider } from 'src/components/ui/divider'
import { Input } from 'src/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select'
import { Text } from 'src/components/ui/text'

type DialogProps = {
  buttonTitle: string
  icon: React.ReactNode
  buttonVariant: 'primary' | 'secondary' | 'neutral' | 'outline' | 'error' | 'ghost' | 'link'
  buttonSize: 'default' | 'sm' | 'xs' | 'lg' | 'icon'
  action: string
}

export function AddClusterManagerFormDialog({ buttonTitle, icon, buttonVariant, action, buttonSize }: DialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex w-full justify-start space-x-2" variant={buttonVariant} size={buttonSize}>
          {icon} <Text>{buttonTitle}</Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader className="p-3 text-center">
          <DialogTitle className="text-center">
            {action == 'add' ? 'Add a cluster manager' : 'Edit cluster manager'}
          </DialogTitle>
          <Divider />
        </DialogHeader>
        <div className="flex w-full flex-col items-center gap-7 p-7 ">
          <div className="flex w-full items-center justify-center gap-2">
            <Input type="text" className="rounded-md border border-neutral-200 px-2 py-1" placeholder="First name" />
            <Input type="text" className="rounded-md border border-neutral-200 px-2 py-1" placeholder="Last name" />
          </div>
          <div className="w-full">
            <Input type="email" className="rounded-md border border-neutral-200 px-2 py-1" placeholder="Email" />
          </div>
          <div className="w-full">
            <Select>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <SelectValue placeholder="Select cluster" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="cluster1">Cluster 1</SelectItem>
                  <SelectItem value="cluster2">Cluster 2</SelectItem>
                  <SelectItem value="cluster3">Cluster 3</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full">
            <Input type="tel" className="rounded-md border border-neutral-200 px-2 py-1" placeholder="Phone" />
          </div>
        </div>
        <DialogFooter className="mt-1 flex w-full justify-between bg-neutral-100 px-7 py-4">
          <DialogClose asChild>
            <Button size="sm" variant="outline" type="button">
              <Text>Back</Text>
            </Button>
          </DialogClose>
          <Button size="sm" variant="primary" type="submit">
            <Text>{action == 'add' ? 'Add cluster manager' : 'Update'}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
