"use client";

import React from "react";

export interface GlassIconsItem {
  icon: React.ReactElement;
  color: string;
  label: string;
  customClass?: string;
}

export interface GlassIconsProps {
  items: GlassIconsItem[];
}

const gradientMapping: Record<string, string> = {
  blue: "linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))",
  purple: "linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))",
  red: "linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))",
  indigo: "linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))",
  orange: "linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))",
  green: "linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))",
};

const GlassIcons: React.FC<GlassIconsProps> = ({ items }) => {
  const getBackgroundStyle = (color: string): React.CSSProperties => {
    if (gradientMapping[color]) {
      return { background: gradientMapping[color] };
    }
    return { background: color };
  };

  return (
    <div className="flex md:flex-row flex-col flex-wrap gap-20 items-center justify-evenly py-20">
      {items.map((e, i) => (
        <div key={i} className="flex flex-col items-center gap-6 group">
          <div className="size-20 relative cursor-pointer">
            <div
              className="w-full h-full rotate-15 group-hover:rotate-30 group-hover:-translate-y-8 group-hover:translate-x-6 translate-x-4 -translate-y-3 rounded-2xl transform transition-transform duration-300"
              style={getBackgroundStyle(e.color)}
            ></div>
            <div
              style={{
                boxShadow: "0 0 0 0.1em hsla(0, 0%, 100%, 0.3) inset",
              }}
              className="group-hover:scale-110 transition-transform duration-300 w-full h-full absolute top-0 left-0 rounded-2xl bg-[hsla(0,0%,100%,0.15)] border grid place-content-center"
            >
              {e.icon}
            </div>
          </div>
          <p className="text-center max-w-40 group-hover:scale-110 group-hover:translate-y-2 transition-all duration-300">
            {e.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default GlassIcons;
