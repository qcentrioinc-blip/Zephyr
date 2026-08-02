import { useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaPinterestP,
} from "react-icons/fa";
import { H3, P } from "../Global/Typography/Typo";

/** Free email domains rejected for B2B contact form */
const FREE_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "yahoo.co.in",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "protonmail.com",
  "proton.me",
  "aol.com",
  "gmx.com",
  "mail.com",
  "yandex.com",
  "zoho.com",
  "rediffmail.com",
];

function isCompanyEmail(email: string): boolean {
  const trimmed = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return false;
  const domain = trimmed.split("@")[1];
  if (!domain) return false;
  return !FREE_EMAIL_DOMAINS.includes(domain);
}

const addresses = {
  registered: {
    label: "Registered Office",
    lines: [
      "Zephyr Life Sciences",
      "#706, 3rd 'A' Cross, HRBR Layout, 1st Block",
      "Kalyan Nagar, Bangalore – 560043, Karnataka, India",
    ],
  },
  factory: {
    label: "Factory",
    lines: [
      "Plot #168-P5, Vemgal Industrial Area",
      "Kolar District, Karnataka, India",
    ],
  },
  spain: {
    label: "Sales — Spain",
    lines: [
      "C/Cami Reial 17, Planta 3, Despacho 5",
      "43700 El Vendrell, Tarragona, Spain",
    ],
  },
  usa: {
    label: "USA Office",
    lines: ["2525 US-130, Cranbury, NJ 08512"],
  },
};

const officeHours = "Monday – Saturday, 9:30 – 18:00";
const productionHours = "Monday – Saturday, 06:00 – 18:00";
const cin = "U24100KA2019PTC120330";

const Content = () => {
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: params.get("subject") ?? "",
    message: params.get("message") ?? "",
  });
  const [emailError, setEmailError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const locations = useMemo(
    () => [addresses.registered, addresses.factory, addresses.spain, addresses.usa],
    []
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isCompanyEmail(form.email)) {
      setEmailError(
        "Please use a company email address. Free domains (Gmail, Yahoo, Outlook, etc.) are not accepted."
      );
      return;
    }
    setEmailError("");
    // TODO: Wire backend email delivery + optional OTP verification for company domains.
    setSubmitted(true);
  };

  return (
    <div className="w-full bg-[#f5f5f5]">
      <div className="zephyr-container py-18">
        <div className="bg-white rounded-md shadow-sm p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <H3 className="mb-3">Ready to partner with Zephyr</H3>
            <P className="text-gray-500 mt-4">
              Interested in discussing manufacturing, MOQ, or private-label
              opportunities? Fill the form and our team will respond.
            </P>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1.5fr] gap-8">
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-8">
                  <H3 className="text-[#2f6b3a]">Enquiry received</H3>
                  <P className="mt-3 text-gray-700">
                    Thank you. Your partnership enquiry has been captured locally
                    for now. Email delivery and OTP confirmation will be wired
                    next.
                  </P>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-para font-normal text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        value={form.firstName}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, firstName: e.target.value }))
                        }
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-para font-normal text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        value={form.lastName}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, lastName: e.target.value }))
                        }
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-para font-normal text-gray-700 mb-2">
                      Company Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, email: e.target.value }));
                        if (emailError) setEmailError("");
                      }}
                      placeholder="name@yourcompany.com"
                      className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                    />
                    {emailError ? (
                      <p className="mt-2 text-sm text-red-600">{emailError}</p>
                    ) : (
                      <p className="mt-2 text-xs text-gray-500">
                        Business domains only — Gmail, Yahoo, Outlook and other free
                        mail providers are blocked.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-para font-normal text-gray-700 mb-2">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-para font-normal text-gray-700 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={form.subject}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, subject: e.target.value }))
                      }
                      className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-para font-normal text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, message: e.target.value }))
                      }
                      placeholder="Tell us about the product range, dosage format, estimated volumes / MOQ, and target markets."
                      className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-green-600 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#5e8d49] hover:bg-[#4f793d] font-para font-normal transition-all text-white text-sm font-semibold px-8 py-3 rounded-md"
                  >
                    SEND ENQUIRY
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-[#EDEFF6] rounded-lg p-6 space-y-7">
                {locations.map((loc) => (
                  <div key={loc.label}>
                    <p className="text-xs uppercase text-gray-400 mb-2 tracking-wide">
                      {loc.label}
                    </p>
                    {loc.lines.map((line) => (
                      <p key={line} className="text-sm text-gray-700 leading-7">
                        {line}
                      </p>
                    ))}
                  </div>
                ))}

                <div className="border-t border-gray-200 pt-5 space-y-2">
                  <p className="text-sm text-gray-700">
                    <strong>Office hours:</strong> {officeHours}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Production hours:</strong> {productionHours}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>CIN:</strong> {cin}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  {[FaTwitter, FaFacebookF, FaInstagram, FaYoutube, FaPinterestP].map(
                    (Icon, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-700 shadow-sm"
                      >
                        <Icon size={14} />
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="overflow-hidden rounded-lg">
                <img
                  src="/Production/ProductionsHeroLeft.png"
                  alt="Zephyr facility"
                  className="w-full h-[250px] sm:h-[300px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
