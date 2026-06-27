import { Link } from "react-router-dom";
import { demos } from "./registry";
export default function testLabPage() {
  return (
    <section className="test-lab" style={{ padding: "100px 0 120px" }}>
      testLabPage
      <Link to={`/testLab/${demos[0].id}`}>Test sub Link</Link>
    </section>
  );
}