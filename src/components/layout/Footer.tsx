
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Mintopia Blockchain. All rights reserved.
        </p>
        
        <div className="flex items-center gap-4">
          <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground">
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground">
            Terms of Service
          </Link>
          <Link to="/docs" className="text-xs text-muted-foreground hover:text-foreground">
            Documentation
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
