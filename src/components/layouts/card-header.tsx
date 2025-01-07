import { Heading } from './heading'

export default function CardHeader() {
  return (
    <div className="mx-auto flex flex-col items-center gap-6">
      <div className="mx-auto flex flex-col items-center gap-5">
        <img src="./src/assets/icons/favicon.svg" alt="Organisation logo" />
        <Heading className="text-2xl font-bold text-primary-4">F.A.O</Heading>
      </div>
      <Heading className="text-xl font-medium text-black/80">Log in to access your account</Heading>
    </div>
  )
}
