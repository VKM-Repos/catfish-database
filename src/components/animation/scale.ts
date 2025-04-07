export const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
}

export const scaleOut = {
  visible: { scale: 1, opacity: 1 },
  hidden: { scale: 0.8, opacity: 0, transition: { duration: 0.5 } },
}
