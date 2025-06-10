export function UserDetails() {
  return (
    <div className="user-details">
      <h1>User Details</h1>
      <p>Here you can view and edit user details.</p>
      <form>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}