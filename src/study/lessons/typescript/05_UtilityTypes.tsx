// 레슨 05: 유틸리티 타입 — Partial / Pick / Omit / Record.
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

type UserUpdate = Partial<User>;
type UserPreview = Pick<User, "id" | "name">;
type UserCreate = Omit<User, "id">;

type Role = "admin" | "editor" | "viewer";
const roleLabel: Record<Role, string> = {
  admin: "관리자",
  editor: "에디터",
  viewer: "구독자",
};

const update: UserUpdate = { name: "정한석" };
const preview: UserPreview = { id: "u1", name: "Hs" };
const draft: UserCreate = { name: "Hs", email: "a@b.c", age: 34 };

export default function Demo() {
  return (
    <div className="study-stack">
      <div>
        <h5 className="study-h5">Partial&lt;User&gt; — 모두 optional</h5>
        <pre className="study-pre">{JSON.stringify(update, null, 2)}</pre>
      </div>
      <div>
        <h5 className="study-h5">Pick&lt;User, "id" | "name"&gt;</h5>
        <pre className="study-pre">{JSON.stringify(preview, null, 2)}</pre>
      </div>
      <div>
        <h5 className="study-h5">Omit&lt;User, "id"&gt;</h5>
        <pre className="study-pre">{JSON.stringify(draft, null, 2)}</pre>
      </div>
      <div>
        <h5 className="study-h5">Record&lt;Role, string&gt;</h5>
        <pre className="study-pre">{JSON.stringify(roleLabel, null, 2)}</pre>
      </div>
    </div>
  );
}
