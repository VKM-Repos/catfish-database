import { FlexBox } from '../ui/flexbox'

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
