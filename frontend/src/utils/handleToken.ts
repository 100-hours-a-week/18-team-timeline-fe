import { jwtDecode, type JwtPayload } from "jwt-decode";

export interface TokenJwtPayload extends JwtPayload {
  sub?: string;
  name?: string;
  role?: string;
}

const isTokenExpired = (exp?: number): boolean => {
  if (!exp) return true;
  const currentTime = Math.floor(Date.now() / 1000);
  return exp < currentTime;
};

export const handleToken = (token: string): void => {
  try {
    const decoded = jwtDecode<TokenJwtPayload>(token);

    if (isTokenExpired(decoded.exp)) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("name");
      localStorage.removeItem("role");
      return;
    }

    const userId = decoded.sub ? Number(decoded.sub) : null;

    if (userId && decoded.name && decoded.role) {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("userId", userId.toString());
      localStorage.setItem("name", decoded.name);
      localStorage.setItem("role", decoded.role);
    } else {
      console.warn("JWT에서 필수 정보 누락: sub, name, role");
    }
  } catch (error) {
    console.error("JWT 처리 중 오류 발생:", error);
    localStorage.clear();
  }
};