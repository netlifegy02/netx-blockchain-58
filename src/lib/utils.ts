
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Initialize WhatsApp verification as disabled by default
(() => {
  // Only set if it doesn't already exist in localStorage
  if (localStorage.getItem('whatsappVerificationEnabled') === null) {
    localStorage.setItem('whatsappVerificationEnabled', 'false');
  }
})();
