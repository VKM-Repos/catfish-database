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
import { Heading } from 'src/components/ui/heading'
import { roleRequestSchema, roleResponseSchema } from 'src/schemas/schemas'
import { Alert, AlertTitle, AlertDescription } from 'src/components/ui/alert'
import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { FlexBox } from 'src/components/ui/flexbox'
import { useLocation } from 'react-router-dom'
import { authCache } from 'src/api'
import { Grid } from 'src/components/ui/grid'

type RoleFormValues = z.infer<typeof roleRequestSchema>

type RoleFormProps = {
  mode: 'create' | 'edit'
  initialValues?: RoleFormValues
  onSuccess?: () => void
  onClose?: () => void
}

const useGetAllPrivileges = () => {
  const [allPrivileges, setAllPrivileges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function fetchAll() {
      let page = 0
      const size = 100
      let privileges: any[] = []
      let totalPages = 1
      const baseUrl = import.meta.env.VITE_API_BASE_URL
      const token = authCache.getToken()

      while (page < totalPages) {
        const res = await fetch(`${baseUrl}/roles/privileges?page=${page}&size=${size}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        privileges = privileges.concat(data?.content || [])
        totalPages = data?.totalPages
        page++
      }
      if (isMounted) {
        setAllPrivileges(privileges)
        setLoading(false)
      }
    }
    fetchAll()
    return () => {
      isMounted = false
    }
  }, [])

  return { privileges: allPrivileges, loading }
}

export function EditConfigForm({ mode, initialValues, onSuccess, onClose }: RoleFormProps) {
  const location = useLocation()
  const { role, allPrivileges: statePrivileges } = location?.state || {}

  const { privileges: fetchedPrivileges, loading: loadingPrivileges } = useGetAllPrivileges()

  const allPrivileges = mode === 'edit' ? fetchedPrivileges : statePrivileges

  const queryClient = useQueryClient()
  const [error, setError] = useState<{ title: string; message: string } | null>(null)
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleRequestSchema),
    defaultValues: initialValues || {
      id: '', // or use uuid if needed
      name: '',
      description: '',
      privilegeIds: [],
    },
    mode: 'onChange',
  })

  // Create farmer staff
  const useCreateRole = createPostMutationHook({
    endpoint: '/roles',
    requestSchema: roleRequestSchema,
    responseSchema: roleResponseSchema,
  })

  const useCreateRoleMutation = useCreateRole()

  // PUT mutation
  const usePutRole = createPutMutationHook({
    endpoint: `/roles/${initialValues?.id}`,
    requestSchema: roleRequestSchema,
    responseSchema: roleResponseSchema,
  })
  const updateRoleMutation = usePutRole()

  const onSubmit = async (values: RoleFormValues) => {
    try {
      setError(null)
      const formData = { ...values }

      if (mode === 'create') {
        await useCreateRoleMutation.mutateAsync(formData)
        queryClient.invalidateQueries(['roles'])
      } else if (mode === 'edit' && initialValues?.id) {
        await updateRoleMutation.mutateAsync(formData)
        queryClient.invalidateQueries(['roles'])
      }
      form.reset()
      onSuccess?.()
    } catch (err) {
      console.error(`${mode === 'create' ? 'Create' : 'Update'} role error:`, err)
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
                Configuration Title <span className="font-bold text-red-500">*</span>
                <SolarIconSet.QuestionCircle size={16} />
              </Text>
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem className="w-full">
                    <FormControl className="w-full">
                      <Input
                        state={fieldState.error ? 'error' : 'default'}
                        className="w-full"
                        placeholder="Feeding schedule"
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
                Key (Read-only) <span className="font-bold text-red-500">*</span>
                <SolarIconSet.QuestionCircle size={16} />
              </Text>
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        state={fieldState.error ? 'error' : 'default'}
                        className="w-full"
                        placeholder="Enter last name"
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
            Description <span className="font-bold text-red-500">*</span>
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
                  List
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

            <Heading level={6} className="text-lg font-semibold text-neutral-800">
              Current Value
            </Heading>
            <FlexBox direction="col">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <button
                // onClick={() => openAddModal(config.id)}
                className="col-span-2 flex w-full items-center justify-center gap-2 rounded-md border-2 border-dashed border-neutral-200 py-2 hover:bg-hover"
              >
                <SolarIconSet.AddSquare color="black" size={14} iconStyle="Outline" />
                <Heading level={6}>Add another</Heading>
              </button>
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
              {useCreateRoleMutation.isLoading || updateRoleMutation.isLoading ? (
                <>
                  <Loader type="spinner" size={18} />
                  <Text>{mode === 'create' ? 'Creating...' : 'Updating...'}</Text>
                </>
              ) : (
                <>
                  <Text>{mode === 'create' ? 'Save' : 'Update'}</Text>
                </>
              )}
            </Button>
          </FlexBox>
        </form>
      </Form>
    </>
  )
}
