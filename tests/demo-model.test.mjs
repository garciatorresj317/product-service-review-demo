import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createEmployee,
  createInitialDemoState,
  createReview,
  parseDemoState,
  validateReview,
} from '../lib/demo-model.mjs';

test('the demo starts with John and no fabricated reviews', () => {
  const state = createInitialDemoState();
  assert.equal(state.company.name, 'Sample Company');
  assert.equal(state.employees[0].name, 'John');
  assert.equal(state.reviews.length, 0);
});

test('employee creation trims names and produces a stable token', () => {
  const result = createEmployee('  Maya  ', 'employee-maya', '2026-10-03T12:00:00.000Z');
  assert.equal(result.ok, true);
  assert.equal(result.value.name, 'Maya');
  assert.equal(result.value.token, 'employee-maya');
});

test('review validation rejects incomplete and out-of-range submissions', () => {
  assert.equal(validateReview(0, 'Helpful').ok, false);
  assert.equal(validateReview(5, '   ').ok, false);
  assert.equal(validateReview(6, 'Helpful').ok, false);
});

test('a valid review remains associated with the employee token', () => {
  const result = createReview(
    { token: 'john-sample-company', rating: 5, feedback: '  John solved the issue quickly.  ' },
    'review-1',
    '2026-10-03T12:30:00.000Z',
  );
  assert.deepEqual(result.value, {
    id: 'review-1',
    employeeToken: 'john-sample-company',
    rating: 5,
    feedback: 'John solved the issue quickly.',
    createdAt: '2026-10-03T12:30:00.000Z',
  });
});

test('invalid stored data safely resets the demo', () => {
  const state = parseDemoState('{broken');
  assert.equal(state.employees[0].name, 'John');
});
