import { Lightbulb, BadgeDollarSign, Type } from "lucide-react";
import PostGigForm from "@/components/PostGigForm";

export default function NewGigPage() {
  return (
    <div className="fade-up mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-extrabold tracking-tight">Post a gig</h1>
        <p className="mt-2 text-gray-500">List a service so clients can book you.</p>
        <PostGigForm />
      </div>

      <aside className="h-fit space-y-4 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 p-8 text-white shadow-xl">
        <h2 className="flex items-center gap-2 text-lg font-bold"><Lightbulb size={20} /> Tips for a great gig</h2>
        {[
          { icon: Type, t: "Be specific", d: "\"Instagram Reels editing\" beats \"Video help\"." },
          { icon: BadgeDollarSign, t: "Price fairly", d: "Check similar gigs on Browse before setting your rate." },
          { icon: Lightbulb, t: "Say what's included", d: "Number of revisions, delivery time, file formats." },
        ].map((x) => {
          const Icon = x.icon;
          return (
            <div key={x.t} className="flex gap-3 rounded-2xl bg-white/10 p-4">
              <Icon size={20} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">{x.t}</p>
                <p className="text-sm text-violet-100">{x.d}</p>
              </div>
            </div>
          );
        })}
        <p className="pt-2 text-sm text-violet-100">New creators get a boost on the marketplace, so your first gig gets seen.</p>
      </aside>
    </div>
  );
}