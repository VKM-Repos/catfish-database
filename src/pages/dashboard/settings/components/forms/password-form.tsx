import { Heading } from 'src/components/ui/heading'
import * as SolarIconSet from 'solar-icon-set'
import { Form, FormControl, FormField, FormItem, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Button } from 'src/components/ui/button'
import { useState } from 'react'
import { Label } from 'src/components/ui/label'
import FormValidationErrorAlert from '../form-alert-error'

export default function PasswordForm({ title, form, onSubmit, error, setOpen, loading }: any) {
  const { formState: isDirty } = form
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="w-full py-[4rem] pb-[6rem]">
      <div className="absolute inset-x-0 top-0 w-full border-b border-b-neutral-200 py-2">
        <Heading className="text-center" level={6}>
          {title}
        </Heading>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
          {error && <FormValidationErrorAlert error={error} />}
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex flex-col gap-2">
                    <Label>Old password</Label>
                    <Input
                      placeholder="Current Password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      autoCorrect="off"
                      spellCheck={false}
                      {...field}
                      icon={
                        <Button
                          variant="ghost"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          type="button"
                          className="h-full w-full p-0"
                        >
                          {showCurrentPassword ? <SolarIconSet.EyeClosed size={20} /> : <SolarIconSet.Eye size={20} />}
                        </Button>
                      }
                      iconPosition="right"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex flex-col gap-2">
                    <Label>New password</Label>
                    <Input
                      placeholder="New Password"
                      type={showNewPassword ? 'text' : 'password'}
                      {...field}
                      icon={
                        <Button
                          variant="ghost"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          type="button"
                          className="h-full w-full p-0"
                        >
                          {showNewPassword ? <SolarIconSet.EyeClosed size={20} /> : <SolarIconSet.Eye size={20} />}
                        </Button>
                      }
                      iconPosition="right"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex flex-col gap-2">
                    <Label>Confirm new password</Label>
                    <Input
                      placeholder="Confirm New Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...field}
                      icon={
                        <Button
                          variant="ghost"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          type="button"
                          className="h-full w-full p-0"
                        >
                          {showConfirmPassword ? <SolarIconSet.EyeClosed size={20} /> : <SolarIconSet.Eye size={20} />}
                        </Button>
                      }
                      iconPosition="right"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="absolute inset-x-0 bottom-0 mx-auto flex w-[98%] items-start justify-between rounded-md bg-neutral-50 p-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setOpen(false)
                form.reset()
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!isDirty}>
              Update Password
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
