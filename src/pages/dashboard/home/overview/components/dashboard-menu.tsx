import React from 'react'
import { Button } from 'src/components/ui/button'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { Heading } from 'src/components/ui/heading'
import { DropDownOption } from './drop-down-option'
import { useAuthStore } from 'src/store/auth.store'
import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes/paths'

export default function DashboardMenu() {
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()

  const title = user?.role === 'FARMER' ? 'Farm ' : 'Cluster'

  return (
    <nav className="sticky left-0 top-[68px] z-50 flex h-fit w-full flex-col items-center justify-between bg-white px-10 py-4">
      {/* <FlexBox className="w-full">
        <div className="flex w-full place-content-start items-center ">
          <Button
            size="lg"
            variant="outline"
            className=" flex items-center justify-between gap-4 rounded-sm border border-neutral-200 text-neutral-500"
          >
            <SolarIconSet.Home color="currentColor" size={20} iconStyle="Outline" />
            <Text size="sm" weight="light">
              All Clusters
            </Text>
            <SolarIconSet.AltArrowDown color="currentColor" size={20} iconStyle="Bold" />
          </Button>
        </div>
        <div className="flex w-full place-content-end items-center gap-4">
          <Text size="sm" weight="light">
            All Time
          </Text>
          <Button
            variant="outline"
            className=" flex items-center justify-between gap-4 rounded-sm border border-neutral-200 text-neutral-500"
          >
            <Text size="sm" weight="light">
              May 21 - 27, 2024
            </Text>
            <SolarIconSet.AltArrowDown color="currentColor" size={20} iconStyle="Outline" />
          </Button>
        </div>
      </FlexBox> */}
      <FlexBox justify="between" align="center" className="sticky mb-[2rem] mt-4 w-full py-[.625rem]">
        <FlexBox direction="col" gap="gap-1">
          <Heading className="!text-[1.875rem] font-semibold">{title} Overview</Heading>
          <Text className="text-sm text-neutral-700">
            View and manage your {title.toLowerCase()} performance metrics
          </Text>
        </FlexBox>
        <div className="flex items-center gap-2">
          {user?.role === 'FARMER' ? (
            <DropDownOption />
          ) : (
            <Button
              onClick={() => navigate(paths.dashboard.ponds.create.addPond)}
              variant={'outline'}
              className="flex items-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15 10.625H5C4.65833 10.625 4.375 10.3417 4.375 10C4.375 9.65833 4.65833 9.375 5 9.375H15C15.3417 9.375 15.625 9.65833 15.625 10C15.625 10.3417 15.3417 10.625 15 10.625Z"
                  fill="#651391"
                />
                <path
                  d="M10 15.625C9.65833 15.625 9.375 15.3417 9.375 15V5C9.375 4.65833 9.65833 4.375 10 4.375C10.3417 4.375 10.625 4.65833 10.625 5V15C10.625 15.3417 10.3417 15.625 10 15.625Z"
                  fill="#651391"
                />
              </svg>
              <Text className="text-[14px] font-semibold">Add Pond</Text>
            </Button>
          )}
          <Button onClick={() => navigate(paths.dashboard.home.getStarted)}>Submit Report</Button>
        </div>
      </FlexBox>
    </nav>
  )
}
