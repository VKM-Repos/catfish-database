import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Textarea } from 'src/components/ui/textarea'
import { Button } from 'src/components/ui/button'
import { Text } from 'src/components/ui/text'
import { Loader } from 'src/components/ui/loader'
import * as SolarIconSet from 'solar-icon-set'
import { createPostMutationHook } from 'src/api/hooks/usePost'
import { createPutMutationHook } from 'src/api/hooks/usePut'

import { z } from 'zod'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from 'src/components/ui/select'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { Heading } from 'src/components/ui/heading'
import { clusterRequestSchema, clusterResponseSchema } from 'src/schemas/schemas'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { ClientErrorType, ServerErrorType } from 'src/types'
import FormValidationErrorAlert from 'src/components/global/form-error-alert'

type ClusterFormValues = z.infer<typeof clusterRequestSchema> & { id?: string }

type ClusterFormProps = {
  mode: 'create' | 'edit'
  initialValues?: ClusterFormValues
  onSuccess?: () => void
  onClose?: () => void
}

export function ClusterForm({ mode, initialValues, onSuccess, onClose }: ClusterFormProps) {
  const queryClient = useQueryClient()
  const [error, setError] = useState<ClientErrorType | null>(null)
  const form = useForm<ClusterFormValues>({
    resolver: zodResolver(clusterRequestSchema),
    defaultValues: initialValues || {
      name: '',
      stateId: 0,
      description: '',
    },
    mode: 'onChange',
  })

  // Create the create cluster mutation hook
  const useCreateCluster = createPostMutationHook({
    endpoint: '/clusters',
    requestSchema: clusterRequestSchema,
    responseSchema: clusterResponseSchema,
  })

  // Create the update cluster mutation hook
  const useUpdateCluster = createPutMutationHook({
    endpoint: `/clusters/${initialValues?.id}`,
    requestSchema: clusterRequestSchema,
    responseSchema: clusterResponseSchema,
  })

  const createClusterMutation = useCreateCluster()
  const updateClusterMutation = useUpdateCluster()

  const useGetStates = createGetQueryHook({
    endpoint: '/states',
    responseSchema: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
      }),
    ),
    queryKey: ['states'],
  })

  const { data: states = [], isLoading: isLoadingStates } = useGetStates()

  const onSubmit = async (values: ClusterFormValues) => {
    try {
      setError(null)
      const formData = { ...values, context: values.name }
      if (mode === 'create') {
        await createClusterMutation.mutateAsync(formData)
        queryClient.invalidateQueries(['clusters'])
      } else if (mode === 'edit' && initialValues?.id) {
        await updateClusterMutation.mutateAsync({ ...formData, id: initialValues.id })
        queryClient.invalidateQueries(['clusters'])
      }
      form.reset()
      onSuccess?.()
    } catch (err) {
      console.error(`${mode === 'create' ? 'Create' : 'Update'} cluster error:`, err)
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: ServerErrorType } }
        const errorData = axiosError.response?.data

        if (errorData) {
          setError({
            title: errorData.error,
            message: errorData.message,
            errors: errorData.errors ?? null,
          })
        }
      }
    }
  }

  // Watch the description field to get the character count
  const description = form.watch('description')

  return (
    <>
      <div className="absolute inset-x-0 top-0 w-full border-b border-b-neutral-200 py-2">
        <Heading className="text-center" level={6}>
          {mode === 'create' ? 'Add a new cluster' : 'Edit cluster'}
        </Heading>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {error && <FormValidationErrorAlert error={error} />}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Enter cluster name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stateId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger className="font-light">
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingStates ? (
                        <SelectItem value="loading" disabled>
                          <Text>Loading states...</Text>
                        </SelectItem>
                      ) : (
                        states.map((state) => (
                          <SelectItem key={state.id} value={String(state.id)}>
                            {state.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="Enter description" {...field} className="text-neutral-900" />
                </FormControl>
                <FormMessage />
                <Text align="left" size="base" color="text-neutral-900" weight="light">
                  {description.length}/500
                </Text>
              </FormItem>
            )}
          />
          <div className="absolute inset-x-0 bottom-0 mx-auto flex w-[98%] items-start justify-between rounded-md bg-neutral-50 p-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Back
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex items-center gap-2"
              disabled={!form.formState.isValid || createClusterMutation.isLoading || updateClusterMutation.isLoading}
            >
              {createClusterMutation.isLoading || updateClusterMutation.isLoading ? (
                <>
                  <Loader type="spinner" size={18} />
                  <Text>{mode === 'create' ? 'Creating...' : 'Updating...'}</Text>
                </>
              ) : (
                <>
                  <Text>{mode === 'create' ? 'Create Cluster' : 'Update Cluster'}</Text>
                  <SolarIconSet.ArrowRight size={18} />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
