import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left: Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900 tracking-tighter">Webiox QR Studio</span>
            </Link>
          </div>

          {/* Center: Navigation Links (Hidden on mobile) */}
          <div className="hidden md:flex space-x-8">
            <Link href="#" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">QR Code API</Link>
            <Link href="#" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">QR Code Types</Link>
            <Link href="#" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link>
          </div>

          {/* Right: Login / Sign Up */}
          <div className="flex items-center space-x-4">
            <Link href="#" className="hidden sm:block text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors">
              Login
            </Link>
            <Link href="#" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 px-6 rounded-full transition-colors shadow-sm shadow-blue-600/20">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
