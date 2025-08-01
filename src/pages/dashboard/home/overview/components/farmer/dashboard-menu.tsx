import React, { useState } from 'react'
import { Button } from 'src/components/ui/button'
import { FlexBox } from 'src/components/ui/flexbox'
import { Text } from 'src/components/ui/text'
import { Heading } from 'src/components/ui/heading'
import { DropDownOption } from './drop-down-option'
import { useAuthStore } from 'src/store/auth.store'
import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes/paths'
import { SelectFarmerDialog } from './select-farmer-dialog'

export default function DashboardMenu() {
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()
  const [selectFarmerDIalogOpen, setOpenSelectFarmerDialog] = useState(false)
  const title = user?.role === 'FARMER' ? 'Farm ' : user?.role === 'CLUSTER_MANAGER' ? 'Cluster' : 'System'

  return (
    <nav className="sticky left-0 top-[68px] z-50 flex h-fit w-full flex-col items-center justify-between bg-white py-4 md:px-6">
      <FlexBox justify="between" align="center" className="sticky mb-[2rem] mt-4 w-full py-[.625rem]">
        <FlexBox direction="col" gap="gap-1">
          <Heading className="!text-base font-semibold lg:!text-[1.875rem]">{title} Overview</Heading>
          <Text className="hidden text-sm text-neutral-700 lg:inline">
            View and manage your {title.toLowerCase()} performance metrics
          </Text>
        </FlexBox>
        {user?.role !== 'SUPER_ADMIN' && (
          <div className="flex items-center gap-1 lg:gap-2">
            {user?.role === 'FARMER' ? (
              <DropDownOption />
            ) : (
              <Button
                onClick={() => setOpenSelectFarmerDialog(true)}
                variant={'outline'}
                // size={'xs'}
                className="flex items-center gap-2 rounded-full md:rounded-lg"
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
                <Text className="hidden text-xs font-medium md:inline md:text-sm">Add Pond</Text>
              </Button>
            )}
            <Button onClick={() => navigate(paths.dashboard.home.getStarted)}>Submit Report</Button>
          </div>
        )}
      </FlexBox>
      <SelectFarmerDialog
        open={selectFarmerDIalogOpen}
        title="Create pond for a farmer"
        onOpenChange={() => setOpenSelectFarmerDialog(false)}
      />
    </nav>
  )
}
