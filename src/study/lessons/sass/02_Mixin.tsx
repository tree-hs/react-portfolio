import "./02_Mixin.scss";

export default function Demo() {
  return (
    <div className="sass-toolbar">
      <button type="button" className="sass-btn--primary">
        Primary
      </button>
      <button type="button" className="sass-btn--danger">
        Danger
      </button>
      <button type="button" className="sass-btn--ghost">
        Ghost
      </button>
    </div>
  );
}
