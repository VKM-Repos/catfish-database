export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

export const fadeOut = {
  visible: { opacity: 1 },
  hidden: { opacity: 0, transition: { duration: 0.5 } },
}
