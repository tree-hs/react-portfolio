import "./03_Function.scss";

export default function Demo() {
  const rows: Array<[string, string]> = [
    ["space(4) space(6)", "16px 24px"],
    ["rem(18)", "1.125rem"],
    ["rem(8)", "0.5rem"],
    ["color.adjust($brand, $lightness: -10%)", "어두운 brand"],
    ["color.adjust($brand, $lightness: 45%)", "밝은 brand (배경)"],
  ];
  return (
    <div className="sass-fn-demo">
      {rows.map(([call, result]) => (
        <div key={call} className="sass-fn-demo__row">
          <span>{call}</span>
          <strong>{result}</strong>
        </div>
      ))}
    </div>
  );
}
