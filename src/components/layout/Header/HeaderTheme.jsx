import { useEffect, useState } from "react";

const STORAGE_KEY = "theme"; // 'light' | 'dark'

function HeaderTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === "dark" || saved === "light") {
      const nextIsDark = saved === "dark";
      setIsDark(nextIsDark);
      document.body.dataset.theme = saved;
      return;
    }

    const prefersDark = window.matchMedia?.(
      "(prefers-color-scheme: dark)"
    )?.matches;
    setIsDark(!!prefersDark);
    document.body.dataset.theme = prefersDark ? "dark" : "light";
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
