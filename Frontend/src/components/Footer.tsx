import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import medicapsLogo from '@/assets/medicaps-logo.png';

export const Footer = () => {
  return (
    <footer className="gradient-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={medicapsLogo} alt="Medicaps University" className="h-12 w-auto bg-primary-foreground rounded p-1" />
              <div>
                <h3 className="font-bold text-lg">Campus Merch Store</h3>
                <p className="text-sm opacity-90">Medicaps University</p>
              </div>
            </div>
            <p className="text-sm opacity-80 max-w-md">
              Your one-stop destination for official Medicaps University merchandise. 
              Quality apparel for students, faculty, and clubs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/boys" className="opacity-80 hover:opacity-100 transition-opacity">Boys Collection</Link></li>
              <li><Link to="/girls" className="opacity-80 hover:opacity-100 transition-opacity">Girls Collection</Link></li>
              <li><Link to="/teachers" className="opacity-80 hover:opacity-100 transition-opacity">Teachers Collection</Link></li>
              <li><Link to="/club-customization" className="opacity-80 hover:opacity-100 transition-opacity">Club Customization</Link></li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm mb-4">
              <li><Link to="/return-policy" className="opacity-80 hover:opacity-100 transition-opacity">Return Policy</Link></li>
              <li><Link to="/payment-support" className="opacity-80 hover:opacity-100 transition-opacity">Payment Issues</Link></li>
              <li><Link to="/admin" className="opacity-80 hover:opacity-100 transition-opacity">Admin Panel</Link></li>
            </ul>
            <h4 className="font-semibold mb-3">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 opacity-80">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>Medicaps University Campus, Indore</span>
              </li>
              <li className="flex items-center gap-2 opacity-80">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+91 731 XXX XXXX</span>
              </li>
              <li className="flex items-center gap-2 opacity-80">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>merch@medicaps.ac.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-70">
          <p>© {new Date().getFullYear()} Campus Merch Store - Medicaps University. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
