import { Link } from "react-router-dom";
import { H3, P } from "./Typography/Typo";

type FooterLink = { name: string; url: string };

const ACCENT = "#11BB8A";
const STRIP_BORDER = "rgba(17, 187, 138, 0.35)";
const STRIP_BG = "rgba(17, 187, 139, 0.27)";

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

  const features = [
    { title: "Custom Formulations", desc: "Private label ready" },
    { title: "GMP & ISO Ready", desc: "Quality assured" },
    { title: "Global Partnerships", desc: "India · Spain · USA" },
    { title: "End-to-End CDMO", desc: "Idea to finished pack" },
  ];

  const linkColumns: { title: string; links: FooterLink[] }[] = [
    { title: "Products", links: productLinks },
    { title: "Company", links: companyLinks },
  ];

  return (
    <footer className="relative w-full overflow-hidden rounded-t-4xl pt-10 pb-6 text-white sm:pt-12">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, #113227 18%, #349877 100%)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-[35%]"
        style={{
          background: "linear-gradient(to left, rgba(0,0,0,.45), transparent)",
        }}
      />

      <img
        src="/flower.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-0 -bottom-4 h-full w-full select-none object-contain object-right-bottom opacity-4"
      />

      <div className="zephyr-container relative z-10">
        <div className="mb-7 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-10">
          {/* Brand */}
          <div className="flex flex-col items-center text-center sm:col-span-2 sm:items-start sm:text-left lg:col-span-1">
            <Link to="/" className="mb-3 inline-flex shrink-0 items-center">
              <img
                src="/Global/Logo.png"
                alt="Zephyr"
                className="h-12 w-auto object-contain sm:h-14 md:h-16"
              />
            </Link>
            <P className="max-w-[320px] text-sm text-white/70">
              Factory: Plot #168-P5, Vemgal Industrial Area, Kolar District,
              Karnataka, India
            </P>
          </div>

          {/* Products / Company */}
          {linkColumns.map((col) => (
            <div
              key={col.title}
              className="flex flex-col items-center text-center sm:items-start sm:text-left"
            >
              <H3
                className="mb-2 !text-[16px] md:!text-[20px] lg:!text-[24px]"
                style={{ color: ACCENT }}
              >
                {col.title}
              </H3>
              <ul className="m-0 list-none space-y-2 p-0 sm:space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.name} className="m-0 p-0">
                    <Link
                      to={link.url}
                      className="inline-block text-[13px] font-normal text-white/90 transition-colors duration-300 hover:text-[#11BB8A] sm:text-[15px] lg:text-[16px]"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="my-10 overflow-hidden rounded-2xl px-3 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md md:rounded-[18px] md:px-5 md:py-5 md:shadow-none md:backdrop-blur-sm"
          style={{
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: STRIP_BORDER,
            background: `linear-gradient(to bottom, ${STRIP_BG}, rgba(255,255,255,0.03))`,
          }}
        >
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:place-items-center md:gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex flex-col items-center gap-2 rounded-xl px-2 py-2.5 text-center md:max-w-[220px] md:flex-row md:gap-3 md:rounded-none md:px-0 md:py-0 md:text-left"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center md:h-12 md:w-12 md:bg-transparent">
                  <img
                    src="/Global/LeafIcon.png"
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <P className="!text-[11px] leading-snug text-white sm:!text-[12px] md:!text-base md:leading-tight">
                    {f.title}
                  </P>
                  <P className="mt-0.5 !text-[10px] text-white/65 sm:!text-[11px] md:!text-sm">
                    {f.desc}
                  </P>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 pt-1 md:flex-row">
          <P className="font-para tracking-normal text-white/70">
            © {new Date().getFullYear()} Zephyr. All rights reserved.
          </P>
        </div>
      </div>
    </footer>
  );
};

export default NewFooter;
