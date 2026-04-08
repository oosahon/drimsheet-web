export default function FullPageLoader() {
  return (
    <div className="flex h-screen items-center justify-center fixed inset-0 z-50 backdrop-blur-md bg-background/50">
      <img
        className="animate-pulse-scale"
        width={100}
        height={100}
        src="/animated-purple-ledger.svg"
        alt="Purple Ledger"
      />
    </div>
  );
}
