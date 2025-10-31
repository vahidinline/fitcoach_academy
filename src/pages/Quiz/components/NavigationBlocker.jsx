import { useEffect } from 'react';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';
import { useContext } from 'react';

export function useNavigationBlocker(shouldBlock, message) {
  const navigator = useContext(NavigationContext).navigator;

  useEffect(() => {
    if (!shouldBlock) return;

    const push = navigator.push;

    navigator.push = (...args) => {
      if (window.confirm(message)) {
        navigator.push = push; // restore default
        push(...args);
      }
    };

    return () => {
      navigator.push = push;
    };
  }, [navigator, shouldBlock, message]);
}
