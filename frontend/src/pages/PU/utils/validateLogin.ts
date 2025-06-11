interface ValidationResult {
  isValid: boolean;
  errors: {
    email?: string;
    password?: string;
  };
}

export function validateLogin(email: string, password: string): ValidationResult {
  const errors: ValidationResult["errors"] = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email.trim()) {
    errors.email = "이메일을 입력하세요.";
  } else if (!emailRegex.test(email)) {
    errors.email = "유효한 이메일 주소를 입력해 주세요.";
  }

  if (!password.trim()) {
    errors.password = "비밀번호를 입력하세요.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
