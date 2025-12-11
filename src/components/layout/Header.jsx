import "./Header.scss";

function Header() {
  return (
    <header class="grid_gp10">
      <div className="flx_btw">
        <h1>Hs React portfolio</h1>
        <div className="theme-toggle">
          <label htmlFor="themeBtn">theme mode button</label>
          <input type="checkbox" id="themeBtn" />
        </div>
      </div>
      <div>
        <p>i didn't have a lot of experience about react skill so i made this page</p>
        <p>please hire me</p>
      </div>
      {/* 메뉴 등 */}
    </header>
  );
}

export default Header;