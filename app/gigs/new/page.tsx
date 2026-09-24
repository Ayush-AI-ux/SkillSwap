import PostGigForm from "@/components/PostGigForm";

export default function NewGigPage() {
  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-8">
      <h1 className="text-3xl font-bold tracking-tight">Post a gig</h1>
      <p className="mt-2 text-gray-600">List a service so clients can book you.</p>
      <PostGigForm />
    </div>
  );
}