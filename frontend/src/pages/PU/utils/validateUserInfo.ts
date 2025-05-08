interface ValidationResult {
  isValid: boolean
  errors: {
    name?: string
  };
}

export function validateUserInfo(
  name: string
): ValidationResult {
  const errors: ValidationResult["errors"] = {}
  
  if (!name.trim()) {
    errors.name = "닉네임을 입력하세요."
  } else if (name.length > 10 || name.length < 2) {
    errors.name = "2자 이상 10자 이내로 입력해 주세요."
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}