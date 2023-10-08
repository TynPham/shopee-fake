import { useRef } from 'react'
import config from 'src/constants/config'
import { toast } from 'react-toastify'

export interface InputFileProps {
  onChange?: (file?: File) => void
}

export default function InputFile({ onChange }: InputFileProps) {
  const uploadAvatarRef = useRef<HTMLInputElement>(null)

  const onChooseAvatar = () => {
    uploadAvatarRef.current?.click()
  }

  const handleUploadAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileLocal = event.target.files && event.target.files[0]
    if (fileLocal && (fileLocal?.size >= config.maxSizeAvatarUpload || !fileLocal.type.startsWith('image'))) {
      toast.error('The maximum file size is 1 MB. Format: .JPEG, .PNG', {
        position: 'top-center'
      })
    } else {
      onChange && onChange(fileLocal as File)
    }
  }
  return (
    <>
      <input
        className='hidden'
        type='file'
        accept='.jpg,.jpeg,.png'
        ref={uploadAvatarRef}
        onChange={handleUploadAvatar}
        onClick={(event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
          ;(event.target as any).value = null
        }}
      />
      <button
        type='button'
        className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'
        onClick={onChooseAvatar}
      >
        Chọn ảnh
      </button>
    </>
  )
}
