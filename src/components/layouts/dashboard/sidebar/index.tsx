import { Section } from 'src/components/ui/section'
import { Text } from 'src/components/ui/text'
import { useSideBar } from 'src/providers/sidebar.provider'
import { motion } from 'framer-motion'
import * as SolarIconSet from 'solar-icon-set'
import { useLocation, Link } from 'react-router-dom'
import { useState } from 'react'
import { container, item } from 'src/components/animation'
import { AnchorButton } from 'src/components/ui/anchor-button'

type SidebarProps = {
  onLinkClick?: () => void
}

export function Sidebar({ onLinkClick }: SidebarProps) {
  const { pathname } = useLocation()
  const { links } = useSideBar()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const handleDropdownToggle = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label)
  }

  return (
    <Section className="inset-y-0 w-full overflow-y-auto rounded-lg border border-neutral-200 bg-neutral-50 p-2 shadow-sm lg:h-[calc(100vh-100px)]">
      <motion.ul variants={container} initial="hidden" animate="visible" className="flex flex-col gap-y-2">
        {links.map(({ path, icon, label, subLinks }) => (
          <motion.li key={label} variants={item} className="flex flex-col">
            {subLinks ? (
              <>
                <AnchorButton
                  size={'lg'}
                  active={openDropdown === label}
                  onClick={() => handleDropdownToggle(label)}
                  className={`${
                    label === path ? 'text-inherit' : 'text-neutral-500'
                  } flex w-full cursor-pointer items-center justify-between space-x-3 hover:text-primary-600`}
                >
                  <span className="flex items-center justify-start gap-3">
                    <span className="mt-[6px]">{icon}</span>
                    <Text size="base">{label}</Text>
                  </span>
                  <span
                    className={`${
                      openDropdown === label ? 'rotate-180' : 'rotate-0'
                    } flex h-fit w-fit transform items-center transition duration-200 `}
                  >
                    <SolarIconSet.AltArrowDown color="currentColor" size={24} iconStyle="Outline" />
                  </span>
                </AnchorButton>

                {openDropdown === label && (
                  <motion.ul
                    variants={container}
                    initial="hidden"
                    animate="visible"
                    className="ml-[3.3rem] mt-3 flex flex-col gap-4"
                  >
                    {subLinks
                      .filter(({ path }) => path)
                      .map(({ path, label }) => (
                        <motion.li key={label} variants={item}>
                          <Link
                            to={typeof path === 'string' ? path : ''}
                            onClick={onLinkClick}
                            className={`${
                              pathname === path ? '!font-semibold text-primary-500' : 'text-neutral-500'
                            } flex items-center justify-start space-x-4 hover:text-primary-600`}
                          >
                            <Text size="base">{label}</Text>
                          </Link>
                        </motion.li>
                      ))}
                  </motion.ul>
                )}
              </>
            ) : (
              path && (
                <AnchorButton size={'lg'} active={pathname === path}>
                  <Link
                    to={typeof path === 'string' ? path : path.root}
                    onClick={onLinkClick}
                    className={`${
                      pathname === path ? ' text-inherit' : 'text-neutral-500'
                    } flex w-full items-center justify-start space-x-3 whitespace-nowrap hover:text-primary-600`}
                  >
                    <span className="mt-[6px]">{icon}</span>
                    <Text size="base">{label}</Text>
                  </Link>
                </AnchorButton>
              )
            )}
          </motion.li>
        ))}
      </motion.ul>
    </Section>
  )
}
