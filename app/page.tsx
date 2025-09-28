export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200">
          <div className="grid gap-0 md:grid-cols-2">
            <div className="p-10">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
                Bantu Sesama, Mulai Hari Ini
              </h1>
              <p className="mt-3 text-slate-600">
                Donasi Anda membawa dampak nyata. Bayar mudah dengan QRIS dari bank atau e-wallet apa pun.
              </p>
              <a
                href="/donasi"
                className="mt-8 inline-flex items-center justify-center rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
              >
                Mulai Donasi
              </a>
              <p className="mt-3 text-xs text-slate-500">
                Aman, cepat, dan transparan.
              </p>
            </div>

            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-slate-50" />
              <div className="absolute right-8 top-8 h-28 w-28 rounded-2xl bg-sky-100" />
              <div className="absolute bottom-10 left-12 h-20 w-20 rounded-2xl bg-indigo-100" />
              <div className="absolute right-20 bottom-16 h-12 w-32 rounded-full bg-slate-100" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
