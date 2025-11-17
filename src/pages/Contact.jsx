// FILE PURPOSE:
// - Contact page with form and information

import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Contact Us</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="mr-3 text-primary-600" size={20} />
                <span className="text-gray-600 dark:text-gray-400">support@mitc.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="mr-3 text-primary-600" size={20} />
                <span className="text-gray-600 dark:text-gray-400">+91 1234567890</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-3 text-primary-600" size={20} />
                <span className="text-gray-600 dark:text-gray-400">Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>
          <div className="card">
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Send Message</h3>
            <form className="space-y-4">
              <input type="text" placeholder="Your Name" className="input" />
              <input type="email" placeholder="Your Email" className="input" />
              <textarea placeholder="Your Message" rows="4" className="input"></textarea>
              <button type="submit" className="btn btn-primary w-full">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;