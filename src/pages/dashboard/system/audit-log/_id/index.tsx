import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Dialog, DialogContent } from 'src/components/ui/dialog'
import { Text } from 'src/components/ui/text'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { Loader } from 'src/components/ui/loader'
import { paths } from 'src/routes/paths'
import { Heading } from 'src/components/ui/heading'
import { Button } from 'src/components/ui/button'
import { auditResponseSchema } from 'src/schemas/auditLogSchema'
import * as SolarIconSet from 'solar-icon-set'

const useGetAudit = createGetQueryHook<typeof auditResponseSchema, { id: string }>({
  endpoint: '/audit-log/:id',
  responseSchema: auditResponseSchema,
  queryKey: ['audit'],
})

export default function AuditDetailsModal() {
  const location = useLocation()
  const audit = location.state?.audit

  // console.log('test audit: ', testAudit)
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  // const { data: audit, isLoading } = useGetAudit({ route: { id: id! } })

  const isLoading = false
  if (!id) {
    return null
  }

  return (
    <Dialog open={true} onOpenChange={() => navigate(paths.dashboard.system.auditLog.root)}>
      <DialogContent className="min-h-[500px] max-w-[600px] rounded-xl px-8 py-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader type="dots" size={24} />
          </div>
        ) : audit ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <Heading level={5} className="text-lg font-semibold">
                Log details
              </Heading>

              <SolarIconSet.CloseCircle
                onClick={() => navigate(paths.dashboard.system.auditLog.root)}
                size={20}
                className="cursor-pointer"
              />
            </div>

            <div className="text-muted-foreground grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div>
                <Text className="font-medium text-black">Timestamp</Text>
                <Text>{new Date(audit.timestamp).toLocaleString()}</Text>
              </div>
              <div>
                <Text className="font-medium text-black">Action type</Text>
                <Text>{audit.actionType}</Text>
              </div>
              <div>
                <Text className="font-medium text-black">Entity type</Text>
                <Text>{audit.entityType}</Text>
              </div>
              <div>
                <Text className="font-medium text-black">Entity ID</Text>
                <Text>{audit.entityId}</Text>
              </div>
              <div>
                <Text className="font-medium text-black">User Email</Text>
                <Text>{audit.username}</Text>
              </div>
              <div>
                <Text className="font-medium text-black">Affected User</Text>
                <Text>{audit.username || audit.username}</Text>
              </div>
              <div className="col-span-2">
                <Text className="font-medium text-black">Description</Text>
                <Text>{audit.description}</Text>
              </div>
              <div>
                <Text className="font-medium text-black">IP Address</Text>
                <Text>{audit.ipAddress}</Text>
              </div>
              <div>
                <Text className="font-medium text-black">Session ID</Text>
                <Text>{audit.ipAddress || '—'}</Text>
              </div>
            </div>

            {(audit.oldValue || audit.newValue) && (
              <div className="bg-muted mt-6 rounded-md border p-4">
                <Text className="mb-2 font-medium text-black">Changes made</Text>
                <div className="text-muted-foreground flex justify-between gap-4 text-sm">
                  <div className="flex-1">
                    <Text className="font-semibold text-black">Previous value</Text>
                    <pre className="whitespace-pre-wrap">Null</pre>
                  </div>
                  <div className="flex-1">
                    <Text className="font-semibold text-black">New value</Text>
                    <pre className="whitespace-pre-wrap">Null</pre>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => navigate(paths.dashboard.system.auditLog.root)}>
                Close
              </Button>
            </div>
          </>
        ) : (
          <Text>Audit not found</Text>
        )}
      </DialogContent>
    </Dialog>
  )
}
