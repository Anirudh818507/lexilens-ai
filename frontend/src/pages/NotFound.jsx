import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center justify-center py-24 text-center">
      <p className="font-serif text-6xl text-paper-200">404</p>
      <h1 className="mt-3 font-serif text-2xl text-ink-900">Page not found</h1>
      <p className="mt-2 text-sm text-ink-600">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6 rounded-md bg-ink-900 px-5 py-2.5 text-sm font-medium text-paper-50 hover:bg-ink-800">
        Back to home
      </Link>
    </div>
  );
}
