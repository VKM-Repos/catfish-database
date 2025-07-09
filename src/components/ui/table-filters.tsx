import React from 'react'
import { Button } from './button'
import { Text } from './text'
import * as SolarIconSet from 'solar-icon-set'
import { FlexBox } from './flexbox'

// Popover UI for filter selection
function SelectPopover<T extends string>({
  label,
  placeholder,
  options,
  value,
  onChange,
  loading,
}: {
  label: string
  placeholder: string
  options: T[]
  value?: T
  onChange: (newVal: T | undefined) => void
  loading?: boolean
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-col">
      <Text size="base">{placeholder}</Text>
      <Button
        variant="neutral"
        size="sm"
        className="flex min-w-[220px] justify-between gap-x-2 !border border-neutral-200 bg-white text-sm capitalize"
        onClick={() => setOpen((o) => !o)}
        disabled={loading}
      >
        {value || placeholder} <SolarIconSet.AltArrowDown size={14} />
      </Button>
      {open && (
        <div className="absolute z-10 mt-2 flex max-h-64 w-52 flex-col gap-1 overflow-y-scroll rounded bg-white p-2 text-sm shadow-lg">
          <Button
            variant="ghost"
            size="sm"
            className="justify-start text-sm hover:bg-primary-100"
            onClick={() => {
              onChange(undefined)
              setOpen(false)
            }}
          >
            All {label}
          </Button>
          {options.map((opt) => (
            <Button
              key={opt}
              variant={opt === value ? 'neutral' : 'ghost'}
              size="sm"
              className="justify-start text-sm capitalize hover:bg-primary-100"
              onClick={() => {
                onChange(opt)
                setOpen(false)
              }}
            >
              {opt}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

function FilterPill({ label, value, onRemove }: { label: string; value: string; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-primary-300 bg-primary-100 px-3 py-0.5 text-sm">
      <Text size="xs" className="font-medium text-primary-400">
        {label}: {value}
      </Text>
      <Button
        variant="ghost"
        size="sm"
        className="h-4 w-4 p-0 text-primary-500 hover:text-primary-700"
        onClick={onRemove}
      >
        <SolarIconSet.CloseCircle size={12} />
      </Button>
    </div>
  )
}

export type TableFiltersProps = {
  searchTerm: string
  onSearchChange: (val: string) => void
  showFilters: boolean
  onToggleFilters: () => void
  filters: { [key: string]: string | undefined }
  tempFilters: { [key: string]: string | undefined }
  onFilterChange: (filterType: string, value: string | undefined) => void
  onApplyFilters: () => void
  onClearFilters: () => void
  onRemoveSingleFilter: (filterType: string) => void
  filterOptions: { [key: string]: string[] }
  filterLoading?: { [key: string]: boolean }
  filterLabels?: { [key: string]: string }
  hasActiveFilters: boolean
}

export function TableFilters({
  searchTerm,
  onSearchChange,
  showFilters,
  onToggleFilters,
  filters,
  tempFilters,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
  onRemoveSingleFilter,
  filterOptions,
  filterLoading = {},
  filterLabels = {},
  hasActiveFilters,
}: TableFiltersProps) {
  return (
    <FlexBox
      direction="col"
      gap="gap-2"
      className="mb-4 min-h-[5rem] w-full cursor-default rounded-md bg-neutral-50 shadow-sm"
    >
      {/* Search and Filter Toggle Row */}
      <div className="flex w-full flex-1 items-center justify-between p-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-3 rounded-md border border-neutral-200 bg-white px-3 py-2">
            <SolarIconSet.MinimalisticMagnifer />
            <input
              className="w-[360px] border-none focus:outline-none focus-visible:border-none focus-visible:ring-primary-500"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        <Button variant="ghost" className="flex items-center gap-2 p-0 text-primary-500" onClick={onToggleFilters}>
          <SolarIconSet.Filter size={20} />
          <Text>{showFilters ? 'hide filters' : 'show filters'}</Text>
        </Button>
      </div>
      {/* Filter Controls */}
      {showFilters && (
        <>
          <div className="px-4 pb-4">
            <div className="flex items-end gap-4">
              {Object.keys(filterOptions).map((filterKey) => (
                <SelectPopover
                  key={filterKey}
                  label={filterLabels[filterKey] || filterKey}
                  placeholder={filterLoading[filterKey] ? 'Loading…' : filterLabels[filterKey] || filterKey}
                  options={filterOptions[filterKey]}
                  value={tempFilters[filterKey]}
                  onChange={(v) => onFilterChange(filterKey, v)}
                  loading={filterLoading[filterKey]}
                />
              ))}
              <Button variant="primary" size="sm" className="flex items-center gap-2" onClick={onApplyFilters}>
                Apply
              </Button>
            </div>
          </div>
          {/* Active Filter Pills */}
          {hasActiveFilters && (
            <div className="px-4 pb-4">
              <div className="flex items-center gap-4">
                {Object.keys(filters).map(
                  (filterKey) =>
                    filters[filterKey] && (
                      <FilterPill
                        key={filterKey}
                        label={filterLabels[filterKey] || filterKey}
                        value={filters[filterKey]!}
                        onRemove={() => onRemoveSingleFilter(filterKey)}
                      />
                    ),
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-neutral-500 hover:text-neutral-700"
                  onClick={onClearFilters}
                >
                  <SolarIconSet.TrashBinMinimalistic size={16} />
                  Clear filters
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </FlexBox>
  )
}

export default TableFilters
