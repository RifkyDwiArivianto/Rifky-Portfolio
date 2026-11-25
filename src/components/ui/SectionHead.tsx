interface SectionHeadProps {
  eyebrow: string;
  title: string;
  /** kalimat pengantar di bawah judul */
  intro?: string;
}

export function SectionHead({ eyebrow, title, intro }: SectionHeadProps) {
  return (
    <div className="sec-head">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {intro && <p className="intro">{intro}</p>}
    </div>
  );
}
