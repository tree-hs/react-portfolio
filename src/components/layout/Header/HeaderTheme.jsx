import { useEffect, useState } from "react";

const STORAGE_KEY = "theme"; // 'light' | 'dark'

function HeaderTheme() {
  // 크리에이티브 방향 = 다크 기본. (main.tsx가 선페인트로 dark를 박아둠)
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    // 저장된 사용자 선택이 있으면 그것을 우선 존중
    if (saved === "dark" || saved === "light") {
      const nextIsDark = saved === "dark";
      setIsDark(nextIsDark);
      document.body.dataset.theme = saved;
      return;
    }

    // 저장값이 없으면 브랜드 기본값(다크) 유지. (OS가 라이트여도 다크로 시작 → 토글로 전환 가능)
    setIsDark(true);
    document.body.dataset.theme = "dark";
  }, []);

  useEffect(() => {
    const theme = isDark ? "dark" : "light";
    document.body.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [isDark]);

  return (
    <div className="theme-toggle">
      <label htmlFor="themeBtn">
        {isDark ? "Dark" : "Light"}
      </label>
      <input
        type="checkbox"
        id="themeBtn"
        checked={isDark}
        onChange={(e) => setIsDark(e.target.checked)}
      />
    </div>
  );
}

export default HeaderTheme;
