export function setCookie(key: string, value: string, days = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  const domain = process.env.NEXT_PUBLIC_DOMAIN || ".beenbo.com";

  document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(
    value
  )};expires=${expires.toUTCString()};path=/;domain=${domain};samesite=lax`;
}

export function getCookie(key: string): string | null {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [k, v] = cookie.split("=");
    if (decodeURIComponent(k) === key) return decodeURIComponent(v);
  }
  return null;
}

export function removeCookie(key: string) {
  const domain = process.env.NEXT_PUBLIC_DOMAIN || ".beenbo.com";

  document.cookie = `${encodeURIComponent(
    key
  )}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${domain};samesite=lax`;
}
