// TypeScript 레슨용 소스 문자열.
// 각 라이브 예제와 동일한 핵심 코드를 문자열 형태로 보관.

export const tsBasicTypesCode = `// 1) primitive 타입
const userName: string = "정한석";
const age: number = 34;
const isActive: boolean = true;

// 2) 배열 / 튜플
const tags: string[] = ["react", "ts", "sass"];
const point: [number, number] = [10, 20]; // 길이 고정

// 3) 리터럴 유니온 — enum 대신 가장 흔하게 쓰임
type Size = "sm" | "md" | "lg";
const size: Size = "md";

// 4) any 는 검사 OFF, unknown 은 "쓰기 전에 좁혀라"
function safeParse(input: unknown): number {
  if (typeof input === "number") return input;
  if (typeof input === "string") return Number(input);
  return 0;
}

// 5) 함수 타입
type Add = (a: number, b: number) => number;
const add: Add = (a, b) => a + b;

export default function Demo() {
  return (
    <ul>
      <li>name: {userName} ({typeof userName})</li>
      <li>tags: {tags.join(", ")}</li>
      <li>size: {size}</li>
      <li>safeParse('42'): {safeParse('42')}</li>
      <li>add(3,4): {add(3,4)}</li>
    </ul>
  );
}`;

export const tsInterfaceTypeCode = `// interface 와 type 모두 객체 형태를 묘사할 수 있다.
interface UserI {
  id: string;
  name: string;
}

type UserT = {
  id: string;
  name: string;
};

// 확장 방식 차이
interface AdminI extends UserI {
  role: "admin";
}
type AdminT = UserT & { role: "admin" };

// 유니온 / 튜플 / 리터럴은 type 만 가능
type ID = string | number;
type Point = [number, number];

// 선언 병합 — interface 만 가능 (라이브러리 d.ts 확장에 유용)
interface Window {
  __MY_FLAG__?: boolean;
}

const admin: AdminI = { id: "u1", name: "Hs", role: "admin" };
const id1: ID = "abc";
const id2: ID = 42;`;

export const tsPropsTypingCode = `import type { ReactNode } from "react";

interface ButtonProps {
  label: string;
  variant?: "primary" | "ghost";   // optional
  disabled?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}

// 디스트럭처링에서 default 값으로 \`variant\` 기본값 부여
function Button({
  label,
  variant = "primary",
  disabled,
  onClick,
  children,
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
    >
      {label}
      {children}
    </button>
  );
}

export default function Demo() {
  return (
    <div>
      <Button label="저장" />
      <Button label="취소" variant="ghost" />
      <Button label="제출" disabled />
    </div>
  );
}`;

export const tsGenericsCode = `// 1) 함수 제네릭 — 입력 타입과 반환 타입의 관계를 표현
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

// 2) 제약 (constraint) — T 가 id 를 가져야 함
function byId<T extends { id: string }>(arr: T[], id: string): T | undefined {
  return arr.find((x) => x.id === id);
}

// 3) 여러 타입 변수
function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}

// 사용
const n = first([1, 2, 3]);          // number | undefined
const s = first(["a", "b"]);         // string | undefined

interface Todo { id: string; text: string; }
const todos: Todo[] = [
  { id: "t1", text: "공부" },
  { id: "t2", text: "운동" },
];
const found = byId(todos, "t2");      // Todo | undefined

const tup = pair("size", 12);         // [string, number]`;

export const tsUtilityTypesCode = `interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

// Partial — 모든 prop optional. PATCH 요청 body 타이핑에 자주 사용.
type UserUpdate = Partial<User>;
const update: UserUpdate = { name: "정한석" }; // OK

// Pick — 일부만 골라내기
type UserPreview = Pick<User, "id" | "name">;
const preview: UserPreview = { id: "u1", name: "Hs" };

// Omit — 일부만 빼기 (Pick 의 반대)
type UserCreate = Omit<User, "id">;            // 서버가 id 생성, 클라이언트는 id 없이 보냄
const draft: UserCreate = {
  name: "Hs", email: "a@b.c", age: 34,
};

// Record — 키/값 쌍 객체
type Role = "admin" | "editor" | "viewer";
const labels: Record<Role, string> = {
  admin: "관리자", editor: "에디터", viewer: "구독자",
};

// Required — 다 필수로
type StrictUpdate = Required<UserUpdate>;       // 다시 User 와 동일

// ReturnType — 함수 반환 타입 추출
function makeUser() { return { id: "u1", name: "Hs" }; }
type MadeUser = ReturnType<typeof makeUser>;`;
