// components/form/useSignUpLogic.ts
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ROUTES, ENDPOINTS } from "@/constants/url"
import { useRequestStore } from "@/stores/requestStore"
import { validateSignUp } from "../utils/validateSignUp"

export const useSignUpLogic = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordCheck, setPasswordCheck] = useState("")
  const [name, setName] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string; passwordCheck?: string; name?: string }>({})
  const [isButtonActive, setIsButtonActive] = useState(false)

  const { getData, postData } = useRequestStore()
  const navigate = useNavigate()

  useEffect(() => {
    const result = validateSignUp(email, password, passwordCheck, name)
    setErrors(result.errors)
    setIsButtonActive(result.isValid)
  }, [email, password, passwordCheck, name])

  const checkDuplicate = async (
    value: string,
    validator: (v: string) => Promise<{ available: boolean }>,
    key: keyof typeof errors,
    message: string
  ) => {
    if (!value || errors[key]) return;
    const res = await validator(value);
    if (!res.available) {
      setErrors((prev) => ({ ...prev, [key]: message }));
    }
  }

  const checkEmailDuplicate = () => checkDuplicate(email, (val) => getData(ENDPOINTS.CHECK_EMAIL(val)), "email", "이미 사용 중인 이메일입니다.")
  const checkNameDuplicate = () => checkDuplicate(name, (val) => getData(ENDPOINTS.CHECK_NAME(val)), "name", "이미 사용 중인 닉네임입니다.")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = validateSignUp(email, password, passwordCheck, name)
    if (!result.isValid) {
      setErrors(result.errors)
      return
    }
    try {
      const res = await postData(ENDPOINTS.SIGNUP, { email, password, name })
      if (res?.success) {
        navigate(ROUTES.MAIN)
      }
    } catch (error) {
      console.error("회원가입 실패", error)
      alert("회원가입 중 오류가 발생했습니다.")
    }
  }

  return {
    email, setEmail,
    password, setPassword,
    passwordCheck, setPasswordCheck,
    name, setName,
    errors,
    isButtonActive,
    handleSubmit,
    checkEmailDuplicate,
    checkNameDuplicate
  }
}
