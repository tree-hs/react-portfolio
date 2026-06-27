import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  // 다른 라우트(/study, /lab)에서 앵커 메뉴를 눌렀을 때, 홈으로 이동한 뒤
  // 스크롤할 섹션 hash를 잠시 보관한다.
  const [pendingHash, setPendingHash] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
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

  // 지정한 섹션(id)으로 스크롤. 요소가 아직 없으면 false 반환.
  const scrollToHash = (hash) => {
    const element = document.getElementById(hash);
    if (!element) return false;

    // Lenis가 있으면 관성 스크롤로(offset 만큼 위에서 멈춤), 없으면 네이티브 폴백
    if (lenis) {
      lenis.scrollTo(element, { offset: -SCROLL_OFFSET });
    } else {
      const top =
        element.getBoundingClientRect().top + window.pageYOffset - SCROLL_OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
    }
    return true;
  };

  // 앵커 메뉴 클릭:
  //  · 홈(/)이면 바로 해당 섹션으로 스크롤
  //  · 다른 라우트면 홈으로 이동 후, 섹션이 마운트되면 스크롤(pendingHash + 아래 effect)
  const handleAnchorNav = (path, onNavigate) => {
    const hash = path.split("#")[1];
    if (!hash) return;
    if (location.pathname === "/") {
      scrollToHash(hash);
    } else {
      setPendingHash(hash);
      navigate("/");
    }
    onNavigate?.();
  };

  // 홈으로 막 이동했고 대기 중인 hash가 있으면, 섹션이 렌더된 다음 프레임에 스크롤.
  useEffect(() => {
    if (location.pathname !== "/" || !pendingHash) return;
    let raf2;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        scrollToHash(pendingHash);
        setPendingHash(null);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, pendingHash]);

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
            handleAnchorNav(item.path, onNavigate);
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
