import { CompanyCareer, CompanyQueryParams } from "../types/companys.ts";
const ENDPOINT = "/companies.json";

//Map<K, V> K(키)string, V(값)CompanyCareer
//캐시를 많이 활용함으로서 속도 개선
const responseCache = new Map<string, CompanyCareer[]>();

// (이유) params 객체(필터 조건)를 문자열 key로 바꿔 캐시 키/디버깅/URL 파라미터로 쓰기 위함
// - year=2021&sort=recent 같은 형태로 만들어서 "같은 조건이면 같은 결과"를 쉽게 판별
const buildQueryString = (params: CompanyQueryParams): string => {
  const sp = new URLSearchParams();
  // ✅ (이유) year가 있을 때만 파라미터에 넣어 불필요한 key 분기를 줄임
  if (params.year) sp.set("year", String(params.year));

  // (선택) 정렬 조건이 있다면 같은 방식으로 추가 가능
  // if (params.sort) sp.set("sort", params.sort);

  return sp.toString();
};
const toYear = (v: string | number) => Number(String(v).slice(0, 4));

const includesYear = (
  start: string | number,
  end: string | number | "present",
  year: number
) => {
  const startYear = toYear(start);
  const endYear = end === "present" ? new Date().getFullYear() : toYear(end);

  return startYear <= year && year <= endYear;
};

export const fetchCompanies = async (
  params: CompanyQueryParams = {}
  //Promise는 작업결과의 성공,실패 출력해줌 (pending/진행중)(fulfilled/성공)(rejected/실패)
): Promise<CompanyCareer[]> => {
  // 필터 조건을 문자열로 만들어 "캐시 key"로 쓰기 위함
  const key = buildQueryString(params);

  // 같은 조건으로 이미 받아온 결과가 있으면 네트워크 요청 생략
  if (responseCache.has(key)) {
    return responseCache.get(key)!; // key가 있으면 값도 존재하므로 !로 단언
  }

  // Vite 배포 환경에서 base path가 바뀌어도 경로가 깨지지 않게 하기 위함
  // - 로컬 개발: BASE_URL이 보통 "/"
  // - GitHub Pages 같은 서브경로 배포: BASE_URL이 "/repo-name/" 처럼 바뀜
  // - 그래서 "/companies.json" 하드코딩 대신 BASE_URL을 붙여 안전하게 요청
  const url = `${import.meta.env.BASE_URL}${ENDPOINT}`;

  //await는 promise가 끝날때까지 기다렸다 결과를 내는 키워드 await는 async 함수 안에서만 사용가능
  //fetch는 서버 or 파일에서 대이터를 요청하는 함수 웹에서 요청할때 흔이 씀
  const res = await fetch(url);

  //const res = await fetch(url);을 .then으로 쓸 경우
  /*
    return fetch(url).then((res) => {
      // 여기서 res를 사용할 수 있음
    });
    */

  // 404/500 같은 실패를 조기에 잡아서 UI/로직에서 예외처리하기 위함
  if (!res.ok) {
    //res.ok는 html 상태코드가 200~299면 true/ 404,500등은 false
    //throw가 실행되면 아래 동작들은 멈춤
    throw new Error(`Failed to fetch companies: ${res.statusText}`);
  }

  // JSON을 "경력 데이터 배열"로 사용할 예정이므로 타입을 명시
  // - 이후 period.start 같은 접근이 타입 안전해짐
  const payload: CompanyCareer[] = await res.json();

  // year 선택이 없으면(전체 보기) 불필요한 filter를 돌리지 않고 그대로 반환
  // - 성능/가독성에 유리
  if (params.year == null) {
    responseCache.set(key, payload); // 전체 목록도 캐싱해두면 재사용 가능
    return payload;
  }

  // "선택한 연도에 근무했던 기록만" 보여주기 위한 필터
  // - 2021~2022 근무면 2021, 2022 둘 다 포함되도록 includesYear 사용
  const filtered = payload.filter((item) =>
    includesYear(item.period.start, item.period.end, params.year!)
  );

  // 필터 결과도 캐싱해두면 같은 연도를 다시 선택할 때 즉시 반환 가능
  responseCache.set(key, filtered);

  return filtered;
};
