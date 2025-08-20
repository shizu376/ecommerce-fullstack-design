import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="font-sans mt-10">

      {/* Main Footer */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-6 gap-6 text-sm">

          {/* Brand Column */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold text-blue-600 mb-3">MyShop</h2>
            <p className="text-gray-600 mb-4 leading-snug">
              Your one-stop shop for all categories of products with the best offers.
            </p>
            <div className="flex gap-3 text-gray-600 text-lg">
              <a href="#" className="hover:text-blue-600"><FaFacebookF /></a>
              <a href="#" className="hover:text-blue-600"><FaTwitter /></a>
              <a href="#" className="hover:text-blue-600"><FaInstagram /></a>
              <a href="#" className="hover:text-blue-600"><FaLinkedinIn /></a>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="font-bold text-gray-800 mb-2">About</h3>
            <ul className="space-y-1 text-gray-600">
              <li><a href="#" className="hover:text-blue-600">About Us</a></li>
              <li><a href="#" className="hover:text-blue-600">Find Store</a></li>
              <li><a href="#" className="hover:text-blue-600">Categories</a></li>
              <li><a href="#" className="hover:text-blue-600">Blogs</a></li>
            </ul>
          </div>

          {/* Partnership */}
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Partnership</h3>
            <ul className="space-y-1 text-gray-600">
              <li><a href="#" className="hover:text-blue-600">Become a Partner</a></li>
              <li><a href="#" className="hover:text-blue-600">Affiliate Program</a></li>
              <li><a href="#" className="hover:text-blue-600">Advertise</a></li>
              <li><a href="#" className="hover:text-blue-600">Careers</a></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Information</h3>
            <ul className="space-y-1 text-gray-600">
              <li><a href="#" className="hover:text-blue-600">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-600">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-blue-600">FAQs</a></li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h3 className="font-bold text-gray-800 mb-2">For Users</h3>
            <ul className="space-y-1 text-gray-600">
              <li><a href="#" className="hover:text-blue-600">Login</a></li>
              <li><a href="#" className="hover:text-blue-600">Register</a></li>
              <li><a href="#" className="hover:text-blue-600">Settings</a></li>
              <li><a href="#" className="hover:text-blue-600">My Orders</a></li>
            </ul>
          </div>

          {/* Get App */}
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Get App</h3>
            <div className="space-y-2">
              <a href="#"><img src="googleplay.png" alt="Google Play" className="w-28" /></a>
              <a href="#"><img src="appstore.png" alt="App Store" className="w-28" /></a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between text-xs text-gray-600">
            <p>© {new Date().getFullYear()} Brand. All rights reserved.</p>
            <div className="flex gap-3 mt-2 md:mt-0">
              <a href="#" className="hover:text-blue-600">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


