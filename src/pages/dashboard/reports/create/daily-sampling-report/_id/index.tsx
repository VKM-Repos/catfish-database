import { FlexBox } from 'src/components/ui/flexbox'

import SamplingIndexForm from '../../../components/forms/sampling/sampling-report-index-form'
import { SortingForm } from '../../../components/forms/sorting/sorting-form'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from 'src/components/ui/breadcrumb'
import { Text } from 'src/components/ui/text'
import { FishBehavior } from '../../../components/forms/fish-behavior'
import { FishDisease } from '../../../components/forms/fish-disease'
import { useSamplingStepperStore } from 'src/store/sampling-stepper-store'
import { Mortality } from '../../../components/forms/mortality'

export default function CreateSampling() {
  const { step, nextStep, prevStep } = useSamplingStepperStore()

  const RenderSteps = () => {
    switch (step) {
      case 1:
        return <SamplingIndexForm handleNext={nextStep} />
      case 2:
        return <SortingForm handlePrevious={prevStep} handleNext={nextStep} />
      case 3:
        return <FishBehavior handleNext={nextStep} handlePrevious={prevStep} />
      case 4:
        return <FishDisease handleNext={nextStep} handlePrevious={prevStep} isLastStep={false} />
      case 5:
        return <Mortality handlePrevious={prevStep} />
      default:
        return null
    }
  }

  return (
    <>
      <FlexBox className="mx-10">
        <CustomBreadcrumb />
      </FlexBox>
      <FlexBox direction="col" gap="gap-5" align="center" className="mx-auto mt-5 w-full max-w-[80%]">
        <Stepper step={step} />
        <RenderSteps />
      </FlexBox>
    </>
  )
}

const Stepper = ({ step }: { step: number }) => {
  return (
    <div className="w-full">
      <div className="mx-auto flex max-w-[90%] items-center justify-center">
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
              step >= 2 ? 'border-primary-500 text-primary-500' : 'border-neutral-200 text-neutral-200'
            } flex h-5 w-5 items-center justify-center rounded-[1.25rem] border text-xs`}
          >
            2
          </span>
          <p className={`${step >= 2 ? 'text-primary-500' : 'text-neutral-200'} text-sm font-medium`}>Sorting</p>
        </FlexBox>
        <hr className={`w-full max-w-[1/5] border ${step > 2 ? 'border-primary-500' : ''}`} />

        <FlexBox
          gap="gap-[.625rem]"
          align="center"
          className={`w-full max-w-fit rounded-[4rem] border ${step === 3 ? 'border-primary-500' : ''} p-[.625rem]`}
        >
          <span
            className={`${
              step >= 3 ? 'border-primary-500 text-primary-500' : 'border-neutral-200 text-neutral-200'
            } flex h-5 w-5 items-center justify-center rounded-[1.25rem] border text-xs`}
          >
            3
          </span>
          <p className={`${step >= 3 ? 'text-primary-500' : 'text-neutral-200'} text-sm font-medium`}>Fish Behavior</p>
        </FlexBox>
        <hr className={`w-full max-w-[1/5] border ${step > 3 ? 'border-primary-500' : ''}`} />

        <FlexBox
          gap="gap-[.625rem]"
          align="center"
          className={`w-full max-w-fit rounded-[4rem] border ${step === 4 ? 'border-primary-500' : ''} p-[.625rem]`}
        >
          <span
            className={`${
              step >= 4 ? 'border-primary-500 text-primary-500' : 'border-neutral-200 text-neutral-200'
            } flex h-5 w-5 items-center justify-center rounded-[1.25rem] border text-xs`}
          >
            4
          </span>
          <p className={`${step >= 4 ? 'text-primary-500' : 'text-neutral-200'} text-sm font-medium`}>Fish disease</p>
        </FlexBox>
        <hr className={`w-full max-w-[1/5] border ${step > 4 ? 'border-primary-500' : ''}`} />

        <FlexBox
          gap="gap-[.625rem]"
          align="center"
          className={`w-full max-w-fit rounded-[4rem] border ${step === 5 ? 'border-primary-500' : ''} p-[.625rem]`}
        >
          <span
            className={`${
              step === 5 ? 'border-primary-500 text-primary-500' : 'border-neutral-200 text-neutral-200'
            } flex h-5 w-5 items-center justify-center rounded-[1.25rem] border text-xs`}
          >
            5
          </span>
          <p className={`${step === 5 ? 'text-primary-500' : 'text-neutral-200'} text-sm font-medium`}>Mortality</p>
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
