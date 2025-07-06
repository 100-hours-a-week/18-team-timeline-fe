import { useEffect, useState, type DetailedHTMLProps, type HTMLAttributes } from 'react'
import { useRequestStore } from '@/stores/useRequestStore'
import { ENDPOINTS } from '@/constants/url'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/url'
import { PollMessage } from '@/constants/PV/pollMessage'
import { getFormatDateTime } from '../utils/getFormatDateTime'
import { useAuthStore } from '@/stores/useAuthStore'

type PollLogicProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  setToastMessage: (msg: string) => void
}

export const usePollLogic = ({ setToastMessage }: PollLogicProps) => {
  const [title, setTitle] = useState('투표 제목')
  const [minChoices, setMinChoices] = useState<number>()
  const [maxChoices, setMaxChoices] = useState<number>()
  const [endAt, setEndAt] = useState('00월 00일 00:00')
  const [options, setOptions] = useState<{ id: number; title: string; imageUrl?: string }[]>([])
  const [hasVoted, setHasVoted] = useState(false)
  const [selectOps, setSelectOps] = useState<number[]>([])
  const [isButtonActive, setIsButtonActive] = useState(false)
  const [isInputModalOpen, setIsInputModalOpen] = useState(false)

  const { isLoggedIn } = useAuthStore()
  const { getData, postData } = useRequestStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(ROUTES.LOGIN)
      return
    }

    const fetchPoll = async () => {
      try {
        const res = await getData(ENDPOINTS.POLL_FETCH)
        setTitle(res.data.poll.title)
        setMinChoices(res.data.poll.minChoices)
        setMaxChoices(res.data.poll.maxChoices)
        setEndAt(getFormatDateTime(res.data.poll.endAt))
        setOptions(res.data.poll.options)
        setHasVoted(res.data.hasVoted)
        setSelectOps(res.data.votedOptions)
      } catch (e) {
        console.error('투표 정보 조회 실패', e)
        navigate(ROUTES.MAIN)
      }
    }
    fetchPoll()
  }, [])

  useEffect(() => {
    if (minChoices !== undefined) {
      setIsButtonActive(selectOps.length >= minChoices && !hasVoted)
    }
  }, [selectOps, minChoices, hasVoted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isButtonActive) return
    try {
      const res = await postData(ENDPOINTS.POLL_SUBMIT, { optionIds: selectOps })
      if (res?.success) {
        setToastMessage(PollMessage.TOAST_SUCCESS)
        setHasVoted(true)
        setIsButtonActive(false)
      }
    } catch (error: any) {
      console.error('투표 제출 실패', error)
      setToastMessage(error?.response?.data?.message ?? PollMessage.TOAST_FAIL)
    }
  }


  return {
    title,
    endAt,
    options,
    minChoices,
    maxChoices,
    selectOps,
    setSelectOps,
    hasVoted,
    isButtonActive,
    handleSubmit,
    isInputModalOpen,
    setIsInputModalOpen,
  }
}
