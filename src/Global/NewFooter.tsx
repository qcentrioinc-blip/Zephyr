import { Link } from "react-router-dom";
import {
  ArrowRight,
  FlaskConical,
  Globe2,
  Package,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { H3, P } from "./Typography/Typo";

type FooterLink = { name: string; url: string };

const ACCENT = "#11BB8A";
const STRIP_BORDER = "rgba(17, 187, 138, 0.35)";
const STRIP_BG = "rgba(17, 187, 139, 0.27)";

type Feature = {
  title: string;
  desc: string;
  Icon: LucideIcon;
};

const features: Feature[] = [
  {
    title: "Custom Formulations",
    desc: "Private label ready",
    Icon: FlaskConical,
  },
  {
    title: "cGMP & ISO Systems",
    desc: "Quality assured",
    Icon: ShieldCheck,
  },
  {
    title: "Global Partnerships",
    desc: "India · Spain · USA",
    Icon: Globe2,
  },
  {
    title: "End-to-End CDMO",
    desc: "Idea to finished goods",
    Icon: Package,
  },
];

const NewFooter = () => {
  const productLinks: FooterLink[] = [
    { name: "Herbaceutical", url: "/herbaceutical" },
    { name: "Nutraceutical", url: "/nutraceutical" },
    { name: "Organic", url: "/organic" },
  ];

  const companyLinks: FooterLink[] = [
    { name: "R & D", url: "/research" },
    { name: "Production", url: "/production" },
    { name: "Gallery", url: "/gallery" },
  ];

  return (
    <footer className="relative w-full overflow-hidden rounded-t-4xl pt-11 pb-7 text-white sm:pt-12 sm:pb-8">
      <div className="absolute inset-0 bg-[#113227]" />

      <img
        src="/flower.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-0 -bottom-4 h-full w-full select-none object-contain object-right-bottom opacity-4"
      />

      <div className="zephyr-container relative z-10">
        <div className="mb-8 grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-[1.4fr_1fr_1fr_1.15fr] lg:gap-8">
          <div className="col-span-2 flex flex-col items-center text-center sm:items-start sm:text-left lg:col-span-1">
            <Link to="/" className="mb-3 inline-flex shrink-0 items-center">
              <img
                src="/Global/Logo.png"
                alt="Zephyr"
                className="h-12 w-auto object-contain sm:h-14 md:h-16"
              />
            </Link>
            {/* <P className="max-w-[320px] text-sm text-white/70">
              Contract manufacturing and private label partner for dietary
              supplements across nutraceutical, herbaceutical, and organic
              ranges. Built for US brand owners who need formulation support and
              reliable finished goods supply.
            </P> */}
            <P className="mt-3 max-w-[320px] text-sm text-white/55">
              Factory: Plot #168-P5, Vemgal Industrial Area, Kolar District,
              Karnataka, India
            </P>
          </div>

          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <H3
              className="mb-2 !text-[16px] md:!text-[18px] lg:!text-[20px]"
              style={{ color: ACCENT }}
            >
              Products
            </H3>
            <ul className="m-0 list-none space-y-2 p-0">
              {productLinks.map((link) => (
                <li key={link.name} className="m-0 p-0">
                  <Link
                    to={link.url}
                    className="inline-block text-[13px] text-white/90 transition-colors hover:text-[#11BB8A] sm:text-[15px]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <H3
              className="mb-2 !text-[16px] md:!text-[18px] lg:!text-[20px]"
              style={{ color: ACCENT }}
            >
              Company
            </H3>
            <ul className="m-0 list-none space-y-2 p-0">
              {companyLinks.map((link) => (
                <li key={link.name} className="m-0 p-0">
                  <Link
                    to={link.url}
                    className="inline-block text-[13px] text-white/90 transition-colors hover:text-[#11BB8A] sm:text-[15px]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-5 text-center sm:items-start sm:text-left lg:col-span-1">
            <H3 className="mb-2 !text-[16px] text-white md:!text-[18px]">
              Ready to manufacture with Zephyr?
            </H3>
            {/* <P className="mb-4 text-white/70">
              Share your formula brief, dosage form, and MOQ targets. Our team
              supports US private label and contract manufacturing enquiries.
            </P> */}
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-[#11BB8A] px-5 py-2.5 text-sm font-semibold text-[#113227] transition hover:bg-[#14d09a]"
            >
              Enquire / MOQ
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        <div
          className="mb-7 overflow-hidden rounded-2xl px-3 py-4 md:px-5 md:py-5"
          style={{
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: STRIP_BORDER,
            background: STRIP_BG,
          }}
        >
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:place-items-center md:gap-6">
            {features.map(({ title, desc, Icon }) => (
              <div
                key={title}
                className="flex flex-col items-center gap-2 px-2 py-2 text-center md:max-w-[220px] md:flex-row md:gap-3 md:text-left"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center text-[#11BB8A] md:h-11 md:w-11">
                  <Icon className="h-full w-full" strokeWidth={1.6} aria-hidden />
                </div>
                <div>
                  <P className="!text-[11px] text-white sm:!text-[12px] md:!text-sm">
                    {title}
                  </P>
                  <P className="mt-0.5 !text-[10px] text-white/65 sm:!text-[11px]">
                    {desc}
                  </P>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-2 pt-1 md:flex-row">
          <P className="font-para tracking-normal text-white/70">
            © {new Date().getFullYear()} Zephyr. All rights reserved.
          </P>
          <P className="text-white/50">
            B2B manufacturing partner · Nutraceutical · Herbaceutical · Organic
          </P>
        </div>
      </div>
    </footer>
  );
};

export default NewFooter;
