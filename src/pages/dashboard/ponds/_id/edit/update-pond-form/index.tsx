import { UseFormReturn } from 'react-hook-form'
import FormValidationErrorAlert from 'src/components/global/form-error-alert'
import { Heading } from 'src/components/ui/heading'
import AddPondDetailsForm from '../../../create/add-pond/forms/add-pond-details-form'
import { Button } from 'src/components/ui/button'
import UpdatePondLocationForm from './forms/update-pond-location'
import { ClientErrorType } from 'src/types'
import { FlexBox } from 'src/components/ui/flexbox'
import { Loader } from 'src/components/ui/loader'
import { Text } from 'src/components/ui/text'

type UpdatePondProps = {
  form: UseFormReturn<any>
  setOpen: (open: boolean) => void
  error: ClientErrorType | null
  loading: boolean
}

export default function UpdatePondForm({ form, error, loading, setOpen }: UpdatePondProps) {
  return (
    <div className="w-full min-w-[46.25rem] pb-[2rem] pt-[4rem]">
      <div className="absolute inset-x-0 top-0 w-full border-b border-b-neutral-200 py-2">
        <Heading className="text-center" level={6}>
          Edit pond info
        </Heading>
      </div>
      <FlexBox gap="gap-8" direction="col" align="center">
        {error && <FormValidationErrorAlert error={error} />}
        <div className="flex w-full flex-col items-start gap-1">
          <p className=" font-bold text-[#444955]">Pond Details</p>
          <hr className="w-full border border-primary-200" />
        </div>
        <AddPondDetailsForm form={form} />

        <div className="mb-2 w-full items-start">
          <p className="font-bold text-[#444955]">Pond Location</p>
          <hr className="w-full border border-primary-200" />
        </div>
        <UpdatePondLocationForm form={form} />
        <FlexBox justify="between" align="center" className="w-full">
          <Button
            type="button"
            variant="outline"
            className="flex min-w-[9rem] items-center gap-2"
            onClick={() => {
              setOpen(false)
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex min-w-[9rem] items-center gap-2"
            disabled={!form.formState.isValid}
          >
            {loading ? (
              <>
                <Loader type="spinner" size={18} />
                <Text color="text-inherit" variant="body">
                  Updating
                </Text>
              </>
            ) : (
              <>
                <Text color="text-inherit" variant="body">
                  Continue
                </Text>
              </>
            )}
          </Button>
        </FlexBox>
      </FlexBox>
    </div>
  )
}
