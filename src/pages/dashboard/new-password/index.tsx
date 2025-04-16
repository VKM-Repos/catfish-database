import { useState } from 'react'
import PageTransition from 'src/components/animation/page-transition'
import { Container } from 'src/components/ui/container'
import NewPasswordForm from './form/new-password-form'
import { Dialog, DialogClose, DialogContent, DialogHeader } from 'src/components/ui/dialog'
import { Heading } from 'src/components/ui/heading'
import { Text } from 'src/components/ui/text'
import { Button } from 'src/components/ui/button'
import { X } from 'lucide-react'
import ECLIPSE from 'src/assets/images/ellipse.png'
import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes'
import * as SolarIconSet from 'solar-icon-set'

export default function NewPasswordPage() {
  const navigate = useNavigate()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleNext = () => {
    setIsDialogOpen(true)
  }
  const handleRedirect = () => {
    setIsDialogOpen(false)
    navigate(paths.dashboard.home.root)
  }

  return (
    <PageTransition>
      <Container>
        <NewPasswordForm handleNext={handleNext} />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="overflow-hidden p-8">
            <picture>
              <img className="absolute left-0 top-0 w-[10rem]" src={ECLIPSE} alt="" />
            </picture>
            <DialogClose className="flex h-16 w-full items-center justify-end">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </DialogClose>
            <DialogHeader>
              <Heading weight="semibold" level={5}>
                Completed!
              </Heading>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center space-y-12">
              <Text weight="light" align="left" className="w-full">
                Password updated successfully!
              </Text>
              <Button
                className="my-4 flex w-full items-center justify-center gap-2 focus:outline-none"
                variant="primary"
                onClick={handleRedirect}
              >
                <Text color="text-inherit" variant="body">
                  Proceed to my account
                </Text>
                <SolarIconSet.ArrowRight color="currentColor" size={18} iconStyle="Outline" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </Container>
    </PageTransition>
  )
}
