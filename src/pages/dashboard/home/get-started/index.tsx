import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from 'src/store/auth.store'
import { paths } from 'src/routes/paths'
import { Card, CardContent, CardFooter, CardHeader } from 'src/components/ui/card'
import { Button } from 'src/components/ui/button'
import { Text } from 'src/components/ui/text'
import * as SolarIconSet from 'solar-icon-set'
import { LoadingScreen } from 'src/components/global/loading-screen'
import { Heading } from 'src/components/ui/heading'
import { z } from 'zod'
import { createGetQueryHook } from 'src/api/hooks/useGet'

const checkFarmerHasPond = async (farmerId: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return Math.random() > 0.5
}

interface ActionCardProps {
  title: string
  description: string
  icon: React.ReactNode
  buttonText: string
  buttonAction: () => void
  isFirstCard?: boolean
}

export const useGetPond = createGetQueryHook({
  endpoint: '/ponds',
  responseSchema: z.any(),
  queryKey: ['ponds'],
  requiresAuth: true,
})

function ActionCard({ title, description, icon, buttonText, buttonAction, isFirstCard }: ActionCardProps) {
  return (
    <Card className="flex min-h-[326px] w-[347px] flex-col gap-0 border-neutral-200 py-5">
      <CardHeader className="flex items-center">
        <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-primary-100 text-primary-600">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col items-center justify-center">
        <div className="flex w-4/5 flex-col items-center justify-center gap-2 text-center ">
          <Text weight="semibold" size="base" color="text-neutral-500">
            {title}
          </Text>
          <Text weight="light" size="base" align="center">
            {description}
          </Text>
        </div>
      </CardContent>
      <CardFooter className="flex-none">
        <Button className="mx-auto w-fit" onClick={buttonAction} variant={isFirstCard ? 'primary' : 'outline'}>
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}

// Component for unregistered pond state
function UnregisteredPondCards({ navigate }: { navigate: (path: string) => void }) {
  return (
    <>
      <ActionCard
        title="Register a pond"
        description="Add details of your ponds to start tracking your farm activities."
        icon={<SolarIconSet.Flag color="currentColor" size={24} iconStyle="Outline" className="text-primary-500" />}
        buttonText="Register a Pond"
        buttonAction={() => navigate('/dashboard/ponds/create')}
        isFirstCard={true}
      />

      <ActionCard
        title="Register a fish batch"
        description="Log the fish batches currently in your ponds for accurate reporting."
        icon={
          <SolarIconSet.Waterdrop color="currentColor" size={24} iconStyle="Outline" className="text-primary-500" />
        }
        buttonText="Register Batch"
        buttonAction={() => navigate('/dashboard/batches/register')}
      />

      <ActionCard
        title="Need Help?"
        description="Find answers to common questions or get in touch with support."
        icon={
          <SolarIconSet.Lightbulb color="currentColor" size={24} iconStyle="Outline" className="text-primary-500" />
        }
        buttonText="Visit help center"
        buttonAction={() => navigate(paths.dashboard.helpCenter)}
      />
    </>
  )
}

// Component for registered pond state
function RegisteredPondCards({ navigate }: { navigate: (path: string) => void }) {
  return (
    <>
      <ActionCard
        title="Submit Production Report"
        description="Submit your production reports to track your catfish farming performance over time."
        icon={
          <SolarIconSet.ClipboardText color="currentColor" size={24} iconStyle="Outline" className="text-primary-500" />
        }
        buttonText="Submit Report"
        buttonAction={() => navigate('/dashboard/reports/production')}
        isFirstCard={true}
      />

      <ActionCard
        title="Submit Health Report"
        description="Submit health reports to track the health status of your catfish and get recommendations."
        icon={
          <SolarIconSet.PaperMedicine color="currentColor" size={24} iconStyle="Outline" className="text-primary-500" />
        }
        buttonText="Submit Report"
        buttonAction={() => navigate('/dashboard/reports/health')}
      />

      <ActionCard
        title="Submit Financial Report"
        description="Submit financial reports to track your expenses, revenue, and profitability."
        icon={<SolarIconSet.Chart color="currentColor" size={24} iconStyle="Outline" className="text-primary-500" />}
        buttonText="Submit Report"
        buttonAction={() => navigate('/dashboard/reports/financial')}
      />
    </>
  )
}

export default function GetStarted() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [hasPond, setHasPond] = useState(false)

  useEffect(() => {
    const checkPondStatus = async () => {
      if (user?.id) {
        const hasRegisteredPond = await checkFarmerHasPond(user.id)
        setHasPond(hasRegisteredPond)
      }
      setLoading(false)
    }

    checkPondStatus()
  }, [user])

  if (loading) {
    return <LoadingScreen />
  }

  const pageTitle = hasPond ? 'Welcome back to the Catfish Database 🐟' : 'Welcome to the Catfish Database 👋'

  const pageDescription = hasPond ? 'What report do you want to submit today?' : 'Get Started with Your Farm Management'

  return (
    <div className="container mx-auto flex max-w-7xl flex-col gap-6 px-3 py-8">
      <div className="mt-[3rem] space-y-0 text-center">
        <Heading level={5} className="mb-2" weight="bold">
          {pageTitle}
        </Heading>
        <Text weight="light" size="base" align="center">
          {pageDescription}
        </Text>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-5">
        {!hasPond ? <UnregisteredPondCards navigate={navigate} /> : <RegisteredPondCards navigate={navigate} />}
      </div>

      <div className="mx-auto mt-12 w-fit border-b border-primary-400 p-2 text-center">
        <Button
          variant="ghost"
          onClick={() => navigate(paths.dashboard.root)}
          className="mx-auto w-fit space-x-2 p-0 text-primary-600 hover:text-primary-400"
        >
          <span>Proceed to your Dashboard</span>
          <SolarIconSet.Forward color="currentColor" size={20} iconStyle="Outline" className="text-primary-500" />
        </Button>
      </div>
    </div>
  )
}
