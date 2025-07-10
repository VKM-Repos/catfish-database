import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { useState } from 'react'

import PromptNewFeedType from '../prompts/prompt-new-feed'
import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes'
import FeedStockForm from '../../inventory/create/feed-stock/feed-stock-form'
import { Dialog, DialogContent, DialogHeader } from 'src/components/ui/dialog'
import { Button } from 'src/components/ui/button'
import { Heading } from 'src/components/ui/heading'
import * as SolarIconSet from 'solar-icon-set'
import ECLIPSE from 'src/assets/images/ellipse.png'
import DiscardChanges from '../../ponds/create/prompts/discard-changes'
import { useQueryClient } from '@tanstack/react-query'

export default function RegisterFeedTypes() {
  const [open, setOpen] = useState(false)
  const [openCancelPrompt, setOpenCancelPrompt] = useState(false)
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const queryClient = useQueryClient()

  const handleYesConditionOnClose = () => {
    setOpen(false)
  }

  const handleNoConditionOnClose = () => {
    setOpen(false)
    queryClient.refetchQueries(['my-inventory'])
    navigate(paths.dashboard.home.overview)
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
              <FeedStockForm mode="create" setStep={setStep} onCancel={() => setOpenCancelPrompt(true)} />
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
              className="h-fit w-fit overflow-y-scroll p-8"
            >
              <>
                <picture>
                  <img className="absolute left-0 top-0 w-[10rem]" src={ECLIPSE} alt="Background ellipse" />
                </picture>
                <DialogHeader>
                  <Heading level={5} weight="semibold" className="text-center">
                    Success! Feed recorded
                  </Heading>
                </DialogHeader>
                <div className="space-y-8">
                  <Text className="text-center">
                    Do you want to add another feed ? You can always add to your stock from your inventory.
                  </Text>
                  <div className="flex w-full flex-col justify-between space-x-2">
                    <Button variant="primary" onClick={() => setStep(1)} className="w-full font-semibold">
                      Yes, add another feed
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleNoConditionOnClose}
                      className="w-full font-semibold text-primary-500"
                    >
                      No, I will do this later
                    </Button>
                  </div>
                </div>
              </>
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
        <PromptNewFeedType
          open={open}
          setOpen={setOpen}
          handleNoConditionOnClose={handleNoConditionOnClose}
          handleYesConditionOnClose={handleYesConditionOnClose}
        />
        <DiscardChanges open={openCancelPrompt} setOpen={setOpenCancelPrompt} onDiscard={() => navigate(-1)} />
      </>
    </FlexBox>
  )
}
