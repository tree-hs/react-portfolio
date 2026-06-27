# Renderer 내부 동작 노트

> 작성: 2026-05-12 · 짝꿍 데모: [`/lab/raw-webgl-triangle`](../src/lab/demos/02-raw-webgl-triangle/RawTriangle.tsx)
> 목적: 채용공고 우대사항 C("**Renderer 내부 동작 방식에 대한 이해**")에 대한 정리.
> 핵심 메시지: "Three.js `renderer.render(scene, camera)` 한 줄 안에 *어떤 일들이 매 프레임 일어나고 있는가*"를 raw WebGL로 한 번 풀어보고, 그게 어떻게 자동화돼 있는지 매핑.

---

## 0. 한 컷 요약

```
[3D 데이터(꼭짓점, 색, 행렬)]          [GPU에서 일어나는 일]
              │
              ▼
    1. vertex shader       ── 꼭짓점마다 1번 실행. (모델→월드→뷰→클립 변환 + varying 출력)
              ▼
    2. 래스터화             ── 삼각형 안쪽을 픽셀들로 채움 (GPU 자동)
              ▼
    3. fragment shader     ── 픽셀마다 1번 실행. (텍스처·라이팅·후처리 등으로 색 결정)
              ▼
    4. 깊이/스텐실 테스트   ── 앞 물체가 뒤를 가리도록
              ▼
    5. 캔버스(프레임버퍼)에 출력
```

**Draw call** = 위 1~5 사이클을 GPU에 "이 셋팅으로 한 번 돌려!" 명령하는 단위 (`drawArrays` / `drawElements`). 보통:
- raw WebGL 데모 02: 삼각형 1개 = 1 draw call / 프레임
- Three.js: Mesh 1개당 보통 1 draw call (인스턴싱 쓰면 N개 mesh = 1 draw call 가능, Phase 3 주제)

---

## 1. raw WebGL로 본 한 프레임 (데모 02 코드와 매핑)

데모 02([`RawTriangle.tsx`](../src/lab/demos/02-raw-webgl-triangle/RawTriangle.tsx))의 단계와 그 의미를 같이 본다.

### A. 셋업 (mount 시 1번만)

| 단계 | 코드(데모 02) | 하는 일 |
|---|---|---|
| 1) 컨텍스트 얻기 | `canvas.getContext("webgl")` | `<canvas>` 위에서 GPU를 부릴 권한 획득. 한 캔버스에 1개만 가능. |
| 2) 셰이더 컴파일 | `compileShader(gl, gl.VERTEX_SHADER, src)` ×2 | GLSL 문자열 → GPU가 실행할 수 있는 형태로 컴파일. 실패는 silent라 `getShaderInfoLog` 확인 필수. |
| 3) 프로그램 링크 | `linkProgram(gl, vs, fs)` | vertex + fragment 셰이더를 한 묶음(WebGLProgram)으로 연결. |
| 4) CPU 데이터 준비 | `new Float32Array([...])` (positions, colors) | 꼭짓점 위치·색을 자바스크립트 메모리에. |
| 5) VBO 생성·업로드 | `createBuffer` → `bindBuffer` → `bufferData` | 4번 데이터를 GPU 메모리로 옮김. STATIC_DRAW: 잘 안 바뀌는 데이터 힌트. |
| 6) location lookup | `getAttribLocation`, `getUniformLocation` | GLSL 변수 이름 ↔ 외부 JS의 다리. 한 번 구해두고 매 프레임 재사용. |

### B. 매 프레임 (requestAnimationFrame 안)

| 단계 | 코드 | 하는 일 |
|---|---|---|
| 7) 해상도 동기화 | `resize()` → `gl.viewport(0,0,w,h)` | DPR 곱해서 픽셀 해상도 맞추고 GL에 영역 알림. |
| 8) 화면 클리어 | `clearColor` + `gl.clear(COLOR_BUFFER_BIT)` | 직전 프레임 픽셀 지움. 깊이 버퍼도 같이 지우려면 `\| DEPTH_BUFFER_BIT`. |
| 9) 프로그램 활성 | `gl.useProgram(program)` | "지금부터 이 셰이더 페어로 그릴 거야". |
| 10) attribute 연결 | `bindBuffer` + `enableVertexAttribArray` + `vertexAttribPointer` ×N | VBO ↔ shader의 attribute 변수 매핑. **bindBuffer 직후의 vertexAttribPointer가 그 버퍼 기준**. |
| 11) uniform 전달 | `uniform1f(uTimeLoc, t)` 등 | 한 draw call 동안 공유될 값들. |
| 12) **DRAW CALL** | `gl.drawArrays(gl.TRIANGLES, 0, 3)` | ★ GPU에 "그려!" 명령 1회. 이 한 줄이 위 [0. 한 컷 요약]의 1~5단계를 발동. |

### C. 언마운트 시 1번

| 단계 | 코드 | 하는 일 |
|---|---|---|
| 13) 자원 해제 | `deleteBuffer`, `deleteProgram`, `deleteShader` | GPU 메모리에 올려둔 VBO/프로그램/셰이더 해제. 안 하면 매 마운트마다 쌓임 → **메모리 누수**. |

> 핵심 패턴: WebGL은 **current-state machine** — `bindBuffer` / `useProgram` 같은 호출은 "지금 활성화된 무엇"을 바꾸고, 이후 호출은 그 상태를 기준으로 동작. 그래서 매 프레임 같은 순서로 다시 묶어 주는 게 정석. 이걸 잊으면 *조용히* 다른 버퍼로 그려지는 버그가 남.

---

## 2. Three.js `WebGLRenderer`는 이걸 어떻게 자동화하나

`renderer.render(scene, camera)` 한 줄 안에서 일어나는 일을 위 단계와 1:1로 비교:

| raw WebGL 단계 | Three.js 대응 | 자동화 정도 |
|---|---|---|
| 1) 컨텍스트 | `new THREE.WebGLRenderer({ canvas })` | 자동 |
| 2~3) 셰이더 컴파일·링크 | 각 Material(`MeshBasicMaterial`, `MeshStandardMaterial`, `ShaderMaterial` …)이 자기 셰이더 소스를 가짐. 처음 마주칠 때 1번 컴파일+링크 → **프로그램 캐시**(`renderer.info.programs`). | 처음 1번, 이후 캐시 |
| 4) CPU 데이터 | `BufferGeometry.setAttribute("position", new BufferAttribute(...))` | 사용자가 정의 |
| 5) VBO 업로드 | `BufferAttribute` 가 처음 그려질 때 자동으로 GPU에 업로드. `needsUpdate = true` 면 재업로드. | 자동 (lazy) |
| 6) location lookup | `WebGLProgram` 클래스 내부에서 자동 + 캐시 | 자동 |
| 7) viewport | `renderer.setSize(w, h)`, `setPixelRatio(dpr)` 한 번 부르면 끝 | 자동 |
| 8) clear | `renderer.autoClear = true` 기본값. 매 프레임 자동. 끄려면 false. | 자동 |
| 9) useProgram | scene을 순회하며 각 mesh의 material에 맞는 program 활성 (가능하면 batch) | 자동 |
| 10~11) attribute/uniform | 각 mesh의 행렬(model/view/projection)·라이트 정보·텍스처 등 적절한 uniform 자동 셋팅 | 자동 |
| 12) drawArrays / drawElements | scene 안의 그려야 할 모든 object 에 대해 호출 — **mesh 1개당 보통 1 draw call** | 자동 |
| 13) dispose | 사용자가 `geometry.dispose() / material.dispose() / texture.dispose() / renderer.dispose()` **직접 호출** 해야 함. **자동 안 됨**. | ❌ 수동 |

> 그래서 Three.js 코드가 짧은 거: 위 표의 거의 모든 줄을 `WebGLRenderer` + `BufferGeometry` + `Material` 클래스가 대신해 줌. 단 **dispose만은 수동** — 이게 Phase 3 메모리 누수 주제의 출발점.

---

## 3. `renderer.render()` 한 줄 안의 *추가* 단계 (raw WebGL엔 없는 것들)

Three.js는 위 13단계에 더해 다음도 자동으로 함:

1. **월드 행렬 갱신** — `scene.updateMatrixWorld(true)`. 부모-자식 관계(Object3D 트리) 따라 각 object의 최종 행렬 계산.
2. **Frustum culling** — 카메라 절두체 안에 안 들어오는 mesh는 *draw call 자체를 안 함*. 보이지 않으면 GPU 일을 안 시키는 게 가장 큰 최적화. (`mesh.frustumCulled = false`로 끌 수 있음 — 셰이더로 좌표 바꿔서 그릴 때 필요)
3. **Render order / 정렬** — 불투명 객체는 카메라에 가까운 순(앞에서 뒤로) → 깊이 테스트로 뒷면 일찍 버리기 위해. 반투명 객체는 *먼 것부터* → 알파 합성 정확성 위해. `mesh.renderOrder` 로 수동 조정 가능.
4. **라이트 수집** — scene 안의 모든 Light를 모아 적절한 uniform(`directionalLights[i].direction` 등)으로 셰이더에 주입. Material이 라이트 수에 따라 셰이더를 다시 컴파일하기도 함(셰이더 variant).
5. **Shadow map 패스** — `castShadow=true` 라이트가 있으면 *그 라이트 시점에서 다시 한 번 scene 전체 렌더* → depth texture → 메인 렌더 시 fragment shader가 그걸 샘플해 그림자 그림. (= draw call 수가 거의 2배)
6. **Depth test** — `gl.enable(DEPTH_TEST)`. 픽셀마다 깊이 비교로 가림 처리. 매 프레임 깊이 버퍼 clear가 같이 필요.
7. **Tone mapping / output color space** — 최종 fragment 색을 sRGB/Linear 등으로 변환. `renderer.outputColorSpace`, `renderer.toneMapping`.

> 그래서 같은 "삼각형 1개" 라도, raw WebGL 데모 02는 12) drawArrays까지만 하면 끝이지만, Three.js의 `MeshStandardMaterial` 큐브 1개는 *라이팅 계산 + 그림자 + 톤매핑 + 매트릭스 갱신* 까지 매 프레임 일어나서 훨씬 무겁다.

---

## 4. `renderer.info` — 한 프레임의 *비용*을 숫자로

Three.js는 디버그용으로 한 프레임의 통계를 노출한다. 데모 02의 우상단 오버레이가 raw WebGL판이라면, Three.js판은 이거:

```ts
console.log(renderer.info);
// {
//   memory: { geometries: 12, textures: 3 },        ← 현재 GPU에 살아있는 자원 수
//   render: {
//     calls: 18,        ← 이번 프레임 draw call 수  ★ Phase 3에서 줄일 핵심 지표
//     triangles: 24580, ← 그린 삼각형 수
//     points: 0,
//     lines: 0,
//     frame: 1234       ← 누적 프레임 번호
//   },
//   programs: [ ... ]   ← 컴파일된 셰이더 프로그램들 (재사용 캐시)
// }
```

해석 가이드:
- `render.calls` 가 프레임마다 *증가* → 누수. 보통 코드를 다시 보면 매 프레임 `new THREE.Mesh()` 같은 짓을 하고 있음.
- `memory.geometries / textures` 가 페이지를 오래 켜둘수록 증가 → 언마운트 시 `dispose()` 빠뜨림.
- `render.calls` 가 큰데(예: 수천) FPS가 낮음 → InstancedMesh / merged geometry / atlas 텍스처 등으로 묶어야 함. (Phase 3 주제)
- `programs.length` 가 비정상적으로 많음 → 비슷한 Material을 매번 새로 만들고 있음. Material을 캐시/재사용해야 함.

`r3f-perf` 의 `<Perf />` HUD가 보여주는 게 결국 이 정보 + GPU 시간 측정.

---

## 5. Draw call이 왜 비싼가 (Phase 3 예고)

draw call 1번은 *GPU에게 그리라 명령하는 것*만 비용은 작아 보이지만, 실제로는 매번:
- 어떤 셰이더(`useProgram`)인지 전환 → GPU 파이프라인 stall
- 어떤 버퍼·텍스처가 바인딩됐는지 검증
- 어떤 uniform들이 셋팅됐는지 업로드
- 드라이버가 GPU 명령 큐에 명령 직렬화 → JS 메인 스레드 ↔ GPU 동기화 비용

→ "100만 개 삼각형을 1 draw call로" 그리는 게 "100개 삼각형을 1만 draw call로" 그리는 것보다 *훨씬* 빠르다. **GPU는 일을 많이 시키는 것보다 자주 깨우는 게 더 비싸다.**

Three.js에서 draw call을 줄이는 무기 (Phase 3 데모에서 직접 비교):
1. **`InstancedMesh`** — 같은 geometry+material을 위치만 다르게 N개 → draw call 1번
2. **Geometry merge** — 정적인 N개 geometry를 합쳐 단일 Mesh → draw call 1번 (`BufferGeometryUtils.mergeGeometries`)
3. **Texture atlas** — 텍스처 여러 장을 한 장에 묶어 material 분기 줄임
4. **재질 공유** — 같은 색·재질의 mesh가 다른 material 인스턴스를 쓰지 않게
5. **on-demand 렌더** — 상호작용이 없을 땐 아예 `renderer.render`를 안 부름 (`<Canvas frameloop="demand">`)

---

## 6. 자원 수명 — `dispose()`가 진짜로 하는 일

Three.js의 `dispose()` 는 결국 raw WebGL의 다음 호출들을 부른다:
- `BufferGeometry.dispose()` → `gl.deleteBuffer(...)` (모든 attribute의 VBO)
- `Material.dispose()` → `gl.deleteProgram(...)` (해당 program 캐시 무효화)
- `Texture.dispose()` → `gl.deleteTexture(...)`
- `WebGLRenderer.dispose()` → 위 전부 + 컨텍스트 자원 정리

**자동 안 됨**의 의미: scene에서 `scene.remove(mesh)` 만 하면 자바스크립트는 GC 대상이지만, **GPU에 올라간 buffer/texture/program 은 안 지워진다.** 페이지를 오래 켜놓고 mesh를 마운트/언마운트 반복하면 GPU 메모리만 계속 쌓임 → 결국 브라우저가 컨텍스트를 강제로 잃거나 페이지가 멈춤.

Phase 3 데모(20번)에서 이걸 *측정 가능한 그래프*로 보일 예정:
- "Bad" 모드: 매 프레임 `new` + dispose 없음 → `renderer.info.memory.geometries` 가 시간에 따라 우상향
- "Good" 모드: `useMemo` 재사용 + 언마운트 시 dispose → 평평

---

## 7. 데모 02 → Three.js로 옮기면 어떻게 짧아지나

같은 무지개 삼각형을 Three.js로 만들면(셰이더는 똑같이 GLSL을 ShaderMaterial로 넣음):

```tsx
function RainbowTriangle() {
  const ref = useRef<Mesh>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.z += dt * 0.5; });

  // BufferGeometry — raw의 (4)(5)(6) 단계가 이 한 묶음
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array([
       0,  0.7, 0,  -0.7, -0.6, 0,   0.7, -0.6, 0,
    ]), 3));
    g.setAttribute("color", new THREE.BufferAttribute(new Float32Array([
      1, 0.1, 0.2,  0.1, 0.9, 0.4,  0.2, 0.4, 1,
    ]), 3));
    return g;
  }, []);

  return (
    <mesh ref={ref} geometry={geometry}>
      <meshBasicMaterial vertexColors />   {/* fragment shader 안 짜도 vertex color 자동 보간 */}
    </mesh>
  );
}
```

비교:
- raw WebGL ~ **170줄** (셰이더 소스 + 컴파일 헬퍼 + bind/draw 등)
- Three.js ~ **20줄**
- 차이의 정체 = 위 1~3절의 자동화 분량.

→ **Three.js를 쓴다고 내부 동작을 모르면 되는 게 아니라, "내가 코드 안 친 그 부분에서 어떤 일이 일어나고 있는지" 를 안 채로 쓰는 게 중요**. 그래서 raw WebGL 한 번이 의미가 있음.

---

## 8. 더 깊이 갈 키워드 (선택, Phase 1 안에서는 생략)

- WebGL 2 vs 1 (UBO, VAO, MRT, instanced rendering 네이티브)
- VAO (Vertex Array Object) — bind 상태를 묶어두는 객체. WebGL 1 은 `OES_vertex_array_object` 확장.
- Compressed textures (KTX2, Basis) — Phase 3에서 다룰 텍스처 메모리 절약
- WebGPU — WebGL의 후속. Three.js `WebGPURenderer` 가 베타로 있음. 컨셉은 비슷하지만 pipeline 객체·바인드 그룹 등 더 명시적.

---

## 한 줄 요약
> **`renderer.render(scene, camera)` 한 줄 = 매 프레임 `scene` 안의 mesh마다 [VBO bind → program 활성 → uniform 갱신 → drawArrays] 를 자동으로 + 행렬 갱신·culling·정렬·라이트·그림자·톤매핑 까지.** 데모 02는 그 중 한 mesh, 한 draw call의 raw 버전을 직접 짜본 것. 다음(데모 03)은 Scene graph(부모-자식 행렬 합성)를 시각화해서 "scene을 순회하는 과정"을 손에 익힌다.
