export type Year = number;

export type YearRange = {
  start: Year;
  end: Year | "present";
};

export interface CompanyCareer {
  id: number;
  company: string;
  role: string;
  employmentLabel?: string;
  period: { start: string; end: string | "present" };
}

export interface CompanyQueryParams {
  year?: Year;
}
