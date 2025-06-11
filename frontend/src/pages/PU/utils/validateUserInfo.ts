interface ValidationResult {
  isValid: boolean
  errors: {
    name?: string
  }
}

export function validateUserInfo(name: string): ValidationResult {
  const errors: ValidationResult['errors'] = {}
  const nameRegex = /^[가-힣a-zA-Z0-9]+$/

  if (!name.trim()) {
    errors.name = '닉네임을 입력하세요.'
  } else if (name.length > 10 || name.length < 2) {
    errors.name = '2자 이상 10자 이내로 입력해 주세요.'
  } else if (!nameRegex.test(name)) {
    errors.name = '띄어쓰기 및 특수문자를 사용할 수 없습니다.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
