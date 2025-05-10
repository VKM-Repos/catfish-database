import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes/paths'
import { Card, CardContent, CardFooter, CardHeader } from 'src/components/ui/card'
import { Button } from 'src/components/ui/button'
import { Text } from 'src/components/ui/text'
import * as SolarIconSet from 'solar-icon-set'
import { LoadingScreen } from 'src/components/global/loading-screen'
import { Heading } from 'src/components/ui/heading'
import { z } from 'zod'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import { ReportModal } from './report-modal'

interface ActionCardProps {
  title: string
  description: string
  icon: React.ReactNode
  buttonText: string
  buttonAction: () => void
  isFirstCard?: boolean
}

function ActionCard({ title, description, icon, buttonText, buttonAction, isFirstCard }: ActionCardProps) {
  return (
    <Card className="flex min-h-[326px] w-[347px] flex-col gap-0 border-neutral-200 py-5">
      <CardHeader className="flex items-center">
        <div>{icon}</div>
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
        title="Add a new pond"
        description="Add details of your ponds to start tracking your farm activities."
        icon={
          <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-primary-100 text-primary-600">
            <SolarIconSet.Flag color="currentColor" size={24} iconStyle="Outline" className="text-primary-500" />
          </div>
        }
        buttonText="Register a Pond"
        buttonAction={() => navigate(paths.dashboard.ponds.create.addPond)}
        isFirstCard={true}
      />

      <ActionCard
        title="Need Help?"
        description="Find answers to common questions or get in touch with support."
        icon={
          <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-primary-100 text-primary-600">
            <SolarIconSet.Lightbulb color="currentColor" size={24} iconStyle="Outline" className="text-primary-500" />
          </div>
        }
        buttonText="Visit help center"
        buttonAction={() => navigate(paths.dashboard.helpCenter)}
      />
    </>
  )
}

// Component for registered pond state
function RegisteredPondCards({ navigate }: { navigate: (path: string) => void }) {
  const [farmReportOpen, setFarmReportOpen] = useState(false)
  const [samplingReportOpen, setSamplingReportOpen] = useState(false)
  const [harvestReportOpen, setHarvestReportOpen] = useState(false)
  return (
    <>
      <ActionCard
        title="Daily Farm Report"
        description="Keep track of your farm’s daily activities. Submit details like the amount of feed used and water quality readings."
        icon={<img src="/src/assets/images/farm_report.png" alt="Farm Report" />}
        buttonText="Submit Daily Farm Report"
        buttonAction={() => setFarmReportOpen(true)}
        isFirstCard={true}
      />

      <ReportModal
        title="Daily Farm Report"
        open={farmReportOpen}
        redirect="daily-farm-report"
        onOpenChange={setFarmReportOpen}
      />

      <ActionCard
        title="Sampling Report"
        description="Record important details from your sampling operation, including fish weight, mortality, total feed consumed, and current stock."
        icon={<img src="/src/assets/images/sampling_report.png" alt="Sampling Report" />}
        buttonText="Submit Sampling Report"
        buttonAction={() => setSamplingReportOpen(true)}
      />

      <ReportModal
        title="Sampling Report"
        open={samplingReportOpen}
        redirect="daily-sampling-report"
        onOpenChange={setSamplingReportOpen}
      />

      <ActionCard
        title="Harvest Report"
        description="Record your farm’s harvest and sales. Submit data on cost of feed, labor, maintenance, and sales revenue."
        icon={<img src="/src/assets/images/harvest_report.png" alt="Harvest Report" />}
        buttonText="Submit Harvest Report"
        buttonAction={() => setHarvestReportOpen(true)}
      />

      <ReportModal
        title="Harvest Report"
        open={harvestReportOpen}
        redirect="daily-harvest-report"
        onOpenChange={setHarvestReportOpen}
      />
    </>
  )
}

export default function GetStarted() {
  const navigate = useNavigate()
  const useGetPonds = createGetQueryHook({
    endpoint: '/ponds/farmers/me',
    responseSchema: z.any(),
    queryKey: ['my-ponds'],
  })

  const { data: ponds = [], isLoading: isLoadingPonds } = useGetPonds()

  if (isLoadingPonds) {
    return <LoadingScreen />
  }

  // const hasPond = ponds.content.length > 0
  const hasPond = true

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
          onClick={() => navigate(paths.dashboard.home.overview)}
          className="mx-auto w-fit space-x-2 p-0 text-primary-600 hover:text-primary-400"
        >
          <span>Proceed to your Dashboard</span>
          <SolarIconSet.Forward color="currentColor" size={20} iconStyle="Outline" className="text-primary-500" />
        </Button>
      </div>
    </div>
  )
}
