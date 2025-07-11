import { useEffect, useState } from 'react'
import { useSidebarAlarmStore } from '@/stores/useSidebarAlarmStore'
import { useRequestStore } from '@/stores/useRequestStore'
import { ENDPOINTS } from '@/constants/url'
import { AlarmType } from '@/constants/AlarmMessage'

export type Alarm = {
  id: number
  title: string
  content: string
  isChecked: boolean
  createdAt: string | null
  targetType: string
  targetId: number
}

export type AlarmGroup = {
  type: 'all' | 'bookmark'
  alarms: Alarm[]
}

export const useSidebarAlarmLogic = () => {
  const isOpen = useSidebarAlarmStore((state) => state.isOpen)
  const close = useSidebarAlarmStore((state) => state.close)

  const [activeTab, setActiveTab] = useState<AlarmType.ALL | AlarmType.BOOKMARK>(AlarmType.ALL)
  const [alarmsData, setAlarmsData] = useState<AlarmGroup[]>([])

  const { getData, patchData, isLoading } = useRequestStore()

  useEffect(() => {
    const fetchAlarms = async () => {
      try {
        const res = await getData<{ success: boolean; message: string; data: AlarmGroup[] }>(ENDPOINTS.ALARM)
        if (res.success) {
          setAlarmsData(res.data)
        }
      } catch (error) {
        console.error('알림 가져오기 실패:', error)
      }
    }

    if (isOpen) fetchAlarms()
  }, [isOpen, getData])

  useEffect(() => {
    if (isOpen) {
      setActiveTab(AlarmType.ALL)
    }
  }, [isOpen])

  const handleAlarmClick = async (alarm: Alarm) => {
    if (!alarm.isChecked) {
      try {
        await patchData(ENDPOINTS.ALARM_CHECK(alarm.id))
        setAlarmsData((prev) =>
          prev.map((group) =>
            group.type === tabType
              ? {
                  ...group,
                  alarms: group.alarms.map((a) => (a.id === alarm.id ? { ...a, isChecked: true } : a)),
                }
              : group,
          ),
        )
      } catch (e) {
        console.error('알림 확인 실패:', e)
      }
    }
    close()
  }

  const tabType = activeTab === AlarmType.ALL ? 'all' : 'bookmark'
  const filteredAlarms = alarmsData.find((group) => group.type === tabType)?.alarms ?? []

  return {
    isOpen,
    close,
    activeTab,
    setActiveTab,
    alarmsData,
    setAlarmsData,
    handleAlarmClick,
    filteredAlarms,
    isLoading,
  }
}
