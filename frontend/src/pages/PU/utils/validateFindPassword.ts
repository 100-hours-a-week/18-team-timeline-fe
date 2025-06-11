interface ValidationResult {
  isValid: boolean
  errors: {
    email?: string
  }
}

export function validateFindPassword(email: string): ValidationResult {
  const errors: ValidationResult["errors"] = {}
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email.trim()) {
    errors.email = "이메일을 입력하세요."
  } else if (!emailRegex.test(email)) {
    errors.email = "유효한 이메일 주소를 입력해 주세요."
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}