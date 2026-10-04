const EMPLOYEE_NAME_MAX = 120;
const FEEDBACK_MAX = 5000;

export const DEMO_STORAGE_KEY = 'product-service-review-demo-v1';

export function createInitialDemoState() {
  return {
    company: { name: 'Sample Company' },
    employees: [
      {
        id: 'employee-john',
        token: 'john-sample-company',
        name: 'John',
        active: true,
        createdAt: '2026-10-03T12:00:00.000Z',
      },
    ],
    reviews: [],
  };
}

export function validateEmployeeName(value) {
  const name = String(value ?? '').trim();
  if (!name) return { ok: false, error: 'Enter an employee name.' };
  if (name.length > EMPLOYEE_NAME_MAX) return { ok: false, error: 'Employee names must be 120 characters or fewer.' };
  return { ok: true, value: name };
}

export function createEmployee(name, id = crypto.randomUUID(), createdAt = new Date().toISOString()) {
  const result = validateEmployeeName(name);
  if (!result.ok) return result;
  return {
    ok: true,
    value: { id, token: id, name: result.value, active: true, createdAt },
  };
}

export function validateReview(ratingValue, feedbackValue) {
  const rating = Number(ratingValue);
  const feedback = String(feedbackValue ?? '').trim();
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { ok: false, error: 'Choose a rating from 1 to 5.' };
  }
  if (!feedback) return { ok: false, error: 'Write a short note about the experience.' };
  if (feedback.length > FEEDBACK_MAX) return { ok: false, error: 'Feedback must be 5,000 characters or fewer.' };
  return { ok: true, value: { rating, feedback } };
}

export function createReview({ token, rating, feedback }, id = crypto.randomUUID(), createdAt = new Date().toISOString()) {
  const result = validateReview(rating, feedback);
  if (!result.ok) return result;
  return {
    ok: true,
    value: { id, employeeToken: token, ...result.value, createdAt },
  };
}

export function parseDemoState(raw) {
  if (!raw) return createInitialDemoState();
  try {
    const value = JSON.parse(raw);
    if (!value?.company?.name || !Array.isArray(value.employees) || !Array.isArray(value.reviews)) {
      return createInitialDemoState();
    }
    return value;
  } catch {
    return createInitialDemoState();
  }
}
