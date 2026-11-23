import type { ReactNode } from "react";

interface SectionHeadProps {
  eyebrow: string;
  title: string;
  /** isi sisi kanan, mis. tab filter */
  children?: ReactNode;
}

export function SectionHead({ eyebrow, title, children }: SectionHeadProps) {
  return (
    <div className="sec-head">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
