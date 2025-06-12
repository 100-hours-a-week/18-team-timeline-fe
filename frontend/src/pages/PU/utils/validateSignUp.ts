interface ValidationResult {
  isValid: boolean
  errors: {
    email?: string
    password?: string
    passwordCheck?: string
    name?: string
    code?: string
  }
}

export function validateSignUp(
  email: string,
  password: string,
  passwordCheck: string,
  name: string,
  code: string,
  showVerificationInput: boolean,
): ValidationResult {
  const errors: ValidationResult['errors'] = {}
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const nameRegex = /^[가-힣a-zA-Z0-9]+$/

  if (!email.trim()) {
    errors.email = '이메일을 입력하세요.'
  } else if (!emailRegex.test(email)) {
    errors.email = '유효한 이메일 주소를 입력해 주세요.'
  }

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

  if (!name.trim()) {
    errors.name = '닉네임을 입력하세요.'
  } else if (name.length > 10 || name.length < 2) {
    errors.name = '2자 이상 10자 이내로 입력해 주세요.'
  } else if (!nameRegex.test(name)) {
    errors.name = '띄어쓰기 및 특수문자를 사용할 수 없습니다.'
  }

  if (showVerificationInput && !code.trim()) {
    errors.code = '메일이 발송되었습니다. 1시간 이내에 인증을 완료해 주세요.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
