"use client";

import { useEffect, useMemo, useState } from "react";
import QRCodeCard from "@/components/QRCodeCard";

function classNames(...s: (string | false | undefined)[]) {
  return s.filter(Boolean).join(" ");
}

export default function DonasiPage() {
  const [amount, setAmount] = useState<number>(10000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [qrString, setQrString] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [status, setStatus] = useState<"pending" | "paid" | string>("");
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [expiredAt, setExpiredAt] = useState("");

  const finalAmount = useMemo(() => {
    const v = Number(customAmount || amount);
    return Number.isFinite(v) && v > 0 ? Math.round(v) : 0;
  }, [amount, customAmount]);

  const presets = [10000, 25000, 50000, 100000];

  const handleGenerate = async () => {
    if (!finalAmount) return;
    try {
      setLoading(true);
      const res = await fetch("/api/qris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: process.env.ID_QRIS,
          amount: finalAmount,
          useUniqueCode: true,
          packageIds: ["id.dana"],
        }),
      });

      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e?.error || "Failed to create QR");
      }

      const data = await res.json();
      setQrString(data.data.qr_string);
      setTransactionId(data.data.transactionId);
      setTotalAmount(data.data.totalAmount ?? data.data.originalAmount ?? finalAmount);
      setExpiredAt(
        data.data.expiredAt ||
          new Date(Date.now() + 10 * 60 * 1000).toISOString() // fallback 10 menit
      );
      setStatus("pending");
    } catch (error: any) {
      alert(error?.message || "Gagal generate QRIS. Cek koneksi/API.");
    } finally {
      setLoading(false);
    }
  };

  // polling status
  useEffect(() => {
    if (!transactionId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/check-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transactionId }),
        });
        const data = await res.json();
        if (data?.data?.status) setStatus(data.data.status);
      } catch {
        // abaikan error polling
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [transactionId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Donasi
          </h1>
          <p className="mt-1 text-slate-600">
            Terima kasih atas dukungan Anda. Silakan pilih nominal atau masukkan jumlah sendiri.
          </p>
        </div>

        {!qrString ? (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Card: pilih nominal */}
            <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
              <h2 className="text-lg font-medium text-slate-900">Pilih Nominal</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {presets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setAmount(p);
                      setCustomAmount("");
                    }}
                    className={classNames(
                      amount === p && !customAmount
                        ? "ring-2 ring-sky-400 bg-sky-50 text-slate-900"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100",
                      "w-full rounded-xl px-4 py-3 text-sm font-semibold shadow-sm ring-1 ring-slate-200 transition"
                    )}
                  >
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(p)}
                  </button>
                ))}
              </div>

              <div className="mt-5">
                <label className="block text-sm font-medium text-slate-700">
                  Atau masukkan jumlah sendiri
                </label>
                <div className="mt-2 relative">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1000}
                    placeholder="Contoh: 75000"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none ring-0 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />
                  {finalAmount > 0 && (
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-semibold text-slate-500">
                      IDR
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !finalAmount}
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Membuat QR..." : "Buat QRIS"}
              </button>
              <p className="mt-3 text-xs text-slate-500">
                QR akan dibuat untuk e-wallet/bank yang tersedia (package: <span className="font-mono">id.dana</span>).
              </p>
            </div>

            {/* Card: ringkasan */}
            <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
              <h2 className="text-lg font-medium text-slate-900">Ringkasan</h2>
              <dl className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-slate-600">Nominal</dt>
                  <dd className="text-sm font-semibold text-slate-900">
                    {finalAmount
                      ? new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(finalAmount)
                      : "-"}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-slate-600">Kode Unik</dt>
                  <dd className="text-sm text-slate-900">Aktif</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-slate-600">Metode</dt>
                  <dd className="text-sm text-slate-900">QRIS</dd>
                </div>
              </dl>
              <div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs text-slate-500 ring-1 ring-slate-200">
                Setelah QR dibuat, kami akan mengecek status pembayaran setiap 5 detik.
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <QRCodeCard
              qrString={qrString}
              transactionId={transactionId}
              totalAmount={totalAmount}
              expiredAt={expiredAt}
              status={status}
            />

            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Status saat ini:{" "}
                <span
                  className={classNames(
                    status === "paid"
                      ? "text-emerald-600"
                      : status === "pending"
                      ? "text-amber-600"
                      : "text-rose-600",
                    "font-semibold"
                  )}
                >
                  {status}
                </span>
              </div>

              <button
                onClick={() => {
                  // reset flow
                  setQrString("");
                  setTransactionId("");
                  setStatus("");
                  setTotalAmount(0);
                  setExpiredAt("");
                }}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Buat QR Baru
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
