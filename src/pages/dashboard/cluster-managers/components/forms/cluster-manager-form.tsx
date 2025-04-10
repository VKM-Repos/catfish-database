import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
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
import { clusterManagerRequestSchema, clusterManagerResponseSchema, clusterResponseSchema } from 'src/schemas/schemas'
import { Alert, AlertTitle, AlertDescription } from 'src/components/ui/alert'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Cluster } from 'src/types/cluster.types'
import { Grid } from 'src/components/ui/grid'

type ClusterManagerValues = z.infer<typeof clusterManagerRequestSchema> & { id?: string }

type ClusterManagerProps = {
  mode: 'create' | 'edit'
  initialValues?: ClusterManagerValues
  onSuccess?: () => void
  onClose?: () => void
}

export function ClusterManagerForm({ mode, initialValues, onSuccess, onClose }: ClusterManagerProps) {
  const queryClient = useQueryClient()
  const [error, setError] = useState<{ title: string; message: string } | null>(null)
  const form = useForm<ClusterManagerValues>({
    resolver: zodResolver(clusterManagerRequestSchema),
    defaultValues: initialValues || {},
  })

  // Create the create cluster mutation hook
  const useCreateClusterManager = createPostMutationHook({
    endpoint: '/users/cluster-manager',
    requestSchema: clusterManagerRequestSchema,
    responseSchema: clusterManagerResponseSchema,
  })

  // Create the update cluster mutation hook
  const useUpdateClusterManager = createPutMutationHook({
    endpoint: `/clusters/${initialValues?.id}`,
    requestSchema: clusterManagerRequestSchema,
    responseSchema: clusterManagerResponseSchema,
  })

  const createClusterManagerMutation = useCreateClusterManager()
  const updateClusterManagerMutation = useUpdateClusterManager()

  const useGetClusters = createGetQueryHook({
    endpoint: '/clusters',
    responseSchema: z.array(clusterResponseSchema),
    queryKey: ['clusters'],
  })

  const { data: clusters = [], isLoading: isLoadingClusters } = useGetClusters()

  const onSubmit = async (values: ClusterManagerValues) => {
    try {
      setError(null)
      if (mode === 'create') {
        await createClusterManagerMutation.mutateAsync({ ...values, password: 'Password@123' })
        queryClient.invalidateQueries(['clusters'])
      } else if (mode === 'edit' && initialValues?.id) {
        await updateClusterManagerMutation.mutateAsync({ ...values, id: initialValues.id, password: 'Password@123' })
        queryClient.invalidateQueries(['clusters'])
      }
      form.reset()
      onSuccess?.()
    } catch (err) {
      console.error(`${mode === 'create' ? 'Create' : 'Update'} cluster error:`, err)
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

  return (
    <>
      <div className="absolute inset-x-0 top-0 w-full border-b border-b-neutral-200 py-2">
        <Heading className="text-center" level={6}>
          {mode === 'create' ? 'Add cluster manager' : 'Edit cluster manager'}
        </Heading>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {error && (
            <Alert variant="error" tone="filled">
              <AlertTitle>{error.title}</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}
          <Grid cols={2} gap="gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Grid>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="clusterId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="font-light !text-neutral-400">
                      <SelectValue placeholder="Cluster" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingClusters ? (
                        <SelectItem value="loading" disabled>
                          <Text>Loading clusters...</Text>
                        </SelectItem>
                      ) : (
                        clusters?.map((cluster: Cluster) => (
                          <SelectItem key={cluster.id} value={String(cluster.id)}>
                            {cluster.name}
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Enter phone " {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="absolute inset-x-0 bottom-0 mx-auto flex w-[98%] items-start justify-between rounded-md bg-neutral-50 p-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex items-center gap-2"
              disabled={
                !form.formState.isValid ||
                createClusterManagerMutation.isLoading ||
                updateClusterManagerMutation.isLoading
              }
            >
              {createClusterManagerMutation.isLoading || updateClusterManagerMutation.isLoading ? (
                <>
                  <Loader type="spinner" size={18} />
                  <Text>{mode === 'create' ? 'Creating...' : 'Updating...'}</Text>
                </>
              ) : (
                <>
                  <Text>{mode === 'create' ? 'Create User' : 'Update User'}</Text>
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
