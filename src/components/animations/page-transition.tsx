import { motion } from 'framer-motion'
import { fadeIn, slideUp } from './'

interface PageTransitionProps {
  children: React.ReactNode
  transitionType?: 'fade' | 'slide'
}

const PageTransition = ({ children, transitionType = 'fade' }: PageTransitionProps) => {
  let transitionVariants

  if (transitionType === 'fade') {
    transitionVariants = fadeIn
  } else if (transitionType === 'slide') {
    transitionVariants = slideUp
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={transitionVariants}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  )
}

export default PageTransition
