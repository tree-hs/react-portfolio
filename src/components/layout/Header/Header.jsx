import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import HeaderTheme from "./HeaderTheme";
import "./Header.scss";

// path가 "#..." 이면 같은 페이지 내 스크롤(앵커), "/..." 이면 라우터 이동(<Link>).
const navItems = [
  { name: "About", path: "#about" },
  { name: "Work", path: "#projects" },
  { name: "Stack", path: "#stack" },
  { name: "Lab", path: "/lab" },
];

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (path) => {
    const hash = path.split("#")[1];
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }
  };

  return (
    <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
      <nav className="header__nav">
        <div className="header__logo">
          <Link to="/" className="header__logo-link">
            <span className="header__logo-text">HS</span>
          </Link>
        </div>
        
        <ul className="header__menu">
          {navItems.map((item, idx) => (
            <li key={idx} className="header__menu-item">
              {item.path.startsWith("#") ? (
                <a
                  href={item.path}
                  className="header__menu-link"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.path);
                  }}
                >
                  <span className="header__menu-number">0{idx + 1}.</span>
                  {item.name}
                </a>
              ) : (
                <Link to={item.path} className="header__menu-link">
                  <span className="header__menu-number">0{idx + 1}.</span>
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="header__actions">
          <HeaderTheme />
        </div>
      </nav>
    </header>
  );
}

export default Header;
