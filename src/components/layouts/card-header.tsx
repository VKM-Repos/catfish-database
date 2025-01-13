import { Heading } from './heading'

type CardHeaderProps = {
  heading_string: string
  subheading?: string
}
export default function CardHeader({ heading_string, subheading = '' }: CardHeaderProps) {
  return (
    <div className="mx-auto flex cursor-default flex-col items-center gap-6">
      <div className="mx-auto flex flex-col items-center gap-5">
        <img src="./src/assets/icons/favicon.svg" alt="Organisation logo" />
        <Heading className="!mb-5 text-2xl !font-bold !text-primary-500">F.A.O</Heading>
      </div>
      <div className="mx-auto flex flex-col items-center justify-center gap-2">
        <Heading className="!mb-0 text-xl font-semibold text-neutral-600">{heading_string}</Heading>
        <p className="text-center text-sm text-neutral-600">{subheading}</p>
      </div>
    </div>
  )
}
