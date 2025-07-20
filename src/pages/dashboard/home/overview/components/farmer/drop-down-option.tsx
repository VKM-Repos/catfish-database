import { Button } from 'src/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu'
import { useNavigate } from 'react-router-dom'
import { paths } from 'src/routes/paths'
import { useState } from 'react'

export function DropDownOption() {
  const [menu, setMenu] = useState(false)
  const navigate = useNavigate()

  const redirectToPond = () => {
    navigate(paths.dashboard.ponds.create.addPond)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'link'}>
            <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask
                id="path-1-outside-1_3421_26554"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="42"
                height="42"
                fill="black"
              >
                <rect fill="white" width="42" height="42" />
                <path d="M1 21C1 9.95431 9.95431 1 21 1C32.0457 1 41 9.95431 41 21C41 32.0457 32.0457 41 21 41C9.95431 41 1 32.0457 1 21Z" />
              </mask>
              <path
                d="M21 41V40C10.5066 40 2 31.4934 2 21H1H0C0 32.598 9.40202 42 21 42V41ZM41 21H40C40 31.4934 31.4934 40 21 40V41V42C32.598 42 42 32.598 42 21H41ZM21 1V2C31.4934 2 40 10.5066 40 21H41H42C42 9.40202 32.598 0 21 0V1ZM21 1V0C9.40202 0 0 9.40202 0 21H1H2C2 10.5066 10.5066 2 21 2V1Z"
                fill="#651391"
                mask="url(#path-1-outside-1_3421_26554)"
              />
              <path
                d="M27 21.75H15C14.59 21.75 14.25 21.41 14.25 21C14.25 20.59 14.59 20.25 15 20.25H27C27.41 20.25 27.75 20.59 27.75 21C27.75 21.41 27.41 21.75 27 21.75Z"
                fill="#651391"
              />
              <path
                d="M21 27.75C20.59 27.75 20.25 27.41 20.25 27V15C20.25 14.59 20.59 14.25 21 14.25C21.41 14.25 21.75 14.59 21.75 15V27C21.75 27.41 21.41 27.75 21 27.75Z"
                fill="#651391"
              />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => navigate(paths.dashboard.ponds.create.addPond)}>Add Pond</DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate(paths.dashboard.ponds.create.addFishToPond)}>
            Add fish
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate(paths.dashboard.feeds.create.root)}>
            Add feed stock
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
