import { demos } from "./registry";
export default function TestLabDemoPage() {
  return (
    <section className="test-lab-demo" style={{ padding: "100px 0 120px" }}>
      TestLabDemoPage
      <ul>
        {demos.map((d) => (
          <li key={d.id}>
            <p>{d.id}</p>
            <p>{d.no}</p>
            <p>{d.title}</p>
            <p>{d.summary}</p>
            <p>{d.status}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}