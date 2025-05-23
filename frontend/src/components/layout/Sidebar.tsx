import { useEffect, useRef } from 'react';
import { useSidebarStore } from '@/stores/sidebarStore';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { INQUIRY_URL, ROUTES } from '@/constants/url';
import { Icon } from '../ui/Icon';
import { Text } from '../ui/Text';
import { LogoutButton } from '../ui/Button';
import { useAuthStore } from '@/stores/authStore';

export const Sidebar = () => {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const close = useSidebarStore((state) => state.close);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, close]);

  const className = clsx(
    'absolute top-0 left-0 h-full w-[240px] bg-menuBackground z-50 transition-transform duration-300',
    isOpen ? 'translate-x-0' : '-translate-x-full'
  );

  const iconClass = 'flex justify-end p-4';
  const lineClass = 'border-t border-ccLine';
  const menuClass = 'relative mx-4 flex flex-col';
  const titleClass = 'text-menuTitle text-2xl font-bold flex flex-col pl-1 pt-10 pb-4';
  const navClass = 'flex flex-col pl-1 pt-6 space-y-4';
  const navItemClass = 'text-menuItem hover:text-menuItemHover text-lg font-medium';
  const metaClass = 'absolute bottom-0 left-0 right-0 px-4';
  const metaItemClass = 'flex flex-col pl-1 space-y-1 text-xs font-semithin';

  return (
    <div ref={sidebarRef} className={className}>
      <div className={iconClass}>
        <Icon
          name="Bars3Icon"
          size={24}
          variant="solid"
          className="text-menuItem cursor-pointer"
          onClick={close}
        />
      </div>

      {isLoggedIn ? (
        <div className={menuClass}>
          <Text className={titleClass}>마이 페이지</Text>
          <div className={lineClass} />
          <nav className={navClass}>
            <Link to={ROUTES.USER_INFO} className={navItemClass} onClick={close}>
              회원정보 수정
            </Link>
            <LogoutButton
              className={clsx(navItemClass, 'block text-left')}
              onClick={close}
            />
          </nav>
        </div>
      ) : (
        <div className={menuClass}>
          <Text className={clsx(titleClass)}>로그인이<br />필요합니다.</Text>
          <div className={lineClass} />
          <nav className={navClass}>
            <Link to={ROUTES.LOGIN} className={navItemClass} onClick={close}>
              로그인
            </Link>
            <Link to={ROUTES.SIGNUP} className={navItemClass} onClick={close}>
              회원가입
            </Link>
          </nav>
        </div>
      )}

      <div className={metaClass}>
        <div className={lineClass} />
        <div className={clsx(metaItemClass, 'pt-4 pb-8')}>
          <Link
            to={INQUIRY_URL}
            className="text-menuItem"
            onClick={close}
          >
            문의하기
          </Link>
          <Text
            className="text-menuMetaText"
          >
            v0.01 25.05.12
          </Text>
        </div>
      </div>
    </div>
  );
};
