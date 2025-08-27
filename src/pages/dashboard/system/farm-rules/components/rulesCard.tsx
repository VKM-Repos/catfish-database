import React from 'react'
import { Checkbox } from 'src/components/ui/checkbox'
import { Heading } from 'src/components/ui/heading'
import { Text } from 'src/components/ui/text'
import * as SolarIconSet from 'solar-icon-set'
import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes/paths'

const data = [
  {
    id: 'feed',
    title: 'Feed Types & Pellet Size',
    subtitle: 'Manage feed types and their available pellet sizes',
    params: [
      { id: 'f1', label: 'Starter Feed', values: ['1mn', '2mn', '3mn'] },
      { id: 'f2', label: 'Grower Feed', values: ['2mn', '4mn'] },
      { id: 'f3', label: 'Finisher Feed', values: ['3mn', '5mn'] },
      { id: 'f4', label: 'Custom Feed', values: ['2mn', '4mn', '6mn'] },
    ],
  },
  {
    id: 'water_quality',
    title: 'Water Quality Parameters',
    subtitle: 'Set which parameters are mandatory for monitoring',
    params: [
      { id: 'q1', label: 'Dissolved Oxygen', values: ['mg/L'] },
      { id: 'q2', label: 'Temperature', values: ['°C'] },
      { id: 'q3', label: 'Nitrite', values: ['mg/L'] },
      { id: 'q4', label: 'pH', values: ['1–14 scale'] },
    ],
  },
  {
    id: 'water_source',
    title: 'Water Sources',
    subtitle: 'Manage feed types and their available pellet sizes',
    params: [
      { id: 's1', label: 'Borehole', values: ['Deep grounded source'] },
      { id: 's2', label: 'River', values: ['Natural flowing water source'] },
      { id: 's3', label: 'Municipal Supply', values: ['Treated city water'] },
      { id: 's4', label: 'Rainwater', values: ['Collect precipitation'] },
    ],
  },
  {
    id: 'maintenance',
    title: 'Maintenace Types',
    subtitle: 'Define common maintenance actions and procedures',
    params: [
      { id: 'm1', label: 'Water Charge', values: ['Deep grounded source'] },
      { id: 'm2', label: 'Pump Repair', values: ['Natural flowing water source'] },
      { id: 'm3', label: 'Fulling', values: ['Treated city water'] },
      { id: 'm4', label: 'Net Cleaning', values: ['Collect precipitation'] },
    ],
  },
  {
    id: 'disease',
    title: 'Disease Types',
    subtitle: 'Manage fish diseases with descriptions',
    params: [
      { id: 'd1', label: 'Fin Rot', values: ['Bacterial infection affecting fins'] },
      { id: 'd2', label: 'Columnaris', values: ['Bacterial infection affecting gills and skin'] },
      { id: 'd3', label: 'Ich', values: ['Parasitic infection causing white spots'] },
      { id: 'd4', label: 'Fungal Infection', values: ['Various fungal infections'] },
    ],
  },
  {
    id: 'behavior',
    title: 'Fish Behaviors',
    subtitle: 'Behavior labels for observation reporting',
    params: [
      { id: 'b1', label: 'Slow Movement', values: ['Bacterial infection affecting fins'] },
      { id: 'b2', label: 'Gasping', values: ['Bacterial infection affecting gills and skin'] },
      { id: 'b3', label: 'Aggressive Feeding', values: ['Parasitic infection causing white spots'] },
      { id: 'b4', label: 'Lethargy', values: ['Various fungal infections'] },
    ],
  },
]

type RuleParam = {
  id: string
  label: string
  values: string[]
}

const RuleItem = ({ label, values, onEdit }: { label: string; values: string[]; onEdit: any }) => (
  <div className="group flex items-start gap-3 rounded-md p-3 transition hover:bg-hover">
    <Checkbox />
    <div className="flex w-full flex-col">
      <div className="flex items-start justify-between gap-2">
        <Text
          variant="label"
          size="base"
          weight="normal"
          color="text-neutral-400"
          className="max-w-[85%] truncate"
          // title={label}
        >
          {label}
        </Text>

        {/* Only show on hover */}
        <button onClick={() => onEdit()} className="opacity-0 transition-opacity group-hover:opacity-100">
          <SolarIconSet.PenNewSquare
            color="#4C0E6D"
            size={14}
            iconStyle="Outline"
            // onClick={() => console.log('edit')}
            className="cursor-pointer"
          />
        </button>
      </div>

      <div className="mt-1 flex flex-wrap gap-2">
        {values.map((val, i) => (
          <div
            key={i}
            className="max-w-full truncate rounded-md bg-[#E5E7FF] px-2 py-0.5 text-sm text-gray-800"
            title={val}
          >
            {val.length > 20 ? val.slice(0, 20) + '…' : val}
          </div>
        ))}
      </div>
    </div>
  </div>
)

const RulesCard = () => {
  const navigate = useNavigate()

  const openAddModal = (navOpt: string) => {
    navigate(paths.dashboard.system.farmRules.create(navOpt), {
      state: { modalOpt: navOpt },
    })
  }

  const openEditModal = (navOpt: string, data: RuleParam) => {
    // console.log(data?.id)
    navigate(paths.dashboard.system.farmRules.edit(data.id), {
      state: { modalOpt: navOpt, data },
    })
  }
  return (
    <div className="mb-8 grid grid-cols-2 gap-8">
      {data.map((config, sectionIndex) => (
        <div key={sectionIndex} className="rounded-md border-2 border-neutral-200 p-4">
          <Heading level={6}>{config.title}</Heading>
          <div className="mb-4 text-sm text-neutral-600">{config.subtitle}</div>

          <div className="grid grid-cols-2 gap-4">
            {config.params.map((type, i) => (
              <RuleItem key={i} label={type.label} values={type.values} onEdit={() => openEditModal(config.id, type)} />
            ))}
            <button
              onClick={() => openAddModal(config.id)}
              className="col-span-2 flex items-center justify-center gap-2 rounded-md border-2 border-dashed border-neutral-200 py-2 hover:bg-hover"
            >
              <SolarIconSet.AddSquare color="black" size={14} iconStyle="Outline" />
              <Heading level={6}>Add another</Heading>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RulesCard
