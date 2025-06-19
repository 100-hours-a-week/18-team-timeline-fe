import { type DetailedHTMLProps, type HTMLAttributes } from 'react'
import { Button } from '../components/ui/Button'
import { useCreateNewsBtnName } from './useCreateNewsBtnName'
import { Link } from 'react-router-dom'
import { Text } from '@/components/ui/Text'
import { ROUTES } from '@/constants/url'

type CreateNewsBtnBoxProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  isButtonActive: boolean
  isLoading: boolean
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export const CreateNewsBtnBox = ({ isButtonActive, isLoading, handleSubmit }: CreateNewsBtnBoxProps) => {
  const buttonText = useCreateNewsBtnName(isLoading)

  const wrapperClass =
    'flex flex-col w-full items-center justify-center bg-createNewsBtnBoxBg border-t border-t-createNewsBtnBoxBorder gap-1 py-4'
  const navigationClass = 'w-full justify-center flex flex-row space-x-1 text-sm text-navText'
  const linkClass = 'hover:text-navTextHover'

  return (
    <div className={wrapperClass}>
      <Button text={buttonText} isActive={isButtonActive && !isLoading} onClick={handleSubmit} />
      {!isLoading && !isButtonActive && (
        <div className={navigationClass}>
          <Link to={ROUTES.LOGIN} className={linkClass}>
            <Text>로그인하러 가기</Text>
          </Link>
        </div>
      )}
    </div>
  )
}
