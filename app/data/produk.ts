// ~/data/productCatalog.ts
export type Tone = 'emerald' | 'blue' | 'amber' | 'violet'
export type Category = 'Website' | 'Mobile App' | 'Add-On'

export type KPI = { label: string; value: string }
export type Persona = { role: string; needs: string; outcomes: string }
export type Capability = { title: string; desc: string; icon: string }
export type Module = { title: string; desc: string }
export type Step = { title: string; desc: string }
export type ArchitectureItem = { title: string; desc: string }
export type SecurityItem = { title: string; desc: string }
export type Integration = { name: string; icon: string }
export type Plan = { name: string; price: string; unit?: string; best?: boolean; features: string[] }
export type CaseStudy = { title: string; summary: string; impact: string; metric?: string }
export type FAQ = { q: string; a: string }

export type Product = {
  slug: string
  title: string
  subtitle?: string
  short: string
  category: Category
  icon: string
  tone: Tone
  tags: string[]
  images?: {
    cover?: string
    alt1?: string
    alt2?: string
  }
  detail: {
    overview: string
    highlights: string[]
    kpis: KPI[]
    personas: Persona[]
    features: Capability[]
    modules: Module[]
    workflow: Step[]
    architecture: ArchitectureItem[]
    security: SecurityItem[]
    integrations: Integration[]
    pricing: Plan[]
    timeline: Step[]
    caseStudies: CaseStudy[]
    faqs: FAQ[]
    related?: string[]
  }
}

/* Helper image placeholders (Unsplash) – bebas diganti */
const img = {
  siakad: '/assets/images/product/siakad/0.png',
  cms: '/assets/images/product/web/0.png',
  app: '/assets/images/product/app/0.png',
  cbt: '/assets/images/product/app/0.png',
  toriid: '/assets/images/product/toriid/0.png',
  autobot: '/assets/images/product/autobot/0.png',
  alt1: '/assets/images/product/siakad/1.png',
  alt2: '/assets/images/product/siakad/2.png',
  cms_alt1: '/assets/images/product/web/1.png',
  cms_alt2: '/assets/images/product/web/2.png',
  app_alt1: '/assets/images/product/app/1.png',
  app_alt2: '/assets/images/product/app/2.png',
  cbt_alt1: '/assets/images/product/app/1.png',
  cbt_alt2: '/assets/images/product/app/2.png',
  toriid_alt1: '/assets/images/product/toriid/1.png',
  toriid_alt2: '/assets/images/product/toriid/2.png',
  autobot_alt1: '/assets/images/product/autobot/1.png',
  autobot_alt2: '/assets/images/product/autobot/2.png',
}

/* ========================= CATALOG ========================= */
export const produk: Product[] = [
  {
    slug: 'obayan-siakad',
    title: 'Obayan SIAKAD',
    subtitle: 'Sistem Manajemen Pendidikan',
    short: 'Website inti untuk kelola data akademik, kelas, nilai, rapor, dan arsip.',
    category: 'Website',
    icon: 'mingcute:web-line',
    tone: 'emerald',
    tags: ['Akademik', 'Data Induk', 'Rapor'],
    images: { cover: img.siakad, alt1: img.alt1, alt2: img.alt2 },
    detail: {
      overview:
        'Obayan SIAKAD adalah pondasi data untuk sekolah/pesantren. Satu dashboard untuk data santri/guru, kelas/rombel, jadwal, nilai, hingga rapor digital.',
      highlights: [
        'Struktur multi-unit & multi-tahun ajaran',
        'Relasi data rapi: santri ⇄ kelas ⇄ nilai',
        'Template rapor kustom & cetak massal',
        'Akses pimpinan dengan KPI instan'
      ],
      kpis: [
        { label: 'Reduksi kerja admin', value: '↓ 60%' },
        { label: 'Akurasi data', value: '↑ 99%' },
        { label: 'Waktu unduh laporan', value: '< 3 detik' }
      ],
      personas: [
        { role: 'TU/Operator', needs: 'Input cepat & seragam', outcomes: 'Data rapi, arsip otomatis' },
        { role: 'Wali Kelas', needs: 'Rekap nilai & absensi', outcomes: 'Rapor beres, minim salah' },
        { role: 'Pimpinan', needs: 'Angka ringkas & akurat', outcomes: 'Keputusan cepat & tepat' }
      ],
      features: [
        { title: 'Data Induk Terpadu', desc: 'Profil santri, orang tua, domisili, status aktif.', icon: 'lucide:id-card' },
        { title: 'Rombel & Mutasi', desc: 'Kenaikan/kelulusan massal, histori jelas.', icon: 'lucide:rows' },
        { title: 'Rapor Kustom', desc: 'Editor template + variabel dinamis.', icon: 'lucide:layout-template' },
        { title: 'Audit & RBAC', desc: 'Hak akses granular & jejak aksi.', icon: 'lucide:lock' },
        { title: 'Ekspor Cepat', desc: 'Excel/PDF siap cetak & arsip.', icon: 'lucide:download' }
      ],
      modules: [
        { title: 'Manajemen Tahun Ajaran', desc: 'Semester, kalender akademik, penguncian data.' },
        { title: 'Mapel & Kurikulum', desc: 'Struktur fleksibel, dukung pesantren.' },
        { title: 'Dashboard Pimpinan', desc: 'KPI kehadiran, nilai, dan aktivitas.' }
      ],
      workflow: [
        { title: 'Setup Struktur', desc: 'Unit, kelas, mapel, dan role pengguna.' },
        { title: 'Import Data', desc: 'Template Excel → validasi → masuk.' },
        { title: 'Operasional', desc: 'Kegiatan harian: jadwal, nilai, absensi.' },
        { title: 'Pelaporan', desc: 'Rapor & laporan pimpinan.' },
        { title: 'Arsip Tahunan', desc: 'Kunci & simpan historis untuk audit.' }
      ],
      architecture: [
        { title: 'Layer Data', desc: 'Relasional dengan indeks & constraint.' },
        { title: 'Service API', desc: 'Terstandar untuk integrasi modul.' },
        { title: 'CDN Media', desc: 'Aman & cepat untuk dokumen.' }
      ],
      security: [
        { title: 'RBAC & 2FA', desc: 'Izin per-aksi dengan verifikasi dua langkah.' },
        { title: 'Backup Otomatis', desc: 'Snapshot harian & retensi terukur.' },
        { title: 'Audit Trail', desc: 'Jejak semua perubahan penting.' }
      ],
      integrations: [
        { name: 'Kelas Akademik', icon: 'lucide:book-open' },
        { name: 'Nilai & Rapor', icon: 'lucide:clipboard-check' },
        { name: 'ToriID', icon: 'lucide:contact' },
        { name: 'Autobot', icon: 'lucide:bot' }
      ],
      pricing: [
        { name: 'Starter', price: 'Gratis*', unit: '/3 bulan uji', features: ['Unit tunggal', '≤ 300 siswa', 'Ekspor PDF'] },
        { name: 'Standard', price: 'Rp 999K', unit: '/bulan', best: true, features: ['Multi unit', 'Rapor kustom', 'Audit log', 'Backup otomatis'] },
        { name: 'Enterprise', price: 'Hubungi kami', features: ['SSO', 'SLA 99.9%', 'On-prem/Private cloud'] }
      ],
      timeline: [
        { title: 'Kickoff', desc: '1 hari: scope & akses' },
        { title: 'Migrasi Data', desc: '3–5 hari: template & validasi' },
        { title: 'Pelatihan', desc: '1–2 hari: operator & guru' },
        { title: 'Go-Live', desc: '1 hari: monitor & backup' }
      ],
      caseStudies: [
        { title: 'MTs X - 800 siswa', summary: 'Pengelolaan rapor lintas unit lebih cepat.', impact: 'Rapor selesai 5 hari lebih awal', metric: '↓ 40% revisi' }
      ],
      faqs: [
        { q: 'Apakah mendukung multi-cabang?', a: 'Ya, dengan isolasi data per unit & role khusus.' },
        { q: 'Bisakah impor dari sistem lama?', a: 'Tersedia template Excel & tools validasi.' }
      ],
      related: ['obayan-cms', 'toriid', 'autobot']
    }
  },

  {
    slug: 'obayan-cms',
    title: 'Obayan CMS',
    subtitle: 'Website Profile & Editor Visual',
    short: 'Website sekolah/pesantren yang bisa di-edit tanpa coding: halaman, berita, prestasi.',
    category: 'Website',
    icon: 'ph:globe',
    tone: 'blue',
    tags: ['CMS', 'Berita', 'Prestasi'],
    images: { cover: img.cms, alt1: img.cms_alt1, alt2: img.cms_alt2 },
    detail: {
      overview:
        'CMS visual untuk halaman profil, berita, pengumuman, hingga katalog prestasi. SEO-ready dan cepat.',
      highlights: [
        'Editor drag & drop',
        'SEO otomatis & sitemap',
        'Integrasi Prestasi & Pengumuman',
        'Tema konsisten dengan brand'
      ],
      kpis: [
        { label: 'Waktu terbit konten', value: '↓ 70%' },
        { label: 'Skor Lighthouse', value: '95–100' },
        { label: 'Bounce rate', value: '↓ signifikan' }
      ],
      personas: [
        { role: 'Admin Web', needs: 'Update konten cepat', outcomes: 'Halaman selalu up-to-date' },
        { role: 'Humas', needs: 'Publikasi prestasi', outcomes: 'Eksposur tinggi, share mudah' }
      ],
      features: [
        { title: 'Block Editor', desc: 'Hero, gallery, FAQ, CTA, embed.', icon: 'lucide:square-mouse-pointer' },
        { title: 'SEO & Analytics', desc: 'Meta, sitemap, structured data.', icon: 'lucide:search' },
        { title: 'Draft & Approvals', desc: 'Alur tinjau sebelum tayang.', icon: 'lucide:check-check' },
        { title: 'Multimedia', desc: 'Optimasi gambar & lazyload.', icon: 'lucide:image' }
      ],
      modules: [
        { title: 'Berita & Artikel', desc: 'Kategori, tag, dan arsip.' },
        { title: 'Prestasi', desc: 'Taut ke modul Prestasi dari sistem.' },
        { title: 'Pengumuman', desc: 'Jadwalkan tayang & arsip.' }
      ],
      workflow: [
        { title: 'Pilih Tema', desc: 'Sesuaikan warna & logo.' },
        { title: 'Susun Halaman', desc: 'Drag & drop blok siap pakai.' },
        { title: 'Tulis Konten', desc: 'Draft → review → publish.' },
        { title: 'Optimasi SEO', desc: 'Cek skor & sitemap.' }
      ],
      architecture: [
        { title: 'Headless API', desc: 'Konten diambil aman & cepat.' },
        { title: 'Static Delivery', desc: 'Halaman di-cache/CDN.' }
      ],
      security: [
        { title: 'RBAC Editor', desc: 'Peran kontributor–editor.' },
        { title: 'Audit Konten', desc: 'Riwayat revisi & rollback.' }
      ],
      integrations: [
        { name: 'Prestasi', icon: 'lucide:trophy' },
        { name: 'Pengumuman', icon: 'lucide:megaphone' },
        { name: 'Analytics', icon: 'lucide:bar-chart-3' }
      ],
      pricing: [
        { name: 'Starter', price: 'Rp 299K', unit: '/bulan', features: ['Tema dasar', 'Berita/Artikel', 'SEO dasar'] },
        { name: 'Pro', price: 'Rp 699K', unit: '/bulan', best: true, features: ['Editor blok premium', 'Prestasi & Pengumuman', 'Structured data'] },
        { name: 'Enterprise', price: 'Hubungi kami', features: ['Multi bahasa', 'Custom domain/SSO', 'CDN premium'] }
      ],
      timeline: [
        { title: 'Setup', desc: '1 hari: domain & tema' },
        { title: 'Konten', desc: '2–3 hari: migrasi awal' },
        { title: 'Launch', desc: 'Go-live & training editor' }
      ],
      caseStudies: [
        { title: 'MA Y - Rebrand cepat', summary: 'Website baru dalam 4 hari.', impact: 'Lonjakan trafik 2.1×' }
      ],
      faqs: [
        { q: 'Bisa multi-bahasa?', a: 'Ya, paket Enterprise.' },
        { q: 'Migrasi blog lama?', a: 'Impor RSS/CSV didukung.' }
      ],
      related: ['obayan-siakad', 'autobot']
    }
  },

  {
    slug: 'obayan-app',
    title: 'Obayan App',
    subtitle: 'Aplikasi Monitoring Wali',
    short: 'Mobile app untuk orang tua: presensi, nilai, tagihan, pengumuman real-time.',
    category: 'Mobile App',
    icon: 'duo-icons:app',
    tone: 'amber',
    tags: ['Android/iOS', 'Wali', 'Realtime'],
    images: { cover: img.app, alt1: img.app_alt1, alt2: img.app_alt2 },
    detail: {
      overview:
        'Satu aplikasi untuk wali memantau aktivitas anak: hadir, nilai terbaru, status tagihan, hingga pengumuman sekolah.',
      highlights: [
        'Notifikasi real-time',
        'Portal pembayaran',
        'Pantau progres & rapor',
        'Multi anak (satu akun)'
      ],
      kpis: [
        { label: 'Engagement wali', value: '↑ 3×' },
        { label: 'Tagihan tepat waktu', value: '↑ 35%' },
        { label: 'Komplain berulang', value: '↓ 50%' }
      ],
      personas: [
        { role: 'Wali', needs: 'Informasi cepat & ringkas', outcomes: 'Tenang & tidak ketinggalan' },
        { role: 'Bendahara', needs: 'Pembayaran lancar', outcomes: 'Arus kas stabil' }
      ],
      features: [
        { title: 'Timeline Aktivitas', desc: 'Hadir, tugas, nilai, pengumuman.', icon: 'lucide:activity' },
        { title: 'Pembayaran In-App', desc: 'VA/QRIS langsung dari app.', icon: 'lucide:wallet' },
        { title: 'Rapor Digital', desc: 'Lihat rapor & arsip.', icon: 'lucide:file-text' },
        { title: 'Multi Anak', desc: 'Switch cepat antar profil.', icon: 'lucide:users' }
      ],
      modules: [
        { title: 'Chat Satu Arah', desc: 'Broadcast dari sekolah (via Autobot).' },
        { title: 'Kartu Pelajar Digital', desc: 'QR identitas di aplikasi.' }
      ],
      workflow: [
        { title: 'Login Aman', desc: 'Akun wali diverifikasi.' },
        { title: 'Sinkron Data', desc: 'Tarik presensi/nilai/tagihan.' },
        { title: 'Notifikasi', desc: 'Event penting di-push real-time.' },
        { title: 'Pembayaran', desc: 'Proses via gateway resmi.' }
      ],
      architecture: [
        { title: 'API Real-time', desc: 'Event stream untuk notifikasi.' },
        { title: 'Caching Cerdas', desc: 'Hemat data & cepat.' }
      ],
      security: [
        { title: 'Device Binding', desc: 'Batasi perangkat untuk akun penting.' },
        { title: 'Privacy by Design', desc: 'Data anak terenkripsi in-transit.' }
      ],
      integrations: [
        { name: 'Pembayaran', icon: 'lucide:banknote' },
        { name: 'Autobot', icon: 'lucide:bot' },
        { name: 'ToriID', icon: 'lucide:contact' }
      ],
      pricing: [
        { name: 'Included', price: 'Bundled', features: ['Termasuk paket Standard/Pro', 'Notifikasi dasar', 'Portal tagihan'] },
        { name: 'Plus', price: 'Rp 5K', unit: '/siswa/bln', best: true, features: ['Push prioritas', 'Rapor digital', 'Kartu pelajar'] }
      ],
      timeline: [
        { title: 'Provisioning', desc: '1–2 hari: build & branding' },
        { title: 'Publish', desc: 'Store listing & QA' }
      ],
      caseStudies: [
        { title: 'Boarding Z', summary: 'Wali lebih proaktif membayar & memantau.', impact: 'Menurunkan keterlambatan hadir' }
      ],
      faqs: [
        { q: 'iOS & Android?', a: 'Ya, keduanya didukung.' },
        { q: 'Login wali gimana?', a: 'Akun ditautkan ke data SIAKAD.' }
      ],
      related: ['obayan-siakad', 'pembayaran', 'autobot']
    }
  },

  {
    slug: 'obayan-cbt',
    title: 'Obayan CBT',
    subtitle: 'Computer Based Test',
    short: 'Platform ujian: bank soal, randomisasi, pengawasan, hasil instan.',
    category: 'Mobile App',
    icon: 'garden:app-26',
    tone: 'violet',
    tags: ['CBT', 'Ujian', 'Bank Soal'],
    images: { cover: img.cbt, alt1: img.cbt_alt1, alt2: img.cbt_alt2 },
    detail: {
      overview:
        'Rancang ujian dengan bank soal, mixing tipe soal, pengawasan, hingga remedial otomatis.',
      highlights: [
        'Bank soal kolaboratif',
        'Randomisasi butir & opsi',
        'Anti-cheat dasar',
        'Nilai & analitik instan'
      ],
      kpis: [
        { label: 'Waktu koreksi', value: '↓ 95%' },
        { label: 'Reliabilitas', value: '↑ signifikan' },
        { label: 'Persiapan ujian', value: '↓ 60%' }
      ],
      personas: [
        { role: 'Guru Mapel', needs: 'Ujian cepat disiapkan', outcomes: 'Analitik hasil otomatis' },
        { role: 'Operator', needs: 'Manajemen sesi', outcomes: 'Stabil & terukur' }
      ],
      features: [
        { title: 'Tipe Soal Campuran', desc: 'Pilihan ganda, esai, menjodohkan.', icon: 'lucide:list-checks' },
        { title: 'Pengawasan Basic', desc: 'Lock fullscreen, deteksi switch.', icon: 'lucide:monitor-lock' },
        { title: 'Remedial Otomatis', desc: 'Sesi tindak lanjut tergenerate.', icon: 'lucide:redo-2' },
        { title: 'Analitik', desc: 'Item analysis & report kelas.', icon: 'lucide:chart-line' }
      ],
      modules: [
        { title: 'Penjadwalan Sesi', desc: 'Batch kelas & penempatan lab.' },
        { title: 'Impor Soal', desc: 'Template doc/CSV & editor rich.' }
      ],
      workflow: [
        { title: 'Buat Bank Soal', desc: 'Tag topik & kesulitan.' },
        { title: 'Rakit Ujian', desc: 'Randomisasi & aturan.' },
        { title: 'Eksekusi', desc: 'Pengawasan & log aktivitas.' },
        { title: 'Nilai Instan', desc: 'Skor otomatis, esai dibantu rubrik.' }
      ],
      architecture: [
        { title: 'Queue Engine', desc: 'Stabil saat banyak peserta.' },
        { title: 'Content CDN', desc: 'Asset soal cepat & aman.' }
      ],
      security: [
        { title: 'Role Pengawas', desc: 'Hanya akses ruang ujian terkait.' },
        { title: 'Audit Ujian', desc: 'Log percobaan & anomali.' }
      ],
      integrations: [
        { name: 'Nilai & Rapor', icon: 'lucide:clipboard-check' },
        { name: 'Kelas Akademik', icon: 'lucide:book-open' },
        { name: 'Autobot', icon: 'lucide:bot' }
      ],
      pricing: [
        { name: 'Basic', price: 'Rp 499K', unit: '/bulan', features: ['≤ 500 peserta/bulan', 'PG/Esai', 'Analitik dasar'] },
        { name: 'Pro', price: 'Rp 999K', unit: '/bulan', best: true, features: ['≤ 2.000 peserta/bulan', 'Remedial otomatis', 'Anti-cheat dasar'] },
        { name: 'Max', price: 'Hubungi kami', features: ['Skala besar', 'Fitur pro + SLA'] }
      ],
      timeline: [
        { title: 'Setup', desc: '1 hari: konfigurasi dasar' },
        { title: 'Import Soal', desc: '2–3 hari: bank soal' }
      ],
      caseStudies: [
        { title: 'SMK Q - Ujian Serentak', summary: '2.000 peserta tanpa hambatan.', impact: 'Skor keluar di hari yang sama' }
      ],
      faqs: [
        { q: 'Esai otomatis?', a: 'Skor dibantu rubrik; manual tetap tersedia.' },
        { q: 'Bisa offline?', a: 'Mode low-connectivity dengan sinkronisasi.' }
      ],
      related: ['obayan-siakad', 'obayan-app']
    }
  },

  {
    slug: 'toriid',
    title: 'ToriID',
    subtitle: 'Attendance Add-On',
    short: 'Add-on presensi: RFID/QR/Face, realtime ke SIAKAD & kelas.',
    category: 'Add-On',
    icon: 'ph:identification-badge',
    tone: 'emerald',
    tags: ['RFID', 'QRIS', 'Realtime'],
    images: { cover: img.toriid, alt1: img.toriid_alt1, alt2: img.toriid_alt2 },
    detail: {
      overview:
        'Sistem presensi terintegrasi untuk siswa & staf. Data hadir real-time mengalir ke kelas/keuangan/notifikasi.',
      highlights: [
        'RFID/QR/Face opsional',
        'Anti duplikasi',
        'Notifikasi ke wali',
        'Grafik & rekap'
      ],
      kpis: [
        { label: 'Ketepatan hadir', value: '↑ 25%' },
        { label: 'Antrian gerbang', value: '↓ 60%' }
      ],
      personas: [
        { role: 'Kesiswaan', needs: 'Pantau kedisiplinan', outcomes: 'Tindak cepat & adil' },
        { role: 'Wali', needs: 'Pemberitahuan hadir/pulang', outcomes: 'Tenang & terinformasi' }
      ],
      features: [
        { title: 'Multi Metode', desc: 'RFID/QR/Face menyesuaikan infrastruktur.', icon: 'lucide:badge-check' },
        { title: 'Geo/Device Log', desc: 'Catat lokasi/perangkat presensi.', icon: 'lucide:map-pin' },
        { title: 'Rekap Pintar', desc: 'Grafik keterlambatan & tren.', icon: 'lucide:chart-bar' }
      ],
      modules: [
        { title: 'Gerbang Multi-Lajur', desc: 'Load balancing antar perangkat.' },
        { title: 'Presensi Staf', desc: 'Taut ke payroll & shift.' }
      ],
      workflow: [
        { title: 'Pasang Perangkat', desc: 'Letak strategis di gerbang/lobi.' },
        { title: 'Registrasi ID', desc: 'Kartu/QR ditautkan ke profil.' },
        { title: 'Streaming Data', desc: 'Ke server & modul terkait.' }
      ],
      architecture: [
        { title: 'Gateway IoT', desc: 'Jembatan perangkat ke API aman.' },
        { title: 'Buffer Offline', desc: 'Antrean aman saat gangguan.' }
      ],
      security: [
        { title: 'Rate Limit', desc: 'Cegah spam & duplikasi.' },
        { title: 'Privacy', desc: 'Data minimal & terenkripsi.' }
      ],
      integrations: [
        { name: 'SIAKAD', icon: 'lucide:school' },
        { name: 'Kelas', icon: 'lucide:book-open' },
        { name: 'Autobot', icon: 'lucide:bot' }
      ],
      pricing: [
        { name: 'Starter', price: 'Rp 399K', unit: '/bulan', features: ['≤ 500 user', 'RFID/QR', 'Rekap dasar'] },
        { name: 'Pro', price: 'Rp 799K', unit: '/bulan', best: true, features: ['≤ 2.000 user', 'Gerbang multi-lajur', 'Notifikasi wali'] }
      ],
      timeline: [
        { title: 'Survey', desc: '1 hari: titik pemasangan' },
        { title: 'Deploy', desc: '1–2 hari: instalasi & pairing' }
      ],
      caseStudies: [
        { title: 'Pesantren R', summary: 'Kurangi antrean gerbang pagi.', impact: 'Keterlambatan turun signifikan' }
      ],
      faqs: [
        { q: 'Butuh internet?', a: 'Ada buffer offline → sync otomatis.' },
        { q: 'Face recognition?', a: 'Opsional dengan kebijakan privasi.' }
      ],
      related: ['obayan-app', 'autobot']
    }
  },

  {
    slug: 'autobot',
    title: 'Autobot',
    subtitle: 'Notification Add-On',
    short: 'Bot pesan otomatis: WA, Email, Telegram—tagihan, izin, pengumuman.',
    category: 'Add-On',
    icon: 'mage:robot',
    tone: 'violet',
    tags: ['WA/API', 'Email', 'Telegram'],
    images: { cover: img.autobot, alt1: img.autobot_alt1, alt2: img.autobot_alt2 },
    detail: {
      overview:
        'Otomasi komunikasi ke wali/guru: pengumuman, pengingat jatuh tempo, status izin, presensi, dll.',
      highlights: [
        'Template variabel',
        'Jadwal & trigger',
        'Multi channel + fallback',
        'Log & metrik deliverability'
      ],
      kpis: [
        { label: 'Open/Read rate', value: '↑ 3×' },
        { label: 'Tagihan tertagih', value: '↑ 30%' }
      ],
      personas: [
        { role: 'Bendahara', needs: 'Penagihan efektif', outcomes: 'Arus kas membaik' },
        { role: 'Kesiswaan', needs: 'Info cepat ke wali', outcomes: 'Respons lebih cepat' }
      ],
      features: [
        { title: 'Template Dinamis', desc: 'Variabel {nama}, {kelas}, {tagihan}.', icon: 'lucide:braces' },
        { title: 'Trigger Event', desc: 'Jatuh tempo, izin disetujui, presensi.', icon: 'lucide:alarm-clock' },
        { title: 'Fallback Channel', desc: 'WA → Email → Telegram.', icon: 'lucide:send' }
      ],
      modules: [
        { title: 'A/B Testing', desc: 'Uji template terbaik.' },
        { title: 'Quota & Rate', desc: 'Kendalikan laju & batas.' }
      ],
      workflow: [
        { title: 'Pilih Skenario', desc: 'Tagihan/izin/pengumuman/presensi.' },
        { title: 'Buat Template', desc: 'Preview per-channel.' },
        { title: 'Jadwalkan', desc: 'Atur waktu & frekuensi.' }
      ],
      architecture: [
        { title: 'Queue & Retry', desc: 'Tahan lonjakan, retry otomatis.' },
        { title: 'Webhook', desc: 'Integrasi event dari modul lain.' }
      ],
      security: [
        { title: 'Opt-out', desc: 'Hormati preferensi penerima.' },
        { title: 'Data Minimal', desc: 'Kirim hanya informasi perlu.' }
      ],
      integrations: [
        { name: 'Pembayaran', icon: 'lucide:banknote' },
        { name: 'Perizinan', icon: 'lucide:file-check' },
        { name: 'Presensi', icon: 'lucide:contact' }
      ],
      pricing: [
        { name: 'Basic', price: 'Rp 199K', unit: '/bulan + biaya channel', features: ['Template dasar', 'Log pengiriman'] },
        { name: 'Pro', price: 'Rp 499K', unit: '/bulan + biaya channel', best: true, features: ['Trigger event', 'Fallback', 'A/B test'] }
      ],
      timeline: [
        { title: 'Konfigurasi', desc: '1 hari: channel & template' },
        { title: 'Go-Live', desc: 'Uji coba & monitor' }
      ],
      caseStudies: [
        { title: 'MA T - Penagihan', summary: 'Reminder tertata, pembayaran naik.', impact: 'Tunggakan turun 28%' }
      ],
      faqs: [
        { q: 'WA resmi?', a: 'Mendukung integrasi WA API sesuai kebijakan.' },
        { q: 'Biaya channel?', a: 'Bervariasi sesuai provider & volume.' }
      ],
      related: ['obayan-app', 'toriid', 'obayan-siakad']
    }
  }
]
