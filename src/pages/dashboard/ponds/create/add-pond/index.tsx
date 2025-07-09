import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { paths } from 'src/routes/paths'
import { Container } from 'src/components/ui/container'
import { Heading } from 'src/components/ui/heading'
import { Text } from 'src/components/ui/text'

import { FlexBox } from 'src/components/ui/flexbox'
import PondForm from './forms/pond-form'
import DiscardChanges from '../prompts/discard-changes'
import PondPrompt from '../prompts/pond-prompt'

export default function AddPond() {
  const navigate = useNavigate()
  const location = useLocation()

  /**
   * Preserve the origin path for "Maybe later" cases.
   * If none is provided, default to the ponds list.
   */
  const originPath = useRef<string>((location.state as { from?: string })?.from || paths.dashboard.ponds.root).current

  /**
   * Flag to know if we should drive user directly to the "add fish" flow
   * (coming from a ponds detail context, e.g., /ponds/:id)
   */
  const addFishPreferred: boolean = useRef<boolean>(
    (location.state as { addFishNext?: boolean })?.addFishNext || false,
  ).current

  const [step, setStep] = useState(1)
  const [openPrompt, setOpenPrompt] = useState(false)
  const [openDiscard, setOpenDiscard] = useState(false)

  const handleSuccess = () => {
    // After a successful create, trigger the prompt step (step = 2)
    setStep(2)
    setOpenPrompt(true)
  }

  const handleClose = () => setOpenDiscard(true)

  const RenderSteps = () => {
    switch (step) {
      case 1:
        return (
          <Container className="rounded-lg border border-neutral-200 p-6">
            <PondForm mode="create" onSuccess={handleSuccess} onClose={handleClose} />
          </Container>
        )
      case 2:
        return (
          <Container className="rounded-lg border border-neutral-200 p-6">
            <FlexBox direction="col" align="center" justify="center" className="space-y-4">
              <Heading level={4}>Completed!</Heading>
              <Text variant="body" color="text-neutral-600">
                Pond created successfully!
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

      {/* Modal prompt shown at step 2 */}
      <PondPrompt
        open={openPrompt}
        setOpen={setOpenPrompt}
        title="Success! Pond created"
        message={
          addFishPreferred
            ? 'Would you like to add fish to this pond now?'
            : 'Would you like to add another pond now? You can always do this later from your dashboard.'
        }
        primaryText={addFishPreferred ? 'Yes, add fish' : 'Yes, add another pond'}
        secondaryText={addFishPreferred ? 'No, do this later' : 'No, return'}
        primaryAction={() => {
          if (addFishPreferred) {
            navigate(paths.dashboard.ponds.create.addFishToPond)
          } else {
            setOpenPrompt(false)
            setStep(1)
          }
        }}
        secondaryAction={() => navigate(-1)}
      />

      {/* Discard changes modal */}
      <DiscardChanges open={openDiscard} setOpen={setOpenDiscard} onDiscard={() => navigate(-1)} />
    </div>
  )
}

/*
  HOW TO LINK TO THIS PAGE WHILE PRESERVING ORIGIN
  -----------------------------------------------
  navigate(paths.dashboard.ponds.addNew, {
    state: {
      from: location.pathname,      // current route
      addFishNext: true             // optional flag if we want the prompt to offer add‑fish flow
    }
  })
*/
