export function getRobotsTxtApiUrl(): string | null {
  const baseUrl = process.env.COMPANY_API_BASE_URL?.trim();
  if (!baseUrl) return null;

  const base = baseUrl.replace(/\/+$/, '');
  return `${base}/v1/robots-txt?format=txt`;
}
