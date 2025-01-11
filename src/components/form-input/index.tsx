import { forwardRef, InputHTMLAttributes, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import * as SolarIconSet from 'solar-icon-set'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
  className?: string
  disabled?: boolean
  readOnly?: boolean
}

const FormInput = forwardRef<HTMLInputElement, InputProps>(
  ({ name, label, className, disabled, readOnly, ...rest }, ref) => {
    const [isPasswordVisible, setPasswordVisibility] = useState(false)
    const {
      control,
      formState: { errors },
    } = useFormContext()
    const error = errors[name]

    const { type, required } = rest

    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => {
          const { value, onChange } = field
          return (
            <FormItem className="flex flex-col gap-0">
              <FormLabel className="font-md mt-2 flex gap-0">
                {label}
                {required && (
                  <span className="text-error text-red-500" title="required">
                    &ensp;*
                  </span>
                )}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    ref={ref}
                    type={type === 'password' ? (isPasswordVisible ? 'text' : 'password') : type}
                    placeholder={rest.placeholder}
                    onChange={onChange}
                    value={value ?? ''}
                    className={`rounded-[4px] px-3 py-2 font-medium ${
                      error ? 'border-error-500 bg-error-100 ring-error-500' : ''
                    }  placeholder:text-black/30 ${className}`}
                    disabled={disabled}
                    readOnly={readOnly}
                    autoComplete="on"
                  />
                  {rest.type === 'email' && (
                    <div
                      className={`absolute right-4 top-1/2 -translate-y-1/2 transform cursor-pointer${
                        error ? 'border-red-500' : 'border-neutral-200'
                      }`}
                    >
                      <div className={`${error ? 'text-error-500' : 'text-[#444955]'}`}>
                        <SolarIconSet.Letter size={20} color="currentColor" iconStyle="Outline" />
                      </div>
                    </div>
                  )}
                  {rest.type === 'password' && (
                    <div
                      className={`absolute right-4 top-1/2 -translate-y-1/2 transform cursor-pointer${
                        error ? ' border-red-500 text-error-500' : 'border-neutral-200 text-neutral-200'
                      }`}
                      onClick={() => setPasswordVisibility(!isPasswordVisible)}
                    >
                      {isPasswordVisible ? (
                        <div className={`${error ? 'text-error-500' : 'text-[#444955]'}`}>
                          <SolarIconSet.EyeClosed size={20} color="currentColor" iconStyle="Outline" />
                        </div>
                      ) : (
                        <div className={`${error ? 'text-error-500' : 'text-[#444955]'}`}>
                          <SolarIconSet.Eye size={20} color="currentColor" iconStyle="Outline" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
    )
  },
)

FormInput.displayName = 'FormInput'
export default FormInput
