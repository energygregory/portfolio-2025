import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AnimatedLogo from "./AnimatedLogo";
import Dither from "./Dither";

export default function Footer() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

  const MODAL_CONTENT = {
    policy: {
      title: "POLICY/WORKING TERMS",
      content: (
        <>
          <p>
            1. PAYMENT TERMS: A 50% deposit is required before work commences.
            This deposit is non-refundable once design work has begun. The
            remaining balance is due upon project completion before final file
            delivery.
          </p>
          <p>
            2. REVISIONS: 4 rounds of revisions are included in the quoted
            price. Additional revisions will incur an extra charge.
          </p>
          <p>
            3. TIMELINE: Project timelines are estimates. Delays in client
            feedback may affect delivery dates.
          </p>
          <p>
            4. OWNERSHIP: Final designs become client property upon full
            payment. I retain the right to display the work in my portfolio.
          </p>
        </>
      ),
    },
    privacy: {
      title: "PRIVACY POLICY",
      content: (
        <>
          <p>
            1. DATA COLLECTION: We collect personal information you provide
            directly to us, such as when you fill out a contact form.
          </p>
          <p>
            2. USE OF INFORMATION: We use the information we collect to
            communicate with you, provide services, and improve our website.
          </p>
          <p>
            3. DATA PROTECTION: We implement reasonable security measures to
            protect your personal information.
          </p>
        </>
      ),
    },
    terms: {
      title: "TERMS OF USE",
      content: (
        <>
          <p>
            1. ACCEPTANCE: By accessing this website, you agree to be bound by
            these Terms of Use.
          </p>
          <p>
            2. INTELLECTUAL PROPERTY: All content on this site is the property
            of Greg and protected by copyright laws.
          </p>
          <p>
            3. LIMITATION OF LIABILITY: We are not liable for any damages
            arising from the use of this website.
          </p>
        </>
      ),
    },
    legal: {
      title: "LEGAL",
      content: (
        <>
          <p>This website is operated by Greg. All rights reserved.</p>
          <p>
            For legal inquiries, please contact us directly through the contact
            form.
          </p>
        </>
      ),
    },
    ratecard: {
      title: "RATE CARD",
      content: (
        <div className="flex flex-col items-center justify-center py-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-24 h-24 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      ),
    },
  };

  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.classList.contains("theme-light")
        ? "light"
        : "dark";
      setIsDark(theme === "dark");
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!name || !email || !message) {
      setSubmitStatus("Please fill in all fields");
      setTimeout(() => setSubmitStatus(""), 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("");

    try {
      const { default: emailjs } = await import("@emailjs/browser");

      // EmailJS configuration
      const serviceID = "service_clnatbs";
      const templateID = "template_l8e5iwg";
      const publicKey = "qeNUbwHcQWXZdkquR";

      const templateParams = {
        from_name: name,
        from_email: email,
        message: message,
        to_email: "gregory.gfx1@gmail.com",
      };

      await emailjs.send(serviceID, templateID, templateParams, publicKey);
      setSubmitStatus("Message sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setSubmitStatus(""), 5000);
    } catch (error) {
      console.error("EmailJS Error:", error);
      setSubmitStatus("Failed to send message. Please try again.");
      setTimeout(() => setSubmitStatus(""), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer
      className={`${
        isDark ? "bg-[#2a2a2a] text-white" : "bg-gray-100 text-black"
      } w-full relative z-[20] overflow-hidden pb-0 border-t-0 text-no-resize`}
      style={{
        fontFamily:
          "'PT Mono', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        fontWeight: isDark ? 800 : 950,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        fontSize: '16px'
      }}
    >
      {/* Dither Background */}
      <div className="absolute inset-0">
        <Dither
          waveColor={isDark ? [0.3, 0.3, 0.3] : [1.0, 1.0, 1.0]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={isDark ? 4 : 2}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.05}
          bias={isDark ? 0.2 : -0.4}
        />
      </div>
      <div className={`absolute inset-0 ${isDark ? "bg-black/70" : "bg-white/90"}`} />

      {/* Content */}
      <div className="w-full lg:max-w-7xl lg:mx-auto lg:px-6 py-4 relative z-10 box-border">
        {/* Mobile Compact Layout - FIX: Reduced Padding to close Green Gap */}
        <div className="lg:hidden py-[2px] pb-[safe-area-inset-bottom] w-full">
          <div className="flex items-center justify-between gap-4 px-4">
            {/* Logo */}
            <AnimatedLogo className="w-24" />
            
            {/* Commission Button */}
            <button
              onClick={() => setActiveModal("commission")}
              className={`text-[10px] font-semibold px-3 py-1.5 border transition-colors ${
                isDark
                  ? "border-white/50 hover:bg-white hover:text-black"
                  : "border-black/50 hover:bg-black hover:text-white"
              }`}
            >
              COMMISSIONS OPEN
            </button>
          </div>
          
          {/* Resources & Legal links */}
          <div className="flex justify-center gap-4 mt-3">
            <button
              onClick={() => navigate('/pricelist')}
              className={`text-[9px] ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"} transition-colors`}
            >
              RATE CARD
            </button>
            <span className={`text-[9px] ${isDark ? "text-gray-600" : "text-gray-400"}`}>•</span>
            <button
              onClick={() => setActiveModal("policy")}
              className={`text-[9px] ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"} transition-colors`}
            >
              POLICY
            </button>
            <span className={`text-[9px] ${isDark ? "text-gray-600" : "text-gray-400"}`}>•</span>
            <button
              onClick={() => setActiveModal("privacy")}
              className={`text-[9px] ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"} transition-colors`}
            >
              PRIVACY
            </button>
            <span className={`text-[9px] ${isDark ? "text-gray-600" : "text-gray-400"}`}>•</span>
            <button
              onClick={() => setActiveModal("legal")}
              className={`text-[9px] ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"} transition-colors`}
            >
              LEGAL
            </button>
          </div>
          
          {/* Bottom text */}
          <div
            className={`text-center text-[9px] mt-3 ${
              isDark ? "text-gray-500" : "text-gray-500"
            }`}
          >
            <p>© 2026 DESIGNED BY GREG</p>
          </div>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden lg:grid grid-cols-4 gap-16 mb-4">
          {/* Logo Section */}
          <div className="flex items-start">
            <AnimatedLogo className="w-48" />
          </div>

          {/* Open For Collabs Section */}
          <div>
            <h3 className="text-base font-semibold mb-0">COMMISSIONS OPEN</h3>
            <p className="text-[10px] mb-1">and open for collabs</p>
            <form onSubmit={handleSubscribe} className="space-y-0.5">
              <div className="flex gap-1">
                <input
                  type="text"
                  placeholder="NAME"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  className={`w-1/2 px-2 py-0.5 text-xs rounded-none border focus:outline-none transition-colors placeholder:opacity-50 disabled:opacity-50 ${
                    isDark
                      ? "bg-transparent border-white/40 text-white placeholder:text-gray-400 focus:border-white focus:bg-white/5"
                      : "bg-transparent border-black/40 text-black placeholder:text-gray-500 focus:border-black focus:bg-black/5"
                  }`}
                />
                <input
                  type="email"
                  placeholder="EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className={`w-1/2 px-2 py-0.5 text-xs rounded-none border focus:outline-none transition-colors placeholder:opacity-50 disabled:opacity-50 ${
                    isDark
                      ? "bg-transparent border-white/40 text-white placeholder:text-gray-400 focus:border-white focus:bg-white/5"
                      : "bg-transparent border-black/40 text-black placeholder:text-gray-500 focus:border-black focus:bg-black/5"
                  }`}
                />
              </div>
              <textarea
                placeholder="MESSAGE"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="1"
                disabled={isSubmitting}
                className={`w-full px-2 py-0.5 text-xs rounded-none border focus:outline-none resize-none transition-colors placeholder:opacity-50 disabled:opacity-50 ${
                  isDark
                    ? "bg-transparent border-white/40 text-white placeholder:text-gray-400 focus:border-white focus:bg-white/5"
                    : "bg-transparent border-black/40 text-black placeholder:text-gray-500 focus:border-black focus:bg-black/5"
                }`}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-2 py-0.5 text-xs bg-transparent border rounded-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark
                    ? "border-white text-white hover:bg-white hover:text-black"
                    : "border-black text-black hover:bg-black hover:text-white"
                }`}
              >
                {isSubmitting ? "SENDING..." : "SUBMIT"}
              </button>
              {submitStatus && (
                <p
                  className={`text-xs text-center ${
                    submitStatus.includes("success")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {submitStatus}
                </p>
              )}
            </form>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="text-base font-semibold mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate('/pricelist')}
                  className={`text-left ${
                    isDark
                      ? "text-gray-300 hover:text-white transition-colors"
                      : "text-gray-600 hover:text-black transition-colors"
                  }`}
                >
                  RATE CARD
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal("policy")}
                  className={`text-left ${
                    isDark
                      ? "text-gray-300 hover:text-white transition-colors"
                      : "text-gray-600 hover:text-black transition-colors"
                  }`}
                >
                  POLICY/WORKING TERMS
                </button>
              </li>
            </ul>
            {/* Social Media Icons */}
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://www.behance.net/grega"
                target="_blank"
                rel="noopener noreferrer"
                className={
                  isDark
                    ? "hover:text-white transition-colors"
                    : "hover:text-black transition-colors"
                }
                aria-label="Behance"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/0021.studio"
                target="_blank"
                rel="noopener noreferrer"
                className={
                  isDark
                    ? "hover:text-white transition-colors"
                    : "hover:text-black transition-colors"
                }
                aria-label="Instagram"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-base font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setActiveModal("privacy")}
                  className={`text-left ${
                    isDark
                      ? "text-gray-300 hover:text-white transition-colors"
                      : "text-gray-600 hover:text-black transition-colors"
                  }`}
                >
                  PRIVACY POLICY
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal("terms")}
                  className={`text-left ${
                    isDark
                      ? "text-gray-300 hover:text-white transition-colors"
                      : "text-gray-600 hover:text-black transition-colors"
                  }`}
                >
                  TERMS OF USE
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal("legal")}
                  className={`text-left ${
                    isDark
                      ? "text-gray-300 hover:text-white transition-colors"
                      : "text-gray-600 hover:text-black transition-colors"
                  }`}
                >
                  LEGAL
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Desktop Bottom Bar */}
        <div
          className={`hidden lg:block border-t pt-4 ${
            isDark ? "border-gray-600" : "border-gray-400"
          }`}
        >
          <div
            className={`flex justify-between items-center text-sm ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <p>DESIGNED BY GREG</p>
            <p>© 2026 All Rights Reserved</p>
          </div>
        </div>
      </div>

      {/* Policy Modal */}
      {activeModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setActiveModal(null)}
        >
          <div
            className={`relative max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto rounded-lg p-8 ${
              isDark ? "bg-[#1a1a1a] text-white" : "bg-white text-black"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-2xl font-bold hover:opacity-70"
              aria-label="Close"
            >
              ×
            </button>
            
            {activeModal === "commission" ? (
              <>
                <h2 className="text-2xl font-bold mb-2 font-mono">COMMISSIONS OPEN</h2>
                <p className="text-xs opacity-70 mb-4">and open for collabs</p>
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 text-sm rounded focus:outline-none focus:ring-2 placeholder:opacity-50 bg-white text-black focus:ring-gray-400 disabled:opacity-50"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 text-sm rounded focus:outline-none focus:ring-2 placeholder:opacity-50 bg-white text-black focus:ring-gray-400 disabled:opacity-50"
                  />
                  <textarea
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="3"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 text-sm rounded focus:outline-none focus:ring-2 resize-none placeholder:opacity-50 bg-white text-black focus:ring-gray-400 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 text-sm bg-white text-black border border-black rounded hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "SENDING..." : "SUBMIT"}
                  </button>
                  {submitStatus && (
                    <p
                      className={`text-xs text-center ${
                        submitStatus.includes("success")
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {submitStatus}
                    </p>
                  )}
                </form>
              </>
            ) : MODAL_CONTENT[activeModal] ? (
              <>
                <h2 className="text-2xl font-bold mb-4 font-mono">
                  {MODAL_CONTENT[activeModal].title}
                </h2>
                <div className="space-y-4 text-sm leading-relaxed font-mono uppercase">
                  {MODAL_CONTENT[activeModal].content}
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </footer>
  );
}
