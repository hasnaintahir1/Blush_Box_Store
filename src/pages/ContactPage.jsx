import React, { useState } from 'react';
import { Mail, Phone, MapPin, Sparkles, Send, ShieldCheck, ChevronDown, Clock, HelpCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';

const FAQS = [
  {
    q: "How does personalized laser monogramming work?",
    a: "Our precision laser engravers etch custom monograms, names, dates, or messages into metal, crystal, wood, and Italian leather. Personalization is complimentary on all designated Blush Box pieces."
  },
  {
    q: "Can I schedule a delivery for an exact future milestone date?",
    a: "Yes. During checkout, you may select any specific milestone date (e.g. birthday, anniversary, holiday). We calculate transit time and dispatch the parcel so it arrives precisely on your chosen date."
  },
  {
    q: "What is included in the Signature Blush Box packaging?",
    a: "Every gift arrives enclosed in our custom heavy blush keepsake box, wrapped with double-faced satin ribbon, accompanied by your personalized message hand-inscribed on gold-foiled stationery."
  },
  {
    q: "Do you accommodate large-volume corporate orders?",
    a: "Yes. Our Corporate Concierge handles bulk executive gifting (10 to 500+ recipients) with custom company logo foil stamping, individualized note cards, and multi-address split dispatch."
  }
];

export default function ContactPage() {
  const { showToast } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    inquiryType: 'Corporate Gifting',
    message: ''
  });
  const [openFaq, setOpenFaq] = useState(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      showToast("Your concierge inquiry has been received. Our senior curator will contact you within 2 hours.");
      setFormData({ name: '', email: '', company: '', phone: '', inquiryType: 'Corporate Gifting', message: '' });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-stone-50/50 dark:bg-stone-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Client Services &amp; Concierge</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white">
            Concierge &amp; Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            Whether curating gifts for executive retreats, weddings, milestone anniversaries, or bespoke commissions, our Blush Box team is at your service.
          </p>
        </div>

        {/* 2 Column Layout: Info + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 space-y-6 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white">
                Direct Contact
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 dark:text-white block">Concierge Hotline</span>
                    <span className="text-stone-500">+1 (800) 555-BLUSH (Toll Free, 24/7)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 dark:text-white block">Private Email</span>
                    <span className="text-stone-500">concierge@blushbox.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 dark:text-white block">Flagship Gifting Studio</span>
                    <span className="text-stone-500">740 Madison Avenue, 4th Floor, New York, NY 10065</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 dark:text-white block">Studio Hours</span>
                    <span className="text-stone-500">Mon - Sat: 9:00 AM - 7:00 PM EST</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Corporate Gifting Callout Box */}
            <div className="bg-stone-950 text-white p-6 sm:p-8 rounded-3xl border border-stone-800 space-y-3">
              <span className="text-[10px] uppercase tracking-wider font-bold text-rose-400">VIP Corporate Services</span>
              <h4 className="font-serif text-lg font-bold">Executive Bulk Gifting</h4>
              <p className="text-xs text-stone-300 font-light leading-relaxed">
                Inquire about custom corporate branding, debossed logo boxes, bespoke wine selections, and individualized address CSV bulk dispatch.
              </p>
            </div>
          </div>

          {/* Right Inquiry Form (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-stone-900 p-6 sm:p-10 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-6">
            <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">
              Send a Concierge Request
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Lady Penelope Ashworth"
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="client@luxurygifts.com"
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">Company / Organization (Optional)</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Global Capital Holdings"
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">Inquiry Purpose</label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
                  >
                    <option value="Corporate Gifting">Corporate VIP &amp; Executive Gifting</option>
                    <option value="Wedding Registry">Bespoke Wedding Registry</option>
                    <option value="Custom Hamper">Custom One-of-a-Kind Hamper</option>
                    <option value="Order Assistance">Dispatched Order Assistance</option>
                    <option value="Other">Other Bespoke Request</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">Message &amp; Scope Requirements</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about the recipient, desired occasion, estimated quantity, budget range, and any custom engraving or branding requirements..."
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3.5 bg-stone-900 dark:bg-rose-600 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{sending ? "Submitting to Atelier..." : "Submit Concierge Inquiry"}</span>
              </button>
            </form>
          </div>

        </div>

        {/* FAQ Section */}
        <div className="bg-white dark:bg-stone-900 p-8 sm:p-12 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-stone-500">
              Clear answers regarding our white-glove curation, laser monogramming, and delivery protocols.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-stone-900 dark:text-white bg-stone-50/70 dark:bg-stone-800/40 hover:bg-stone-100 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${openFaq === idx ? 'rotate-180 text-rose-600' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-4 text-xs text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-900 leading-relaxed border-t border-stone-100 dark:border-stone-800">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
