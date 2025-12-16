import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div>
      {/* চাইলে এখানে Navbar দিতে পারো */}
      <Outlet />
    </div>
  );
}
