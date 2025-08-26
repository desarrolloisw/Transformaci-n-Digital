import { useEffect } from 'react';

export default function VanillaChatbot() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '../vanilla-chatbot/script.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="chatbot" />
  );
}