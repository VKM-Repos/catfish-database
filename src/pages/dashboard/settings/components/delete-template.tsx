import { useState } from 'react'
import * as SolarIconSet from 'solar-icon-set'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { Button } from 'src/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from 'src/components/ui/dialog'

export default function DeleteTemplate() {
  const [open, setOpen] = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(false)

  const handleDelete = () => {
    // Simulate delete action (e.g., API call)
    setTimeout(() => {
      setDeleteSuccess(true)
    }, 1000) // Simulating delay for the delete operation
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="cursor-pointer">
        <SolarIconSet.TrashBin2 color="#FF0000" iconStyle="Outline" size={16} />
      </DialogTrigger>
      <DialogContent
        className={`${deleteSuccess ? 'max-w-[23rem] p-5' : 'max-w-[29.875rem] p-6'} rounded-lg bg-white shadow-dialog`}
      >
        {deleteSuccess ? (
          <>
            <FlexBox align="center" direction="col" gap="gap-6">
              <FlexBox align="center" direction="col" gap="gap-2">
                <DialogTitle className="text-neutral-700">Done!</DialogTitle>
                <DialogDescription>Template deleted successfully.</DialogDescription>
              </FlexBox>

              <Button
                className="w-full max-w-[90px]"
                variant="primary"
                onClick={() => {
                  setOpen(false)
                  setTimeout(() => setDeleteSuccess(false)), 1000
                }}
              >
                Continue
              </Button>
            </FlexBox>
          </>
        ) : (
          <>
            <DialogClose className="flex justify-end py-3 text-right" asChild>
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
            <FlexBox gap="gap-2" direction="col">
              <DialogTitle className="flex gap-2 text-neutral-700">Delete template</DialogTitle>
              <DialogDescription>You are about to delete a template, this action can be undone.</DialogDescription>
            </FlexBox>

            <FlexBox justify="between" align="center">
              <Button className="w-full max-w-[200px]" variant="outline">
                <DialogClose>
                  <Text>Cancel</Text>
                </DialogClose>
              </Button>
              <Button className="w-full max-w-[200px]" type="submit" variant="primary" onClick={handleDelete}>
                <Text>Continue</Text>
              </Button>
            </FlexBox>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
