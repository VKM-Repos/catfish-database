import { Button } from 'src/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogTrigger } from 'src/components/ui/dialog'
import * as SolarIconSet from 'solar-icon-set'
import FileUpload from './file-upload'
import { Text } from 'src/components/ui/text'

export function ImportDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="space-x-2" variant="outline" size="sm">
          <SolarIconSet.CircleBottomUp /> <Text>Import</Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="flex w-fit flex-col items-center justify-center bg-white px-7 py-4">
        <DialogClose className="py-2" asChild>
          <button>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15.7123 16.773L7.22699 8.28768C6.93708 7.99776 6.93708 7.51693 7.22699 7.22702C7.51691 6.9371 7.99774 6.9371 8.28765 7.22702L16.7729 15.7123C17.0628 16.0022 17.0628 16.483 16.7729 16.773C16.483 17.0629 16.0022 17.0629 15.7123 16.773Z"
                fill="#1C274C"
              />
              <path
                d="M7.22706 16.773C6.93715 16.4831 6.93715 16.0023 7.22706 15.7124L15.7123 7.22711C16.0023 6.93719 16.4831 6.93719 16.773 7.22711C17.0629 7.51702 17.0629 7.99785 16.773 8.28777L8.28772 16.773C7.99781 17.063 7.51698 17.063 7.22706 16.773Z"
                fill="#1C274C"
              />
            </svg>
          </button>
        </DialogClose>

        <FileUpload />
      </DialogContent>
    </Dialog>
  )
}
