"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  qrString: string;
  transactionId: string;
  totalAmount: number;
  expiredAt: string; // ISO
  status: "pending" | "paid" | string;
};

function formatCurrency(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function QRCodeCard({
  qrString,
  transactionId,
  totalAmount,
  expiredAt,
  status,
}: Props) {
  const qrUrl = useMemo(
    () =>
      `https://larabert-qrgen.hf.space/v1/create-qr-code?size=480x480&style=2&color=0ea5e9&data=${encodeURIComponent(
        qrString
      )}`,
    [qrString]
  );

  const [remainingMs, setRemainingMs] = useState(
    new Date(expiredAt).getTime() - Date.now()
  );

  useEffect(() => {
    const t = setInterval(() => {
      setRemainingMs(new Date(expiredAt).getTime() - Date.now());
    }, 1000);
    return () => clearInterval(t);
  }, [expiredAt]);

  const isExpired = remainingMs <= 0 && status !== "paid";
  const mm = Math.max(0, Math.floor(remainingMs / 60000));
  const ss = Math.max(0, Math.floor((remainingMs % 60000) / 1000));

  const progress = Math.max(
    0,
    Math.min(100, (remainingMs / (10 * 60 * 1000)) * 100) // fallback TTL 10 menit
  );

  const statusStyle =
    status === "paid"
      ? "bg-emerald-500 text-white"
      : isExpired
      ? "bg-rose-500 text-white"
      : "bg-amber-400 text-white";

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
      {/* Header */}
      <div className="px-6 pt-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Scan QRIS untuk Donasi
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Gunakan aplikasi bank / e-wallet Anda untuk menyelesaikan pembayaran.
          </p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-4 py-1 text-sm font-semibold shadow ${statusStyle}`}
        >
          {isExpired ? "Expired" : status}
        </span>
      </div>

      {/* QR */}
      <div className="px-6 py-6 flex justify-center">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-inner">
          <img
            src={qrUrl}
            alt="QR Code"
            width={320}
            height={320}
            className="block w-full"
          />
        </div>
      </div>

      {/* Details */}
      <div className="px-6 pb-6 space-y-6">
        <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-200">
          <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Transaction ID
          </dt>
          <dd className="mt-1 text-sm font-mono font-semibold text-gray-900 break-words">
            {transactionId}
          </dd>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-200">
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Total Amount
            </dt>
            <dd className="mt-1 text-lg font-bold text-gray-900">
              {formatCurrency(totalAmount)}
            </dd>
          </div>
          <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-200">
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Waktu Tersisa
            </dt>
            <dd
              className={`mt-1 text-lg font-semibold ${
                isExpired ? "text-rose-600" : "text-gray-900"
              }`}
            >
              {isExpired ? "Habis" : `${mm}m ${ss}s`}
            </dd>
          </div>
        </div>

        {/* Progress (countdown) */}
        <div>
          <div className="h-2 w-full rounded-full bg-gray-100">
            <div
              className={`h-2 rounded-full transition-[width] duration-500 ${
                isExpired ? "bg-rose-500" : "bg-sky-600"
              }`}
              style={{ width: `${isExpired ? 0 : progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Kedaluwarsa pada: {new Date(expiredAt).toLocaleString("id-ID")}
          </p>
        </div>
      </div>
    </div>
  );
}
