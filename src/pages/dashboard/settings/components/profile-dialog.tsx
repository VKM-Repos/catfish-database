import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import FormInput from 'src/components/form-input'
import { FlexBox } from 'src/components/layouts/flexbox'
import { Text } from 'src/components/layouts/text'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from 'src/components/ui/dialog'
import { Form } from 'src/components/ui/form'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select'
import { z } from 'zod'
import * as SolarIconSet from 'solar-icon-set'
import { Button } from 'src/components/ui/button'
import { Label } from 'src/components/ui/label'

const formSchema = z.object({
  first_name: z.string().min(1, { message: 'Please fill this field' }),
  last_name: z.string().min(1, { message: 'Please fill this field' }),
  email: z.string().email({ message: 'Invalid email address' }).min(1, { message: 'Please fill this field' }),
  state: z.string().min(1, { message: 'Please fill this field' }),
  phone_number: z.string().min(1, { message: 'Please fill this field' }),
})

type ProfileData = z.infer<typeof formSchema>

export default function ProfileDialog() {
  const [state, setState] = useState('Kaduna')
  const [open, setOpen] = useState(false)

  const form = useForm<ProfileData>({ resolver: zodResolver(formSchema) })
  const {
    formState: { isDirty },
  } = form

  const onSubmit = (data: ProfileData) => {
    console.log(data)
    setOpen(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="border-primary-400">
            <FlexBox gap="gap-3" align="center">
              <SolarIconSet.PenNewSquare color="#651391" size={20} iconStyle="Outline" />
              <Text className="text-primary-400">Edit</Text>
            </FlexBox>
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-lg shadow-dialog">
          <div className="cursor-default bg-white">
            <FlexBox direction="col" justify="center" gap="gap-6">
              <DialogHeader className="w-full border-[0.5px] border-b-neutral-300 px-6 py-3">
                <DialogTitle className="text-center text-xl font-bold">Edit Profile</DialogTitle>
              </DialogHeader>
              <DialogDescription />
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FlexBox direction="col" gap="gap-6" justify="center" className="w-full p-6">
                    <FlexBox gap="gap-6" align="center">
                      <FormInput
                        label="First name"
                        type="text"
                        className="!border-neutral-200"
                        {...form.register('first_name')}
                      />
                      <FormInput
                        label="Last name"
                        type="text"
                        className="!border-neutral-200"
                        {...form.register('last_name')}
                      />
                    </FlexBox>
                    <div className="w-full">
                      <FormInput
                        label="Email"
                        type="email"
                        {...form.register('email')}
                        className="!border-neutral-200"
                      />
                    </div>
                    <div className="w-full">
                      <Select>
                        <FlexBox gap="gap-2" direction="col" justify="center">
                          <Label>State</Label>
                          <SelectTrigger className="w-full rounded border border-neutral-200 px-3 py-2 ">
                            <FlexBox gap="gap-2" align="center" justify="center">
                              <SolarIconSet.Signpost iconStyle="Outline" size={20} />
                              <SelectValue className="w-full" placeholder={state} />
                            </FlexBox>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="Delta">Delta</SelectItem>
                              <SelectItem value="Gombe">Gombe</SelectItem>
                              <SelectItem value="Kwara">Kwara</SelectItem>
                              <SelectItem value="Ogun">Ogun</SelectItem>
                              <SelectItem value="Kano">Kano</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </FlexBox>
                      </Select>
                    </div>
                    <div className="w-full">
                      <FormInput
                        label="Phone Number"
                        type="text"
                        className="!border-neutral-200"
                        {...form.register('phone_number')}
                      />
                    </div>
                  </FlexBox>
                  <footer
                    className={`mx-auto w-full rounded-sm !bg-neutral-50 bg-neutral-100 !px-0 !py-0 px-8 py-4 text-center text-sm text-neutral-400`}
                  >
                    <FlexBox justify="between" align="center" className="px-6 py-3">
                      <Button variant="outline">
                        <DialogClose>
                          <Text>Back</Text>
                        </DialogClose>
                      </Button>
                      <Button type="submit" variant="primary" disabled={!isDirty}>
                        <Text>Edit Profile</Text>
                      </Button>
                    </FlexBox>
                  </footer>
                </form>
              </Form>
            </FlexBox>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
