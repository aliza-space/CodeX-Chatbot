import { useEffect, useRef } from "react";

/**
 * Custom hook to handle mobile back button & swipe-to-go-back gesture for modals.
 * When `isOpen` is true, pushes a synthetic history state.
 * Swiping back or pressing phone back button closes the modal without exiting the application.
 */
export function useModalBackHandler(isOpen, onClose) {
  const isPushedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    // Push synthetic history state for modal back interception
    window.history.pushState({ modalOpen: true }, "");
    isPushedRef.current = true;

    const handlePopState = (e) => {
      isPushedRef.current = false;
      if (onClose) {
        onClose();
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      // If closed programmatically (e.g. clicking X or backdrop), revert pushed history state
      if (isPushedRef.current && window.history.state?.modalOpen) {
        isPushedRef.current = false;
        window.history.back();
      }
    };
  }, [isOpen, onClose]);
}
