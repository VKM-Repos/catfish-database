import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { useState } from 'react'
import { z } from 'zod'
import CancelPrompt from '../../ponds/create/prompts/cancel-prompt'
import PromptNewFeedType from '../prompts/prompt-new-feed'
import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import FeedStockForm from '../../inventory/create/feed-stock/feed-stock-form'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from 'src/components/ui/dialog'
import { Button } from 'src/components/ui/button'
import { Heading } from 'src/components/ui/heading'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import * as SolarIconSet from 'solar-icon-set'

export default function RegisterFeedTypes() {
  const [open, setOpen] = useState(false)
  const [openCancelPrompt, setOpenCancelPrompt] = useState(false)
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  const useGetFishBatches = createGetQueryHook({
    endpoint: '/fish-batches',
    responseSchema: z.any(),
    queryKey: ['fish-batches'],
  })

  const { data: fishBatches } = useGetFishBatches()

  const handleCancelYes = () => {
    setOpenCancelPrompt(false)
  }

  const handleCancelNo = () => {
    setOpenCancelPrompt(false)
  }

  const handleYesConditionOnClose = () => {
    setOpen(false)
  }

  const handleNoConditionOnClose = () => {
    setOpen(false)
    navigate(fishBatches.totalElements > 1 ? paths.dashboard.home.overview : paths.dashboard.home.getStarted)
  }

  const RenderSteps = () => {
    switch (step) {
      case 1:
        return (
          <>
            <FlexBox direction="col" gap="gap-[.625rem]" align="center" className="w-full text-center">
              <h1 className="flex items-center gap-2 text-[1.5rem] font-bold">
                Register your feed types{' '}
                <span>
                  <SolarIconSet.MoneyBag />
                </span>
              </h1>
              <Text>Add each feed’s name, pellet size, and cost to populate your daily feeding options</Text>
            </FlexBox>
            <div className="relative left-0 w-full rounded-lg border border-neutral-200 p-4">
              <Heading level={6} className="absolute left-0 top-0 w-full border-b border-neutral-200 p-3 text-left ">
                Feed Details
              </Heading>
              <div className="py-4" />
              <FeedStockForm
                mode="create"
                setStep={setStep}
                onCancel={() => navigate(`${paths.dashboard.inventory.root}`)}
              />
            </div>
          </>
        )
      case 2:
        return (
          <Dialog open={true} onOpenChange={() => navigate(paths.dashboard.inventory.root)}>
            <DialogContent
              onInteractOutside={(e) => {
                e.preventDefault()
              }}
              className="max-h-[80vh] max-w-[750px] overflow-y-scroll p-8"
            >
              <VisuallyHidden>
                <DialogTitle>Add new feed type?</DialogTitle>
                <DialogDescription>
                  This popup allows you to either start a new process to add a feed type or leave the page
                </DialogDescription>
              </VisuallyHidden>
              <FlexBox direction="col" justify="between" gap="gap-[3.25rem]" align="center">
                <FlexBox direction="col" gap="gap-2" align="center">
                  <Heading level={5} weight="bold">
                    Success! Feed recorded
                  </Heading>
                  <Text className="text-center">
                    Do you want to add another feed ? You can always add to your stock from your inventory.
                  </Text>
                </FlexBox>
                <FlexBox direction="col" gap="gap-3" className="w-full">
                  <Button variant="primary" onClick={handleYesConditionOnClose} className="w-full font-semibold">
                    Yes, add another feed
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleNoConditionOnClose}
                    className="w-full font-semibold text-primary-500"
                  >
                    No, I will do this later
                  </Button>
                </FlexBox>
              </FlexBox>
            </DialogContent>
          </Dialog>
        )
      default:
        return null
    }
  }

  return (
    <FlexBox direction="col" gap="gap-5" align="center" className="mx-auto w-full max-w-[50%]">
      <FlexBox direction="col" gap="gap-[.625rem]" align="center" className="w-full text-center">
        <RenderSteps />
      </FlexBox>
      <>
        <CancelPrompt
          openCancelPrompt={openCancelPrompt}
          setOpenCancelPrompt={setOpenCancelPrompt}
          handleCancelYes={handleCancelYes}
          handleCancelNo={handleCancelNo}
        />
        <PromptNewFeedType
          open={open}
          setOpen={setOpen}
          handleNoConditionOnClose={handleNoConditionOnClose}
          handleYesConditionOnClose={handleYesConditionOnClose}
        />
      </>
    </FlexBox>
  )
}
