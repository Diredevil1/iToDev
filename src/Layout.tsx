import { NavLink, Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div className="isolate flex flex-col h-screen gap-20">
      <header className="flex items-center justify-between sticky p-6 bg-zinc-900 text-white h-[6rem]">
        <h1 className="text-5xl font-bold text-amber-300">iToDev STAR WARS</h1>
        <div className="text-2xl flex gap-8 font-semibold">
          <NavLink
            to="films"
            className={({ isActive }) =>
              isActive ? "text-amber-300" : "hover:text-red-400"
            }
          >
            Films
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "text-amber-300" : "hover:text-red-400"
            }
            to="characters"
          >
            Characters
          </NavLink>
        </div>
      </header>
      <main className="px-20">
        <Outlet />
      </main>
    </div>
  );
};
