import * as React from "react";

export const Header: React.FC = () => {
  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="relative flex items-center justify-center">
          {/* Label esquerda */}
          <div className="absolute left-0 inset-y-0 flex items-center">
            <span className="text-xs sm:text-sm font-medium tracking-wide text-muted-foreground">
              UniLink
            </span>
          </div>

          {/* Título central */}
          <h1
            className="text-center font-semibold tracking-wide"
            aria-label="Universidade Federal do Espírito Santo"
          >
            <span className="text-2xl md:text-3xl lg:text-4xl">UFES</span>
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
