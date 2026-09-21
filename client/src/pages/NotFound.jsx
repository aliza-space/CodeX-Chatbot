import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 font-mono">
      <p className="text-4xl">404</p>
      <p className="text-gray-500">// route not found</p>
      <Link to="/" className="text-brand-500 hover:underline">
        cd ~/home
      </Link>
    </div>
  );
}
