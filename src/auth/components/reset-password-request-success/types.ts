export interface RequestPasswordResetSuccessProps {
  countdown: number;
  loading: boolean;
  onRetry: () => void;
  signInHref?: string;
}

export interface RequestPasswordResetSuccessContainerProps {
  onRetry: () => void | Promise<void>;
  loading: boolean;
  signInHref?: string;
}
