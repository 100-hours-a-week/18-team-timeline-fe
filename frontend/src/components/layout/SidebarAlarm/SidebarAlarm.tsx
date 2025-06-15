import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { Icon } from '../../ui/Icon'
import { AlarmCard } from './AlarmCard'
import { useSidebarAlarmStore } from '@/stores/useSidebarAlarmStore'
import { useRequestStore } from '@/stores/useRequestStore'
import { getRelativeTime } from '@/utils/getRelativeTime'
import { ENDPOINTS } from '@/constants/url'

type Alarm = {
  id: number
  title: string
  content: string
  isChecked: boolean
  createdAt: string | null
  targetType: string
  targetId: number
}

type AlarmGroup = {
  type: 'all' | 'bookmark'
  alarms: Alarm[]
}

export const SidebarAlarm = () => {
  const isOpen = useSidebarAlarmStore((state) => state.isOpen)
  const close = useSidebarAlarmStore((state) => state.close)
  const SidebarAlarmRef = useRef<HTMLDivElement>(null)

  const [activeTab, setActiveTab] = useState<'전체' | '북마크'>('전체')
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
      setActiveTab('전체')
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && SidebarAlarmRef.current && !SidebarAlarmRef.current.contains(event.target as Node)) {
        close()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, close])

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

  const tabType = activeTab === '전체' ? 'all' : 'bookmark'
  const filteredAlarms = alarmsData.find((group) => group.type === tabType)?.alarms ?? []

  const wrapperClass = clsx(
    'absolute top-0 right-0 h-full w-[320px] bg-alarmBarBg z-50 transition-transform duration-300',
    isOpen ? 'translate-x-0' : 'translate-x-full',
  )

  const iconClass = 'flex justify-end p-4 bg-alarmBarHeader'
  const tabClass = 'flex justify-around bg-alarmBarHeader'
  const tabItemClass = (tab: '전체' | '북마크') =>
    clsx(
      'w-1/2 text-lg text-center cursor-pointer pb-1',
      activeTab === tab ? 'font-bold border-b-2 border-b border-alarmTabSelect' : 'border-b text-alarmTabNotSelect',
    )

  const menuClass = 'relative flex flex-col overflow-y-auto h-full'
  const metaTextClass = 'text-center text-sm text-alarmBarMetaText mt-10'

  return (
    <div ref={SidebarAlarmRef} className={wrapperClass}>
      <div className={iconClass}>
        <Icon name="XMarkIcon" size={24} variant="solid" className="text-menuItem cursor-pointer" onClick={close} />
      </div>

      {/* 탭 */}
      <div className={tabClass}>
        <div className={tabItemClass('전체')} onClick={() => setActiveTab('전체')}>
          전체
        </div>
        <div className={tabItemClass('북마크')} onClick={() => setActiveTab('북마크')}>
          북마크
        </div>
      </div>

      <div className={menuClass}>
        {isLoading ? (
          <div className={metaTextClass}>불러오는 중...</div>
        ) : filteredAlarms.length === 0 ? (
          <div className={metaTextClass}>알림이 없습니다.</div>
        ) : (
          filteredAlarms.map((alarm) => (
            <AlarmCard
              key={alarm.id}
              title={alarm.title}
              content={alarm.content}
              isChecked={alarm.isChecked}
              createdAt={getRelativeTime(alarm.createdAt)}
              targetType={alarm.targetType}
              targetId={alarm.targetId}
              onClick={() => handleAlarmClick(alarm)}
            />
          ))
        )}
      </div>
    </div>
  )
}
