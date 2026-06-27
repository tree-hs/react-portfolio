// 레슨 01: JSX와 컴포넌트, Props.
// _sources.ts 의 reactJsxPropsCode 문자열과 (가능한 한) 동일한 동작을 한다.
import type { ReactNode } from "react";

interface GreetProps {
  name: string;
  age?: number;
}

function Greet({ name, age }: GreetProps) {
  return (
    <div className="study-card">
      <p>
        안녕하세요, <strong>{name}</strong> 님!
      </p>
      {age !== undefined && <p>나이: {age}살</p>}
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return <div className="study-card-wrap">{children}</div>;
}

export default function Example() {
  return (
    <Card>
      <Greet name="정한석" age={34} />
      <Greet name="익명" />
    </Card>
  );
}
