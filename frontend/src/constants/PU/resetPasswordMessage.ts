export const ResetPasswordMessage = {
  TITLE: (isLogin: boolean) => `비밀번호 ${isLogin ? '재설정' : '변경'}`,
  BTN_NAME: (isLogin: boolean) => `비밀번호 ${isLogin ? '재설정' : '변경'}하기`,
  TOAST_SUCCESS: (isLogin: boolean) => `비밀번호가 ${isLogin ? '재설정' : '변경'}되었습니다.`,
  TOAST_FAIL: (isLogin: boolean) => `비밀번호 ${isLogin ? '재설정' : '변경'} 중 오류가 발생했습니다.`,
}