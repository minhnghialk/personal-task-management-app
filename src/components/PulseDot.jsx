export const PulseDot = () => {
  return (
    <div className="relative w-4 h-4">
      {/* Dot cố định */}
      <span className="absolute inset-0 rounded-full bg-white"></span>
      {/* Dot pulse */}
      <span className="absolute inset-0 rounded-full bg-white animate-ping"></span>
    </div>
  );
};
