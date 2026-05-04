import animatedLogoImg from '@/shared/assets/animated-purple-ledger.svg';

export function FullPageLoader() {
  return (
    <div className="flex h-screen items-center justify-center fixed inset-0 z-50 backdrop-blur-md bg-background/50">
      <img
        className="animate-pulse-scale"
        width={100}
        height={100}
        src={animatedLogoImg}
        alt="Purple Ledger"
      />
    </div>
  );
}
