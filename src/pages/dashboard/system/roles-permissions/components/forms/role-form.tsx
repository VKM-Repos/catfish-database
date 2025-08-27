import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Button } from 'src/components/ui/button'
import { Text } from 'src/components/ui/text'
import { Loader } from 'src/components/ui/loader'
import { createPostMutationHook } from 'src/api/hooks/usePost'
import { createPutMutationHook } from 'src/api/hooks/usePut'

import { z } from 'zod'
import { Heading } from 'src/components/ui/heading'
import { Alert, AlertTitle, AlertDescription } from 'src/components/ui/alert'
import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { FlexBox } from 'src/components/ui/flexbox'
import ModuleTable from './module-table'
import { useLocation } from 'react-router-dom'
import { authCache } from 'src/api'
import { roleFormSchema, roleRequestSchema, roleResponseSchema } from 'src/schemas/rolePermissionSchema'

// const roleSchema = z.object({
//   id: z.string(),
//   name: z.string(),
//   description: z.string(),
//   privilegeIds: z.array(z.string()),
// })

type RoleFormValues = z.infer<typeof roleFormSchema>

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

export function RoleForm({ mode, initialValues, onSuccess, onClose }: RoleFormProps) {
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
    console.log('values: ', {
      ...values,
    })

    try {
      setError(null)
      const formData = {
        ...values,
      }

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
            {mode === 'create' ? 'Create a New Role' : 'Edit Role'}
          </Heading>
          <p className="mt-1 text-sm leading-snug text-neutral-600">
            {mode === 'create'
              ? 'Define user roles and assign permissions to control access to various features of the system.'
              : 'Customize user roles and assign permissions to control access to various features of the system.'}
          </p>
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
          <Text className="flex items-center text-sm font-medium text-neutral-700">
            Role Name <span className="font-bold text-red-500">*</span>
          </Text>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Enter role name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Text className="flex items-center text-sm font-medium text-neutral-700">
            Role Description <span className="font-bold text-red-500">*</span>
          </Text>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Describes the role's purpose" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ModuleTable
            mode={mode}
            allPrivileges={allPrivileges}
            role={role}
            onChangePrivilegeIds={(ids) => form.setValue('privilegeIds', ids)}
            // onChangePrivilegeIds={(ids) => console.log('privilegesIds', ids)}
          />

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
