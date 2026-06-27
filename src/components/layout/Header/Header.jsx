import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";
import HeaderTheme from "./HeaderTheme";
import "./Header.scss";

// 헤더 높이만큼 위 여백을 두고 멈추기 위한 오프셋(px). --header-h 와 맞춤.
const SCROLL_OFFSET = 90;

// path가 "#..." 이면 같은 페이지 내 스크롤(앵커), "/..." 이면 라우터 이동(<Link>).
const navItems = [
  { name: "About", path: "#about" },
  { name: "Work", path: "#projects" },
  { name: "Stack", path: "#stack" },
  { name: "Study", path: "/study" },
  { name: "Lab", path: "/lab" },
];

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  // Lenis 인스턴스(스무스 스크롤). 동작 줄이기 선호 시 SmoothScroll이 Lenis를
  // 마운트하지 않으므로 null → 아래에서 네이티브 scrollTo로 폴백.
  const lenis = useLenis();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 라우트가 바뀌면 모바일 메뉴 닫기 + 메뉴 열렸을 때 배경 스크롤 잠금
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const scrollToSection = (path) => {
    const hash = path.split("#")[1];
    if (!hash) return;
    const element = document.getElementById(hash);
    if (!element) return;

    // Lenis가 있으면 관성 스크롤로(offset 만큼 위에서 멈춤), 없으면 네이티브 폴백
    if (lenis) {
      lenis.scrollTo(element, { offset: -SCROLL_OFFSET });
    } else {
      const top =
        element.getBoundingClientRect().top + window.pageYOffset - SCROLL_OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  // 메뉴 항목 렌더 — 앵커/라우트 분기. onNavigate 로 모바일에서 클릭 시 닫기.
  const renderLink = (item, idx, onNavigate) => {
    const number = `0${idx + 1}`;
    const inner = (
      <>
        <span className="header__menu-number">{number}.</span>
        {item.name}
      </>
    );
    if (item.path.startsWith("#")) {
      return (
        <a
          href={item.path}
          className="header__menu-link"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection(item.path);
            onNavigate?.();
          }}
        >
          {inner}
        </a>
      );
    }
    return (
      <Link
        to={item.path}
        className="header__menu-link"
        onClick={() => onNavigate?.()}
      >
        {inner}
      </Link>
    );
  };

  return (
    <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
      <nav className="header__nav">
        <div className="header__logo">
          <Link to="/" className="header__logo-link">
            <span className="header__logo-text">HS</span>
          </Link>
        </div>

        {/* 데스크톱 메뉴 */}
        <ul className="header__menu">
          {navItems.map((item, idx) => (
            <li key={item.name} className="header__menu-item">
              {renderLink(item, idx)}
            </li>
          ))}
        </ul>

        <div className="header__actions">
          <HeaderTheme />
          {/* 모바일 햄버거 */}
          <button
            type="button"
            className={`header__burger ${menuOpen ? "is-open" : ""}`}
            aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* 모바일 풀스크린 메뉴 */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="header__mobile"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="header__mobile-menu">
              {navItems.map((item, idx) => (
                <li key={item.name} className="header__mobile-item">
                  {renderLink(item, idx, () => setMenuOpen(false))}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
