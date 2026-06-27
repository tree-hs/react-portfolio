// Sass 레슨용 소스 문자열.
// 각 라이브 예제에서 import 하는 .scss 파일과 동일한 코드를 보여준다.

export const sassVariablesCode = `// _variables.scss
// 1) $변수 — 컴파일 타임 상수
$primary: #2563eb;
$radius: 6px;
$gap: 12px;

// 2) 중첩 + & (부모 셀렉터 참조)
.sass-card {
  padding: 16px;
  border: 2px solid $primary;
  border-radius: $radius;
  display: flex;
  gap: $gap;
  align-items: center;

  // & 는 부모(.sass-card) 자리에 들어감.
  // 컴파일 결과: .sass-card:hover { ... }
  &:hover {
    background: rgba($primary, 0.05);
  }

  // .sass-card--primary
  &--primary {
    background: $primary;
    color: #fff;
  }

  // .sass-card .sass-card__label
  &__label {
    font-weight: 600;
    color: $primary;
  }
}`;

export const sassMixinCode = `// _mixin.scss
@mixin flex-center($gap: 8px) {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $gap;
}

// 미디어 쿼리 mixin — 가장 자주 쓰이는 패턴
@mixin mobile {
  @media (max-width: 768px) {
    @content;   // ← 호출자의 블록이 여기에 끼워짐
  }
}

// 버튼 variant mixin
@mixin button-style($bg, $color: #fff) {
  background: $bg;
  color: $color;
  border: 0;
  padding: 10px 18px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover { opacity: 0.85; }
}

// 사용
.sass-toolbar {
  @include flex-center(12px);
  padding: 12px;

  @include mobile {
    flex-direction: column;
    gap: 8px;
  }
}

.sass-btn--primary { @include button-style(#2563eb); }
.sass-btn--danger  { @include button-style(#dc2626); }
.sass-btn--ghost   { @include button-style(transparent, #2563eb); }`;

export const sassFunctionCode = `@use 'sass:math';
@use 'sass:color';

// rem() — px 값을 받아 rem 단위로 반환
@function rem($px, $base: 16) {
  @return math.div($px, $base) * 1rem;
}

// spacing — 4의 배수 step 시스템 (디자인 시스템 단골)
@function space($step) {
  @return $step * 4px;
}

$brand: #2563eb;

.sass-fn-demo {
  // 함수 호출
  padding: space(4) space(6);          // 16px 24px
  font-size: rem(18);                  // 1.125rem
  border-radius: rem(8);               // 0.5rem

  // 색상 함수 — 명도 / 채도 조절
  border: 2px solid color.adjust($brand, $lightness: -10%);
  background: color.adjust($brand, $lightness: 45%);

  // 런타임 값이 섞이면 calc() 사용
  height: calc(100% - #{space(2)});
}`;

export const sassModulesCode = `// _tokens.scss
$primary: #2563eb !default;        // !default → 외부에서 덮어쓰기 허용
$radius: 8px !default;

// _mixins.scss
@use 'tokens' as t;

@mixin card {
  border: 2px solid t.$primary;
  border-radius: t.$radius;
  padding: 16px;
}

// main.scss — 진입점
@use 'tokens' as t;
@use 'mixins' as m;

.sass-module-demo {
  @include m.card;

  color: t.$primary;
}

// 다른 파일에서 토큰을 덮어쓰며 가져오기
// @use 'tokens' as t with ($primary: #dc2626);
//
// @forward 패턴 (index.scss)
// @forward 'tokens';
// @forward 'mixins';
// → 이 한 파일만 @use 하면 둘 다 사용 가능`;

export const sassDesignTokensCode = `// 1) :root 에 라이트 토큰. body[data-theme="dark"] 에 다크 오버라이드.
:root {
  --bg: #ffffff;
  --text: #1a1a1a;
  --muted: #666666;
  --brand: #2563eb;
}

body[data-theme="dark"] {
  --bg: #0a0a0a;
  --text: #ffffff;
  --muted: #999999;
  --brand: #60a5fa;
}

// 2) Sass mixin 은 토큰의 var() 를 참조.
//    → 한 mixin 으로 양쪽 테마에 자동 대응.
@mixin themed-surface {
  background: var(--bg);
  color: var(--text);
  border: 1px solid var(--muted);
  transition: background 0.3s, color 0.3s, border-color 0.3s;
}

.sass-token-demo {
  @include themed-surface;
  padding: 16px;
  border-radius: 8px;

  strong { color: var(--brand); }
}

// 3) 토글은 JS 한 줄:
//    document.body.dataset.theme = "dark"
//    → :root 의 변수가 그대로 갈아끼워지므로 별도 클래스 수정 불필요.`;
