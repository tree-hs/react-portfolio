import "./04_Modules.scss";

export default function Demo() {
  return (
    <div className="sass-module-demo">
      <p>
        <code>@use './tokens' as t;</code> 로 가져온{" "}
        <code>t.$primary</code> 변수와
      </p>
      <p>같은 파일 안에서 정의한 <code>@mixin card</code> 가</p>
      <p>이 박스에 함께 적용되어 있습니다.</p>
      <p>
        이전 <code>@import</code> 와 달리 네임스페이스가 명시되어
      </p>
      <p>"이 변수가 어디서 왔는지" 한눈에 보입니다.</p>
    </div>
  );
}
