import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const KeyboardListener = () => {
  const navigate = useNavigate();
  let keysPressed = "";
  let timer: NodeJS.Timeout | null = null;

  useEffect(() => {
    // Handler for keydown event
    const handleKeyDown = (e: KeyboardEvent) => {
      // Add the pressed key to our string
      keysPressed += e.key.toLowerCase();

      // Check if the string contains our secret word
      if (keysPressed.includes("sayang")) {
        // Reset the keysPressed and navigate to our special page
        keysPressed = "";
        navigate("/makasihya");
      }

      // Reset keysPressed after 2 seconds of inactivity
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        keysPressed = "";
      }, 2000);
    };

    // Add the event listener
    document.addEventListener('keydown', handleKeyDown);

    // Clean up
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (timer) clearTimeout(timer);
    };
  }, [navigate]);

  // This component doesn't render anything
  return null;
};

export default KeyboardListener;