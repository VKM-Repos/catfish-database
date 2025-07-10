import { useNavigate } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from 'src/components/ui/breadcrumb'
import { Text } from 'src/components/ui/text'
import { paths } from 'src/routes'
import { DailyFeeding } from '../../../components/forms/feeding-report/fish-feeding-form'
import { WaterQuality } from '../../../components/forms/water-quality'
import { useStepperStore } from 'src/store/daily-feeding-stepper-store'
import { FlexBox } from 'src/components/ui/flexbox'
import { FishBehavior } from '../../../components/forms/fish-behavior'
import { FishDisease } from '../../../components/forms/fish-disease'
import { Mortality } from '../../../components/forms/mortality'

export default function CreateDailyFeedingReportPage() {
  const { step, next, previous, setStep } = useStepperStore()
  const navigate = useNavigate()

  const handleNext = () => {
    next()
    // setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step === 1) {
      navigate(paths.dashboard.home.getStarted)
      return
    }
    previous()
  }

  const RenderSteps = () => {
    switch (step) {
      case 1:
        return <DailyFeeding handleNext={handleNext} />
      case 2:
        return <WaterQuality handleNext={handleNext} handlePrevious={handlePrevious} />
      case 3:
        return <FishBehavior handleNext={handleNext} handlePrevious={handlePrevious} />
      case 4:
        return <FishDisease handlePrevious={handlePrevious} handleNext={handleNext} />
      case 5:
        return <Mortality handlePrevious={handlePrevious} />
      default:
        return null
    }
  }

  return (
    <>
      <FlexBox className="mx-10 w-full">
        <CustomBreadcrumb />
      </FlexBox>
      <FlexBox direction="col" gap="gap-5" align="center" className="mx-auto max-w-[80%]">
        <Stepper />
        <RenderSteps />
      </FlexBox>
    </>
  )
}

const Stepper = () => {
  const { step } = useStepperStore()

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
            } flex h-5 w-5 items-center justify-center rounded-[1.25rem] border text-xs`}
          >
            1
          </span>
          <p className={`${step >= 1 ? 'text-primary-500' : 'text-neutral-200'} text-sm font-medium`}>Feeding</p>
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
          <p className={`${step >= 2 ? 'text-primary-500' : 'text-neutral-200'} text-sm font-medium`}>Water Quality</p>
        </FlexBox>
        <hr className={`w-full max-w-[1/5] border ${step > 2 ? 'border-primary-500' : ''}`} />
        <FlexBox
          gap="gap-[.625rem]"
          align="center"
          className={`w-full max-w-fit rounded-[4rem] border ${step > 2 ? 'border-primary-500' : ''} p-[.625rem]`}
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
          className={`w-full max-w-fit rounded-[4rem] border ${step > 3 ? 'border-primary-500' : ''} p-[.625rem]`}
        >
          <span
            className={`${
              step >= 4 ? 'border-primary-500 text-primary-500' : 'border-neutral-200 text-neutral-200'
            } flex h-5 w-5 items-center justify-center rounded-[1.25rem] border text-xs`}
          >
            4
          </span>
          <p className={`${step >= 4 ? 'text-primary-500' : 'text-neutral-200'} text-sm font-medium`}>Fish Diseases</p>
        </FlexBox>
        <hr className={`w-full max-w-[1/5] border ${step > 4 ? 'border-primary-500' : ''}`} />

        <FlexBox
          gap="gap-[.625rem]"
          align="center"
          className={`w-full max-w-fit rounded-[4rem] border ${step > 4 ? 'border-primary-500' : ''} p-[.625rem]`}
        >
          <span
            className={`${
              step >= 5 ? 'border-primary-500 text-primary-500' : 'border-neutral-200 text-neutral-200'
            } flex h-5 w-5 items-center justify-center rounded-[1.25rem] border text-xs`}
          >
            5
          </span>
          <p className={`${step >= 5 ? 'text-primary-500' : 'text-neutral-200'} text-sm font-medium`}>Mortality</p>
        </FlexBox>
      </div>
    </div>
  )
}

// CustomBreadcrumb remains the same
const CustomBreadcrumb = () => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink>
            <Text className="text-primary-500">Daily Report</Text>
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
