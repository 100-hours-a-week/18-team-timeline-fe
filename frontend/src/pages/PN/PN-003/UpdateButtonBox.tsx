import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import { Button } from '../components/ui/Button'
import { useNavigate } from 'node_modules/react-router-dom/dist/index.mjs'
import { ROUTES } from '@/constants/url'
import { useUpdateNewsBtnName } from './hooks/useUpdateNewsBtnName'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
type UpdateButtonBoxProps = ReactDivProps & {
  isUpdating: boolean
  isUpdateAvailable: boolean
  isLoggedIn: boolean
  handleTimelineUpdate: () => void
}

export const UpdateButtonBox = ({
  isUpdating,
  isUpdateAvailable,
  isLoggedIn,
  handleTimelineUpdate,
}: UpdateButtonBoxProps) => {
  const navigate = useNavigate()
  const wrappedClass = 'flex flex-col justify-center items-center my-4'

  return (
    <div className={wrappedClass}>
      <Button
        text={useUpdateNewsBtnName(isUpdating)}
        isActive={!isUpdating && isUpdateAvailable}
        onClick={() => {
          !isLoggedIn ? navigate(ROUTES.LOGIN) : handleTimelineUpdate()
        }}
      />
    </div>
  )
}
