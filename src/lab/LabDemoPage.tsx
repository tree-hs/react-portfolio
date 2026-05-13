// /lab/:demoId — 개별 데모 셸. 좌(또는 위): 캔버스, 우(또는 아래): 설명 패널.
// 데모 본체(three/R3F)는 demo.Component (React.lazy) 라서 이 페이지를 열 때 chunk 로딩.
import { Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import { Leva } from "leva";
import { getDemo } from "./registry";
import DemoExplain from "./components/DemoExplain";
import "./lab.scss";

export default function LabDemoPage() {
  const { demoId } = useParams();
  const demo = demoId ? getDemo(demoId) : undefined;

  if (!demo) {
    return (
      <section className="lab lab--missing">
        <p>
          데모를 찾을 수 없습니다. <Link to="/lab">← Lab으로 돌아가기</Link>
        </p>
      </section>
    );
  }

  const Demo = demo.Component;

  return (
    <section className="lab lab--demo">
      <Link to="/lab" className="lab__back">
        ← Lab
      </Link>

      <div className="lab-demo__layout">
        <div className="lab-demo__stage">
          <Suspense
            fallback={<div className="lab-canvas lab-canvas--loading">3D 로딩 중…</div>}
          >
            <Demo />
          </Suspense>
        </div>
        <DemoExplain demo={demo} />
      </div>

      {/* leva 전역 패널 — 데모가 useControls를 쓰면 여기에 슬라이더가 뜸 */}
      <Leva collapsed titleBar={{ title: "Controls (leva)" }} />
    </section>
  );
}
