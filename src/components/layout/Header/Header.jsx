import HeaderTheme from "./HeaderTheme";
import "./Header.scss";

function Header() {
  return (
    <header className="grid agp10">
      <div className="flx flx-btw flx-vct">
        <h1>Hs React portfolio</h1>
        <HeaderTheme />
      </div>
      {/* 메뉴 등 */}
    </header>
  );
}

export default Header;
