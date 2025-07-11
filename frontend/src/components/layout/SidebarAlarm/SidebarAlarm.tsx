import { useRef, useEffect } from 'react'
import clsx from 'clsx'
import { Icon } from '../../ui/Icon'
import { AlarmCard } from './AlarmCard'
import { AlarmMessage, AlarmType } from '@/constants/AlarmMessage'
import { getRelativeDate } from '@/utils/getRelativeDate'
import { useSidebarAlarmLogic } from './useAlarmLogic'

export const SidebarAlarm = () => {
  const {
    isOpen,
    close,
    activeTab,
    setActiveTab,
    handleAlarmClick,
    filteredAlarms,
    isLoading,
  } = useSidebarAlarmLogic()

  const SidebarAlarmRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && SidebarAlarmRef.current && !SidebarAlarmRef.current.contains(event.target as Node)) {
        close()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, close])

  const wrapperClass = clsx(
    'absolute top-0 right-0 h-full w-full bg-alarmBarBg z-50',
    isOpen ? 'translate-x-0' : 'translate-x-full',
  )

  const iconClass = 'flex justify-end p-4 bg-alarmBarHeader'
  const tabClass = 'flex justify-around bg-alarmBarHeader'
  const tabItemClass = (tab: AlarmType.ALL | AlarmType.BOOKMARK) =>
    clsx(
      'w-1/2 text-lg text-center cursor-pointer pb-1',
      activeTab === tab ? 'font-bold border-b-2 border-b border-alarmTabSelect' : 'border-b text-alarmTabNotSelect',
    )

  const menuClass = 'relative flex flex-col overflow-y-auto h-full scrollbar-hide'
  const metaTextClass = 'text-center text-sm text-alarmBarMetaText mt-10'

  return (
    <div ref={SidebarAlarmRef} className={wrapperClass}>
      <div className={iconClass}>
        <Icon name="XMarkIcon" size={24} variant="solid" className="cursor-pointer text-menuItem" onClick={close} />
      </div>

      {/* 탭 */}
      <div className={tabClass}>
        <div className={tabItemClass(AlarmType.ALL)} onClick={() => setActiveTab(AlarmType.ALL)}>
          {AlarmType.ALL}
        </div>
        <div className={tabItemClass(AlarmType.BOOKMARK)} onClick={() => setActiveTab(AlarmType.BOOKMARK)}>
          {AlarmType.BOOKMARK}
        </div>
      </div>

      <div className={menuClass}>
        {isLoading ? (
          <div className={metaTextClass}>{AlarmMessage.LOADING}</div>
        ) : filteredAlarms.length === 0 ? (
          <div className={metaTextClass}>{AlarmMessage.NO_ALARM}</div>
        ) : (
          filteredAlarms.map((alarm) => (
            <AlarmCard
              key={alarm.id}
              title={alarm.title}
              content={alarm.content}
              isChecked={alarm.isChecked}
              createdAt={getRelativeDate(alarm.createdAt)}
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
