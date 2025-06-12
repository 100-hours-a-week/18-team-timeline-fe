import { useState, type DetailedHTMLProps, type HTMLAttributes } from 'react'
import clsx from 'clsx'
import { Input } from '@/components/form/Input'
import { Button } from '../components/ui/Button'
import { Link } from 'react-router-dom'
import { Text } from '@/components/ui/Text'
import { StaticField } from '../components/ui/StaticField'
import { InputModal } from '@/components/ui/Modal'
import { useUserInfoLogic } from './useUserInfoLogic'
import { useRequestStore } from '@/stores/requestStore'
import { ENDPOINTS } from '@/constants/url'
import { Toast } from '@/components/ui/Toast'
import { UserInfoMessage } from '@/constants/PU/userInfoMessage'
import { NavigationLink } from '@/constants/navigationLink'
import { NicknameInput } from '../components/form/NicknameInput'

type UserInfoFormProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {}

export const UserInfoForm = ({}: UserInfoFormProps) => {
  const [toastMessage, setToastMessage] = useState('')

  const {
    email,
    text,
    setText,
    name,
    setName,
    checkNameDuplicate,
    isInputModalOpen,
    setIsInputModalOpen,
    errors,
    isButtonActive,
    handleSubmit,
  } = useUserInfoLogic({ setToastMessage })

  const { deleteData } = useRequestStore()

  const disabled = !(text.trim() === UserInfoMessage.WITHDRAW_VALID_INPUT)

  const handleDeleteAccount = () => {
    setText('')
    setIsInputModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    setIsInputModalOpen(false)
    try {
      const res = await deleteData(ENDPOINTS.USER_WITHDRAW)
      if (res?.success) {
        localStorage.clear()
        setToastMessage(UserInfoMessage.WITHDRAW_SUCCESS)
      }
    } catch (err) {
      console.error('유저 탈퇴 실패', err)
    }
  }

  const handleCancelDelete = () => {
    setIsInputModalOpen(false)
  }

  const formClass = clsx('w-full flex flex-col justify-center', 'space-y-3')
  const buttonClass = clsx('flex flex-col pt-8 space-y-1')
  const navigationClass = clsx('w-full justify-center flex flex-row space-x-1', 'text-sm text-navText')
  const linkClass = clsx('hover:text-navTextHover')

  return (
    <>
      <form className={formClass} onSubmit={handleSubmit}>
        <StaticField label="이메일" content={email} />
        <NicknameInput
          isLabel={true}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={checkNameDuplicate}
          helperText={errors.name}
        />
        <div className={buttonClass}>
          <Button text={UserInfoMessage.BTN_NAME} isActive={isButtonActive} />
          <div className={navigationClass}>
            <Link to={''} className={linkClass}>
              <Text>{NavigationLink.RESET_PASSWORD}</Text>
            </Link>
            <Text>|</Text>
            <button type="button" className={linkClass} onClick={handleDeleteAccount}>
              <Text>{NavigationLink.WITHDRAW}</Text>
            </button>
          </div>
        </div>
      </form>

      <InputModal
        isOpen={isInputModalOpen}
        title={UserInfoMessage.MODAL_TITLE}
        content={UserInfoMessage.MODAL_CONTENT}
        text={text}
        onTextChange={(e) => setText(e.target.value)}
        disabled={disabled}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {toastMessage && <Toast message={toastMessage} />}
    </>
  )
}
