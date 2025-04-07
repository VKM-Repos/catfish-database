import React from 'react'

type SkeletonProps = {
  className?: string
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return <div className={`animate-pulse bg-neutral-100 ${className}`} />
}

export default Skeleton
