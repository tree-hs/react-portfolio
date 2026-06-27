// 레슨 04: 제네릭 — 입력↔출력 타입 관계 표현.

/* ─────────────────────────────────────────────────────────────────────────
   first — "배열의 첫 원소를 그 배열과 같은 타입으로 돌려주는 함수"

   function first<T>(arr: T[]): T | undefined
            ─┬──   ─┬──    ─┬──   ─┬─────────
             │      │       │      └─ 반환 타입: T 이거나 undefined
             │      │       │         (빈 배열이면 arr[0] 이 undefined 라서)
             │      │       └─ 매개변수: "원소 타입이 T 인 배열"
             │      └─ 타입 매개변수 1개 선언 ("이 함수는 T 라는 타입을 다룬다")
             └─ 함수 이름

   ─── 호출하면 T 가 자동 추론된다 ─────────────────────────────────────────
     first([1, 2, 3])           → T = number → 반환 number | undefined
     first(["a", "b"])          → T = string → 반환 string | undefined
     first([{ id: "x" }])       → T = { id: string } → 반환 그 객체 | undefined
     first([])                  → T = never  → 반환 never | undefined (= undefined)

   ─── 동작 풀어보기 ────────────────────────────────────────────────────────
     1) 호출자가 first([1,2,3]) 처럼 부른다.
     2) TS가 arr 의 타입(number[])을 보고 "T 는 number 구나" 라고 추론.
     3) 본문 arr[0] 실행 → JS 차원에선 그냥 첫 원소 가져옴.
     4) TS는 반환 타입이 T | undefined 라고 약속했으므로,
        호출 위치에서 number | undefined 로 다뤄짐.

   ─── 왜 | undefined 가 붙어 있나? ────────────────────────────────────────
     arr[0] 은 배열이 비었으면 undefined.
     하지만 기본 설정에서 TS 는 "있다고 가정" — number[] 의 [0] 은 그냥 number.
     이 함수 코드는 "비어있을 수도 있다" 는 사실을 명시적으로 표현하려고
     반환 타입에 | undefined 를 직접 적어준 것. 호출자가 빈 배열 케이스를
     체크하도록 강제하는 효과.
     (tsconfig 의 noUncheckedIndexedAccess: true 옵션을 켜면 TS가 알아서
      arr[0] 의 타입을 T | undefined 로 만들어준다 — 더 안전한 모드.)

   ─── any 와의 차이 ───────────────────────────────────────────────────────
     function firstAny(arr: any[]): any { return arr[0]; }
     const x = firstAny([1, 2, 3]);
     x.toUpperCase();   // ✅ 에러 안 남 — 그러나 런타임에 폭발 (number 라 메서드 없음)

     const y = first([1, 2, 3]);
     y?.toUpperCase();  // ❌ 컴파일 에러: number 에는 toUpperCase 없음
     y?.toFixed(2);     // ✅ 정상 — T 가 number 라는 정보가 살아있음.
   ───────────────────────────────────────────────────────────────────────── */
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

/* ─────────────────────────────────────────────────────────────────────────
   byId — "id 를 가진 객체들의 배열에서 특정 id 의 항목을 찾아 반환"

   function byId<T extends { id: string }>(arr: T[], id: string): T | undefined
                 ─┬────────────────────
                  └─ 제약 (constraint):
                     "T 는 아무 타입이나 OK 가 아니라, 최소한 { id: string } 모양을 가져야 한다"

   ─── extends 가 여기서 의미하는 것 ───────────────────────────────────────
     "상속" 이 아니라 "제약" 이다.
     "T 가 { id: string } 을 만족해야만 이 함수를 쓸 수 있다" 는 뜻.
     덕분에 함수 본문 안에서 x.id 같은 속성 접근이 가능해진다.

     (제약이 없다면?)
       function byId<T>(arr: T[], id: string) {
         return arr.find((x) => x.id === id);
                                  ↑
                          ❌ TS 에러: "T 에 id 속성이 있는지 모르겠다"

   ─── 호출 예시와 추론 ────────────────────────────────────────────────────
     interface Todo { id: string; text: string; }
     const todos: Todo[] = [
       { id: "t1", text: "공부" },
       { id: "t2", text: "운동" },
     ];

     const found = byId(todos, "t2");
     //    ↑ T = Todo 로 추론됨 (Todo 가 { id: string } 을 만족하니까)
     //    found 의 타입: Todo | undefined
     //    → found?.text 접근 가능 (text 도 살아있음)

     byId([{ name: "a" }], "x");   // ❌ 컴파일 에러: { name } 에는 id 가 없음

   ─── 본문 동작 ────────────────────────────────────────────────────────────
     arr.find(콜백)
       · 배열 메서드. 콜백이 true 를 반환하는 "첫 번째" 원소를 돌려준다.
       · 못 찾으면 undefined → 그래서 반환 타입에 | undefined.
       · 콜백 (x) => x.id === id
         x: 배열에서 꺼낸 한 원소 (타입은 T).
         x.id: 제약 덕분에 string 으로 안전하게 알려져 있음.
         id:   함수의 두 번째 매개변수.
         ===:  엄격 비교. 두 string 이 글자 그대로 같으면 true.

   ─── "왜 그냥 any[] 안 쓰고 제네릭을?" ──────────────────────────────────
     · any[] 로 받으면 반환도 any → 호출자가 .text 같은 속성을 안전하게 못 씀.
     · 제네릭 + 제약: "id 는 있다는 것만 약속 받고, 나머지 모양은 호출자가
       알려준 그대로 보존" — Todo 를 넣으면 Todo 를 돌려줌, User 를 넣으면 User.
   ───────────────────────────────────────────────────────────────────────── */
function byId<T extends { id: string }>(arr: T[], id: string): T | undefined {
  return arr.find((x) => x.id === id);
}

/* ─────────────────────────────────────────────────────────────────────────
   pair — "서로 다를 수 있는 두 값을 받아 튜플로 묶어주는 함수"

   function pair<A, B>(a: A, b: B): [A, B]
                 ─┬─    ─┬───     ─┬───
                  │      │         └─ 반환: 길이 2 짜리 "튜플"
                  │      │            1번 자리=A 의 타입, 2번 자리=B 의 타입 (위치 고정)
                  │      └─ 매개변수 두 개의 타입이 각각 A, B
                  └─ 타입 매개변수 2개 ("이 함수는 두 종류의 타입을 다룬다")

   ─── 왜 <A, B> 두 개를 쓰나? <T> 하나로는 안 되나? ──────────────────────
     하나만 쓰면 두 인자가 "같은 타입" 이어야 한다는 의미가 된다:

       function pairSame<T>(a: T, b: T): [T, T] { return [a, b]; }
       pairSame(1, 2);       // ✅ T = number
       pairSame("a", 2);     // ⚠️ T = string | number 로 합쳐짐 — 의도 불분명

     <A, B> 처럼 따로 두면 각 인자가 독립적으로 추론된다:

       pair("a", 2);         // A = "a"(또는 string), B = number 로 따로 추론

   ─── 튜플 [A, B] vs 배열 (A | B)[] 차이 ─────────────────────────────────
     반환 타입이 (A | B)[] 였다면:
       const r = ["hi", 7] as (string | number)[];
       r[0]  // string | number — 어느 자리든 둘 다 가능. 좁히기 필요.

     반환 타입이 [A, B] 인 튜플이면:
       const r: [string, number] = ["hi", 7];
       r[0]  // string (확정) — toUpperCase() 바로 사용 가능
       r[1]  // number (확정) — toFixed() 바로 사용 가능

     → 튜플은 "위치별로 타입이 못박혀 있는" 배열. 정확한 타입 추적이 가능.

   ─── 호출 예시 ───────────────────────────────────────────────────────────
     const a = pair("hello", 42);        // [string, number]
     const b = pair(true, [1, 2, 3]);    // [boolean, number[]]
     const c = pair({ id: 1 }, "ok");    // [{ id: number }, string]

     // 실용 활용: useState 의 반환이 바로 이 패턴!
     // const [state, setState] = useState(0);
     // → useState 의 반환 타입이 [T, Dispatch<...>] 튜플이라서
     //   디스트럭처링으로 두 다른 타입을 한 줄에 받을 수 있다.

   ─── 본문 동작 ───────────────────────────────────────────────────────────
     return [a, b];
       · JS 차원: 두 값을 배열에 담아 반환.
       · TS 차원: 반환 타입을 [A, B] 로 약속했으므로 그 튜플로 인식됨.
         (만약 반환 타입을 적지 않으면 (A | B)[] 로 추론될 수도 있어서,
          : [A, B] 를 명시해주는 게 안전.)
   ───────────────────────────────────────────────────────────────────────── */
function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}

interface Todo {
  id: string;
  text: string;
}

const todos: Todo[] = [
  { id: "t1", text: "공부" },
  { id: "t2", text: "운동" },
];

export default function Demo() {
  const n = first([1, 2, 3]);
  const s = first(["apple", "banana"]);
  const found = byId(todos, "t2");
  /*
    pair("size" as const, 12)
    ─────────────────────────
    "as const" = "TS야, 이 값의 타입을 넓히지(widening) 말고 적힌 그대로 봐줘."

    ─── as const 없으면 ──────────────────────────────────────────────────
      pair("size", 12)
        · TS 가 "size" 를 친절하게 string 으로 넓혀버림.
        · 결과 타입: [string, number]
        · tup[0] 의 타입 = string ("size" 라는 정보는 사라짐)

    ─── as const 붙이면 ─────────────────────────────────────────────────
      pair("size" as const, 12)
        · "size" 가 그대로 "size" 라는 리터럴 타입으로 고정.
        · 결과 타입: ["size", number]
        · tup[0] 의 타입 = "size"   ← 정확한 정보 보존

    ─── 왜 TS 는 평소엔 넓혀주나? ────────────────────────────────────────
      let x = "size";   // x: string   ← 나중에 "color" 등으로 바꿀 수 있으니 넓힘
      const y = "size"; // y: "size"   ← const 라 못 바꾸니 그대로 둠
      함수 인자도 평소엔 string 으로 넓혀짐 — 그 친절함을 끄는 도구가 as const.

    ─── as const 의 3가지 효과 ──────────────────────────────────────────
      1) 문자열 리터럴이 그대로 살아남음: "size" → "size" (그냥 string 아님)
      2) 객체/배열의 속성이 readonly: 수정 불가
      3) 배열 → 튜플 로 인식: [1, 2, 3] as const → readonly [1, 2, 3]

    ─── 실무에서 빛나는 곳 ──────────────────────────────────────────────
      · 디스크리미네이티드 유니온의 type 필드 ("INCREMENT" 처럼)
      · enum 대안: const SIZES = ["sm","md","lg"] as const;
                  type Size = typeof SIZES[number];  // "sm" | "md" | "lg"
      · React props 에 리터럴만 허용하고 싶을 때

    ─── 이 데모에서의 역할 ──────────────────────────────────────────────
      "제네릭에 리터럴 타입까지 그대로 흘러가는 것" 을 시각적으로 보여주려고
      의도적으로 붙인 것. 빼고 hover 해보면 첫 자리 타입이 string 으로 바뀜.
  */
  const tup = pair("size" as const, 12);

  return (
    <ul className="study-list study-list--plain">
      <li>
        <code>first([1,2,3])</code> → <strong>{String(n)}</strong>{" "}
        <em>(number | undefined)</em>
      </li>
      <li>
        <code>first(["apple","banana"])</code> → <strong>{String(s)}</strong>{" "}
        <em>(string | undefined)</em>
      </li>
      <li>
        <code>byId(todos, "t2")</code> →{" "}
        <strong>{found ? `${found.id}: ${found.text}` : "undefined"}</strong>
      </li>
      <li>
        <code>pair("size", 12)</code> → <strong>[{tup[0]}, {tup[1]}]</strong>{" "}
        <em>(["size", number])</em>
      </li>
    </ul>
  );
}
