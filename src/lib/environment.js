/**
 * Utilitas environment aplikasi.
 *
 * Sumber kebenaran: variabel env `VITE_ENVIRONMENT` (lihat .env / .env.production).
 * Nilai yang dikenali: "development" | "production" (alias: "dev", "local").
 *
 * Default sengaja jatuh ke "production" (fail-closed): kalau env lupa diisi,
 * aplikasi lebih baik menampilkan kode HTTP generik daripada membocorkan
 * pesan error & stack trace ke user.
 *
 * PENTING: nilai env dipakai lewat perbandingan langsung dengan literal.
 * Vite mengganti `import.meta.env.VITE_ENVIRONMENT` dengan string literal saat
 * build, sehingga `IS_DEVELOPMENT` bisa di-constant-fold dan seluruh cabang
 * development (pesan error, stack trace, dsb) otomatis hilang dari bundle
 * production. Jangan diubah ke `.toLowerCase()`/`.trim()`/helper apa pun -
 * pemanggilan fungsi membuat nilai tidak bisa di-fold dan kode detail ikut
 * ter-bundle ke production.
 */

const RAW = import.meta.env.VITE_ENVIRONMENT;

const IS_DEV_VALUE =
  RAW === "development" || RAW === "dev" || RAW === "local";

/**
 * Gate untuk seluruh detail error (pesan, kode Firebase, stack trace).
 * Di production semua nilai ini harus bernilai false.
 */
export const IS_DEVELOPMENT = IS_DEV_VALUE;
export const IS_PRODUCTION = !IS_DEV_VALUE;

export const ENVIRONMENT = IS_DEV_VALUE ? "development" : "production";

/** Badge kecil yang dipakai di UI error agar mudah dikenali saat development. */
export const ENVIRONMENT_LABEL = IS_DEV_VALUE ? "DEVELOPMENT" : "PRODUCTION";
