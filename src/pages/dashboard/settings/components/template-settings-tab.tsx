import { FlexBox } from 'src/components/layouts/flexbox'
import { Text } from 'src/components/layouts/text'
import ProfileDialog from './profile-dialog'
import * as SolarIconSet from 'solar-icon-set'
import { Dialog, DialogTrigger } from 'src/components/ui/dialog'

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
        <ProfileDialog />
      </FlexBox>
      {files.map((file) => (
        <div key={file.name} className="h-fit w-full max-w-[26.875rem] rounded-lg border border-neutral-200 p-5">
          <FlexBox key={file.name} justify="between" align="start">
            <FlexBox gap="gap-3" align="start">
              <SolarIconSet.File iconStyle="Outline" size={16} />
              <FlexBox direction="col" gap="gap-2" justify="center">
                <Text className="font-semibold">{file?.name}</Text>
                <Text>{file?.size}</Text>
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
