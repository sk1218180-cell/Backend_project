import { Search, Upload, Bell } from "lucide-react";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6 z-50">

      <h1 className="text-2xl text-red-600 font-bold">
        StreamTube
      </h1>

      <div className="flex w-500px">

        <input
          placeholder="Search videos..."
          className="flex-1 bg-zinc-800 rounded-l-full px-4 py-2 outline-none text-white"
        />

        <button className="bg-zinc-700 px-5 rounded-r-full hover:bg-zinc-600">
          <Search size={20}/>
        </button>

      </div>

      <div className="flex gap-5 items-center">

        <Upload className="cursor-pointer"/>

        <Bell className="cursor-pointer"/>

        <img
          src="https://i.pravatar.cc/100"
          className="w-10 h-10 rounded-full cursor-pointer"
        />

      </div>

    </header>
  );
};

export default Navbar;