import { Alert, AlertDescription, AlertTitle } from 'src/components/ui/alert'
import { ClientErrorType } from 'src/types'

export default function FormValidationErrorAlert({ error }: { error: ClientErrorType }) {
  const errorArray: React.ReactNode =
    Array.isArray(error.errors) && error.errors.toString() !== '' ? (
      <ul className="space-y-1">
        {error.errors.map((e: string, i: number) => {
          const [field, ...rest] = e.split(':')

          return (
            <li key={i} className="my-1">
              <strong>{field.trim().charAt(0).toUpperCase() + field.trim().slice(1)}:</strong> {rest.join(':').trim()}
            </li>
          )
        })}
      </ul>
    ) : null

  return (
    <Alert variant="error" tone="filled">
      {errorArray ? (
        <>
          <AlertTitle>{error.message}</AlertTitle>
          <AlertDescription>{errorArray}</AlertDescription>
        </>
      ) : (
        <>
          <AlertTitle className="mt-1.5 text-xs">{error.message}</AlertTitle>
        </>
      )}
    </Alert>
  )
}
