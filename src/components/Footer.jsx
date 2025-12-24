import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import AnimatedLogo from "./AnimatedLogo";
import Dither from "./Dither";

export default function Footer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

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

  const handleSubscribe = (e) => {
    e.preventDefault();

    // Validate fields
    if (!name || !email || !message) {
      setSubmitStatus("Please fill in all fields");
      setTimeout(() => setSubmitStatus(""), 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("");

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

    emailjs
      .send(serviceID, templateID, templateParams, publicKey)
      .then(() => {
        setSubmitStatus("Message sent successfully!");
        setName("");
        setEmail("");
        setMessage("");
        setTimeout(() => setSubmitStatus(""), 5000);
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        setSubmitStatus("Failed to send message. Please try again.");
        setTimeout(() => setSubmitStatus(""), 5000);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <footer
      className={`${
        isDark ? "bg-[#2a2a2a] text-white" : "bg-gray-100 text-black"
      } mt-auto relative overflow-hidden`}
      style={{
        fontFamily:
          "'PT Mono', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}
    >
      {/* Dither Background */}
      <div className="absolute inset-0">
        <Dither
          waveColor={isDark ? [0.3, 0.3, 0.3] : [0.9, 0.9, 0.9]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.05}
          bias={isDark ? 0.2 : 0}
        />
      </div>
      <div className={`absolute inset-0 ${isDark ? "bg-black/70" : ""}`} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Mobile Accordion Layout */}
        <div className="lg:hidden">
          <div className="flex gap-4 mb-4">
            {/* Logo - Small, on the side */}
            <div className="flex-shrink-0 pt-2">
              <AnimatedLogo className="w-28" />
            </div>

            {/* Collapsible Sections */}
            <div className="flex-1 space-y-4">
              {/* Commissions - Collapsible */}
              <div
                className={`border rounded-lg overflow-hidden ${
                  isDark ? "border-white/30" : "border-black/30"
                }`}
              >
                <button
                  onClick={() =>
                    setActiveSection(
                      activeSection === "commissions" ? null : "commissions"
                    )
                  }
                  className="w-full px-3 py-2 flex justify-between items-center text-left"
                >
                  <span className="text-xs font-semibold">
                    COMMISSIONS OPEN
                  </span>
                  <span className="text-lg">
                    {activeSection === "commissions" ? "−" : "+"}
                  </span>
                </button>
                {activeSection === "commissions" && (
                  <div
                    className="px-3 pb-3 border-t pt-3"
                    style={{
                      borderColor: isDark
                        ? "rgba(255,255,255,0.3)"
                        : "rgba(0,0,0,0.3)",
                    }}
                  >
                    <p className="text-[10px] mb-2">and open for collabs</p>
                    <form onSubmit={handleSubscribe} className="space-y-1.5">
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
                        rows="2"
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 text-sm rounded focus:outline-none focus:ring-2 resize-none placeholder:opacity-50 bg-white text-black focus:ring-gray-400 disabled:opacity-50"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full px-3 py-2 text-sm bg-transparent border rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          isDark
                            ? "border-white text-white hover:bg-white hover:text-black"
                            : "border-black text-black hover:bg-black hover:text-white"
                        }`}
                      >
                        {isSubmitting ? "SENDING..." : "SUBMIT"}
                      </button>
                      {submitStatus && (
                        <p
                          className={`text-[10px] text-center ${
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
                )}
              </div>

              {/* Resources - Collapsible */}
              <div
                className={`border rounded-lg overflow-hidden ${
                  isDark ? "border-white/30" : "border-black/30"
                }`}
              >
                <button
                  onClick={() =>
                    setActiveSection(
                      activeSection === "resources" ? null : "resources"
                    )
                  }
                  className="w-full px-3 py-2 flex justify-between items-center text-left"
                >
                  <span className="text-xs font-semibold">RESOURCES</span>
                  <span className="text-lg">
                    {activeSection === "resources" ? "−" : "+"}
                  </span>
                </button>
                {activeSection === "resources" && (
                  <div
                    className="px-3 pb-3 border-t pt-3"
                    style={{
                      borderColor: isDark
                        ? "rgba(255,255,255,0.3)"
                        : "rgba(0,0,0,0.3)",
                    }}
                  >
                    <ul className="space-y-1.5 text-xs mb-3">
                      <li>
                        <Link
                          to="/pricelist"
                          className={
                            isDark
                              ? "text-gray-300 hover:text-white transition-colors"
                              : "text-gray-600 hover:text-black transition-colors"
                          }
                        >
                          Rate Card
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={() => setShowPolicyModal(true)}
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
                    <div className="flex items-center gap-3">
                      <a
                        href="https://www.behance.net"
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
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
                        </svg>
                      </a>
                      <a
                        href="https://www.instagram.com"
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
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Legal - Collapsible */}
              <div
                className={`border rounded-lg overflow-hidden ${
                  isDark ? "border-white/30" : "border-black/30"
                }`}
              >
                <button
                  onClick={() =>
                    setActiveSection(activeSection === "legal" ? null : "legal")
                  }
                  className="w-full px-3 py-2 flex justify-between items-center text-left"
                >
                  <span className="text-xs font-semibold">LEGAL</span>
                  <span className="text-lg">
                    {activeSection === "legal" ? "−" : "+"}
                  </span>
                </button>
                {activeSection === "legal" && (
                  <div
                    className="px-3 pb-3 border-t pt-3"
                    style={{
                      borderColor: isDark
                        ? "rgba(255,255,255,0.3)"
                        : "rgba(0,0,0,0.3)",
                    }}
                  >
                    <ul className="space-y-1.5 text-xs">
                      <li>
                        <Link
                          to="/privacy"
                          className={
                            isDark
                              ? "text-gray-300 hover:text-white transition-colors"
                              : "text-gray-600 hover:text-black transition-colors"
                          }
                        >
                          Privacy Policy
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/terms"
                          className={
                            isDark
                              ? "text-gray-300 hover:text-white transition-colors"
                              : "text-gray-600 hover:text-black transition-colors"
                          }
                        >
                          Terms of Use
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/legal"
                          className={
                            isDark
                              ? "text-gray-300 hover:text-white transition-colors"
                              : "text-gray-600 hover:text-black transition-colors"
                          }
                        >
                          Legal
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Bottom Bar */}
          <div
            className={`border-t pt-4 mt-4 ${
              isDark ? "border-gray-600" : "border-gray-400"
            }`}
          >
            <div
              className={`text-center text-xs space-y-1 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <p>DESIGNED BY GREG</p>
              <p>© 2026 All Rights Reserved</p>
            </div>
          </div>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden lg:grid grid-cols-4 gap-8 mb-8">
          {/* Logo Section */}
          <div className="flex items-start">
            <AnimatedLogo className="w-80" />
          </div>

          {/* Open For Collabs Section */}
          <div>
            <h3 className="text-lg font-semibold mb-1">COMMISSIONS OPEN</h3>
            <p className="text-xs mb-4">and open for collabs</p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className={`w-full px-4 py-2 rounded focus:outline-none focus:ring-2 placeholder:opacity-50 disabled:opacity-50 ${
                  isDark
                    ? "bg-white text-black focus:ring-gray-400"
                    : "bg-white text-black focus:ring-gray-400"
                }`}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className={`w-full px-4 py-2 rounded focus:outline-none focus:ring-2 placeholder:opacity-50 disabled:opacity-50 ${
                  isDark
                    ? "bg-white text-black focus:ring-gray-400"
                    : "bg-white text-black focus:ring-gray-400"
                }`}
              />
              <textarea
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="3"
                disabled={isSubmitting}
                className={`w-full px-4 py-2 rounded focus:outline-none focus:ring-2 resize-none placeholder:opacity-50 disabled:opacity-50 ${
                  isDark
                    ? "bg-white text-black focus:ring-gray-400"
                    : "bg-white text-black focus:ring-gray-400"
                }`}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-4 py-2 bg-transparent border rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
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
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/pricelist"
                  className={
                    isDark
                      ? "text-gray-300 hover:text-white transition-colors"
                      : "text-gray-600 hover:text-black transition-colors"
                  }
                >
                  Rate Card
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setShowPolicyModal(true)}
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
                href="https://www.behance.net"
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
                href="https://www.instagram.com"
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
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/privacy"
                  className={
                    isDark
                      ? "text-gray-300 hover:text-white transition-colors"
                      : "text-gray-600 hover:text-black transition-colors"
                  }
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className={
                    isDark
                      ? "text-gray-300 hover:text-white transition-colors"
                      : "text-gray-600 hover:text-black transition-colors"
                  }
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  to="/legal"
                  className={
                    isDark
                      ? "text-gray-300 hover:text-white transition-colors"
                      : "text-gray-600 hover:text-black transition-colors"
                  }
                >
                  Legal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Desktop Bottom Bar */}
        <div
          className={`hidden lg:block border-t pt-6 ${
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
      {showPolicyModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowPolicyModal(false)}
        >
          <div
            className={`relative max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto rounded-lg p-8 ${
              isDark ? "bg-[#1a1a1a] text-white" : "bg-white text-black"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPolicyModal(false)}
              className="absolute top-4 right-4 text-2xl font-bold hover:opacity-70"
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4">POLICY/WORKING TERMS</h2>
            <div className="space-y-4 text-sm leading-relaxed">
              <p>
                This is our policy document. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua.
              </p>
              <p>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur.
              </p>
              <p>
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
