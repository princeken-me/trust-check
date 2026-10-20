import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [subject, setSubject] = useState('General Inquiry');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim() && message.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-md border border-slate-200 p-8 shadow-2xs space-y-2">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Contact TrustCheck Desk</h1>
        <p className="text-xs text-slate-600 font-medium">
          Get in touch with our support team, compliance analysts, business verification desk, or media inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Contact Info Sidebar */}
        <div className="bg-white rounded-md border border-slate-200 p-6 space-y-6 shadow-2xs">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Global Desk</h3>
            <p className="text-xs text-slate-500 font-medium">TrustCheck Intelligence Center</p>
          </div>

          <div className="space-y-4 text-xs text-slate-700">
            <div className="flex items-start space-x-3">
              <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Email Desk</span>
                <span>support@trustcheck.org</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Verification Appeals</span>
                <span>verifications@trustcheck.org</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Headquarters</span>
                <span>100 Technology Square, Suite 400<br />Boston, MA 02139 USA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="md:col-span-2 bg-white rounded-md border border-slate-200 p-8 shadow-2xs">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
              <h2 className="text-lg font-bold text-slate-900">Message Delivered</h2>
              <p className="text-xs text-slate-600 font-medium max-w-sm mx-auto">
                Thank you for contacting TrustCheck. A representative from our compliance desk will respond to <span className="font-bold text-slate-800">{email}</span> within 24 hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="px-4 py-2 rounded bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition cursor-pointer"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Inquiry Topic</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-blue-500 shadow-2xs"
                >
                  <option value="General Inquiry">General Consumer Inquiry</option>
                  <option value="Business Claim">Business Verification Claim Inquiry</option>
                  <option value="Report Dispute">Report Dispute / Moderation Appeal</option>
                  <option value="Press & Partnership">Press & Partnership Request</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Your Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@domain.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Message Details *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Explain your request or inquiry in detail..."
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-wider text-xs transition cursor-pointer"
                >
                  Submit Contact Form
                </button>
              </div>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
