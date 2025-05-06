import { useNavigate } from 'react-router-dom';
import { useRequestStore } from '@/stores/requestStore';
import clsx from 'clsx';

interface ApiButtonProps {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  data?: any;
  redirectTo?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const ApiButton = ({
  method,
  url,
  data,
  redirectTo,
  className,
  children,
  onClick,
}: ApiButtonProps) => {
  const navigate = useNavigate();
  const {
    getData,
    postData,
    putData,
    patchData,
    deleteData,
  } = useRequestStore();

  const handleClick = async () => {
    try {
      const res =
        method === 'GET' ? await getData(url) :
        method === 'POST' ? await postData(url, data) :
        method === 'PUT' ? await putData(url, data) :
        method === 'PATCH' ? await patchData(url, data) :
        await deleteData(url);

      if (res?.success && redirectTo) {
        navigate(redirectTo);
      }

      if (onClick) {
        onClick();
      }
    } catch (error) {
      console.error(`[${method}] 요청 실패:`, error);
    }
  };

  return (
    <button className={clsx(className)} onClick={handleClick}>
      {children}
    </button>
  );
};
