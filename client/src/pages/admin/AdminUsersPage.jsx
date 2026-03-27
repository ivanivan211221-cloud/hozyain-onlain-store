import { useEffect, useState } from "react";
import { http } from "../../api/http";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const load = () => http.get("/admin/users").then(({ data }) => setUsers(data));
  useEffect(() => { load(); }, []);

  const patchUser = async (id, body) => {
    await http.patch(`/admin/users/${id}`, body);
    load();
  };

  return (
    <div className="stack">
      <h1>Пользователи</h1>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Имя</th><th>Email</th><th>Роль</th><th>Блок</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <select value={u.role} onChange={(e) => patchUser(u.id, { role: e.target.value })}>
                    {["ADMIN", "MANAGER", "CONTENT_MANAGER", "CUSTOMER"].map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
                <td><input type="checkbox" checked={u.isBlocked} onChange={(e) => patchUser(u.id, { isBlocked: e.target.checked })} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
