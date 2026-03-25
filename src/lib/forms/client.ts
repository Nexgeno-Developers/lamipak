'use client';

import type { FormDataByType, FormSubmitResult, FormType } from '@/lib/forms/types';

const DEFAULT_TIMEOUT_MS = 15000;

async function safeParseJson(response: Response): Promise<unknown | null> {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return null;
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function submitForm<T extends FormType>(
  formType: T,
  data: FormDataByType[T],
): Promise<FormSubmitResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch('/api/forms/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ formType, data }),
      signal: controller.signal,
    });

    const payload = (await safeParseJson(response)) as
      | { message?: string; fieldErrors?: Record<string, string>; data?: unknown }
      | null;

    if (!response.ok) {
      return {
        ok: false,
        message: payload?.message || 'Failed to submit the form. Please try again.',
        fieldErrors: payload?.fieldErrors,
      };
    }

    return { ok: true, data: payload?.data ?? payload ?? null };
  } catch (error) {
    const isAbort =
      typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      error.name === 'AbortError';

    return {
      ok: false,
      message: isAbort ? 'Request timed out. Please try again.' : 'Network error. Please try again.',
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
