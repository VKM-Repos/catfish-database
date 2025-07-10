import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { paths } from 'src/routes/paths'
import { Container } from 'src/components/ui/container'
import { FlexBox } from 'src/components/ui/flexbox'
import { Heading } from 'src/components/ui/heading'
import { Text } from 'src/components/ui/text'
import BatchPrompt from '../prompts/batch-prompt'
import DiscardChanges from '../prompts/discard-changes'
import FishBatchForm from './forms/batch-form'

export default function AddBatch() {
  const navigate = useNavigate()
  const location = useLocation()

  const originPath = useRef<string>((location.state as { from?: string })?.from || paths.dashboard.ponds.root).current

  const [step, setStep] = useState(1)
  const [openPrompt, setOpenPrompt] = useState(false)
  const [openDiscard, setOpenDiscard] = useState(false)

  const handleSuccess = () => {
    setStep(2)
    setOpenPrompt(true)
  }

  const handleClose = () => setOpenDiscard(true)

  const RenderSteps = () => {
    switch (step) {
      case 1:
        return (
          <Container className="rounded-lg border border-neutral-200 p-6">
            <FishBatchForm mode="create" onSuccess={handleSuccess} onClose={handleClose} />
          </Container>
        )
      case 2:
        return (
          <Container className="rounded-lg border border-neutral-200 p-6">
            <FlexBox direction="col" align="center" justify="center" className="space-y-4">
              <Heading level={4}>Completed!</Heading>
              <Text variant="body" color="text-neutral-600">
                Fish batch recorded successfully!
              </Text>
            </FlexBox>
          </Container>
        )
      default:
        return null
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <RenderSteps />

      {/* Success prompt */}
      <BatchPrompt
        open={openPrompt}
        setOpen={setOpenPrompt}
        title="Success! Fish batch created"
        message="Would you like to record another batch now? You can always do this later from your dashboard."
        primaryText="Yes, add another batch"
        secondaryText="No, return"
        primaryAction={() => {
          setStep(1)
          setOpenPrompt(false)
        }}
        secondaryAction={() => navigate(-1)}
      />

      {/* Discard modal */}
      <DiscardChanges open={openDiscard} setOpen={setOpenDiscard} onDiscard={() => navigate(-1)} />
    </div>
  )
}
