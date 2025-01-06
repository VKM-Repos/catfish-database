export const modalVariant = {
  hidden: { y: '-100vh', opacity: 0 },
  visible: { y: '0', opacity: 1, transition: { type: 'spring', stiffness: 120 } },
  exit: { y: '-100vh', opacity: 0, transition: { duration: 0.3 } },
}

export const dropDownVariant = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
}

export const drawerVariant = {
  hidden: { x: '-100%' },
  visible: { x: 0, transition: { type: 'spring', stiffness: 120 } },
  exit: { x: '-100%', transition: { duration: 0.3 } },
}
