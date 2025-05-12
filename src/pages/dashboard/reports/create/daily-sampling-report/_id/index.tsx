import { useState } from 'react'
import { FlexBox } from 'src/components/ui/flexbox'
import { usePondStore } from 'src/store/pond.store'

import { useNavigate } from 'react-router-dom'
import SamplingIndexForm from '../../../components/forms/sampling/sampling-report-index-form'
import { SortingForm } from '../../../components/forms/sorting/sorting-from'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from 'src/components/ui/breadcrumb'
import { Text } from 'src/components/ui/text'

export default function CreatePondPage() {
  const [step, setStep] = useState(1)
  const { pondData, resetPondStore } = usePondStore()
  const navigate = useNavigate()

  const handleNext = () => {
    setStep(step + 1)
    console.log('next')
  }

  const handlePrevious = () => {
    setStep(step - 1)
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
        return <SamplingIndexForm handlePrevious={handlePrevious} handleNext={handleNext} />
      case 2:
        return <SortingForm handlePrevious={handlePrevious} handleNext={onSubmit} />
      default:
        return null
    }
  }

  return (
    <>
      <FlexBox className="mx-10">
        <CustomBreadcrumb />
      </FlexBox>
      <FlexBox direction="col" gap="gap-5" align="center" className="mx-auto w-full max-w-[60%]">
        <Stepper step={step} />
        <RenderSteps />
      </FlexBox>
    </>
  )
}

const Stepper = ({ step }: { step: number }) => {
  return (
    <div className="w-[50%]">
      <div className="mx-auto flex max-w-[80%] items-center justify-center">
        <FlexBox
          gap="gap-[.625rem]"
          align="center"
          className={`w-full max-w-fit rounded-[4rem] border ${
            step === 1 || step > 1 ? 'border-primary-500' : ''
          } p-[.625rem]`}
        >
          <span
            className={`${
              step >= 1 ? 'border-primary-500 text-primary-500' : 'border-neutral-200 text-neutral-200'
            } flex h-5  w-5 items-center justify-center rounded-[1.25rem] border text-xs`}
          >
            1
          </span>
          <p className={`${step >= 1 ? 'text-primary-500' : 'text-neutral-200'} text-sm font-medium`}>Sampling</p>
        </FlexBox>
        <hr className={`w-full max-w-[1/5] border ${step > 1 ? 'border-primary-500' : ''}`} />
        <FlexBox
          gap="gap-[.625rem]"
          align="center"
          className={`w-full max-w-fit rounded-[4rem] border ${step > 1 ? 'border-primary-500' : ''} p-[.625rem]`}
        >
          <span
            className={`${
              step === 2 ? 'border-primary-500 text-primary-500' : 'border-neutral-200 text-neutral-200'
            } flex h-5 w-5 items-center justify-center rounded-[1.25rem] border text-xs`}
          >
            2
          </span>
          <p className={`${step === 2 ? 'text-primary-500' : 'text-neutral-200'} text-sm font-medium`}>Sorting</p>
        </FlexBox>
      </div>
    </div>
  )
}

const CustomBreadcrumb = () => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink>
            <Text className="text-primary-500">Sampling Report</Text>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink>
            <Text>New Entry</Text>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
