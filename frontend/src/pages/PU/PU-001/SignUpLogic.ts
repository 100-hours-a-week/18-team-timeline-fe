import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ROUTES, ENDPOINTS } from "@/constants/url"
import { useRequestStore } from "@/stores/requestStore"
import { validateSignUp } from "../utils/validateSignUp"

export const isEmailValid = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return !!email.trim() && emailRegex.test(email);
}

export const useSignUpLogic = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordCheck, setPasswordCheck] = useState("")
  const [name, setName] = useState("")
  const [code , setCode] = useState("")
  const [checkedTerms, setCheckedTerms] = useState(false)
  const [checkedPrivacy, setCheckedPrivacy] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; passwordCheck?: string; name?: string; code?: string}>({})
  const [isButtonActive, setIsButtonActive] = useState(false)
  const [emailAvailable, setEmailAvailable] = useState(false)
  const [nameAvailable, setNameAvailable] = useState(false)
  const [showVerificationInput, setShowVerificationInput] = useState(false)
  const [codeValid, setCodeValid] = useState(false)

  const { getData, postData } = useRequestStore()
  const navigate = useNavigate()

  useEffect(() => {
    const result = validateSignUp(email, password, passwordCheck, name, code, showVerificationInput)
    setErrors(result.errors)
    setIsButtonActive(result.isValid && checkedTerms && checkedPrivacy && emailAvailable && nameAvailable && codeValid)
  }, [email, password, passwordCheck, name, code, checkedTerms, checkedPrivacy, emailAvailable, nameAvailable, showVerificationInput, codeValid])

  const checkDuplicate = async (
    value: string,
    validator: (v: string) => Promise<{ available: boolean }>,
    key: keyof typeof errors,
    message: string,
    onAvailable?: (ok: boolean) => void
  ) => {
    if (!value || errors[key]) return;
    const res = await validator(value);
    if (!res.available) {
      setErrors((prev) => ({ ...prev, [key]: message }));
      onAvailable?.(false)
    } else {
      onAvailable?.(true)
    }
  }

  const checkEmailDuplicate = () => checkDuplicate(
    email,
    (val) => getData(ENDPOINTS.CHECK_EMAIL(val)),
    "email",
    "이미 사용 중인 이메일입니다.",
    setEmailAvailable
  )

  const checkNameDuplicate = () => checkDuplicate(
    name,
    (val) => getData(ENDPOINTS.CHECK_NAME(val)),
    "name",
    "이미 사용 중인 닉네임입니다.",
    setNameAvailable
  )

  const sendVerificationCode = async () => {
    try {
      const res = await postData(ENDPOINTS.SEND_CODE, { email });
      if (res?.success) {
        console.log("인증번호가 이메일로 전송되었습니다.");
      }
    } catch (error) {
      console.error("인증번호 전송 실패", error);
    }
  };  

  useEffect(() => {
    const verifyCode = async () => {
      if (code.length === 6) {
        try {
          const res = await postData(ENDPOINTS.CHECK_CODE, { email, code });
          if (!res.success) {
            setErrors((prev) => ({ ...prev, code: "인증번호가 일치하지 않습니다." }));
            setCodeValid(false);
          } else {
            setErrors((prev) => ({ ...prev, code: undefined }));
            setCodeValid(true);
          }
        } catch (error) {
          console.error("인증번호 유효 시간이 만료되었습니다. 다시 요청해 주세요.", error);
          setCodeValid(false);
        }
      } else {
        setCodeValid(false);
      }
    };
  
    verifyCode();
  }, [code]);
  

  const handleSetEmail = (value: string) => {
    setEmail(value)
    setEmailAvailable(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = validateSignUp(email, password, passwordCheck, name, code, showVerificationInput)
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
    email, setEmail: handleSetEmail,
    password, setPassword,
    passwordCheck, setPasswordCheck,
    name, setName,
    code, setCode,
    isEmailInputValid: isEmailValid(email),
    isEmailAvailable: emailAvailable,
    showVerificationInput, setShowVerificationInput,
    sendVerificationCode,
    checkedTerms, setCheckedTerms,
    checkedPrivacy, setCheckedPrivacy,
    checkEmailDuplicate, checkNameDuplicate,
    codeValid,
    errors, isButtonActive, handleSubmit,
  }
}