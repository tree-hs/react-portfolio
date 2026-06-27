// =====================================================================
//  Lab Demo 02 — Raw WebGL Triangle  (Phase 1 / 채용공고 C)
//  ─────────────────────────────────────────────────────────────────────
//  목표: 라이브러리 없이 <canvas> + WebGLRenderingContext만 써서 삼각형 1개를
//        직접 그린다. 셰이더 컴파일 → 프로그램 링크 → VBO → attribute 연결
//        → uniform → drawArrays 까지 *모든 단계를 손으로*.
//
//  비교 포인트: Three.js의 `renderer.render(scene, camera)` 한 줄 안에는
//  여기 적힌 모든 단계가 매 프레임 자동으로 일어난다. (docs/RENDERER_NOTES.md)
//
//  이 파일은 일부러 *유틸 분리 없이* 한 파일에 두었다 — 위에서 아래로 한 번 읽으면
//  "한 프레임 그려지는 일"의 전체 사이클이 보이도록.
// =====================================================================
import { useEffect, useRef, useState } from "react";
import { useControls } from "leva";

// ─────────────────────────────────────────────────────────────────────
//  1. GLSL 셰이더 소스
// ─────────────────────────────────────────────────────────────────────
//  GLSL = OpenGL Shading Language. GPU에서 돌아가는 C 비슷한 작은 언어.
//  · vertex shader:   "꼭짓점" 하나당 1번 실행 (이 삼각형은 3번).
//  · fragment shader: "픽셀(fragment)" 하나당 1번 실행 (삼각형이 차지하는 픽셀 수만큼).
//  → 둘 다 GPU에서 *병렬*로 돌기 때문에 빠르다.

const VERTEX_SHADER_SOURCE = `
  attribute vec2 aPosition;   // 꼭짓점별 입력값 #1: 위치 (x, y)
  attribute vec3 aColor;      // 꼭짓점별 입력값 #2: 색 (r, g, b)

  uniform float uTime;        // 모든 꼭짓점에 동일하게 들어가는 값 (누적 시간, 초)
  uniform float uSpeed;       // 회전 속도
  uniform float uAspect;      // 캔버스 가로/세로 비율 (찌그러짐 보정)

  varying vec3 vColor;        // vertex → fragment 로 넘기는 값. 삼각형 안쪽에서 자동 보간됨.

  void main() {
    // 2D 회전 행렬을 손으로 (cos, sin)
    float angle = uTime * uSpeed;
    float c = cos(angle);
    float s = sin(angle);
    vec2 rotated = vec2(
      c * aPosition.x - s * aPosition.y,
      s * aPosition.x + c * aPosition.y
    );

    // gl_Position = 이 꼭짓점의 "클립 공간" 좌표 (-1..1 사각형).
    // x를 aspect로 나눠 화면이 가로로 길어도 삼각형이 찌그러지지 않게 보정.
    gl_Position = vec4(rotated.x / uAspect, rotated.y, 0.0, 1.0);

    // varying에 색 그대로 전달. fragment에서 받을 때는 픽셀마다 *보간된* 값.
    vColor = aColor;
  }
`;

const FRAGMENT_SHADER_SOURCE = `
  precision mediump float;   // WebGL 1 의 fragment shader는 float 정밀도 선언이 필수

  varying vec3 vColor;        // vertex에서 넘어온 색 (이미 보간됨)
  uniform float uIntensity;   // 색 밝기 배율

  void main() {
    // gl_FragColor = 이 픽셀의 최종 색 (r, g, b, a)
    gl_FragColor = vec4(vColor * uIntensity, 1.0);
  }
`;

// ─────────────────────────────────────────────────────────────────────
//  2. 헬퍼: 셰이더 컴파일 / 프로그램 링크
//     (Three.js 의 WebGLProgram 클래스가 내부에서 거의 똑같이 함)
// ─────────────────────────────────────────────────────────────────────
function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("gl.createShader() returned null");
  gl.shaderSource(shader, source);    // 소스 등록
  gl.compileShader(shader);           // 컴파일 시도

  // ❗ 컴파일 실패는 "silent fail" — 결과를 직접 확인해야 함. 안 하면 검정 화면.
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(
      `Shader 컴파일 실패 (${type === gl.VERTEX_SHADER ? "vertex" : "fragment"}):\n${log}`
    );
  }
  return shader;
}

function linkProgram(
  gl: WebGLRenderingContext,
  vs: WebGLShader,
  fs: WebGLShader
): WebGLProgram {
  const program = gl.createProgram();
  if (!program) throw new Error("gl.createProgram() returned null");
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program 링크 실패:\n${log}`);
  }
  return program;
}

// ─────────────────────────────────────────────────────────────────────
//  3. 데모 컴포넌트
// ─────────────────────────────────────────────────────────────────────
export default function RawTriangleDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fps, setFps] = useState(0);
  const [drawsPerSec, setDrawsPerSec] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // leva 컨트롤
  const { speed, intensity, paused } = useControls("Triangle", {
    speed: { value: 0.5, min: 0, max: 3, step: 0.1, label: "회전 속도" },
    intensity: { value: 1, min: 0.2, max: 2, step: 0.05, label: "색 밝기" },
    paused: { value: false, label: "정지" },
  });

  // leva 값을 매 프레임 *최신*으로 읽기 위한 ref.
  // (useEffect 안의 렌더 루프는 mount 때 1번만 만들어지므로, 그 closure가
  //  stale한 prop을 보지 않게 ref로 우회.)
  const stateRef = useRef({ speed, intensity, paused });
  useEffect(() => {
    stateRef.current = { speed, intensity, paused };
  }, [speed, intensity, paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── (a) WebGL 컨텍스트 얻기 ─────────────────────────────────────
    //   canvas 하나에 컨텍스트(WebGL 1)는 단 하나. 한 번 얻으면 그 캔버스의 "주인".
    const gl = canvas.getContext("webgl");
    if (!gl) {
      setError("이 브라우저는 WebGL을 지원하지 않습니다.");
      return;
    }

    let program: WebGLProgram;
    let vs: WebGLShader;
    let fs: WebGLShader;
    try {
      // ── (b) 셰이더 컴파일 + 프로그램 링크 ──────────────────────────
      //   Three.js: 각 Material(예: MeshStandardMaterial)이 자신의 셰이더 코드를
      //   가지고 있고, WebGLRenderer가 처음 마주칠 때 한 번 컴파일+링크 → 캐시.
      vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
      fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
      program = linkProgram(gl, vs, fs);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      return;
    }

    // ── (c) 꼭짓점 데이터 (CPU 메모리에 Float32Array로) ─────────────
    //   클립 공간 좌표계: 캔버스 한가운데 (0,0), 좌상단 (-1, 1), 우하단 (1, -1).
    //   Three.js: BufferGeometry.attributes.position 가 같은 역할.
    const positions = new Float32Array([
      0.0,  0.7,    // 꼭대기
      -0.7, -0.6,   // 왼아래
       0.7, -0.6,   // 오른아래
    ]);
    // 꼭짓점별 색 — 안쪽은 fragment shader에서 자동 보간되어 무지개 그라데이션.
    const colors = new Float32Array([
      1.0, 0.10, 0.20,   // 꼭대기: 빨강
      0.10, 0.90, 0.40,  // 왼아래: 초록
      0.20, 0.40, 1.0,   // 오른아래: 파랑
    ]);

    // ── (d) VBO (Vertex Buffer Object) — CPU 데이터를 GPU 메모리로 업로드 ─
    //   ⚠️ WebGL은 "current state" 모델: bindBuffer로 묶은 *그 시점의 버퍼*가
    //   이후 bufferData / vertexAttribPointer 의 대상이 된다. 잊으면 silent bug.
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    //   STATIC_DRAW = "잘 안 바뀌는 데이터" 힌트. (DYNAMIC_DRAW / STREAM_DRAW도 있음)

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    // ── (e) attribute / uniform 위치 lookup ─────────────────────────
    //   GLSL 안에서 선언한 이름과 외부 JS의 다리. 한 번만 구해두고 재사용.
    const aPositionLoc = gl.getAttribLocation(program, "aPosition");
    const aColorLoc = gl.getAttribLocation(program, "aColor");
    const uTimeLoc = gl.getUniformLocation(program, "uTime");
    const uSpeedLoc = gl.getUniformLocation(program, "uSpeed");
    const uAspectLoc = gl.getUniformLocation(program, "uAspect");
    const uIntensityLoc = gl.getUniformLocation(program, "uIntensity");

    // ── (f) 캔버스 해상도 동기화 ───────────────────────────────────
    //   CSS 크기(clientWidth/Height)와 픽셀 버퍼 크기(canvas.width/height)는
    //   분리돼 있다. devicePixelRatio 만큼 곱해야 레티나에서 선명. gl.viewport로
    //   GL이 그릴 영역도 같이 알려준다. (Three.js: renderer.setSize + setPixelRatio)
    //   ※ function 선언 대신 const 화살표 함수를 쓰는 이유: TypeScript가 외부
    //     스코프의 null 체크(canvas/gl)를 함수 안까지 캐리해 주려면 호이스팅되지
    //     않는 const 표현식이어야 함 ("function 선언은 narrowing이 풀린다").
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    // ── (g) 렌더 루프 (= 매 프레임 1번씩 그리기) ────────────────────
    let rafId = 0;
    let elapsed = 0;              // 누적 시간 (paused면 멈춤)
    let lastNow = performance.now();
    let frames = 0;               // 통계용
    let draws = 0;                // 통계용
    let statsTime = lastNow;      // 통계 갱신 기준 시각

    const tick = (now: number) => {
      const dt = (now - lastNow) / 1000;
      lastNow = now;
      const { speed: sp, intensity: it, paused: pa } = stateRef.current;
      if (!pa) elapsed += dt;

      resize();

      // ─── 한 프레임 그리기 ───
      gl.clearColor(0.07, 0.07, 0.09, 1);  // 배경색 RGBA(0..1)
      gl.clear(gl.COLOR_BUFFER_BIT);        // 색 버퍼 비우기 (필요 시 DEPTH도)

      // 어떤 프로그램(셰이더 페어)을 쓸지 활성화
      gl.useProgram(program);

      // attribute 연결: position 버퍼 → aPosition (vec2)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(aPositionLoc);
      gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);
      //   파라미터:  location, size(컴포넌트수), type, normalize, stride, offset
      //   stride=0 = "꽉 차게" 의미. 한 vec2가 8바이트씩 연속.

      // attribute 연결: color 버퍼 → aColor (vec3)
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.enableVertexAttribArray(aColorLoc);
      gl.vertexAttribPointer(aColorLoc, 3, gl.FLOAT, false, 0, 0);

      // uniform 전달 (꼭짓점마다 같은 값들)
      gl.uniform1f(uTimeLoc, elapsed);
      gl.uniform1f(uSpeedLoc, sp);
      gl.uniform1f(uIntensityLoc, it);
      gl.uniform1f(uAspectLoc, canvas.width / canvas.height);

      // ★★★ DRAW CALL — GPU에 "지금까지 셋팅한 걸로 삼각형 그려!" 한 번
      //   파라미터: mode, first(시작 꼭짓점 인덱스), count(그릴 꼭짓점 수)
      //   TRIANGLES 모드: 꼭짓점 3개씩 묶어 1개 삼각형. 6개면 2개. ...
      //   Three.js: renderer.render() 가 scene 안의 mesh마다 이걸 한 번씩 호출.
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      draws += 1;

      // 통계 갱신 (0.5초마다)
      frames += 1;
      if (now - statsTime >= 500) {
        setFps(Math.round((frames * 1000) / (now - statsTime)));
        setDrawsPerSec(Math.round((draws * 1000) / (now - statsTime)));
        frames = 0;
        draws = 0;
        statsTime = now;
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    // ── (h) 정리 — 메모리 누수 방지 (Phase 3에서 더 깊게) ──────────
    //   Three.js: scene/geometry/material/texture 마다 .dispose() 가 있고,
    //   언마운트 시 호출하지 않으면 GPU 자원이 그대로 남아 쌓인다.
    return () => {
      cancelAnimationFrame(rafId);
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(colorBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
    // mount 시 1회만 셋업. leva 값은 stateRef로 매 프레임 최신값 읽음(위 별도 effect).
  }, []);

  return (
    <div className="lab-canvas raw-webgl">
      <canvas ref={canvasRef} className="raw-webgl__canvas" />
      <div className="raw-webgl__stats" aria-hidden="true">
        <div>
          <span className="raw-webgl__k">FPS</span>
          <span>{fps}</span>
        </div>
        <div>
          <span className="raw-webgl__k">draw calls / sec</span>
          <span>{drawsPerSec}</span>
        </div>
        <div>
          <span className="raw-webgl__k">vertices / draw</span>
          <span>3</span>
        </div>
        <div>
          <span className="raw-webgl__k">triangles</span>
          <span>1</span>
        </div>
      </div>
      {error && <pre className="raw-webgl__err">{error}</pre>}
    </div>
  );
}
