import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 py-16 border-t border-gray-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo/Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <span className="text-2xl font-black text-white tracking-tighter block mb-4">Webiox QR Studio</span>
            <p className="text-sm text-gray-500 leading-relaxed">
              The professional standard for generating beautiful, trackable, and high-quality QR codes for your agency and business.
            </p>
          </div>
          
          {/* Links Columns */}
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-4 tracking-wider uppercase text-sm">Products</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm hover:text-white transition-colors">QR Generator</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition-colors">QR Code API</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-4 tracking-wider uppercase text-sm">Company</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm hover:text-white transition-colors">About Webiox</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-white font-bold mb-4 tracking-wider uppercase text-sm">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-sm text-center text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>© 2026 Webiox. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
