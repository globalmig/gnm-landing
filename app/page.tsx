import LeadForm from "@/components/landing/LeadForm";

export default function LandingPage() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-blue-600">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-12 px-5 py-16 pc:flex-row pc:items-center pc:gap-20 pc:px-0">
        <div className="w-full pc:w-1/2">
          <p className="text-lg font-medium text-amber-300 pc:text-xl">남들은 다 받는 혜택</p>
          <h1 className="mt-2 text-3xl font-bold leading-snug text-white pc:text-5xl">
            아직도 기본 요금을<br/>다 내고 계신가요?
          </h1>
        </div>
        <LeadForm />
      </div>
    </section>
  );
}
