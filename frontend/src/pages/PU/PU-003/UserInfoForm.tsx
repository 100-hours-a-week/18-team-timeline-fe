import { useState, type DetailedHTMLProps, type HTMLAttributes } from 'react'
import { Button } from '../components/ui/Button'
import { Text } from '@/components/ui/Text'
import { StaticField } from '../components/ui/StaticField'
import { InputModal } from '@/components/ui/Modal'
import { useUserInfoLogic } from './useUserInfoLogic'
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
    isInputModalOpen,
    errors,
    isButtonActive,
    handleSubmit,
    handleDeleteAccount,
    handleConfirmDelete,
    handleCancelDelete
  } = useUserInfoLogic({ setToastMessage })

  const disabled = !(text.trim() === UserInfoMessage.WITHDRAW_VALID_INPUT)

  const formClass = 'w-full flex flex-col justify-center space-y-3'
  const buttonClass = 'flex flex-col pt-8 space-y-1'
  const navigationClass = 'w-full justify-center flex flex-row space-x-1 text-sm text-navText'
  const linkClass = 'hover:text-navTextHover'

  return (
    <>
      <form className={formClass} onSubmit={handleSubmit}>
        <StaticField label="이메일" content={email} />
        <NicknameInput
          isLabel={true}
          value={name}
          onChange={(e) => setName(e.target.value)}
          helperText={errors.name}
        />
        <div className={buttonClass}>
          <Button text={UserInfoMessage.BTN_NAME} isActive={isButtonActive} />
          <div className={navigationClass}>
            {/* <Link to={ROUTES.RESET_PASSWORD} className={linkClass}>
              <Text>{NavigationLink.RESET_PASSWORD}</Text>
            </Link>
            <Text>|</Text> */}
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
