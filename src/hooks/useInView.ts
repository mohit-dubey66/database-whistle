import { useEffect, useRef, useState } from 'react';


// Export a custom hook called `useInView`
// `options` is for configuring the IntersectionObserver, and `enableSmoothScroll` enables optional smooth scrolling
export function useInView(options = {},  enableSmoothScroll = false) {
  // State to track if the observed element is currently visible in the viewport
  const [isInView, setIsInView] = useState(false);

  // State to track if the observed element has ever been visible in the viewport
  const [hasBeenViewed, setHasBeenViewed] = useState(false);

  // Reference to the HTML element that will be observed
  const elementRef = useRef<HTMLElement | null>(null);

  // To handle the setup and cleanup of the IntersectionObserver
  useEffect(() => {
    // Get the current DOM element from the ref
    const element = elementRef.current;

    // Exit early if no element is attached to the ref
    if (!element) return;

    // Create a new IntersectionObserver instance
    const observer = new IntersectionObserver(([entry]) => {
      const isVisible = entry.isIntersecting; // `entry.isIntersecting` indicates whether the element is visible in the viewport
      setIsInView(isVisible); // Update the `isInView` state based on visibility
      
      // If the element becomes visible and hasn't been viewed before
      if (isVisible && !hasBeenViewed) {
        setHasBeenViewed(true);// Update the `hasBeenViewed` state to true

        // If smooth scrolling is enabled, scroll the element into view with animation
        if (enableSmoothScroll) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, options); // Pass the provided options to the IntersectionObserver

    // Start observing the element attached to `elementRef`
    observer.observe(element);

    // Cleanup function to disconnect the observer when the component unmounts or dependencies change
    return () => {
      observer.disconnect();
    };
  }, [options, hasBeenViewed, enableSmoothScroll]); // Dependencies for the effect: re-run if `options`, `hasBeenViewed`, or `enableSmoothScroll` changes

  // Return the `elementRef` for attaching to the element, and the state v
  return { elementRef, isInView, hasBeenViewed };
}