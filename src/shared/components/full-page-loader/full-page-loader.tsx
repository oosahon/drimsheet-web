import animatedLogoImg from '@/shared/assets/animated-drimsheet.svg';
import type { FullPageLoaderProps } from './types';

export function FullPageLoader({ label }: Readonly<FullPageLoaderProps>) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-md"
    >
      <img
        className="animate-pulse-scale motion-reduce:animate-none"
        width={100}
        height={100}
        src={animatedLogoImg}
        alt=""
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
