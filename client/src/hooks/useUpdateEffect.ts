import * as React from 'react';

export default function useUpdatedEffect(effect: React.EffectCallback, dependencies?: React.DependencyList) {
  const isInitMount = React.useRef(true);

  React.useEffect(() => {
    if (isInitMount.current) {
      isInitMount.current = false;
    } else {
      effect();
    }
  }, dependencies);
}
