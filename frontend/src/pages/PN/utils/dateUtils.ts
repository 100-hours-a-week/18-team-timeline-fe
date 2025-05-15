/**
 * 상대적 시간 포맷 유틸리티
 * 
 * 시간 형식:
 * - 1분 미만: 방금 전
 * - 1분 이상 ~ 59분 미만: N분 전
 * - 1시간 이상 ~ 23시간 미만: N시간 전
 * - 1일 이상 ~ 6일 이하: N일 전
 * - 7일 이상 ~ 29일 이하: N주 전
 * - 30일 이상 ~ 11개월 이하: N개월 전
 * - 12개월 이상: yyyy.MM.dd
 */
export function formatRelativeTime(dateTimeString: string): string {
  const dateUTC = new Date(dateTimeString);
  const nowUTC = new Date(new Date().toISOString()); // 강제 UTC 기준으로 now

  const diff = nowUTC.getTime() - dateUTC.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  // const years = Math.floor(days / 365);

  if (minutes < 1) {
    return '방금 전';
  } else if (minutes < 60) {
    return `${minutes}분 전`;
  } else if (hours < 24) {
    return `${hours}시간 전`;
  } else if (days <= 6) {
    return `${days}일 전`;
  } else if (days <= 29) {
    return `${weeks}주 전`;
  } else if (months <= 11) {
    return `${months}개월 전`;
  } else {
    const year = dateUTC.getFullYear();
    const month = String(dateUTC.getMonth() + 1).padStart(2, '0');
    const day = String(dateUTC.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  }
}