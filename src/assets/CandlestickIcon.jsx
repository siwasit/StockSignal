const CandlestickIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-8 h-8 text-white"
    {...props}
  >
    {/* แท่งเทียน 3 แท่ง */}
    <rect x="4" y="6" width="2" height="12" />
    <rect x="10" y="10" width="2" height="8" />
    <rect x="16" y="4" width="2" height="14" />
    {/* เส้นบน-ล่างแท่งเทียน */}
    <line x1="5" y1="4" x2="5" y2="6" />
    <line x1="5" y1="18" x2="5" y2="20" />
    <line x1="11" y1="8" x2="11" y2="10" />
    <line x1="11" y1="18" x2="11" y2="20" />
    <line x1="17" y1="2" x2="17" y2="4" />
    <line x1="17" y1="18" x2="17" y2="20" />
  </svg>
);

export default CandlestickIcon;
