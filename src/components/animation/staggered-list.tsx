import { motion } from 'framer-motion'
import { container, item } from '.'

interface StaggeredListProps {
  items: string[]
  className?: string
}

const StaggeredList = ({ items, className = '' }: StaggeredListProps) => {
  return (
    <motion.ul variants={container} initial="hidden" animate="visible" className={`space-y-4 ${className}`}>
      {items.map((text, index) => (
        <motion.li key={index} variants={item} className="rounded-lg bg-gray-100 p-4">
          {text}
        </motion.li>
      ))}
    </motion.ul>
  )
}

export default StaggeredList
