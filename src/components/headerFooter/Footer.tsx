import React from "react";
import Link from "next/link";
import { FaInstagram, FaLinkedin, FaTwitter, FaFacebookF } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Footer: React.FC = () => {
  const authUser = useSelector((state: any) => state.authUser.isAuthenticated);

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = (form.elements.namedItem("email") as HTMLInputElement).value;
    if (!input) {
      toast.error("Please enter an email");
      return;
    }
    // UI-only: show a toast; wiring to backend can be added later
    toast.success("Subscribed — thank you!");
    form.reset();
  };

  return (
    <footer className="w-full mt-16 bg-gradient-to-r from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="py-12 px-6 rounded-3xl bg-white/70 backdrop-blur-sm shadow-sm animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">LinkCofounders</h3>
              <p className="text-sm text-gray-700">We help founders find complementary cofounders, validate ideas, and build startups together. Connect, collaborate, and create impact.</p>
              <div className="mt-4 flex items-center gap-3">
                <a href="#" aria-label="Instagram" className="p-2 rounded-lg bg-white/80  hover:shadow-md transition text-pink-500">
                  <FaInstagram className="h-5 w-5" />
                </a>
                <a href="#" aria-label="LinkedIn" className="p-2 rounded-lg bg-white/80  hover:shadow-md transition text-blue-600">
                  <FaLinkedin className="h-5 w-5" />
                </a>
                <a href="#" aria-label="Twitter" className="p-2 rounded-lg bg-white/80  hover:shadow-md transition text-blue-400">
                  <FaTwitter className="h-5 w-5" />
                </a>
                <a href="#" aria-label="Facebook" className="p-2 rounded-lg bg-white/80  hover:shadow-md transition text-blue-800">
                  <FaFacebookF className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <Link href="/"><a className="hover:text-orange-500 transition">Home</a></Link>
                </li>
                <li>
                  <Link href="/proposals"><a className="hover:text-orange-500 transition">Proposals</a></Link>
                </li>
                <li>
                  <Link href="/businesses"><a className="hover:text-orange-500 transition">Companies</a></Link>
                </li>
                <li>
                  <Link href="/find_users"><a className="hover:text-orange-500 transition">Users</a></Link>
                </li>
                <li>
                  <Link href="/chat"><a className="hover:text-orange-500 transition">Messages</a></Link>
                </li>
                {authUser && (
                  <li>
                    <Link href="/dashboard/user"><a className="hover:text-orange-500 transition">Dashboard</a></Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  <Link href="/faq"><a className="hover:text-orange-500 transition">FAQ</a></Link>
                </li>
                <li>
                  <Link href="/blog"><a className="hover:text-orange-500 transition">Blog</a></Link>
                </li>
                <li>
                  <Link href="/support"><a className="hover:text-orange-500 transition">Support</a></Link>
                </li>
                <li>
                  <Link href="/terms"><a className="hover:text-orange-500 transition">Terms & Privacy</a></Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">Newsletter</h4>
              <p className="text-sm text-gray-700 mb-3">Get updates on new proposals, events and success stories.</p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input name="email" type="email" placeholder="Your email" className="flex-1 px-3 py-2 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-orange-200 transition" />
                <button type="submit" className="px-4 py-2 rounded-xl bg-gradient-to-br from-[#f26722] to-[#ff8f57] text-white font-semibold shadow hover:shadow-lg transition">Subscribe</button>
              </form>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-600">
            <div>© {new Date().getFullYear()} LinkCofounders. All rights reserved.</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 400ms ease both; }
      `}</style>
    </footer>
  );
};

export default Footer;
