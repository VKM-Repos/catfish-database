import { Card } from 'src/components/ui/card'
import { Text } from 'src/components/ui/text'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import PageTransition from 'src/components/animation/page-transition'
import { Container } from 'src/components/ui/container'
import { FlexBox } from 'src/components/ui/flexbox'
import { PageHeader } from 'src/components/ui/page-header'
import { Menubar } from 'src/components/layouts/dashboard/menubar'

const productionData = [
  { month: 'Jan', production: 4000 },
  { month: 'Feb', production: 3000 },
  { month: 'Mar', production: 5000 },
  { month: 'Apr', production: 4500 },
  { month: 'May', production: 6000 },
  { month: 'Jun', production: 5500 },
]

const revenueData = [
  { month: 'Jan', revenue: 40000 },
  { month: 'Feb', revenue: 30000 },
  { month: 'Mar', revenue: 50000 },
  { month: 'Apr', revenue: 45000 },
  { month: 'May', revenue: 60000 },
  { month: 'Jun', revenue: 55000 },
]

export default function DashboardOverviewPage() {
  const title = 'Overview'

  return (
    <PageTransition>
      <Menubar />
      <Container className="min-h-[150dvh] !px-12">
        <PageHeader title={title} />
        <FlexBox direction="col" justify="center" align="start" gap="gap-8" className="w-full cursor-default">
          <div className="w-full space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="p-6">
                <div className="space-y-2">
                  <Text className="text-sm text-neutral-500">Total Farmers</Text>
                  <Text className="text-2xl font-bold">1,234</Text>
                </div>
              </Card>
              <Card className="p-6">
                <div className="space-y-2">
                  <Text className="text-sm text-neutral-500">Active Clusters</Text>
                  <Text className="text-2xl font-bold">56</Text>
                </div>
              </Card>
              <Card className="p-6">
                <div className="space-y-2">
                  <Text className="text-sm text-neutral-500">Total Production</Text>
                  <Text className="text-2xl font-bold">45,678 kg</Text>
                </div>
              </Card>
              <Card className="p-6">
                <div className="space-y-2">
                  <Text className="text-sm text-neutral-500">Revenue</Text>
                  <Text className="text-2xl font-bold">$123,456</Text>
                </div>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-6">
                <h2 className="mb-4 text-lg font-semibold">Production Trends</h2>
                <ChartContainer config={{ production: { label: 'Production (kg)' } }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={productionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="production" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </Card>
              <Card className="p-6">
                <h2 className="mb-4 text-lg font-semibold">Revenue Overview</h2>
                <ChartContainer config={{ revenue: { label: 'Revenue ($)' } }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="revenue" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </Card>
            </div>
          </div>
        </FlexBox>
      </Container>
    </PageTransition>
  )
}
