import React, { useRef, useState } from 'react'
import * as SolarIconSet from 'solar-icon-set'
import { CheckIcon, SpinnerIcon } from 'src/assets/icons/svg-icons'
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
        <>
          <div
            className="flex w-full flex-col items-center justify-center gap-5 rounded-md border border-neutral-100 px-5 py-5 font-light"
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="w-fit rounded-full border border-[#651391] px-3 py-2">
              <SolarIconSet.CloudUpload size={48} color="#651391" />
            </div>
            <p className="text-center text-xs">
              <span className="font-semibold text-primary-500">Click to upload</span> or drag and drop
              <br /> CSV (Max 800kb)
            </p>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="flex w-full min-w-[480px] items-center justify-between rounded-md border border-neutral-200 px-3 py-4">
            <div className="flex items-start gap-5 text-sm text-neutral-700">
              <SolarIconSet.File />{' '}
              <span className="-gap-2 flex flex-col">
                {fileName}{' '}
                <span>
                  {formatFileSize(fileSize)} - {`${uploadProgress}% uploaded`}
                </span>
              </span>
            </div>
            <div>{uploadProgress < 100 ? <SpinnerIcon /> : <CheckIcon />}</div>
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
