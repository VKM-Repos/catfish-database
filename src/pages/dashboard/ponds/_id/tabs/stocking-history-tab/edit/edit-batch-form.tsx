import { UseFormReturn } from 'react-hook-form'
import FormValidationErrorAlert from 'src/components/global/form-error-alert'
import { Heading } from 'src/components/ui/heading'
import { Button } from 'src/components/ui/button'
import { ClientErrorType } from 'src/types'
import { FlexBox } from 'src/components/ui/flexbox'
import { Loader } from 'src/components/ui/loader'
import { Text } from 'src/components/ui/text'
import { FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import CostDetailsForm from 'src/pages/dashboard/ponds/create/add-fish-to-pond/forms/cost-details'

type UpdateBatchProps = {
  form: UseFormReturn<any>
  setOpen: (open: boolean) => void
  error: ClientErrorType | null
  loading: boolean
}

export default function EditBatchDetailsForm({ form, error, loading, setOpen }: UpdateBatchProps) {
  return (
    <div className="w-full min-w-[46.25rem] pb-[2rem] pt-[4rem]">
      <div className="absolute inset-x-0 top-0 w-full border-b border-b-neutral-200 py-2">
        <Heading className="text-center font-bold" level={6}>
          Edit batch details
        </Heading>
      </div>
      <FlexBox gap="gap-8" direction="col" align="center">
        {error && <FormValidationErrorAlert error={error} />}

        <FlexBox gap="gap-5" direction="col" className="w-full">
          <div className="flex w-full flex-col gap-2 border-neutral-200">
            <Text className="flex items-center gap-2 text-sm font-medium text-neutral-700">
              Quantity of fish supplied
              <span className="font-bold text-red-500">*</span>
            </Text>
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="e.g 300" {...field} className="bg-neutral !py-3" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <CostDetailsForm form={form} />
        </FlexBox>
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
            // disabled={!form.formState.isValid}
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
