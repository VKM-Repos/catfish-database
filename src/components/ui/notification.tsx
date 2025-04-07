type NotificationProps = {
  type: 'success' | 'error' | 'info'
  message: string
}

export const Notification = ({ type, message }: NotificationProps) => {
  return (
    <div
      className={`rounded p-4 ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}
    >
      <p className="text-white">{message}</p>
    </div>
  )
}
