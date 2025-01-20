import { useState } from 'react'
import { FlexBox } from 'src/components/layouts/flexbox'
import { Button } from 'src/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from 'src/components/ui/dialog'
import * as SolarIconSet from 'solar-icon-set'
import { Text } from 'src/components/layouts/text'

export default function AddNewTemplate() {
  const [file, setFile] = useState()
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline" className="border-primary-400">
          <FlexBox gap="gap-3" align="center">
            <SolarIconSet.HomeAdd color="#651391" size={20} iconStyle="Outline" />
            <Text className="text-primary-400">Add New</Text>
          </FlexBox>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="cursor-default bg-white p-6">
          <FlexBox direction="col" justify="center" align="center" gap="gap-6">
            <button className="p-3 ">
              <p className="text-[20px]">x</p>
              {/* <SolarIconSet.Close size={20} iconStyle="Outline"/> */}
            </button>
          </FlexBox>
        </div>
      </DialogContent>
    </Dialog>
  )
}
