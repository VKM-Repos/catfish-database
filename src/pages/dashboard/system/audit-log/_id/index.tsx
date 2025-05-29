import { useParams, useNavigate } from 'react-router-dom'
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
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  // const { data: audit, isLoading } = useGetAudit({ route: { id: id! } })

  const audit = {
    id: 'afe094c9-c7f0-4ce6-97e5-2d46467244b5',
    timestamp: '2025-05-02T13:33:41.125857',
    actionType: 'CREATE',
    entityType: 'Pond',
    entityId: 'cadcf174-9d59-4365-bc0d-5687675789a0',
    userId: 'b92eedd7-2713-4fdb-b30e-d233edb7840a',
    username: 'testfarmer@gmail.com',
    oldValue: null,
    newValue:
      '{"id":"cadcf174-9d59-4365-bc0d-5687675789a0","createdAt":"2025-05-02T13:33:41.125431781","updatedAt":"2025-05-02T13:33:41.125431781","createdBy":"b92eedd7-2713-4fdb-b30e-d233edb7840a","updatedBy":"b92eedd7-2713-4fdb-b30e-d233edb7840a","context":null,"version":0,"name":"Pond 1D","size":578,"waterSource":"Streams","pondType":"Concrete","cluster":{"id":"abuja-cluster2","name":"abuja-cluster2","state":{"id":37,"name":"Abuja"},"description":"A cluster in abuja","createdAt":"2025-04-16T14:16:49.542352","updatedAt":"2025-04-16T14:16:49.542352","createdBy":"5442e373-ec40-4593-9c2b-16a11b25037a","updatedBy":"5442e373-ec40-4593-9c2b-16a11b25037a"},"farmer":{"id":"b92eedd7-2713-4fdb-b30e-d233edb7840a","email":"testfarmer@gmail.com","role":"FARMER","firstName":"Farmer","lastName":"Test","phone":"08033838383","address":"Place","context":null,"password":"$2a$10$bOAXssmnx39vzAZoYI1PyeR7lhnil.U7YzXDss3hGwmk9kKlzLeT.","defaultPassword":false,"accountNonLocked":true,"enabled":true,"banUntil":null,"creat',
    description: 'Entity created',
    ipAddress: '127.0.0.1',
    userAgent:
      'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
  }
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
