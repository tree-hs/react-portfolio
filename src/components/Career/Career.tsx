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
    <section id="experience" className="experience-section">
      <h2>
        <span className="section-number">02.</span>
        Where I've Worked
      </h2>
      
      <div className="experience__container">
        <div className="experience__tabs">
          <select
            className="experience__select"
            name="period"
            id="period"
            value={selectedYear}
            onChange={(e) => {
              const v = e.target.value;
              setSelectedYear(v === "all" ? "all" : Number(v));
            }}
          >
            <option value="all">All</option>
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="experience__content">
          {companyList.map((c, idx) => (
            <div key={c.id} className="experience__item">
              <div className="experience__header">
                <h3 className="experience__title">
                  <span>{c.position}</span>
                  <span className="experience__company"> @ {c.company}</span>
                </h3>
                <p className="experience__period">
                  {c.period.start} — {c.period.end}
                </p>
              </div>
              <p className="experience__team">{c.team}</p>
              <p className="experience__description">{c.highlights}</p>
              <div className="experience__tech">
                {c.techStack.map((t) => (
                  <span key={`${c.id}-${t}`} className="experience__tech-item">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
