import { anonymousLaunchDarklyContext } from '@/_app/containers/launchdarkly/launchdarkly';
import { authService } from '@/auth/lib/services/auth.service';
import { observabilityService } from '@/shared/lib/services/observability.service';
import { useProfile } from '@/user/hooks/use-profile';
import { useLDClient, type LDContext } from '@launchdarkly/react-sdk';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function LaunchDarklyContextSynchronizerContainer() {
  const ldClient = useLDClient();
  const location = useLocation();
  const isAuthenticated = authService.isLoggedIn();
  const { data: profile } = useProfile({ enabled: isAuthenticated });

  useEffect(() => {
    const currentContext = ldClient.getContext();

    let nextContext: LDContext;

    if (!isAuthenticated) {
      if (
        currentContext &&
        'anonymous' in currentContext &&
        currentContext.anonymous === true
      ) {
        return;
      }

      nextContext = anonymousLaunchDarklyContext;
    } else {
      if (
        !profile ||
        (currentContext &&
          'key' in currentContext &&
          currentContext.key === profile.id &&
          'email' in currentContext &&
          currentContext.email === profile.email)
      ) {
        return;
      }

      nextContext = {
        kind: 'user',
        key: profile.id,
        email: profile.email,
        _meta: {
          privateAttributes: ['email'],
        },
      };
    }

    void ldClient.identify(nextContext).then((result) => {
      if (result.status === 'error') {
        observabilityService.report(result.error, {
          source: 'launchdarkly-context-synchronizer',
        });
      }
    });
  }, [isAuthenticated, ldClient, location.key, profile]);

  return null;
}
