import { Dialog, DialogClose, DialogContent, DialogHeader } from 'src/components/ui/dialog'
import { Button } from 'src/components/ui/button'
import { useQueryClient } from '@tanstack/react-query'
import { createDeleteMutationHook } from 'src/api/hooks/useDelete'
import { z } from 'zod'
import { Cluster } from 'src/types/cluster.types'
import { X } from 'lucide-react'
import ECLIPSE from 'src/assets/images/ellipse.png'
import { Heading } from 'src/components/ui/heading'
import { Text } from 'src/components/ui/text'
import { useState } from 'react'

type DeleteClusterDialogProps = {
  cluster: Cluster
  open: boolean
  onOpenChange: (open: boolean) => void
}

const responseSchema = z.object({
  success: z.boolean(),
})

export function DeleteClusterDialog({ cluster, open, onOpenChange }: DeleteClusterDialogProps) {
  const queryClient = useQueryClient()
  const [step, setStep] = useState(1)

  const useDeleteCluster = createDeleteMutationHook<typeof responseSchema, { id: string }>({
    endpoint: `/clusters/${cluster.id}`,
    responseSchema,
    onSuccess: () => {
      queryClient.invalidateQueries(['clusters'])
      setStep(2)
    },
  })

  const { mutate: deleteCluster, isLoading } = useDeleteCluster({
    route: { id: cluster.id },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-8">
        <picture>
          <img className="absolute left-0 top-0 w-[10rem]" src={ECLIPSE} alt="" />
        </picture>
        <DialogClose className="flex h-16 w-full items-center justify-end">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader>
          <Heading level={5}>{step === 1 ? 'Delete Cluster?' : 'Done'}</Heading>
        </DialogHeader>
        {step === 1 ? (
          <div className="space-y-8">
            <Text
              weight="light"
              size="base"
            >{`Are you sure you want to delete the cluster "${cluster.name}"? This action cannot be undone.`}</Text>
            <div className="flex w-full justify-between space-x-2">
              <Button className="w-full" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button className="w-full" variant="primary" onClick={() => deleteCluster()} disabled={true}>
                {isLoading ? 'Deleting...' : 'Continue'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Text className="text-lg font-semibold">Cluster deleted successfully!</Text>
            <Button variant="primary" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
