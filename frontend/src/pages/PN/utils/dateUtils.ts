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
    const date = new Date(dateTimeString);
    const now = new Date();
    
    // 시간 차이 계산 (밀리초)
    const diff = now.getTime() - date.getTime();
    
    // 분, 시간, 일, 주, 개월, 년 단위로 변환
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    
    // 상대적 시간 포맷 반환
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
      // yyyy.MM.dd 형식으로 변환
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}.${month}.${day}`;
    }
  }
  
  /**
   * ISO 날짜 문자열을 yyyy.MM.dd 형식으로 변환
   */
  export function formatDateString(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}.${month}.${day}`;
  }