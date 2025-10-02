import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center">
            <Image 
              src="/images/colloq transparent.png" 
              alt="Colloq" 
              width={100} 
              height={100} 
            />
          </div>

          <div className="flex gap-8 text-sm text-gray-600">
            <Link href="#about" className="hover:text-purple-600 transition-colors">About</Link>
            <Link href="#privacy" className="hover:text-purple-600 transition-colors">Privacy</Link>
            <Link href="#terms" className="hover:text-purple-600 transition-colors">Terms</Link>
            <Link href="#contact" className="hover:text-purple-600 transition-colors">Contact</Link>
          </div>

          <div className="text-sm text-gray-500">
            &copy; 2025 Colloq. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
