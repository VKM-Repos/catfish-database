import { useNavigate, useSearchParams } from 'react-router-dom'
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
import { DateTimePicker } from '../../../components/forms/date-time-picker'
import { useMemo } from 'react'

export default function CreateDailyFeedingReportPage() {
  const { step, next, previous } = useStepperStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const from = searchParams.get('from')
  const handleNext = () => {
    next()
    // setStep(step + 1)
  }

  const handlePrevious = () => {
    if (from) {
      navigate(paths.dashboard.reports.root)
      return
    }
    if (step === 1) {
      navigate(paths.dashboard.home.getStarted)
      return
    }
    previous()
  }

  const RenderSteps = () => {
    switch (step) {
      case 1:
        return <DailyFeeding handleNext={handleNext} handlePrevious={handlePrevious} />
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
    <div className="flex flex-col justify-center lg:items-center">
      <FlexBox className="flex w-full  flex-col lg:mx-10 lg:max-w-[80%] lg:flex-row lg:items-center" justify="between">
        <CustomBreadcrumb />
        <DateTimePicker dateLabel="Change Date" timeLabel="Time" required={true} className="items-start" />
      </FlexBox>
      <FlexBox direction="col" gap="gap-5" align="center" className="mx-auto mt-5 w-full lg:max-w-[80%]">
        <Stepper />
        <RenderSteps />
      </FlexBox>
    </div>
  )
}

const Stepper = () => {
  const { step } = useStepperStore()

  return (
    <div className="hidden w-full lg:inline">
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

{
  /* Circular Progress Bar for mobile screens.*/
}

const TOTAL_STEPS = 5

export const CircularProgress = () => {
  const { step } = useStepperStore()

  const radius = 50
  const stroke = 15
  const normalizedRadius = radius - stroke / 2
  const circumference = 2 * Math.PI * normalizedRadius

  const strokeDashoffset = useMemo(() => {
    const clampedStep = Math.min(step, TOTAL_STEPS)
    const progress = clampedStep / TOTAL_STEPS
    return circumference - progress * circumference
  }, [step, circumference])

  return (
    <div className="">
      <svg width={radius * 2} height={radius * 2} className="">
        {/* Background Circle */}
        <circle cx={radius} cy={radius} r={normalizedRadius} fill="transparent" stroke="#e5e7eb" strokeWidth={stroke} />
        {/* Progress Circle */}
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="transparent"
          stroke="#651391" // Primary color
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="butt"
          transform={`rotate(-90 ${radius} ${radius})`} // Rotate around center
          style={{ transition: 'stroke-dashoffset 0.4s ease' }}
        />
        {/* Text in the center */}
        <text x="50%" y="50%" textAnchor="middle" dy=".3em" className=" text-[1rem] font-semibold">
          {step} of {TOTAL_STEPS}
        </text>
      </svg>
    </div>
  )
}
