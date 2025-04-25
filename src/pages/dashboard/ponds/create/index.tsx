import { useState } from 'react'
import { FlagIcon } from 'src/assets/icons/svg-icons'
import { FlexBox } from 'src/components/ui/flexbox'
import * as SolarIconSet from 'solar-icon-set'
import { Text } from 'src/components/ui/text'
import { usePondStore } from 'src/store/pond.store'
import AddPond from '../components/add-pond'
import AddFishPond from '../components/add-fish-to-pond'
import { useNavigate } from 'react-router-dom'

export default function CreatePondPage() {
  const [step, setStep] = useState(1)
  const { pondData, resetPondStore } = usePondStore()
  const navigate = useNavigate()

  const handleNext = () => {
    setStep(step + 1)
  }

  const onSubmit = async () => {
    try {
      console.log(pondData)
      navigate('/dashboard/ponds')
      resetPondStore()
    } catch (error) {
      console.error(error)
    }
  }

  const RenderSteps = () => {
    switch (step) {
      case 1:
        return <AddPond handleNext={handleNext} />
      case 2:
        return <AddFishPond handleNext={onSubmit} />
      default:
        return null
    }
  }

  return (
    <FlexBox direction="col" gap="gap-5" align="center" className="mx-auto w-full max-w-[50%]">
      {step === 1 ? (
        <FlexBox direction="col" gap="gap-[.625rem]" align="center" className="w-full text-center">
          <h1 className="flex items-center gap-2 text-[1.5rem] font-bold">
            Add a Pond{' '}
            <span>
              <FlagIcon />
            </span>
          </h1>
          <Text>Add your pond with these guided steps</Text>
        </FlexBox>
      ) : (
        <FlexBox direction="col" gap="gap-[.625rem]" align="center" className="w-full text-center">
          <h1 className="flex items-center gap-2 text-[1.5rem] font-bold">
            Add Fish to a Pond
            <span>
              <SolarIconSet.Waterdrop />
            </span>
          </h1>
          <Text>Let’s add the fish you just stocked into this pond</Text>
        </FlexBox>
      )}
      <Stepper step={step} />
      <RenderSteps />
    </FlexBox>
  )
}

const Stepper = ({ step }: { step: number }) => {
  return (
    <div className="w-full">
      <div className="mx-auto flex max-w-[80%] items-center justify-center">
        <FlexBox gap="gap-[.625rem]" align="center" className="w-full max-w-fit rounded-[4rem] border p-[.625rem]">
          <span
            className={`${
              step >= 1 ? 'border-primary-500 text-primary-500' : 'border-neutral-200 text-neutral-200'
            } flex h-5  w-5 items-center justify-center rounded-[1.25rem] border text-xs`}
          >
            1
          </span>
          <p className={`${step >= 1 ? 'text-primary-500' : 'text-neutral-200'} text-sm font-medium`}>Pond Details</p>
        </FlexBox>
        <hr className="w-full max-w-[1/5]" />
        <FlexBox gap="gap-[.625rem]" align="center" className="w-full max-w-fit rounded-[4rem]  border p-[.625rem]">
          <span
            className={`${
              step === 2 ? 'border-primary-500 text-primary-500' : 'border-neutral-200 text-neutral-200'
            } flex h-5 w-5 items-center justify-center rounded-[1.25rem] border text-xs`}
          >
            2
          </span>
          <p className={`${step === 2 ? 'text-primary-500' : 'text-neutral-200'} text-sm font-medium`}>
            Add Fish to Pond
          </p>
        </FlexBox>
      </div>
    </div>
  )
}
