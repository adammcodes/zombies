export default function UserForm() {
  return (
    <tbody>
      <tr>
        <td>
          <label>Username</label>
        </td>
        <td>
          <input name="username" type="text"></input>
        </td>
      </tr>
      <tr>
        <td>
          <label>Email</label>
        </td>
        <td>
          <input name="email" type="text"></input>
        </td>
      </tr>
      <tr>
        <td>
          <label>Password</label>
        </td>
        <td>
          <input name="password" type="password"></input>
        </td>
      </tr>
    </tbody>
  );
}
