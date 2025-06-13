interface ValidationResult {
  isValid: boolean
  errors: {
    password?: string
    passwordCheck?: string
  }
}

export function validateResetPassword(
  password: string,
  passwordCheck: string,
): ValidationResult {
  const errors: ValidationResult['errors'] = {}

  if (!password.trim()) {
    errors.password = '비밀번호를 입력하세요.'
  } else if (
    password.length < 8 ||
    !/[A-Z]/.test(password) || // 대문자
    !/[a-z]/.test(password) || // 소문자
    !/[0-9]/.test(password) || // 숫자
    !/[^A-Za-z0-9]/.test(password) // 특수문자
  ) {
    errors.password = '최소 8자 이상, 대문자·소문자·숫자·특수문자를 각각 포함해야 합니다.'
  }

  if (!passwordCheck.trim()) {
    errors.passwordCheck = '비밀번호 확인을 입력하세요.'
  } else if (password.trim() !== passwordCheck.trim()) {
    errors.passwordCheck = '비밀번호가 일치하지 않습니다.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
