export type Year = number;

export type YearRange = {
  start: Year;
  end: Year | "present";
};

export interface CompanyCareer {
  id: number;
  company: string;
  /** 고용형태 (사원/프리랜서/선임연구원 등) */
  employmentType?: string;
  /** 소속 팀 (없을 수 있음) */
  team?: string;
  /** 직무 (퍼블리셔/프론트엔드 개발자 등) */
  position: string;
  period: { start: string; end: string | "present" };
  /** 주요 업무 — 줄 단위 배열 */
  highlights: string[];
  /** 사용 기술 */
  techStack: string[];
}

export interface CompanyQueryParams {
  year?: Year;
}
