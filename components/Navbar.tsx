import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-indigo-600">SkillSwap</Link>
        <div className="flex gap-5 text-sm font-medium text-gray-700">
          <Link href="/">Browse</Link>
          <Link href="/gigs/new">Post a gig</Link>
          <Link href="/dashboard">Creator dashboard</Link>
          <Link href="/my-bookings">My bookings</Link>
        </div>
      </div>
    </nav>
  );
}