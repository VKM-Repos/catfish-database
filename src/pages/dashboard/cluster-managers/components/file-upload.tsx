import React, { useRef, useState } from 'react'
import * as SolarIconSet from 'solar-icon-set'
import { Button } from 'src/components/ui/button'

const FileUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState(0)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    handleFileUpload(files)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      handleFileUpload(files)
    }
  }

  const handleFileUpload = (files: FileList) => {
    const file = files[0]
    setFileName(file.name)
    setFileSize(file.size)
    // Simulate file upload
    setIsUploading(true)
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
      }
    }, 300) // Simulated delay for progress
  }

  const handleImport = () => {
    alert(`File "${fileName}" imported successfully!`)
    setIsUploading(false)
    setUploadProgress(0)
    setFileName('')
    setFileSize(0)
  }
  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)}KB`
    return `${(size / (1024 * 1024)).toFixed(2)}MB`
  }
  return (
    <div className="w-full">
      {!isUploading ? (
        <div
          className="flex w-full flex-col items-center justify-center gap-5 rounded-md border border-neutral-100 px-5 py-5 font-light"
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="w-fit rounded-full border border-[#651391] px-3 py-2">
            <SolarIconSet.CloudUpload size={48} color="#651391" />
          </div>
          <p className="text-center text-sm">
            <span className="font-semibold text-primary-500">Click to upload</span> or drag and drop
            <br /> CSV (Max 800kb)
          </p>
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="flex w-full items-center justify-between rounded-md border border-neutral-200 px-3 py-4">
            <div className="flex items-start gap-5 text-sm text-neutral-700">
              <SolarIconSet.File />{' '}
              <span className="-gap-2 flex flex-col">
                {fileName}{' '}
                <span>
                  {formatFileSize(fileSize)} - {`${uploadProgress}% uploaded`}
                </span>
              </span>
            </div>
            <div>
              {uploadProgress < 100 ? (
                <span>
                  <svg
                    aria-hidden="true"
                    className="h-6 w-6 animate-spin fill-primary-500 text-gray-200 dark:text-gray-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </span>
              ) : (
                <span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask
                      id="path-1-outside-1_284_8719"
                      maskUnits="userSpaceOnUse"
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      fill="black"
                    >
                      <rect fill="white" x="2" y="2" width="20" height="20" />
                      <path d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z" />
                    </mask>
                    <path
                      d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z"
                      fill="#651391"
                    />
                    <path
                      d="M6 6H18V2H6V6ZM18 6V18H22V6H18ZM18 18H6V22H18V18ZM6 18V6H2V18H6ZM6 18H2C2 20.2091 3.79086 22 6 22V18ZM18 18V22C20.2091 22 22 20.2091 22 18H18ZM18 6H22C22 3.79086 20.2091 2 18 2V6ZM6 2C3.79086 2 2 3.79086 2 6H6V2Z"
                      fill="#651391"
                      mask="url(#path-1-outside-1_284_8719)"
                    />
                    <path
                      d="M10.1066 16.7733C9.83991 16.7733 9.58658 16.6666 9.39991 16.48L5.62658 12.7066C5.23991 12.32 5.23991 11.68 5.62658 11.2933C6.01325 10.9066 6.65324 10.9066 7.03991 11.2933L10.1066 14.36L16.9599 7.50664C17.3466 7.11998 17.9866 7.11998 18.3732 7.50664C18.7599 7.89331 18.7599 8.53331 18.3732 8.91998L10.8132 16.48C10.6266 16.6666 10.3732 16.7733 10.1066 16.7733Z"
                      fill="white"
                    />
                  </svg>
                </span>
              )}
            </div>
          </div>
          {uploadProgress === 100 && (
            <div className="mt-5 flex w-full items-center justify-between">
              <Button
                className="border border-primary-500 font-light hover:bg-[#F0E8F4]"
                variant="outline"
                type="button"
                onClick={handleImport}
              >
                Back
              </Button>

              <Button
                className="bg-primary-500 font-light text-white hover:bg-[#F0E8F4] hover:text-black"
                type="submit"
                onClick={handleImport}
              >
                Import
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FileUpload
