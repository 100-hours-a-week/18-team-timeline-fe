export const PollMessage = {
  TITLE: (title: string) => `${title}`,
  CONTENT: (endAt: string) => `투표가 ${endAt}에 종료됩니다.`,
  BTN_NAME: '투표하기',
  METATEXT: '투표는 한 번만 가능하며, 이후에는 변경이 불가합니다.',
  TOAST_SUCCESS: '투표를 제출하였습니다.',
  TOAST_FAIL: '투표를 제출하는 중에 오류가 발생하였습니다.'
}
