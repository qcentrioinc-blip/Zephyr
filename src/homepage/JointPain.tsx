const JointPain = () => {
  return (
    <div className="mb-10 text-center md:mb-14">
      <p
        className="mb-4 flex items-center justify-center gap-3 font-manrope text-[11px] font-medium uppercase text-[#7a827d] sm:text-xs"
        style={{ letterSpacing: "0.36em", fontFamily: "Manrope, sans-serif" }}
      >
        <span className="h-px w-5 bg-current sm:w-7" aria-hidden="true" />
        Contract manufacturing partner
        <span className="h-px w-5 bg-current sm:w-7" aria-hidden="true" />
      </p>
      <h2 className="mx-auto max-w-4xl font-manrope text-[clamp(28px,2.8vw,42px)] font-semibold leading-[1.2] tracking-[-0.02em] text-[#1a1f1c]">
        From formulation to market,{" "}
        <br className="hidden sm:block" />
        a trusted partner for{" "}
        <span className="relative inline-block text-[#11BB8A]">
          healthier
          <svg
            aria-hidden="true"
            viewBox="0 0 120 12"
            className="pointer-events-none absolute -bottom-[0.18em] left-0 h-[0.42em] w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M1 4.2C22 8.8 48 10.2 64 9.2 86 7.8 104 5.4 119 3.6 104 7.2 84 10.6 62 11.2 40 11.8 18 9.4 1 4.2Z"
              fill="currentColor"
            />
          </svg>
        </span>{" "}
        Products
      </h2>
    </div>
  );
};

export default JointPain;
