// 레슨 01: TS 기본 타입 — primitive / array / tuple / union / function.
const userName: string = "정한석";
const age: number = 34;
const isActive: boolean = true;

const tags: string[] = ["react", "ts", "sass"];
const point: [number, number] = [10, 20];

type Size = "sm" | "md" | "lg";
const size: Size = "md";

function safeParse(input: unknown): number {
  if (typeof input === "number") return input;
  if (typeof input === "string") return Number(input);
  return 0;
}

type Add = (a: number, b: number) => number;
const add: Add = (a, b) => a + b;

export default function Demo() {
  return (
    <ul className="study-list study-list--plain">
      <li>
        <code>userName</code>: {userName} (<em>{typeof userName}</em>)
      </li>
      <li>
        <code>age</code>: {age}, <code>isActive</code>: {String(isActive)}
      </li>
      <li>
        <code>tags</code>: [{tags.join(", ")}]
      </li>
      <li>
        <code>point</code>: ({point[0]}, {point[1]})
      </li>
      <li>
        <code>size</code>: {size}
      </li>
      <li>
        <code>safeParse("42")</code> = {safeParse("42")},{" "}
        <code>safeParse(true)</code> = {safeParse(true)}
      </li>
      <li>
        <code>add(3, 4)</code> = {add(3, 4)}
      </li>
    </ul>
  );
}
