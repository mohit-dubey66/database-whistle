import { useState, useEffect } from 'react';

const VIEW_THROTTLE_TIME = 60000; // 1 minute in milliseconds

export function useViewThrottle(storyId: string): boolean {
  const [canView, setCanView] = useState(false);

  useEffect(() => {
    const lastViewKey = `story_${storyId}_last_view`;
    const lastViewTime = localStorage.getItem(lastViewKey);
    const currentTime = Date.now();

    // Initial check
    if (!lastViewTime) {
      localStorage.setItem(lastViewKey, currentTime.toString());
      setCanView(true);
      return;
    }

    const timeSinceLastView = currentTime - parseInt(lastViewTime);
    
    if (timeSinceLastView >= VIEW_THROTTLE_TIME) {
      localStorage.setItem(lastViewKey, currentTime.toString());
      setCanView(true);
    } else {
      // Calculate remaining time until next view
      const remainingTime = VIEW_THROTTLE_TIME - timeSinceLastView;
      
      // Set a timeout to enable viewing after the remaining time
      const timer = setTimeout(() => {
        localStorage.setItem(lastViewKey, Date.now().toString());
        setCanView(true);
      }, remainingTime);

      return () => clearTimeout(timer);
    }
  }, [storyId]);

  return canView;
}