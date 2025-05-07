import { useEffect, useState } from "react";
import { useRequestStore } from "@/stores/requestStore";
import { ENDPOINTS } from "@/constants/url";
import { validateUserInfo } from "../utils/validateUserInfo";

export const useUserInfoLogic = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState('')
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false)

  const { getData, postData } = useRequestStore();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await getData(ENDPOINTS.USER_INFO);
        setEmail(res.data.email);
        setName(res.data.username);
      } catch (e) {
        console.error("유저 정보 조회 실패", e);
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const prevName = localStorage.getItem("name");
  
    if (name === prevName) {
      setErrors({});
      setIsButtonActive(false);
      return;
    }

    const result = validateUserInfo(name)
    setErrors(result.errors)
    setIsButtonActive(result.isValid)
  }, [name])

  const checkNameDuplicate = async () => {
    if (!name || errors.name) return;
    const res = await getData(ENDPOINTS.CHECK_NAME(name));
    if (!res.available) {
      setErrors((prev) => ({ ...prev, name: "이미 사용 중인 닉네임입니다." }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isButtonActive) return;
    try {
      const res = await postData(ENDPOINTS.USER_INFO, { name });
      if (res?.success) {
        localStorage.setItem('name', name);
      }
    } catch (error) {
      console.error("닉네임 수정 실패", error);
    }
  };

  return {
    email,
    password, setPassword,
    name, setName,
    checkNameDuplicate,
    errors, isButtonActive, handleSubmit,
    isInputModalOpen, setIsInputModalOpen,
  };
};
