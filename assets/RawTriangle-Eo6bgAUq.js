import{r as i,j as a}from"./index-D5znGMJm.js";import{u as Y}from"./leva.esm-t91ts9Ho.js";const G=`
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
`,V=`
  precision mediump float;   // WebGL 1 의 fragment shader는 float 정밀도 선언이 필수

  varying vec3 vColor;        // vertex에서 넘어온 색 (이미 보간됨)
  uniform float uIntensity;   // 색 밝기 배율

  void main() {
    // gl_FragColor = 이 픽셀의 최종 색 (r, g, b, a)
    gl_FragColor = vec4(vColor * uIntensity, 1.0);
  }
`;function j(r,c,l){const t=r.createShader(c);if(!t)throw new Error("gl.createShader() returned null");if(r.shaderSource(t,l),r.compileShader(t),!r.getShaderParameter(t,r.COMPILE_STATUS)){const f=r.getShaderInfoLog(t);throw r.deleteShader(t),new Error(`Shader 컴파일 실패 (${c===r.VERTEX_SHADER?"vertex":"fragment"}):
${f}`)}return t}function W(r,c,l){const t=r.createProgram();if(!t)throw new Error("gl.createProgram() returned null");if(r.attachShader(t,c),r.attachShader(t,l),r.linkProgram(t),!r.getProgramParameter(t,r.LINK_STATUS)){const f=r.getProgramInfoLog(t);throw r.deleteProgram(t),new Error(`Program 링크 실패:
${f}`)}return t}function q(){const r=i.useRef(null),[c,l]=i.useState(0),[t,f]=i.useState(0),[b,P]=i.useState(null),{speed:h,intensity:g,paused:p}=Y("Triangle",{speed:{value:.5,min:0,max:3,step:.1,label:"회전 속도"},intensity:{value:1,min:.2,max:2,step:.05,label:"색 밝기"},paused:{value:!1,label:"정지"}}),F=i.useRef({speed:h,intensity:g,paused:p});return i.useEffect(()=>{F.current={speed:h,intensity:g,paused:p}},[h,g,p]),i.useEffect(()=>{const n=r.current;if(!n)return;const e=n.getContext("webgl");if(!e){P("이 브라우저는 WebGL을 지원하지 않습니다.");return}let s,A,R;try{A=j(e,e.VERTEX_SHADER,G),R=j(e,e.FRAGMENT_SHADER,V),s=W(e,A,R)}catch(o){P(o instanceof Error?o.message:String(o));return}const B=new Float32Array([0,.7,-.7,-.6,.7,-.6]),U=new Float32Array([1,.1,.2,.1,.9,.4,.2,.4,1]),v=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,v),e.bufferData(e.ARRAY_BUFFER,B,e.STATIC_DRAW);const w=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,w),e.bufferData(e.ARRAY_BUFFER,U,e.STATIC_DRAW);const T=e.getAttribLocation(s,"aPosition"),L=e.getAttribLocation(s,"aColor"),I=e.getUniformLocation(s,"uTime"),N=e.getUniformLocation(s,"uSpeed"),D=e.getUniformLocation(s,"uAspect"),M=e.getUniformLocation(s,"uIntensity"),k=()=>{const o=Math.min(window.devicePixelRatio,2),d=Math.round(n.clientWidth*o),u=Math.round(n.clientHeight*o);(n.width!==d||n.height!==u)&&(n.width=d,n.height=u,e.viewport(0,0,d,u))};let S=0,y=0,_=performance.now(),x=0,E=0,m=_;const C=o=>{const d=(o-_)/1e3;_=o;const{speed:u,intensity:O,paused:H}=F.current;H||(y+=d),k(),e.clearColor(.07,.07,.09,1),e.clear(e.COLOR_BUFFER_BIT),e.useProgram(s),e.bindBuffer(e.ARRAY_BUFFER,v),e.enableVertexAttribArray(T),e.vertexAttribPointer(T,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,w),e.enableVertexAttribArray(L),e.vertexAttribPointer(L,3,e.FLOAT,!1,0,0),e.uniform1f(I,y),e.uniform1f(N,u),e.uniform1f(M,O),e.uniform1f(D,n.width/n.height),e.drawArrays(e.TRIANGLES,0,3),E+=1,x+=1,o-m>=500&&(l(Math.round(x*1e3/(o-m))),f(Math.round(E*1e3/(o-m))),x=0,E=0,m=o),S=requestAnimationFrame(C)};return S=requestAnimationFrame(C),()=>{cancelAnimationFrame(S),e.deleteBuffer(v),e.deleteBuffer(w),e.deleteProgram(s),e.deleteShader(A),e.deleteShader(R)}},[]),a.jsxs("div",{className:"lab-canvas raw-webgl",children:[a.jsx("canvas",{ref:r,className:"raw-webgl__canvas"}),a.jsxs("div",{className:"raw-webgl__stats","aria-hidden":"true",children:[a.jsxs("div",{children:[a.jsx("span",{className:"raw-webgl__k",children:"FPS"}),a.jsx("span",{children:c})]}),a.jsxs("div",{children:[a.jsx("span",{className:"raw-webgl__k",children:"draw calls / sec"}),a.jsx("span",{children:t})]}),a.jsxs("div",{children:[a.jsx("span",{className:"raw-webgl__k",children:"vertices / draw"}),a.jsx("span",{children:"3"})]}),a.jsxs("div",{children:[a.jsx("span",{className:"raw-webgl__k",children:"triangles"}),a.jsx("span",{children:"1"})]})]}),b&&a.jsx("pre",{className:"raw-webgl__err",children:b})]})}export{q as default};
