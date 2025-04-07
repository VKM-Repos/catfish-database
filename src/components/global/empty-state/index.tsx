import React from 'react'

type Props = {
  image: string
  description: string
  action: React.ReactNode
}

const EmptyState = ({ image, description, action }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <img src={image} alt="Empty State" className="mb-4 h-32 w-32" />
      <p className="mb-4 text-center text-gray-600">{description}</p>
      <div>{action}</div>
    </div>
  )
}

export default EmptyState
