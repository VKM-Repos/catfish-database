import React, { useState } from 'react'
import { Card } from 'src/components/ui/card'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import * as SolarIconSet from 'solar-icon-set'
import { createGetQueryHook } from 'src/api/hooks/useGet'
import z from 'zod'
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover'
import { Button } from 'src/components/ui/button'
import { ChartHeader } from 'src/components/global/chart-header'

type Interval = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'ALL'
type DateRange = { from: Date; to: Date }

function SelectPopover<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: T[]
  value: T
  onChange: (newVal: T) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="neutral" size="sm" className="flex gap-x-2 !border border-neutral-200 bg-white capitalize">
          {label} <SolarIconSet.AltArrowDown size={14} />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="flex max-h-64 w-40 flex-col gap-1 overflow-y-scroll p-2">
        {options.map((opt) => (
          <Button
            key={opt}
            variant={opt === value ? 'neutral' : 'ghost'}
            size="sm"
            className="justify-start capitalize"
            onClick={() => {
              onChange(opt)
              setOpen(false)
            }}
          >
            {opt.replaceAll('_', ' ').toLowerCase()}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
function IntervalFilter({ value, onChange }: { value: Interval; onChange: (v: Interval) => void }) {
  const options: Interval[] = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'ALL']
  return <SelectPopover<Interval> label={value.toLowerCase()} options={options} value={value} onChange={onChange} />
}

interface KeyHealthMetricsProps {
  dateRange?: DateRange
}

export default function KeyHealthMetrics({ dateRange }: KeyHealthMetricsProps) {
  const [interval, setInterval] = useState<Interval>('MONTHLY')

  const useGetFcr = createGetQueryHook({
    endpoint: '/dashboards/cluster/fcr/overall',
    responseSchema: z.any(),
    queryKey: ['average-fcr-cluster-manage'],
  })
  const { data: averageFcr } = useGetFcr({
    query: {
      interval: 'ALL',
      startDate: dateRange?.from?.toISOString().split('T')[0],
      endDate: dateRange?.to?.toISOString().split('T')[0],
    },
  })

  const getAverageMortalityRate = createGetQueryHook({
    endpoint: '/dashboards/cluster/mortality-rate/overall?interval=ALL',
    responseSchema: z.any(),
    queryKey: ['mortality-rate-cluster-manage-key-metrix'],
  })
  const { data: averageMortalityRate } = getAverageMortalityRate()

  const useGetSubmission = createGetQueryHook({
    endpoint: '/dashboards/cluster/submission-stats/overall?interval=ALL',
    responseSchema: z.any(),
    queryKey: ['submission-count-cluster-manage-key-metrics'],
  })
  const { data: submissionRate } = useGetSubmission()

  return (
    <Card className="h-fit w-full border border-neutral-200 px-[20px] py-[10px]">
      <div className="flex">
        <ChartHeader
          title={`Key Health Metrics`}
          // action={<IntervalFilter value={interval} onChange={setInterval} />}
        />
      </div>
      <FlexBox className="mt-[20px] w-full" direction="col">
        <FlexBox
          className="w-full rounded-[8px] bg-neutral-100 p-[10px]"
          direction="row"
          align="center"
          justify="between"
        >
          <FlexBox gap="gap-[4px]" direction="col" justify="between">
            <Text className="text-[14px] font-medium">Average FCR</Text>
            <Text className="text-[12px] font-normal">Target: {'<2.0'}</Text>
          </FlexBox>
          <FlexBox direction="row" align="center">
            <Text className="text-[16px] font-semibold">{averageFcr ? averageFcr[0]?.fcrValue : '-'}</Text>
            <div
              style={{
                backgroundColor: '#E7F6E5',
                color: '#0DA500',
              }}
              className="flex items-center justify-center rounded-[.625rem] px-1 py-1"
            >
              -{/* <SolarIconSet.ArrowToTopLeft size={16} iconStyle="Broken" color="currentColor" /> */}
              {/* <SolarIconSet.ArrowToDownLeft size={16} iconStyle="Broken" color="currentColor" /> */}
            </div>
          </FlexBox>
        </FlexBox>

        <FlexBox
          className="w-full rounded-[8px] bg-neutral-100 p-[10px]"
          direction="row"
          align="center"
          justify="between"
        >
          <FlexBox gap="gap-[4px]" direction="col" justify="between">
            <Text className="text-[14px] font-medium">Mortality Rate</Text>
            <Text className="text-[12px] font-normal">Target: {'<3.2%'}</Text>
          </FlexBox>
          <FlexBox direction="row" align="center">
            <Text className="text-[16px] font-semibold">
              {averageMortalityRate ? averageMortalityRate[0]?.mortalityRate : '-'}
            </Text>
            <div
              style={{
                backgroundColor: '#E7F6E5',
                color: '#0DA500',
              }}
              className="flex items-center justify-center rounded-[.625rem] px-1 py-1"
            >
              -{/* <SolarIconSet.ArrowToTopLeft size={16} iconStyle="Broken" color="currentColor" /> */}
              {/* <SolarIconSet.ArrowToDownLeft size={16} iconStyle="Broken" color="currentColor" /> */}
            </div>
          </FlexBox>
        </FlexBox>
        <FlexBox
          className="w-full rounded-[8px] bg-neutral-100 p-[10px]"
          direction="row"
          align="center"
          justify="between"
        >
          <FlexBox gap="gap-[4px]" direction="col" justify="between">
            <Text className="text-[14px] font-medium">Data Submission</Text>
            <Text className="text-[12px] font-normal">Target: {'>90%'}</Text>
          </FlexBox>
          <FlexBox direction="row" align="center">
            <Text className="text-[16px] font-semibold">
              {submissionRate ? submissionRate[0]?.submissionPercentage : '-'}
            </Text>
            <div
              style={{
                backgroundColor: '#E7F6E5',
                color: '#0DA500',
              }}
              className="flex items-center justify-center rounded-[.625rem] px-1 py-1"
            >
              -{/* <SolarIconSet.ArrowToTopLeft size={16} iconStyle="Broken" color="currentColor" /> */}
              {/* <SolarIconSet.ArrowToDownLeft size={16} iconStyle="Broken" color="currentColor" /> */}
            </div>
          </FlexBox>
        </FlexBox>
      </FlexBox>
    </Card>
  )
}
