import { z } from 'zod'
import { Heading } from 'src/components/ui/heading'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import * as SolarIconSet from 'solar-icon-set'
import { useLocation } from 'react-router-dom'
import { configSchema } from 'src/schemas/configurationSchema'
import { Form, FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from 'src/components/ui/input'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { Grid } from 'src/components/ui/grid'
import { Alert, AlertDescription, AlertTitle } from 'src/components/ui/alert'
import { Button } from 'src/components/ui/button'
import { formatString } from '../../tabs/configuration/columns'
import { createPutMutationHook } from 'src/api/hooks/usePut'

const configFormSchema = z.object({
  title: z.string(),
  key: z.string(),
  value: z.string(),
  listValue: z.array(z.string()),
  description: z.string(),
  // type:z.string(),
  // category:z.string()
})

const configRequestSchema = z.object({
  value: z.string(),
  listValue: z.array(z.string()),
  description: z.string(),
  // type:z.string(),
  category: z.string(),
})

type ConfigFormValues = z.infer<typeof configFormSchema>

// type ConfigResponseSchema = z.infer<typeof configSchema>

type RoleFormProps = {
  mode: 'create' | 'edit'
  initialValues?: ConfigFormValues
  onSuccess?: () => void
  onClose?: () => void
}

export function EditConfigForm({ mode, initialValues, onSuccess, onClose }: RoleFormProps) {
  const location = useLocation()
  const { config } = location?.state || {}

  // console.log("config: ",config)

  const queryClient = useQueryClient()
  const [error, setError] = useState<{ title: string; message: string } | null>(null)
  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configFormSchema),
    defaultValues: initialValues || {
      title: formatString(config?.key),
      key: config?.key,
      value: config?.value,
      listValue: config?.listValue,
      description: config?.description,
      // category: config?.category,
      // type: config?.type,
    },
    mode: 'onChange',
  })

  // // Create farmer staff
  // const useCreateRole = createPostMutationHook({
  //   endpoint: '/roles',
  //   requestSchema: roleRequestSchema,
  //   responseSchema: roleResponseSchema,
  // })

  // const useCreateRoleMutation = useCreateRole()

  // PUT mutation
  const usePutConfig = createPutMutationHook({
    endpoint: `/configurations/${config?.id}`,
    requestSchema: configRequestSchema,
    responseSchema: configSchema,
  })
  const updateConfigMutation = usePutConfig()

  const onSubmit = async (values: any) => {
    const isValueSame = config?.value === values.value
    const isListValueSame =
      Array.isArray(config?.listValue) &&
      Array.isArray(values.listValue) &&
      config.listValue.length === values.listValue.length &&
      config.listValue.every((value: any, index: any) => value === values.listValue[index])

    if (config?.value && isValueSame && config?.listValue && isListValueSame) {
      console.log('Close....')
      onClose?.()
      return
    }

    console.log('reach:....')
    try {
      setError(null)
      const formData = { ...values }

      await updateConfigMutation.mutateAsync(formData)
      queryClient.invalidateQueries(['configurations'])

      form.reset()
      onSuccess?.()
    } catch (err) {
      console.error(` 'Update configuration error:`, err)
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { error: string; message: string } } }
        const errorData = axiosError.response?.data
        if (errorData) {
          setError({
            title: errorData.error,
            message: errorData.message,
          })
        }
      }
    }
  }

  // Function to add new value to listValue array
  const addNewValue = () => {
    const currentList = form.getValues('listValue') || []
    form.setValue('listValue', [...currentList, ''])
  }

  return (
    <>
      <div className="absolute inset-x-0 top-0 w-full border-b border-neutral-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto max-w-4xl">
          <Heading level={6} className="text-lg font-semibold text-neutral-800">
            Edit Configuration
          </Heading>
          <p className="mt-1 text-sm leading-snug text-neutral-600">Modify system configuration settings</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-3">
          {error && (
            <Alert variant="error" tone="filled">
              <AlertTitle>{error.title}</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          <Grid cols={2} gap="gap-2">
            <FlexBox direction="col" className="w-full">
              <Text className="flex items-center text-sm font-medium text-neutral-700">
                Configuration Title
                <SolarIconSet.QuestionCircle size={16} />
              </Text>
              <FormField
                control={form.control}
                name="title"
                render={({ field, fieldState }) => (
                  <FormItem className="w-full">
                    <FormControl className="w-full">
                      <Input
                        state={fieldState.error ? 'error' : 'default'}
                        className="w-full"
                        disabled={true}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FlexBox>

            <FlexBox direction="col">
              <Text className="flex items-center text-sm font-medium text-neutral-700">
                Key (Read-only)
                <SolarIconSet.QuestionCircle size={16} />
              </Text>
              <FormField
                control={form.control}
                name="key"
                render={({ field, fieldState }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        state={fieldState.error ? 'error' : 'default'}
                        className="w-full"
                        disabled={true}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FlexBox>
          </Grid>

          <Text className="flex items-center text-sm font-medium text-neutral-700">
            Description
            <SolarIconSet.QuestionCircle size={16} />
          </Text>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="rounded-sm border border-neutral-200 p-4">
            <FlexBox direction="row">
              <FlexBox direction="row">
                <p>Type</p>
                <div
                  className={`rounded-[4rem] border border-info-500 bg-info-100 px-2 py-1 text-center text-sm capitalize text-info-500`}
                >
                  {config?.type}
                </div>
              </FlexBox>
              <FlexBox direction="row">
                <p>Category</p>
                <div
                  className={`rounded-[4rem] border border-neutral-500 bg-neutral-100 px-2 py-1 text-center text-sm capitalize text-neutral-500`}
                >
                  Feeding
                </div>
              </FlexBox>
            </FlexBox>

            <Heading level={6} className="mt-6 text-lg font-semibold text-neutral-800">
              Current Value
            </Heading>
            <FlexBox direction="col">
              {/* Render single value field if config has value */}
              {config?.value && (
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input placeholder="value" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Render list of values if config has listValue */}
              {config?.listValue[0] !== '' && Array.isArray(config.listValue) && (
                <>
                  {form.watch('listValue')?.map((value, index) => (
                    <FormField
                      key={index}
                      control={form.control}
                      name={`listValue.${index}`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input placeholder={`Value ${index + 1}`} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}

                  <button
                    type="button" // Important to prevent form submission
                    onClick={addNewValue}
                    className="col-span-2 flex w-full items-center justify-center gap-2 rounded-md border-2 border-dashed border-neutral-200 py-2 hover:bg-hover"
                  >
                    <SolarIconSet.AddSquare color="black" size={14} iconStyle="Outline" />
                    <Heading level={6}>Add another</Heading>
                  </button>
                </>
              )}
            </FlexBox>
          </div>

          <FlexBox justify="between" align="center" className="w-full bg-neutral-50 px-6 py-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Back
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex items-center gap-2"
              disabled={!form.formState.isValid}
            >
              {/* {useCreateRoleMutation.isLoading || updateRoleMutation.isLoading ? (
                <>
                  <Loader type="spinner" size={18} />
                  <Text>{mode === 'create' ? 'Creating...' : 'Updating...'}</Text>
                </>
              ) : ( */}
              <>
                <Text>Save</Text>
              </>
              {/* )} */}
            </Button>
          </FlexBox>
        </form>
      </Form>
    </>
  )
}
