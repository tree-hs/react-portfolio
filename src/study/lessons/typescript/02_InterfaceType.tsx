// 레슨 02: interface vs type — 객체 모양 묘사의 두 가지 방법.
interface UserI {
  id: string;
  name: string;
}

type UserT = {
  id: string;
  name: string;
};

interface AdminI extends UserI {
  role: "admin";
}
type AdminT = UserT & { role: "admin" };

type ID = string | number;

const admin: AdminI = { id: "u1", name: "Hs", role: "admin" };
const adminT: AdminT = { id: "u2", name: "Hs2", role: "admin" };
const id1: ID = "abc";
const id2: ID = 42;

export default function Demo() {
  const rows: Array<[string, string]> = [
    ["UserI", `{ id: "${admin.id}", name: "${admin.name}" }`],
    ["AdminI", JSON.stringify(admin)],
    ["AdminT", JSON.stringify(adminT)],
    ["ID (union)", `"${id1}" | ${id2}`],
  ];
  return (
    <table className="study-table">
      <thead>
        <tr>
          <th>타입</th>
          <th>값</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([t, v]) => (
          <tr key={t}>
            <td>
              <code>{t}</code>
            </td>
            <td>
              <code>{v}</code>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
