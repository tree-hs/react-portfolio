import { useEffect, useMemo, useState } from "react";
import { fetchCompanies } from "../../api/companys";
import type { CompanyCareer } from "../../types/companys";

export default function Career() {
  // ✅ select에서 사용할 선택값 (전체/연도)
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");

  // ✅ 화면에 뿌릴 회사 목록
  const [companyList, setCompanyList] = useState<CompanyCareer[]>([]);

  // ✅ 연도 옵션 만들기 위해 "전체 데이터"도 한번 보관 (옵션 생성용)
  const [allCompanies, setAllCompanies] = useState<CompanyCareer[]>([]);

  // 1) 최초 1회: 전체 데이터 가져와서 옵션 생성 기반 확보
  useEffect(() => {
    fetchCompanies()
      .then((list) => {
        setAllCompanies(list);
        setCompanyList(list); // 최초는 전체 보여주기
      })
      .catch(console.error);
  }, []);
  const toYear = (v: number | string): number => Number(String(v).slice(0, 4));

  // 2) allCompanies를 바탕으로 연도 옵션 생성 (min~max)
  const yearOptions = useMemo(() => {
    if (allCompanies.length === 0) return [];

    const currentYear = new Date().getFullYear();

    const minYear = Math.min(
      ...allCompanies.map((c) => toYear(c.period.start))
    );
    const maxYear = Math.max(
      ...allCompanies.map((c) =>
        c.period.end === "present" ? currentYear : toYear(c.period.end)
      )
    );

    const years: number[] = [];
    for (let y = maxYear; y >= minYear; y--) years.push(y);
    return years;
  }, [allCompanies]);

  // 3) select 바뀔 때마다 필터된 리스트 받아오기 (캐시 있으면 빠름)
  useEffect(() => {
    const params = selectedYear === "all" ? {} : { year: selectedYear };
    fetchCompanies(params).then(setCompanyList).catch(console.error);
  }, [selectedYear]);

  return (
    <section className="filters">
      <div className="filters__row">
        <label className="filters__label" htmlFor="period">
          기간
        </label>
        <select
          name="period"
          id="period"
          value={selectedYear}
          onChange={(e) => {
            const v = e.target.value;
            setSelectedYear(v === "all" ? "all" : Number(v));
          }}
        >
          <option value="all">전체</option>

          {/* ✅ 여기 연도 띄워야됨 */}
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid--1-2 agp10">
        {companyList.map((c) => (
          <div className="project-card" key={c.id}>
            <div className="flx flx-btw">
              <div className="flx flx-vct xgp8">
                <div className="fs20">
                  <strong>{c.company}</strong>
                </div>
                <div className="fs12">
                  {c.period.start} ~ {c.period.end}
                </div>
              </div>
              <div className="flx flx_vct xgp8">
                <div className="fs12">{c.team}</div>
                <div className="fs12">{c.position}</div>
              </div>
            </div>
            <div className="elps">
              <div className="fs12 flx xgp4">
                {c.techStack.map((t) => (
                  <span key={`${c.id}-${t}`}>{t}</span>
                ))}
              </div>
            </div>
            <div className="fs12 elps elps-2">{c.highlights}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
