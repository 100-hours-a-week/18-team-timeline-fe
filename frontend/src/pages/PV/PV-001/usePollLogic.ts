import { useEffect, useState, type DetailedHTMLProps, type HTMLAttributes } from 'react'
import { useRequestStore } from '@/stores/useRequestStore'
import { ENDPOINTS } from '@/constants/url'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/url'
import { PollMessage } from '@/constants/PV/pollMessage'
import { getFormatDateTime } from '../utils/getFormatDateTime'

type PollLogicProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  setToastMessage: (msg: string) => void
}

export const usePollLogic = ({ setToastMessage }: PollLogicProps) => {
  const [title, setTitle] = useState('투표 제목')
  const [minChoices, setMinChoices] = useState<number>()
  const [maxChoices, setMaxChoices] = useState<number>()
  const [endAt, setEndAt] = useState('00월 00일 00:00')
  const [options, setOptions] = useState<{ title: string; imageUrl?: string }[]>([])
  const [selectOps, setSelectOps] = useState<number[]>([])
  const [isButtonActive, setIsButtonActive] = useState(false)
  const [isInputModalOpen, setIsInputModalOpen] = useState(false)

  const { getData, postData } = useRequestStore()
  const navigate = useNavigate()
  const userName = localStorage.getItem('userName')

  useEffect(() => {
    if (!userName) {
      navigate(ROUTES.LOGIN)
      return
    }

    const fetchPoll = async () => {
      try {
        const res = await getData(ENDPOINTS.POLL_FETCH(72))
        setTitle(res.data.title)
        setMinChoices(res.data.minChoices)
        setMaxChoices(res.data.maxChoices)
        setEndAt(getFormatDateTime(res.data.endAt))
        setOptions(res.data.options)
      } catch (e) {
        console.error('투표 정보 조회 실패', e)
      }
    }
    fetchPoll()
  }, [])

  useEffect(() => {
    if (minChoices !== undefined) {
      setIsButtonActive(selectOps.length >= minChoices)
    }
  }, [selectOps, minChoices])  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isButtonActive) return
    try {
      const res = await postData(ENDPOINTS.POLL_SUBMIT(72), { optionIds: selectOps })
      if (res?.success) {
        setToastMessage(PollMessage.TOAST_SUCCESS)
        window.location.reload()
      }
    } catch (error) {
      console.error('투표 제출 실패', error)
      setToastMessage(PollMessage.TOAST_FAIL)
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
    isButtonActive,
    handleSubmit,
    isInputModalOpen,
    setIsInputModalOpen,
  }
}
