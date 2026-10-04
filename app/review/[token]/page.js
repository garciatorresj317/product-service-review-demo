import EmployeeReviewPage from './review-client';

export function generateStaticParams() {
  return [{ token: 'john-sample-company' }];
}

export default async function ReviewPage({ params }) {
  const { token } = await params;
  return <EmployeeReviewPage token={token} />;
}
