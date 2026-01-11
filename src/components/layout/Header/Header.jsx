import HeaderTheme from "./HeaderTheme";
import "./Header.scss";

function Header() {
  return (
    <header className="grid agp10">
      <div className="flx flx-btw flx-vct">
        <div>
          <h1>Hs React portfolio</h1>
          <p className="fs12">
            이것 저것 해보긴 했는데 퍼블리셔 포지션으로만 경력을 쌓아서
            <br />
            퍼블리싱 외 대다수 stack은 초급이라 생각해서 초급이라 했습니다.
          </p>
        </div>
        <HeaderTheme />
      </div>
      {/* 메뉴 등 */}
    </header>
  );
}

export default Header;
