import { useSidebarStore } from '@/stores/sidebarStore';
import clsx from 'clsx';
import { Link } from 'node_modules/react-router-dom/dist';
import { ENDPOINTS, INQUIRY_URL, ROUTES } from '@/constants/url';
import { Icon } from '../ui/Icon';
import { Text } from '../ui/Text';
import { ApiButton } from '../ui/Button';

export const Sidebar = () => {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const close = useSidebarStore((state) => state.close);

  const className = clsx(
    'absolute top-0 left-0 h-full w-[240px] bg-menuColor z-50 transition-transform duration-300',
    isOpen ? 'translate-x-0' : '-translate-x-full'
  );

  const iconClass = 'flex justify-end p-4';
  const lineClass = 'border-t border-lineColor';

  const menuClass = 'relative mx-4 flex flex-col'
  const titleClass = 'text-2xl font-bold flex flex-col pl-1 pt-12 pb-4';
  const navClass = 'flex flex-col pl-1 pt-6 space-y-4';
  const navItemClass = 'text-menuItemColor hover:text-menuItemHoverColor text-base font-medium';
  
  const metaClass = 'absolute bottom-0 left-0 right-0 px-4'
  const metaItemClass = 'flex flex-col pl-1 space-y-1 text-xs font-semithin';

  return (
    <div className={className}>
      {/* 닫기 아이콘 */}
      <div className={iconClass}>
        <Icon
          name="Bars3Icon"
          size={24}
          variant="solid"
          className="text-menuItemColor cursor-pointer"
          onClick={close}
        />
      </div>

      {/* 내비게이션 메뉴 */}
      <div className={menuClass}>
        <Text className={titleClass}>마이페이지</Text>
        <div className={lineClass} />

        <nav className={navClass}>
          <Link to={ROUTES.USER_INFO} className={navItemClass} onClick={close}>
            회원정보 수정
          </Link>
          <Link to="" className={navItemClass} onClick={close}>
            북마크 목록
          </Link>
          <Link to="" className={navItemClass} onClick={close}>
            투표하기
          </Link>
          <ApiButton
            method='POST'
            url={ENDPOINTS.LOGOUT}
            redirectTo={ROUTES.MAIN}
            className={clsx(navItemClass, 'block text-left')}
            onClick={close}
          >
            로그아웃
          </ApiButton>
        </nav>
      </div>

      {/* 하단 영역 */}
      <div className={metaClass}>
        <div className={lineClass} />
        <div className={clsx(metaItemClass, 'pt-4 pb-8')}>
          <Link to={INQUIRY_URL} className='text-menuItemColor hover:text-menuItemHoverColor' onClick={close}>문의하기</Link>
          <Text className='text-metaTextColor'>v0.01 25.05.12</Text>
        </div>
      </div>
    </div>
  );
};
