import { FlexBox } from 'src/components/layouts/flexbox'
import { Text } from 'src/components/layouts/text'
import * as SolarIconSet from 'solar-icon-set'
import { Dialog, DialogTrigger } from 'src/components/ui/dialog'
import AddNewTemplate from './add-new-template'

const files = [
  {
    name: 'Cluster manager user template',
    size: '200kb',
  },
]
export default function TemplateTab() {
  console.log(files.length)
  return (
    <FlexBox direction="col" gap="gap-6" className="w-full">
      <FlexBox gap="gap-unset" justify="between" align="center" className="w-full">
        <Text className="text-xl font-semibold text-neutral-700">Cluster manager user templates</Text>
        <AddNewTemplate />
      </FlexBox>
      {files.map((file) => (
        <div key={file.name} className="w-full max-w-[26.875rem] rounded-lg border border-neutral-200 p-5">
          <FlexBox key={file.name} justify="between" align="start">
            <FlexBox gap="gap-[14px]" align="start">
              <SolarIconSet.File iconStyle="Outline" size={16} />
              <FlexBox direction="col" gap="gap-1" justify="center">
                <Text className="font-semibold text-neutral-600">{file?.name}</Text>
                <Text className="text-xs text-neutral-400">{file?.size}</Text>
              </FlexBox>
            </FlexBox>
            <Dialog>
              <DialogTrigger asChild>
                <SolarIconSet.TrashBin2 color="#FF0000" iconStyle="Outline" size={16} />
              </DialogTrigger>
            </Dialog>
          </FlexBox>
        </div>
      ))}
    </FlexBox>
  )
}
