// ~/data/fiturCatalog.ts
export type Tone = 'emerald' | 'blue' | 'amber' | 'violet'
export type Category = 'Akademik' | 'Operasional' | 'Keuangan' | 'Add-on'

export type Capability = { title: string; desc: string; icon: string }
export type Problem = { title: string; desc: string }
export type Step = { title: string; desc: string }
export type KPI = { label: string; value: string }
export type FAQ = { q: string; a: string }
export type Integration = { name: string; icon: string }
export type UseCase = { title: string; desc: string }
export type Benefit = { title: string; desc: string; metric?: string }

export type Feature = {
  slug: string
  title: string
  short: string
  icon: string
  tone: Tone
  category: Category
  tags: string[]
  images?: {
    cover?: string
    useCases?: string
    benefits?: string
  }
  detail: {
    overview: string
    topHighlights: string[]
    kpis: KPI[]
    problems: Problem[]
    capabilities: Capability[]
    workflow: Step[]
    integrations: Integration[]
    useCases: UseCase[]         // NEW
    benefits: Benefit[]         // NEW
    faqs: FAQ[]
    related?: string[]
  }
}

export const fitur: Feature[] = [
/* ========================= Agenda ========================= */
{
  slug: 'agenda',
  title: 'Agenda',
  icon: 'mynaui:calendar',
  tone: 'blue',
  category: 'Operasional',
  short: 'Kalender bersama, peminjaman ruang/aset, undangan & pengingat multi-channel.',
  tags: ['Kalender', 'Event', 'Ruang'],
  images: {
    cover: 'https://images.unsplash.com/photo-1513623954575-263b061061e0?q=80&w=1400&auto=format&fit=crop',
    useCases: 'https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?q=80&w=1400&auto=format&fit=crop',
    benefits: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1400&auto=format&fit=crop'
  },
  detail: {
    overview:
      'Kelola semua agenda & acara dari satu kalender terpadu: unit, kelas, asrama, hingga ruang rapat. Hindari bentrok, atur RSVP, dan kirim pengingat otomatis.',
    topHighlights: [
      'Kalender bersama multi-unit',
      'Peminjaman ruang/aset dengan approval',
      'Undangan, RSVP & kuota',
      'Pengingat multi-channel (WA/Email/Telegram)',
      'Anti bentrok jadwal & ruang',
      'Sinkronisasi iCal/Google'
    ],
    kpis: [
      { label: 'Bentrok jadwal', value: '↓ 80%' },
      { label: 'Kehadiran acara', value: '↑ 25%' },
      { label: 'Waktu koordinasi', value: '↓ 50%' },
      { label: 'Sinkron eksternal', value: 'iCal/Google' }
    ],
    problems: [
      { title: 'Ruang bentrok', desc: 'Tanpa sistem booking, ruang kerap dobel-terpakai.' },
      { title: 'Koordinasi peserta', desc: 'Undangan tercecer, status hadir tidak jelas.' },
      { title: 'Agenda tersebar', desc: 'Informasi ada di banyak grup & file.' }
    ],
    capabilities: [
      { title: 'Kalender Unit/Pribadi', desc: 'Pisah kalender per unit & bagi akses.', icon: 'lucide:calendar' },
      { title: 'Booking Ruang/Aset', desc: 'Atur slot, kapasitas, dan approval.', icon: 'lucide:building-2' },
      { title: 'Undangan & RSVP', desc: 'Kuota, daftar hadir, dan rekap otomatis.', icon: 'lucide:users' },
      { title: 'Pengingat Otomatis', desc: 'WA/Email/Telegram via Autobot.', icon: 'lucide:alarm-clock' },
      { title: 'Anti-Bentrok', desc: 'Deteksi tabrakan jadwal & ruang.', icon: 'lucide:shield-check' },
      { title: 'iCal/Google', desc: 'Export/import dan subscribe.', icon: 'lucide:calendar-plus' }
    ],
    workflow: [
      { title: 'Buat Kalender', desc: 'Pisahkan per unit/kelas/ruang.' },
      { title: 'Tambah Event', desc: 'Tentukan waktu, lokasi, dan kapasitas.' },
      { title: 'Undang Peserta', desc: 'Pakai daftar kelas/role/kelompok.' },
      { title: 'Booking Ruang', desc: 'Minta persetujuan jika diperlukan.' },
      { title: 'Kirim Pengingat', desc: 'Autobot kirim reminder terjadwal.' },
      { title: 'Pantau RSVP & Hadir', desc: 'Cek status hadir; tarik dari ToriID bila perlu.' },
      { title: 'Rekap & Arsip', desc: 'Unduh laporan & catatan pasca-event.' }
    ],
    integrations: [
      { name: 'Autobot', icon: 'lucide:bot' },
      { name: 'ToriID', icon: 'lucide:contact' },
      { name: 'Kelas Akademik', icon: 'lucide:book-open' },
      { name: 'Profile Web Editor', icon: 'lucide:layout-dashboard' },
      { name: 'Drive/Cloud', icon: 'lucide:cloud' },
      { name: 'iCal/Google Calendar', icon: 'lucide:calendar' }
    ],
    useCases: [
      { title: 'Rapat Rutin', desc: 'Agenda tetap per pekan dengan notifikasi.' },
      { title: 'Ujian Terjadwal', desc: 'Slot ruang & pengawas anti-bentrok.' },
      { title: 'Event Publik', desc: 'Landing acara + RSVP & daftar hadir.' }
    ],
    benefits: [
      { title: 'Koordinasi Mudah', desc: 'Semua jadwal & undangan terpusat.', metric: '↓ 50% koordinasi' },
      { title: 'Ruang Optimal', desc: 'Booking transparan & efisien.', metric: '↓ 80% bentrok' },
      { title: 'Kehadiran Naik', desc: 'Reminder meningkatkan hadir.', metric: '↑ 25% hadir' }
    ],
    faqs: [
      { q: 'Sinkron ke Google?', a: 'Bisa via iCal. Pengguna dapat subscribe kalender.' },
      { q: 'Bisa batasi kapasitas?', a: 'Bisa, gunakan kuota & RSVP.' },
      { q: 'Notifikasi otomatis?', a: 'Lewat Autobot (WA/Email/Telegram).' }
    ],
    related: ['pengumuman', 'berita-informasi', 'kelas-akademik']
  },
},
  /* ======================= Pengumuman ======================= */
  {
    slug: 'pengumuman',
    title: 'Pengumuman',
    icon: 'mingcute:announcement-line',
    tone: 'violet',
    category: 'Operasional',
    short: 'Broadcast internal/eksternal realtime dengan target audiens, template, dan jadwal.',
    tags: ['Broadcast', 'Multi-channel', 'Template'],
    images: {
      cover: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1400&auto=format&fit=crop',
      useCases: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1400&auto=format&fit=crop',
      benefits: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop'
    },
    detail: {
      overview:
        'Sampaikan informasi penting dengan konsisten: targetkan audiens, gunakan template, atur jadwal, dan pantau bukti baca.',
      topHighlights: [
        'Targeting audiens (kelas/role/unit)',
        'Jadwal & recurring',
        'Multi-channel (WA/Email/Telegram)',
        'Lampiran & rich content',
        'Read receipt & log',
        'Moderasi/approval konten'
      ],
      kpis: [
        { label: 'Keterbacaan', value: '↑ 3×' },
        { label: 'Pengingat manual', value: '↓ 90%' },
        { label: 'Waktu kirim', value: '< 1 menit' },
        { label: 'Tiket kebingungan', value: '↓ 50%' }
      ],
      problems: [
        { title: 'Tenggelam di grup', desc: 'Pesan penting hilang di chat lain.' },
        { title: 'Tidak ada bukti baca', desc: 'Sulit validasi siapa yang menerima.' },
        { title: 'Pesan tidak konsisten', desc: 'Format & isi bervariasi tiap petugas.' }
      ],
      capabilities: [
        { title: 'Segmentasi', desc: 'Kirim ke kelas, wali, guru, atau custom list.', icon: 'lucide:users' },
        { title: 'Template Dinamis', desc: 'Variabel {nama}/{kelas}/{tagihan}.', icon: 'lucide:braces' },
        { title: 'Penjadwalan', desc: 'Jadwal tunggal atau berulang.', icon: 'lucide:calendar-clock' },
        { title: 'Multi Channel', desc: 'WA/Email/Telegram dengan fallback.', icon: 'lucide:send' },
        { title: 'Read Receipt', desc: 'Pantau terkirim/terbaca & retry.', icon: 'lucide:inbox' },
        { title: 'Log & Analitik', desc: 'Jejak kirim & CTR per template.', icon: 'lucide:bar-chart-3' }
      ],
      workflow: [
        { title: 'Pilih Audiens', desc: 'Segmentasi penerima sesuai kebutuhan.' },
        { title: 'Siapkan Template', desc: 'Gunakan variabel & pratinjau.' },
        { title: 'Tentukan Channel', desc: 'WA/Email/Telegram + fallback.' },
        { title: 'Jadwalkan', desc: 'Pilih waktu terbaik & frekuensi.' },
        { title: 'Kirim & Pantau', desc: 'Lihat status terkirim/terbaca.' },
        { title: 'Follow-up', desc: 'Kirim ulang ke yang belum baca.' },
        { title: 'Evaluasi', desc: 'Uji A/B & perbaiki template.' }
      ],
      integrations: [
        { name: 'Autobot', icon: 'lucide:bot' },
        { name: 'Profile Web Editor', icon: 'lucide:layout-dashboard' },
        { name: 'Agenda', icon: 'lucide:calendar' },
        { name: 'Pembayaran', icon: 'lucide:wallet' },
        { name: 'Drive/Cloud', icon: 'lucide:cloud' },
        { name: 'Excel/PDF', icon: 'lucide:file-text' }
      ],
      useCases: [
        { title: 'Pengumuman Mendadak', desc: 'Perubahan jadwal/ruang disebarkan cepat.' },
        { title: 'Reminder Tagihan', desc: 'Notifikasi jatuh tempo SPP/syahriyah.' },
        { title: 'Info Darurat', desc: 'Komunikasi kebencanaan/cuaca ekstrem.' }
      ],
      benefits: [
        { title: 'Jangkauan Besar', desc: 'Multi channel tingkatkan keterbacaan.', metric: '↑ 3×' },
        { title: 'Pesan Konsisten', desc: 'Template menjaga standar konten.' },
        { title: 'Transparan', desc: 'Log & bukti baca jelas.' }
      ],
      faqs: [
        { q: 'WA resmi?', a: 'Mendukung integrasi WA API resmi sesuai kebijakan.' },
        { q: 'Bisa lampiran?', a: 'Bisa dokumen/gambar & tautan aman.' },
        { q: 'Rate limit?', a: 'Ada kontrol laju agar anti-spam.' }
      ],
      related: ['agenda', 'berita-informasi', 'pembayaran']
    }
  },

  /* ==================== Berita Informasi ==================== */
  {
    slug: 'berita-informasi',
    title: 'Berita & Informasi',
    icon: 'iconamoon:news-light',
    tone: 'amber',
    category: 'Operasional',
    short: 'CMS berita/artikel: editor kaya, SEO, jadwal tayang, kategori & arsip.',
    tags: ['CMS', 'SEO', 'Artikel'],
    images: {
      cover: 'https://images.unsplash.com/photo-1519331379826-bdba0f8f76b9?q=80&w=1400&auto=format&fit=crop',
      useCases: 'https://images.unsplash.com/photo-1511207538754-e8555f98ff63?q=80&w=1400&auto=format&fit=crop',
      benefits: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1400&auto=format&fit=crop'
    },
    detail: {
      overview:
        'Kelola berita, artikel, dan siaran pers dengan alur draft → review → publish, SEO tools, dan jadwal tayang otomatis.',
      topHighlights: [
        'Rich text editor + media',
        'Draft → review → publish',
        'Kategori & tag',
        'SEO meta, sitemap & OpenGraph',
        'Jadwal tayang & kedaluwarsa',
        'Versioning & rollback'
      ],
      kpis: [
        { label: 'Waktu terbit', value: '↓ 50%' },
        { label: 'Visibilitas organik', value: '↑ signifikan' },
        { label: 'Konsistensi brand', value: '↑' },
        { label: 'Revisi', value: 'Lebih cepat' }
      ],
      problems: [
        { title: 'Artikel tercecer', desc: 'Konten ada di banyak dokumen & chat.' },
        { title: 'Kualitas tidak seragam', desc: 'Tanpa review, gaya & format berbeda.' },
        { title: 'SEO lemah', desc: 'Tanpa metadata, susah ditemukan.' }
      ],
      capabilities: [
        { title: 'Editor Blok', desc: 'Judul, paragraf, media, kutipan, embed.', icon: 'lucide:layout-template' },
        { title: 'Media Library', desc: 'Upload gambar/video & kompresi.', icon: 'lucide:images' },
        { title: 'Kategori & Tag', desc: 'Pengelompokan & navigasi mudah.', icon: 'lucide:tags' },
        { title: 'SEO Tools', desc: 'Meta, OG tags, sitemap, robots.', icon: 'lucide:search-check' },
        { title: 'Author & Role', desc: 'Penulis/editor dengan RBAC.', icon: 'lucide:user-cog' },
        { title: 'Versioning', desc: 'Riwayat perubahan & restore.', icon: 'lucide:history' }
      ],
      workflow: [
        { title: 'Ide Konten', desc: 'Rapat redaksi & penugasan.' },
        { title: 'Penulisan Draft', desc: 'Gunakan editor blok & media.' },
        { title: 'Review & Sunting', desc: 'Cek fakta & gaya bahasa.' },
        { title: 'SEO & Metadata', desc: 'Isi judul SEO, deskripsi, OG.' },
        { title: 'Jadwal Tayang', desc: 'Atur waktu publish & expire.' },
        { title: 'Publikasi', desc: 'Bagikan ke kanal & arsip.' },
        { title: 'Distribusi', desc: 'Autobot kirim ke wali/umum.' }
      ],
      integrations: [
        { name: 'Profile Web Editor', icon: 'lucide:layout-dashboard' },
        { name: 'Autobot', icon: 'lucide:bot' },
        { name: 'Agenda', icon: 'lucide:calendar' },
        { name: 'Drive/Cloud', icon: 'lucide:cloud' },
        { name: 'RSS/JSON', icon: 'lucide:rss' },
        { name: 'Sitemap', icon: 'lucide:map' }
      ],
      useCases: [
        { title: 'Berita Sekolah', desc: 'Publikasikan kabar terbaru & kebijakan.' },
        { title: 'Liputan Kegiatan', desc: 'Dokumentasikan event & prestasi.' },
        { title: 'Tips Edukasi', desc: 'Artikel bermanfaat untuk wali & siswa.' }
      ],
      benefits: [
        { title: 'Branding Kuat', desc: 'Konten rapi meningkatkan citra.' },
        { title: 'Transparansi', desc: 'Informasi terpusat & mudah dicari.' },
        { title: 'SEO Naik', desc: 'Meta & sitemap mempermudah ditemukan.' }
      ],
      faqs: [
        { q: 'Multi-penulis?', a: 'Ya, role author/editor/reviewer didukung.' },
        { q: 'Komentar publik?', a: 'Opsional; bisa dimatikan sesuai kebijakan.' },
        { q: 'Custom domain?', a: 'Bisa diatur subpath/subdomain sekolah.' }
      ],
      related: ['profile-web-editor', 'pengumuman', 'agenda']
    }
  },

  {
  slug: 'absensi',
  title: 'Absensi',
  icon: 'lucide:user-check',
  tone: 'emerald',
  category: 'Operasional',
  short: 'Absensi harian & per-sesi: manual, QR, perangkat; atur terlambat/izin & rekap otomatis.',
  tags: ['Kehadiran', 'Terlambat', 'Rekap'],
  images: {
    cover: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1400&auto=format&fit=crop',
    useCases: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?q=80&w=1400&auto=format&fit=crop',
    benefits: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1400&auto=format&fit=crop'
  },
  detail: {
    overview:
      'Kelola absensi harian (masuk/pulang) dan absensi per-sesi kelas. Dukung input manual, QR dinamis, dan integrasi perangkat (RFID/Face) via ToriID. Atur aturan terlambat, izin, sakit, serta rekap untuk siswa dan staf.',
    topHighlights: [
      'Metode fleksibel: manual, QR, perangkat',
      'Aturan keterlambatan & toleransi jam',
      'Kategori hadir/izin/sakit/alpa',
      'Rekap harian, mingguan, bulanan',
      'Geo/Device log & anti-duplikasi',
      'Portal wali: pantau real-time'
    ],
    kpis: [
      { label: 'Ketepatan hadir', value: '↑ 20–30%' },
      { label: 'Antrian gerbang', value: '↓ 40–60%' },
      { label: 'Waktu rekap', value: '↓ 70%' },
      { label: 'Sinkron ke modul lain', value: 'Instan' }
    ],
    problems: [
      { title: 'Titip absen & manipulasi', desc: 'Tanpa verifikasi dan log, kecurangan sulit dideteksi.' },
      { title: 'Rekap memakan waktu', desc: 'Penghitungan manual harian/kelas melelahkan & rawan salah.' },
      { title: 'Data terpecah', desc: 'Absensi gerbang tidak terhubung ke kelas/izin/pelanggaran.' },
      { title: 'Komunikasi lambat', desc: 'Wali menerima info kehadiran terlambat atau tidak konsisten.' }
    ],
    capabilities: [
      { title: 'Mode Input Beragam', desc: 'Manual web, QR dinamis per sesi, dan perangkat via ToriID.', icon: 'lucide:scan-line' },
      { title: 'Aturan Keterlambatan', desc: 'Grace period, kategori telat, dan denda opsional.', icon: 'lucide:alarm-clock' },
      { title: 'Kategori Status', desc: 'Hadir, telat, izin, sakit, alpa; alasan & lampiran bukti.', icon: 'lucide:list-checks' },
      { title: 'Geo/Device Logging', desc: 'Catat lokasi & perangkat untuk audit kehadiran.', icon: 'lucide:map-pin' },
      { title: 'Anti-Duplikasi', desc: 'Deteksi double-tap & anomali waktu.', icon: 'lucide:shield-check' },
      { title: 'Rekap & Ekspor', desc: 'Ringkasan per kelas/unit/staf; ekspor Excel/PDF.', icon: 'lucide:download' }
    ],
    workflow: [
      { title: 'Tentukan Skema', desc: 'Jadwal harian & sesi; atur grace period & kategori status.' },
      { title: 'Pilih Metode', desc: 'Manual web, QR dinamis, atau perangkat ToriID.' },
      { title: 'Koneksikan Identitas', desc: 'QR/kartu/ID wajah terhubung profil siswa/staf.' },
      { title: 'Lakukan Pencatatan', desc: 'Scan/submit; sistem validasi waktu, device, dan lokasi.' },
      { title: 'Sinkron Otomatis', desc: 'Datanya mengalir ke Kelas Akademik, Perizinan, dan Keuangan (opsional).' },
      { title: 'Notifikasi', desc: 'Autobot kirim info hadir/pulang/telat ke wali/pihak terkait.' },
      { title: 'Rekap & Analitik', desc: 'Grafik kehadiran, keterlambatan, dan tren per periode.' }
    ],
    integrations: [
      { name: 'ToriID (Perangkat)', icon: 'lucide:contact' },
      { name: 'Kelas Akademik', icon: 'lucide:book-open' },
      { name: 'Perizinan & Printout', icon: 'lucide:file-check' },
      { name: 'Pelanggaran', icon: 'lucide:triangle-alert' },
      { name: 'Autobot', icon: 'lucide:bot' },
      { name: 'Keuangan (opsional)', icon: 'lucide:wallet' }
    ],
    useCases: [
      { title: 'Gerbang Sekolah', desc: 'Pencatatan masuk/pulang siswa & staf dengan antrian minimal.' },
      { title: 'Absensi Sesi Kelas', desc: 'QR dinamis per pertemuan; sinkron ke rekap kelas & nilai kehadiran.' },
      { title: 'Kegiatan/Asrama', desc: 'Absensi kegiatan rutin/asrama dengan perangkat mobile.' }
    ],
    benefits: [
      { title: 'Disiplin Meningkat', desc: 'Toleransi jam & notifikasi membuat siswa lebih tepat waktu.', metric: '↑ 20–30% ketepatan' },
      { title: 'Administrasi Ringkas', desc: 'Rekap otomatis menghemat waktu petugas.', metric: '↓ 70% waktu rekap' },
      { title: 'Data Terhubung', desc: 'Integrasi rapih ke kelas, izin, pelanggaran, dan (opsional) keuangan.' }
    ],
    faqs: [
      { q: 'Bisa offline?', a: 'Ada buffer di perangkat/klien; data disinkron saat online.' },
      { q: 'Presensi staf juga?', a: 'Ya—aturan jam & laporan terpisah untuk staf/guru.' },
      { q: 'QR aman?', a: 'QR dinamis per sesi/waktu; kadaluarsa & anti-screenshot.' },
      { q: 'Privasi lokasi?', a: 'Geo-logging opsional & tunduk kebijakan privasi sekolah.' },
      { q: 'Integrasi denda?', a: 'Opsional—hubungkan ke Keuangan untuk denda keterlambatan.' }
    ],
    related: ['toriid', 'kelas-akademik', 'perizinan-printout', 'pelanggaran']
  }
},

  /* =================== Profile Web Editor =================== */
  {
    slug: 'profile-web-editor',
    title: 'Profile Web Editor',
    icon: 'fluent:design-ideas-24-regular',
    tone: 'emerald',
    category: 'Add-on',
    short: 'Editor situs profil: drag-and-drop, komponen siap pakai, SEO—tanpa coding.',
    tags: ['CMS', 'Builder', 'SEO'],
    images: {
      cover: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1400&auto=format&fit=crop',
      useCases: 'https://images.unsplash.com/photo-1522199710521-72d69614c702?q=80&w=1400&auto=format&fit=crop',
      benefits: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop'
    },
    detail: {
      overview:
        'Bangun & kelola situs profil sekolah/pesantren dengan editor visual. Tarik-lepas komponen, atur tema, dan publikasikan cepat.',
      topHighlights: [
        'Drag & drop builder',
        'Komponen modular (hero, cards, blog)',
        'Tema, warna & tipografi',
        'SEO & OpenGraph',
        'Formulir & CTA',
        'Draft, staging & publish'
      ],
      kpis: [
        { label: 'Waktu update situs', value: '↓ 80%' },
        { label: 'Konsistensi brand', value: '↑' },
        { label: 'Kecepatan halaman', value: 'LCP < 2.5s' },
        { label: 'Aksesibilitas', value: 'AA' }
      ],
      problems: [
        { title: 'Update lama', desc: 'Perlu developer untuk perubahan kecil.' },
        { title: 'Tidak konsisten', desc: 'Gaya & warna berbeda antar halaman.' },
        { title: 'Tidak SEO-friendly', desc: 'Tanpa meta & struktur yang baik.' }
      ],
      capabilities: [
        { title: 'Page Builder', desc: 'Susun halaman dari blok siap pakai.', icon: 'lucide:panel-top' },
        { title: 'Design Tokens', desc: 'Atur warna, font, radius global.', icon: 'lucide:paintbrush' },
        { title: 'Preview Responsif', desc: 'Cek tampilan mobile/tablet/desktop.', icon: 'lucide:smartphone' },
        { title: 'Form Builder', desc: 'Buat formulir kontak/PPDB/pendaftaran.', icon: 'lucide:form-input' },
        { title: 'Bagian Dinamis', desc: 'Tarik data Berita/Agenda/Prestasi.', icon: 'lucide:component' },
        { title: 'Role & Staging', desc: 'RBAC untuk author/editor + staging.', icon: 'lucide:lock' }
      ],
      workflow: [
        { title: 'Pilih Tema', desc: 'Mulai dari preset atau kosong.' },
        { title: 'Atur Brand', desc: 'Warna, logo, tipografi, favicon.' },
        { title: 'Susun Halaman', desc: 'Tarik komponen & susun grid.' },
        { title: 'Isi Konten', desc: 'Teks, gambar, tautan, formulir.' },
        { title: 'Optimasi SEO', desc: 'Meta title/desc, OG, sitemap.' },
        { title: 'Preview & Staging', desc: 'Cek responsif & minta review.' },
        { title: 'Publikasikan', desc: 'Live dengan kontrol rollback.' }
      ],
      integrations: [
        { name: 'Berita & Informasi', icon: 'lucide:newspaper' },
        { name: 'Agenda', icon: 'lucide:calendar' },
        { name: 'Prestasi', icon: 'lucide:trophy' },
        { name: 'Autobot', icon: 'lucide:bot' },
        { name: 'Analytics', icon: 'lucide:chart-line' },
        { name: 'SEO/Sitemap', icon: 'lucide:map' }
      ],
      useCases: [
        { title: 'Halaman Profil Sekolah', desc: 'Visi misi, fasilitas, guru, dan galeri.' },
        { title: 'Landing PPDB', desc: 'Informasi pendaftaran + formulir.' },
        { title: 'Halaman Prestasi', desc: 'Dinding kehormatan digital.' }
      ],
      benefits: [
        { title: 'Cepat', desc: 'Perubahan konten instan tanpa developer.', metric: '↓ 80% waktu' },
        { title: 'Konsisten', desc: 'Design tokens menjaga identitas.' },
        { title: 'Aman', desc: 'RBAC & staging sebelum live.' }
      ],
      faqs: [
        { q: 'Perlu hosting terpisah?', a: 'Tidak wajib—bisa di-host dalam Obayan atau custom domain.' },
        { q: 'Custom domain?', a: 'Dukungan subdomain/subpath & SSL.' },
        { q: 'Batas komponen?', a: 'Banyak komponen siap pakai; bisa tambah kustom.' }
      ],
      related: ['berita-informasi', 'agenda', 'prestasi']
    }
  },

    
  /* ======================= SIAKAD ======================= */
  {
    slug: 'siakad',
    title: 'SIAKAD',
    icon: 'ph:student',
    tone: 'emerald',
    category: 'Akademik',
    short: 'Kelola data santri/murid, guru, kelas, tahun ajaran, dan arsip akademik dari satu tempat.',
    tags: ['Data Induk', 'Kelas', 'Tahun Ajaran'],
    images: {
      cover: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1400&auto=format&fit=crop',
      useCases: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1400&auto=format&fit=crop',
      benefits: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1400&auto=format&fit=crop'
    },
    detail: {
      overview:
        'SIAKAD Obayan menyatukan pengelolaan akademik menjadi alur yang sederhana—mulai dari pendataan santri, rombel, pembagian wali kelas, hingga arsip rapor.',
      topHighlights: [
        'Struktur data fleksibel untuk pesantren/sekolah',
        'Multi-tahun ajaran dengan arsip rapi',
        'Sinkron modul Nilai & Kelas',
        'Hak akses granular/RBAC',
        'Ekspor Excel/PDF siap cetak',
        'Audit log lengkap'
      ],
      kpis: [
        { label: 'Waktu input', value: '↓ 60%' },
        { label: 'Akurasi data', value: '↑ 99%' },
        { label: 'Akses laporan', value: '< 200ms' },
        { label: 'Arsip tahunan', value: 'Otomatis' }
      ],
      problems: [
        { title: 'Data tercecer', desc: 'Data siswa & guru tersebar di file berbeda—membuat pencarian lambat.' },
        { title: 'Perubahan kurikulum', desc: 'Struktur kelas/mapel berubah, sistem sulit ikut.' },
        { title: 'Arsip menumpuk', desc: 'Dokumen fisik/Excel lama sulit dilacak saat audit.' },
        { title: 'Koordinasi akses', desc: 'Peran butuh hak akses berbeda (wali, TU, pimpinan).' }
      ],
      capabilities: [
        { title: 'Data Induk Terpadu', desc: 'Profil lengkap santri/guru/ortu/wali.', icon: 'lucide:id-card' },
        { title: 'Kelas/Rombel', desc: 'Penempatan, mutasi, kelulusan massal.', icon: 'lucide:rows' },
        { title: 'Arsip Tahun Ajaran', desc: 'Freeze data per semester/tahun.', icon: 'lucide:archive' },
        { title: 'Ekspor & Cetak', desc: 'Excel/PDF siap rapat dan pelaporan.', icon: 'lucide:download' },
        { title: 'RBAC', desc: 'Role-based access control + audit.', icon: 'lucide:lock' },
        { title: 'Audit Log', desc: 'Jejak perubahan pengguna.', icon: 'lucide:history' }
      ],
      workflow: [
        { title: 'Setup Tahun Ajaran', desc: 'Buat tahun ajaran, semester, struktur kelas.' },
        { title: 'Import Data', desc: 'Migrasi cepat via template Excel.' },
        { title: 'Atur Peran', desc: 'Tetapkan wali kelas, admin, pimpinan.' },
        { title: 'Integrasi Nilai', desc: 'Sambungkan ke modul Nilai/Rapor.' },
        { title: 'Monitoring', desc: 'Pantau statistik & data bermasalah.' },
        { title: 'Arsipkan Semester', desc: 'Kunci data, simpan salinan untuk audit.' },
        { title: 'Review Berkala', desc: 'Audit akses & perbaikan struktur.' }
      ],
      integrations: [
        { name: 'Nilai & Rapor', icon: 'lucide:clipboard-check' },
        { name: 'Kelas Akademik', icon: 'lucide:book-open' },
        { name: 'ToriID Presensi', icon: 'lucide:contact' },
        { name: 'Autobot', icon: 'lucide:bot' },
        { name: 'Keuangan', icon: 'lucide:wallet' },
        { name: 'PPDB Online', icon: 'lucide:badge-check' }
      ],
      useCases: [
        { title: 'Sekolah Multi-Unit', desc: 'Manajemen beberapa unit (MI/MTs/MA) dalam satu dashboard.' },
        { title: 'Pesantren Boarding', desc: 'Integrasi kegiatan asrama, piket, dan kepengasuhan.' },
        { title: 'Satuan Pendidikan Nonformal', desc: 'Mapping kurikulum fleksibel & kelas lintas usia.' }
      ],
      benefits: [
        { title: 'Operasional Efisien', desc: 'Mengurangi tugas administratif berulang.', metric: '↓ 60% waktu staf' },
        { title: 'Data Andal', desc: 'Satu sumber kebenaran untuk seluruh unit.', metric: '↑ 99% keakuratan' },
        { title: 'Siap Audit', desc: 'Arsip & jejak perubahan rapi.', metric: 'Audit pass cepat' }
      ],
      faqs: [
        { q: 'Bisa migrasi dari Excel lama?', a: 'Bisa. Sediakan template bawaan dan kami bantu validasi.' },
        { q: 'Multi-cabang?', a: 'Ya, mendukung multi-tenant dengan isolasi data.' },
        { q: 'SSO?', a: 'Opsional SAML/OIDC untuk edisi enterprise.' }
      ],
      related: ['kelas-akademik', 'nilai-rapor', 'ppdb']
    }
  },

  /* =================== Kelas Akademik =================== */
  {
    slug: 'kelas-akademik',
    title: 'Kelas Akademik',
    icon: 'streamline-plump:class-lesson',
    tone: 'blue',
    category: 'Akademik',
    short: 'Kelola jadwal, materi, tugas, ujian—terstruktur dan mudah dipantau.',
    tags: ['Jadwal', 'Materi', 'Ujian'],
    images: {
      cover: 'https://images.unsplash.com/photo-1588075592446-265fd1e6e76d?q=80&w=1400&auto=format&fit=crop',
      useCases: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1400&auto=format&fit=crop',
      benefits: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1400&auto=format&fit=crop'
    },
    detail: {
      overview:
        'Semua aktivitas kelas dalam satu alur: jadwal terpusat, materi bersi versi, tugas & ujian dengan penilaian cepat.',
      topHighlights: [
        'Kalender & pengingat',
        'Materi dengan versioning',
        'Tugas & Ujian online/offline',
        'Rubrik penilaian',
        'Komentar & feedback',
        'Rekap kehadiran sesi'
      ],
      kpis: [
        { label: 'Kelas sinkron', value: '100%' },
        { label: 'Waktu rekap', value: '↓ 70%' },
        { label: 'Kepuasan guru', value: '4.8/5' },
        { label: 'Materi', value: 'Versioned' }
      ],
      problems: [
        { title: 'Jadwal bentrok', desc: 'Koordinasi ruang/guru tanpa kalender bersama sulit.' },
        { title: 'Materi tercecer', desc: 'File berpencar di WA/Drive tanpa kontrol versi.' },
        { title: 'Rekap lama', desc: 'Penilaian manual memakan waktu & rawan salah.' },
        { title: 'Absensi tak terekam', desc: 'Kehadiran sesi sering terlewat.' }
      ],
      capabilities: [
        { title: 'Kalender & Jadwal', desc: 'Atur slot, ruang, pengajar; anti-bentrok.', icon: 'lucide:calendar' },
        { title: 'Materi Terversi', desc: 'Simpan perubahan & rollback.', icon: 'lucide:file-digit' },
        { title: 'Tugas & Ujian', desc: 'Bank soal, acak, koreksi cepat.', icon: 'lucide:clipboard-list' },
        { title: 'Rubrik & Feedback', desc: 'Penilaian transparan; komentar.', icon: 'lucide:square-pen' },
        { title: 'Absensi Sesi', desc: 'Tautkan ke ToriID untuk auto.', icon: 'lucide:scan-line' },
        { title: 'Rekap Otomatis', desc: 'Ringkasan nilai/kehadiran kelas.', icon: 'lucide:bar-chart-3' }
      ],
      workflow: [
        { title: 'Buat Kelas', desc: 'Isi pengajar, rombel, ruang, kapasitas.' },
        { title: 'Unggah Materi', desc: 'PDF/slide/link; atur versi & izin.' },
        { title: 'Tugas/Ujian', desc: 'Jenis soal, tenggat, rubrik.' },
        { title: 'Penilaian', desc: 'Gunakan rubric checker; feedback.' },
        { title: 'Absensi', desc: 'Integrasi presensi per sesi.' },
        { title: 'Rekap', desc: 'Ekspor nilai & kehadiran.' },
        { title: 'Refleksi', desc: 'Perbaiki materi dari insight.' }
      ],
      integrations: [
        { name: 'SIAKAD', icon: 'lucide:school' },
        { name: 'Nilai & Rapor', icon: 'lucide:clipboard-check' },
        { name: 'Autobot', icon: 'lucide:bot' },
        { name: 'Drive/Cloud', icon: 'lucide:cloud' },
        { name: 'ToriID', icon: 'lucide:contact' },
        { name: 'CBT', icon: 'lucide:cpu' }
      ],
      useCases: [
        { title: 'Blended Learning', desc: 'Kombinasi tatap muka & daring dengan materi versi & tugas terjadwal.' },
        { title: 'Remedial', desc: 'Kelas remedial otomatis berdasarkan indikator capaian.' },
        { title: 'Praktikum', desc: 'Checklist praktikum & penilaian rubrik.' }
      ],
      benefits: [
        { title: 'Proses Kelas Rapi', desc: 'Semua aktivitas terdokumentasi.', metric: '↓ 70% waktu rekap' },
        { title: 'Kualitas Materi Naik', desc: 'Versioning & feedback memperbaiki materi.', metric: 'Per kelas ↑' },
        { title: 'Transparansi Nilai', desc: 'Rubrik jelas; siswa paham ekspektasi.' }
      ],
      faqs: [
        { q: 'Bank soal ada?', a: 'Ya—tagging & tingkat kesulitan.' },
        { q: 'Impor jadwal?', a: 'Dari Excel & kalender tersedia.' },
        { q: 'Offline?', a: 'Materi dapat diunduh; sync saat online.' }
      ],
      related: ['siakad', 'nilai-rapor', 'cbt']
    }
  },

  /* ================== Nilai & Rapor ================== */
  {
    slug: 'nilai-rapor',
    title: 'Data Nilai & Rapor',
    icon: 'tabler:chart-line',
    tone: 'amber',
    category: 'Akademik',
    short: 'Penilaian harian, UTS, UAS, rapor otomatis dengan template kustom.',
    tags: ['Rapor', 'Kurikulum', 'Rubrik'],
    images: {
      cover: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1400&auto=format&fit=crop',
      useCases: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1400&auto=format&fit=crop',
      benefits: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=1400&auto=format&fit=crop'
    },
    detail: {
      overview:
        'Input nilai cepat, bobot fleksibel, rumus rapor otomatis. Cocok untuk kurikulum umum maupun pesantren.',
      topHighlights: [
        'Skema bobot fleksibel',
        'Rumus rapor otomatis',
        'Template rapor kustom',
        'Komentar & sikap',
        'Validasi kolom',
        'Ekspor massal'
      ],
      kpis: [
        { label: 'Kecepatan rekap', value: '↑ 3×' },
        { label: 'Kesalahan input', value: '↓ 80%' },
        { label: 'Kustom template', value: 'Full' },
        { label: 'Ekspor rapor', value: 'PDF' }
      ],
      problems: [
        { title: 'Rumus rumit', desc: 'Rapor menggunakan banyak bobot & kondisi.' },
        { title: 'Template berbeda', desc: 'Setiap unit/jenjang punya format sendiri.' },
        { title: 'Deadline mepet', desc: 'Rekap manual melelahkan & rawan salah.' },
        { title: 'Validasi kurang', desc: 'Nilai di luar rentang tidak terdeteksi.' }
      ],
      capabilities: [
        { title: 'Bobot & Kategori', desc: 'Tugas, kuis, UTS, UAS; bobot fleksibel.', icon: 'lucide:scales' },
        { title: 'Template Rapor', desc: 'Editor layout + variabel; logo & TTD.', icon: 'lucide:layout-template' },
        { title: 'Validasi Nilai', desc: 'Peringatan real-time out-of-range.', icon: 'lucide:shield-check' },
        { title: 'Komentar Sikap', desc: 'Deskripsi perkembangan siswa.', icon: 'lucide:message-square' },
        { title: 'Ekspor Massal', desc: 'Cetak rapor satu klik.', icon: 'lucide:printer' },
        { title: 'History & Revisi', desc: 'Jejak perubahan nilai untuk audit.', icon: 'lucide:history' }
      ],
      workflow: [
        { title: 'Set Skema', desc: 'Pilih bobot default atau kustom.' },
        { title: 'Input Nilai', desc: 'Manual, impor Excel, atau dari CBT.' },
        { title: 'Validasi', desc: 'Deteksi out-of-range & duplikasi.' },
        { title: 'Generate Rapor', desc: 'Template → preview → cetak massal.' },
        { title: 'Kunci & Arsip', desc: 'Freeze per mapel/kelas/semester.' },
        { title: 'Distribusi', desc: 'Share ke wali melalui portal.' },
        { title: 'Evaluasi', desc: 'Analisis tren nilai per kelas.' }
      ],
      integrations: [
        { name: 'SIAKAD', icon: 'lucide:school' },
        { name: 'CBT', icon: 'lucide:cpu' },
        { name: 'Kelas Akademik', icon: 'lucide:book-open' },
        { name: 'Autobot', icon: 'lucide:bot' },
        { name: 'Drive/Cloud', icon: 'lucide:cloud' },
        { name: 'Keuangan', icon: 'lucide:wallet' }
      ],
      useCases: [
        { title: 'Rapor Bilingual', desc: 'Template ID/EN untuk sekolah internasional.' },
        { title: 'Integrasi CBT', desc: 'Auto tarik nilai dari bank soal/ujian.' },
        { title: 'Analitik Kelas', desc: 'Deteksi mapel/indikator yang perlu remedial.' }
      ],
      benefits: [
        { title: 'Lebih Cepat', desc: 'Rekap nilai berjalan otomatis.', metric: '↑ 3× kecepatan' },
        { title: 'Lebih Akurat', desc: 'Validasi mengurangi kesalahan input.', metric: '↓ 80% error' },
        { title: 'Lebih Fleksibel', desc: 'Template rapor kustom sesuai brand.' }
      ],
      faqs: [
        { q: 'Bisa ganti format rapor?', a: 'Bisa, lewat editor template (Enterprise).' },
        { q: 'Impor nilai?', a: 'CSV/Excel & integrasi modul CBT.' },
        { q: 'TTD digital?', a: 'Opsional—sertifikat digital & QR verifikasi.' }
      ],
      related: ['kelas-akademik', 'siakad', 'cbt']
    }
  },

  /* ============== Perizinan & Printout ============== */
  {
    slug: 'perizinan-printout',
    title: 'Perizinan & Printout',
    icon: 'hugeicons:note',
    tone: 'violet',
    category: 'Operasional',
    short: 'Izin pulang/sakit/kegiatan; verifikasi berjenjang; dokumen cetak otomatis.',
    tags: ['Izin', 'Workflow', 'Cetak'],
    images: {
      cover: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1400&auto=format&fit=crop',
      useCases: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1400&auto=format&fit=crop',
      benefits: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?q=80&w=1400&auto=format&fit=crop'
    },
    detail: {
      overview:
        'Form izin terstandar, alur persetujuan bertingkat, notifikasi real-time, dan surat cetak otomatis + QR verifikasi.',
      topHighlights: [
        'Workflow persetujuan',
        'Template surat otomatis',
        'Lampiran bukti',
        'Riwayat izin lengkap',
        'Kuota & durasi',
        'Notifikasi multi-channel'
      ],
      kpis: [
        { label: 'Kecepatan approval', value: '↑ 2.5×' },
        { label: 'Kepatuhan SOP', value: '↑ 98%' },
        { label: 'Waktu cetak', value: '< 1 menit' },
        { label: 'Jejak status', value: 'End-to-end' }
      ],
      problems: [
        { title: 'Surat manual', desc: 'Format tidak seragam & salah ketik.' },
        { title: 'Kurang jejak', desc: 'Sulit menelusuri persetujuan.' },
        { title: 'Klaim palsu', desc: 'Tanpa lampiran pendukung rapi.' },
        { title: 'Notifikasi telat', desc: 'Orang tua telat tahu status.' }
      ],
      capabilities: [
        { title: 'Form Standar', desc: 'Jenis izin: pulang, sakit, darurat, dll.', icon: 'lucide:form-input' },
        { title: 'Approval Berjenjang', desc: 'Atur level persetujuan per jenis izin.', icon: 'lucide:check-check' },
        { title: 'Auto Print', desc: 'Template surat + QR verifikasi.', icon: 'lucide:printer' },
        { title: 'Lampiran', desc: 'Unggah foto/scan & validasi ukuran.', icon: 'lucide:paperclip' },
        { title: 'Kuota & Durasi', desc: 'Batas izin per periode; laporan pelanggaran.', icon: 'lucide:gauge' },
        { title: 'Notifikasi', desc: 'Email/WA/Telegram via Autobot.', icon: 'lucide:bell' }
      ],
      workflow: [
        { title: 'Ajukan', desc: 'Isi form + lampiran bukti.' },
        { title: 'Verifikasi', desc: 'Petugas memeriksa kelayakan.' },
        { title: 'Persetujuan', desc: 'Berjenjang sesuai SOP.' },
        { title: 'Cetak', desc: 'Surat otomatis dengan QR.' },
        { title: 'Arsip', desc: 'Riwayat izin terdokumentasi.' },
        { title: 'Pelaporan', desc: 'Statistik izin & kepatuhan.' },
        { title: 'Review SOP', desc: 'Perbaiki level persetujuan.' }
      ],
      integrations: [
        { name: 'Autobot', icon: 'lucide:bot' },
        { name: 'Hak Akses', icon: 'lucide:user-cog' },
        { name: 'SIAKAD', icon: 'lucide:school' },
        { name: 'Drive/Cloud', icon: 'lucide:cloud' },
        { name: 'Keuangan', icon: 'lucide:wallet' },
        { name: 'ToriID', icon: 'lucide:contact' }
      ],
      useCases: [
        { title: 'Izin Pulang Berkala', desc: 'Atur kuota per bulan & pantau pelanggaran.' },
        { title: 'Izin Sakit Darurat', desc: 'Lampiran resep/foto; approval dipercepat.' },
        { title: 'Izin Kegiatan', desc: 'Cetak surat tugas kolektif otomatis.' }
      ],
      benefits: [
        { title: 'Taat Prosedur', desc: 'Semua izin terekam & terjaga.', metric: '↑ 98% kepatuhan' },
        { title: 'Cepat & Konsisten', desc: 'Surat seragam, minim salah ketik.', metric: '<1 menit cetak' },
        { title: 'Aman Diverifikasi', desc: 'QR scan verifikasi keaslian.' }
      ],
      faqs: [
        { q: 'Flow bisa custom?', a: 'Bisa, tiap jenis izin bisa punya flow berbeda.' },
        { q: 'QR untuk apa?', a: 'Verifikasi keaslian surat secara online.' },
        { q: 'Integrasi printer?', a: 'Mendukung print server & thermal.' }
      ],
      related: ['pelanggaran', 'hak-akses', 'autobot']
    }
  },

  /* ===================== Pembayaran ===================== */
  {
    slug: 'pembayaran',
    title: 'Pembayaran',
    icon: 'akar-icons:money',
    tone: 'emerald',
    category: 'Keuangan',
    short: 'SPP/syahriyah, tagihan event, dan rekonsiliasi. Terima transfer/VA/QRIS.',
    tags: ['SPP', 'Tagihan', 'VA/QRIS'],
    images: {
      cover: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=1400&auto=format&fit=crop',
      useCases: 'https://images.unsplash.com/photo-1556742400-b5b7c5121f9a?q=80&w=1400&auto=format&fit=crop',
      benefits: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1400&auto=format&fit=crop'
    },
    detail: {
      overview:
        'Kelola penagihan rutin & insidental. Pantau status bayar per santri, kirim pengingat otomatis.',
      topHighlights: [
        'Tagihan massal',
        'Metode bayar beragam',
        'Pengingat jatuh tempo',
        'Keringanan & beasiswa',
        'Rekonsiliasi bank',
        'Laporan cepat'
      ],
      kpis: [
        { label: 'Tepat waktu bayar', value: '↑ 35%' },
        { label: 'Biaya admin', value: '↓ 40%' },
        { label: 'Kesalahan rekonsiliasi', value: '↓ 90%' },
        { label: 'Metode', value: 'VA/QRIS' }
      ],
      problems: [
        { title: 'Penagihan manual', desc: 'Butuh waktu & rawan salah.' },
        { title: 'Metode terbatas', desc: 'Wali kesulitan memilih kanal.' },
        { title: 'Rekonsiliasi lambat', desc: 'Pencocokan manual melelahkan.' },
        { title: 'Komunikasi kurang', desc: 'Wali terlambat karena lupa.' }
      ],
      capabilities: [
        { title: 'Tagihan Massal', desc: 'Generate untuk seluruh kelas/sekolah.', icon: 'lucide:copy' },
        { title: 'VA & QRIS', desc: 'Auto verifikasi pembayaran.', icon: 'lucide:scan' },
        { title: 'Keringanan', desc: 'Diskon, beasiswa, cicilan.', icon: 'lucide:badge-percent' },
        { title: 'Reminder Otomatis', desc: 'Jatuh tempo via WA/Email.', icon: 'lucide:alarm-clock' },
        { title: 'Rekonsiliasi', desc: 'Cocokkan bank secara otomatis.', icon: 'lucide:workflow' },
        { title: 'Laporan', desc: 'Arus kas & aging piutang.', icon: 'lucide:pie-chart' }
      ],
      workflow: [
        { title: 'Buat Skema', desc: 'SPP/syahriyah & periode.' },
        { title: 'Generate Tagihan', desc: 'Massal atau per kelompok.' },
        { title: 'Kirim Notifikasi', desc: 'Autobot pengingat jatuh tempo.' },
        { title: 'Terima Pembayaran', desc: 'VA/QRIS/transfer manual.' },
        { title: 'Rekonsiliasi', desc: 'Cocokkan & tanda lunas.' },
        { title: 'Laporan', desc: 'Unduh rekap per periode.' },
        { title: 'Evaluasi', desc: 'Analisis tunggakan & kebijakan.' }
      ],
      integrations: [
        { name: 'Laporan Keuangan', icon: 'lucide:book' },
        { name: 'Autobot', icon: 'lucide:bot' },
        { name: 'SIAKAD', icon: 'lucide:school' },
        { name: 'ToriID', icon: 'lucide:contact' },
        { name: 'Bank/PG', icon: 'lucide:banknote' },
        { name: 'Excel/PDF', icon: 'lucide:file-text' }
      ],
      useCases: [
        { title: 'SPP Otomatis', desc: 'Generate tagihan rutin dengan skema per jenjang.' },
        { title: 'Event/Study Tour', desc: 'Tagihan sekali jalan per acara.' },
        { title: 'Beasiswa/Cicilan', desc: 'Keringanan dengan kontrol kuota.' }
      ],
      benefits: [
        { title: 'Cashflow Sehat', desc: 'Penagihan tertib & terpantau.', metric: '↑ 35% ketepatan bayar' },
        { title: 'Beban Admin Turun', desc: 'Proses otomatis & rekonsiliasi cepat.', metric: '↓ 40% biaya' },
        { title: 'Nyaman untuk Wali', desc: 'Banyak kanal & reminder lembut.' }
      ],
      faqs: [
        { q: 'PG apa saja?', a: 'VA/QRIS via beberapa payment gateway lokal.' },
        { q: 'Bisa cicilan?', a: 'Ya, atur tenor & simulasi otomatis.' },
        { q: 'Bukti bayar?', a: 'Upload bukti; verifikasi petugas.' }
      ],
      related: ['keuangan', 'autobot', 'toriid']
    }
  },

  /* =============== Laporan Keuangan =============== */
  {
    slug: 'laporan-keuangan',
    title: 'Laporan Keuangan',
    icon: 'mynaui:chart-line',
    tone: 'blue',
    category: 'Keuangan',
    short: 'Pembukuan sederhana hingga laporan periodik. Transparan & siap audit.',
    tags: ['Buku Kas', 'Arus Kas', 'Audit'],
    images: {
      cover: 'https://images.unsplash.com/photo-1523875194681-bedd468c58bf?q=80&w=1400&auto=format&fit=crop',
      useCases: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400&auto=format&fit=crop',
      benefits: 'https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=1400&auto=format&fit=crop'
    },
    detail: {
      overview:
        'Catat pemasukan/pengeluaran, kategorikan, dan hasilkan laporan periode. Transparansi yang meyakinkan wali & pimpinan.',
      topHighlights: [
        'Buku kas multi-kategori',
        'Arus kas & neraca sederhana',
        'Lampiran bukti transaksi',
        'Akses pimpinan ringkas',
        'Export Excel/PDF',
        'Audit trail'
      ],
      kpis: [
        { label: 'Transparansi', value: '↑ 100%' },
        { label: 'Tutup buku', value: '↓ 60%' },
        { label: 'Kepatuhan bukti', value: '↑ 95%' },
        { label: 'Ekspor', value: '1 klik' }
      ],
      problems: [
        { title: 'Bukti tercecer', desc: 'Nota/faktur tidak rapi di arsip.' },
        { title: 'Klasifikasi rumit', desc: 'COA tidak konsisten antar unit.' },
        { title: 'Rekap bulanan lama', desc: 'Manual & rawan salah hitung.' },
        { title: 'Akses pimpinan', desc: 'Butuh visual ringkas untuk keputusan.' }
      ],
      capabilities: [
        { title: 'Kategori & Buku Kas', desc: 'Pisahkan kas operasional, event, donasi.', icon: 'lucide:folder-tree' },
        { title: 'Lampiran Bukti', desc: 'Foto/scan bukti tiap transaksi.', icon: 'lucide:paperclip' },
        { title: 'Grafik Ringkas', desc: 'Arus kas, top kategori, tren.', icon: 'lucide:chart-line' },
        { title: 'Ekspor Cepat', desc: 'Excel/PDF siap audit.', icon: 'lucide:download' },
        { title: 'Akses Pimpinan', desc: 'Dashboard ringkas keputusan cepat.', icon: 'lucide:book-marked' },
        { title: 'Audit Trail', desc: 'Jejak semua perubahan.', icon: 'lucide:history' }
      ],
      workflow: [
        { title: 'Set COA/Kategori', desc: 'Struktur kategori kas & standar.' },
        { title: 'Catat Transaksi', desc: 'Input + lampiran bukti.' },
        { title: 'Rekonsiliasi', desc: 'Cocokkan bank/PG.' },
        { title: 'Laporan', desc: 'Unduh laporan periode.' },
        { title: 'Audit', desc: 'Tampilkan bukti & histori.' },
        { title: 'Akses Pimpinan', desc: 'Snapshot indikator utama.' },
        { title: 'Perbaikan', desc: 'Evaluasi kebijakan anggaran.' }
      ],
      integrations: [
        { name: 'Pembayaran', icon: 'lucide:wallet' },
        { name: 'Excel/PDF', icon: 'lucide:file-text' },
        { name: 'Autobot', icon: 'lucide:bot' },
        { name: 'Drive/Cloud', icon: 'lucide:cloud' },
        { name: 'SIAKAD', icon: 'lucide:school' },
        { name: 'PPDB', icon: 'lucide:badge-check' }
      ],
      useCases: [
        { title: 'Unit Akuntansi Sekolah', desc: 'Pembukuan sederhana per unit/jenjang.' },
        { title: 'Kegiatan/Event', desc: 'COA khusus program & pertanggungjawaban.' },
        { title: 'Transparansi Publik', desc: 'Ringkasan periodik untuk wali/komite.' }
      ],
      benefits: [
        { title: 'Transparansi Naik', desc: 'Kepercayaan wali & pimpinan meningkat.', metric: '↑ 100% visibilitas' },
        { title: 'Operasional Ringkas', desc: 'Tutup buku lebih cepat.', metric: '↓ 60% waktu' },
        { title: 'Audit Mudah', desc: 'Bukti & history siap diperiksa.' }
      ],
      faqs: [
        { q: 'COA lengkap?', a: 'Struktur sederhana; bisa diperluas.' },
        { q: 'Multi buku kas?', a: 'Per unit/jenjang/event bisa dipisah.' },
        { q: 'Ekspor bulanan?', a: '1 klik untuk bulan/tahun.' }
      ],
      related: ['pembayaran', 'autobot']
    }
  },

  /* ===================== Hak Akses ===================== */
  {
    slug: 'hak-akses',
    title: 'Hak Akses (RBAC)',
    icon: 'hugeicons:access',
    tone: 'amber',
    category: 'Operasional',
    short: 'Kelola peran & izin granular: admin, TU, guru, wali, pimpinan.',
    tags: ['RBAC', 'Keamanan', 'Audit'],
    images: {
      cover: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1400&auto=format&fit=crop',
      useCases: 'https://images.unsplash.com/photo-1485217988980-11786ced9454?q=80&w=1400&auto=format&fit=crop',
      benefits: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?q=80&w=1400&auto=format&fit=crop'
    },
    detail: {
      overview:
        'Keamanan dimulai dari akses yang tepat. Atur peran, batasan modul, dan pantau aktivitas.',
      topHighlights: [
        'Role siap pakai',
        'Izin granular per aksi',
        'Session/device control',
        'Audit login',
        'SSO opsional',
        'Password policy'
      ],
      kpis: [
        { label: 'Insiden akses', value: '↓ 95%' },
        { label: 'Waktu setup', value: '↓ 80%' },
        { label: 'Kepatuhan kebijakan', value: '↑ 100%' },
        { label: 'Audit login', value: 'Realtime' }
      ],
      problems: [
        { title: 'Akses berlebihan', desc: 'Semua orang admin—risiko kebocoran.' },
        { title: 'Audit sulit', desc: 'Tak ada jejak akses & perubahan.' },
        { title: 'SSO tidak ada', desc: 'Pengguna banyak, akun ganda merepotkan.' },
        { title: 'Password lemah', desc: 'Tanpa kebijakan—mudah diserang.' }
      ],
      capabilities: [
        { title: 'Role & Policy', desc: 'Peran dasar & kustom tiap modul.', icon: 'lucide:user-cog' },
        { title: 'Izin Per-Aksi', desc: 'Create/Read/Update/Delete per resource.', icon: 'lucide:key-round' },
        { title: 'Session Control', desc: 'Batas device, paksa logout, expiry.', icon: 'lucide:smartphone' },
        { title: 'Audit & Alerts', desc: 'Log akses + peringatan anomali.', icon: 'lucide:radar' },
        { title: 'SSO', desc: 'SAML/OIDC untuk integrasi akun.', icon: 'lucide:shield' },
        { title: 'Password Policy', desc: 'Kompleksitas & rotasi + 2FA.', icon: 'lucide:shield-check' }
      ],
      workflow: [
        { title: 'Aktifkan Role', desc: 'Gunakan role standar sebagai baseline.' },
        { title: 'Kustom Izin', desc: 'Atur per aksi & modul.' },
        { title: 'Aktifkan 2FA', desc: 'Keamanan akun penting.' },
        { title: 'Pantau Log', desc: 'Audit berkala & alert anomali.' },
        { title: 'Review', desc: 'Rotasi akses tiap semester.' },
        { title: 'Pengetesan', desc: 'Uji skenario akses sebelum go-live.' },
        { title: 'Hardening', desc: 'Kebijakan password & session ketat.' }
      ],
      integrations: [
        { name: 'Semua Modul', icon: 'lucide:app-window' },
        { name: 'Autobot', icon: 'lucide:bot' },
        { name: 'SSO', icon: 'lucide:shield' },
        { name: 'Excel/PDF', icon: 'lucide:file-text' },
        { name: 'Drive/Cloud', icon: 'lucide:cloud' },
        { name: 'ToriID', icon: 'lucide:contact' }
      ],
      useCases: [
        { title: 'Least Privilege', desc: 'Set akses minimum untuk staf baru.' },
        { title: 'Compliance', desc: 'Jejak akses untuk audit internal/eksternal.' },
        { title: 'SSO Enterprise', desc: 'Integrasi akun guru/staf ke IdP.' }
      ],
      benefits: [
        { title: 'Lebih Aman', desc: 'Minimalkan akses berlebih.', metric: '↓ 95% insiden' },
        { title: 'Lebih Terkontrol', desc: 'Audit & alert membantu respons cepat.' },
        { title: 'Lebih Praktis', desc: 'SSO mengurangi multi-credential.' }
      ],
      faqs: [
        { q: '2FA tersedia?', a: 'Ya, OTP/Authenticator didukung.' },
        { q: 'Ekspor log?', a: 'Bisa diekspor untuk audit.' },
        { q: 'Batas device?', a: 'Dapat dibatasi per role/pengguna.' }
      ],
      related: ['siakad', 'perizinan-printout']
    }
  },

  /* ======================= ToriID ======================= */
  {
    slug: 'toriid',
    title: 'ToriID (Attendance)',
    icon: 'ph:identification-badge',
    tone: 'emerald',
    category: 'Add-on',
    short: 'Presensi terintegrasi & realtime: RFID, QR, Face.',
    tags: ['RFID', 'Realtime', 'Integrasi'],
    images: {
      cover: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1400&auto=format&fit=crop',
      useCases: 'https://images.unsplash.com/photo-1485217988980-11786ced9454?q=80&w=1400&auto=format&fit=crop',
      benefits: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1400&auto=format&fit=crop'
    },
    detail: {
      overview:
        'Presensi modern: RFID/QR hingga face recognition. Data langsung sinkron ke SIAKAD & Kelas.',
      topHighlights: [
        'RFID/QR/Face',
        'Realtime sync',
        'Anti-duplikasi',
        'Log lokasi/device',
        'Notifikasi wali',
        'Rekap & grafik'
      ],
      kpis: [
        { label: 'Ketepatan hadir', value: '↑ 25%' },
        { label: 'Antrian gerbang', value: '↓ 60%' },
        { label: 'Kecurangan', value: '↓ 90%' },
        { label: 'Integrasi', value: 'Instan' }
      ],
      problems: [
        { title: 'Titip absen', desc: 'Sulit terdeteksi tanpa verifikasi.' },
        { title: 'Antrian panjang', desc: 'Gerbang padat saat jam sibuk.' },
        { title: 'Pelaporan lambat', desc: 'Wali telat menerima info hadir.' },
        { title: 'Data terpisah', desc: 'Presensi tidak sinkron ke modul lain.' }
      ],
      capabilities: [
        { title: 'Multi Metode', desc: 'RFID/QR/Face menyesuaikan fasilitas.', icon: 'lucide:badge-check' },
        { title: 'Realtime', desc: 'Streaming ke server dengan failover.', icon: 'lucide:wifi' },
        { title: 'Geo/Device Log', desc: 'Catat lokasi & perangkat pemindai.', icon: 'lucide:map-pin' },
        { title: 'Anti Duplikasi', desc: 'Deteksi anomali & blokir double-tap.', icon: 'lucide:ban' },
        { title: 'Notifikasi Wali', desc: 'Kirim hadir/pulang otomatis.', icon: 'lucide:bell' },
        { title: 'Rekap Pintar', desc: 'Grafik keterlambatan & tren kelas.', icon: 'lucide:chart-bar' }
      ],
      workflow: [
        { title: 'Pasang Perangkat', desc: 'RFID/QR/Face di titik masuk.' },
        { title: 'Daftarkan ID', desc: 'Sinkron kartu/QR ke profil siswa.' },
        { title: 'Sinkron Data', desc: 'Streaming ke SIAKAD & Kelas.' },
        { title: 'Notifikasi', desc: 'Autobot kirim info ke wali.' },
        { title: 'Analitik', desc: 'Pantau grafik & laporan.' },
        { title: 'Integrasi Keuangan', desc: 'Opsional payroll/potongan keterlambatan.' },
        { title: 'Pemeliharaan', desc: 'Cek rutin perangkat & jaringan.' }
      ],
      integrations: [
        { name: 'SIAKAD', icon: 'lucide:school' },
        { name: 'Kelas', icon: 'lucide:book-open' },
        { name: 'Keuangan', icon: 'lucide:wallet' },
        { name: 'Autobot', icon: 'lucide:bot' },
        { name: 'Excel/PDF', icon: 'lucide:file-text' },
        { name: 'Hardware', icon: 'lucide:cpu' }
      ],
      useCases: [
        { title: 'Gerbang Multi-Lajur', desc: 'Kurangi antrian dengan multi reader & load-balance.' },
        { title: 'Presensi Staf', desc: 'Integrasi payroll & shift.' },
        { title: 'Monitoring Kunjungan', desc: 'Catat tamu & jadwal kunjungan wali.' }
      ],
      benefits: [
        { title: 'Disiplin Naik', desc: 'Keterlambatan terukur & terlihat.', metric: '↑ 25% ketepatan' },
        { title: 'Pengawasan Mudah', desc: 'Notifikasi real-time ke wali.', metric: 'Realtime alert' },
        { title: 'Data Terkoneksi', desc: 'Alirkan ke kelas/keuangan otomatis.' }
      ],
      faqs: [
        { q: 'Butuh internet selalu?', a: 'Ada buffer offline & sinkron saat online.' },
        { q: 'Face recognition?', a: 'Opsional; perhatikan izin & privasi.' },
        { q: 'Integrasi payroll?', a: 'Bisa untuk staf/guru.' }
      ],
      related: ['kelas-akademik', 'pembayaran', 'autobot']
    }
  },

  /* ======================== Prestasi ======================== */
  {
    slug: 'prestasi',
    title: 'Prestasi',
    icon: 'fluent:trophy-20-regular',
    tone: 'emerald',
    category: 'Akademik',
    short: 'Simpan dan publikasikan data prestasi santri/guru, lengkap dengan dokumentasi.',
    tags: ['Trophy', 'Portofolio', 'Publikasi'],
    images: {
      cover: 'https://images.unsplash.com/photo-1511974035430-5de47d3b95da?q=80&w=1400&auto=format&fit=crop',
      useCases: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1400&auto=format&fit=crop',
      benefits: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1400&auto=format&fit=crop'
    },
    detail: {
      overview:
        'Katalog prestasi akademik/non-akademik dengan foto, sertifikat, dan verifikasi. Tampilkan di website/papan kehormatan digital.',
      topHighlights: [
        'Entri cepat & massal',
        'Lampiran sertifikat',
        'Klasifikasi tingkat (kecamatan–internasional)',
        'Verifikasi internal',
        'Publikasi otomatis',
        'Share ke media sosial'
      ],
      kpis: [
        { label: 'Waktu input', value: '↓ 50%' },
        { label: 'Eksposur publik', value: '↑ 3×' },
        { label: 'Arsip digital', value: '100%' },
        { label: 'Validasi', value: '2 langkah' }
      ],
      problems: [
        { title: 'Dokumen tercecer', desc: 'Sertifikat & foto tidak terarsip rapi.' },
        { title: 'Kurang publikasi', desc: 'Prestasi tidak terbaca publik/wali.' },
        { title: 'Verifikasi lemah', desc: 'Sulit mencegah klaim yang tidak sah.' }
      ],
      capabilities: [
        { title: 'Form Prestasi', desc: 'Judul, deskripsi, tingkat, tanggal, lampiran.', icon: 'lucide:list-plus' },
        { title: 'Validasi Berjenjang', desc: 'Diperiksa pembina → pimpinan.', icon: 'lucide:check-check' },
        { title: 'Publikasi Web', desc: 'Auto tampil di laman profil/prestasi.', icon: 'lucide:globe' },
        { title: 'QR Verifikasi', desc: 'Cek keaslian sertifikat daring.', icon: 'lucide:qrcode' },
        { title: 'Widget Dinding', desc: 'Papan kehormatan digital.', icon: 'lucide:sparkles' },
        { title: 'Share Sosmed', desc: 'Template gambar siap posting.', icon: 'lucide:share' }
      ],
      workflow: [
        { title: 'Input Prestasi', desc: 'Isi detail + unggah sertifikat/foto.' },
        { title: 'Validasi', desc: 'Pembina memeriksa kelayakan.' },
        { title: 'Approval', desc: 'Pimpinan menyetujui publikasi.' },
        { title: 'Publikasi', desc: 'Tayang di web & papan digital.' },
        { title: 'Arsip', desc: 'Masuk katalog prestasi sepanjang masa.' },
        { title: 'Komunikasi', desc: 'Autobot kirim pengumuman ke wali.' },
        { title: 'Rekap Tahunan', desc: 'Cetak buku prestasi.' }
      ],
      integrations: [
        { name: 'Profile Web Editor', icon: 'lucide:layout-dashboard' },
        { name: 'Autobot', icon: 'lucide:bot' },
        { name: 'Drive/Cloud', icon: 'lucide:cloud' },
        { name: 'SIAKAD', icon: 'lucide:school' },
        { name: 'Website Publik', icon: 'lucide:globe' },
        { name: 'Excel/PDF', icon: 'lucide:file-text' }
      ],
      useCases: [
        { title: 'Portofolio Siswa', desc: 'Kumpulan prestasi untuk PPDB/akreditasi.' },
        { title: 'Ranking Unit', desc: 'Leaderboard antar kelas/unit.' },
        { title: 'Promosi Sekolah', desc: 'Konten prestasi untuk media sosial.' }
      ],
      benefits: [
        { title: 'Brand Image Naik', desc: 'Eksposur prestasi meningkat.', metric: '↑ 3× impresi' },
        { title: 'Arsip Rapi', desc: 'Mudah cari sertifikat bila dibutuhkan.' },
        { title: 'Motivasi Siswa', desc: 'Papan digital memacu kompetisi sehat.' }
      ],
      faqs: [
        { q: 'Bisa impor massal?', a: 'Ya, via Excel dengan template.' },
        { q: 'Publikasi otomatis?', a: 'Bisa setelah approval final.' },
        { q: 'QR verifikasi?', a: 'Tautan cek keaslian sertifikat.' }
      ],
      related: ['siakad', 'kelas-akademik', 'pengumuman']
    }
  },

  /* ====================== Pelanggaran ====================== */
  {
    slug: 'pelanggaran',
    title: 'Pelanggaran',
    icon: 'mingcute:fault-line',
    tone: 'amber',
    category: 'Operasional',
    short: 'Catat pelanggaran, poin, tindak lanjut, dan surat pernyataan otomatis.',
    tags: ['Disiplin', 'Poin', 'Tindak Lanjut'],
    images: {
      cover: 'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?q=80&w=1400&auto=format&fit=crop',
      useCases: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1400&auto=format&fit=crop',
      benefits: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1400&auto=format&fit=crop'
    },
    detail: {
      overview:
        'Sistem poin pelanggaran yang transparan dengan bukti pendukung, notifikasi ke wali, dan tindak lanjut terukur.',
      topHighlights: [
        'Kategori & bobot poin',
        'Bukti foto/scan',
        'Tindak lanjut bertahap',
        'Surat pernyataan otomatis',
        'Notifikasi wali',
        'Dashboard disiplin'
      ],
      kpis: [
        { label: 'Kasus berulang', value: '↓ 45%' },
        { label: 'Waktu proses', value: '↓ 50%' },
        { label: 'Transparansi', value: '↑ 100%' },
        { label: 'Kepatuhan', value: '↑ signifikan' }
      ],
      problems: [
        { title: 'Subjektif', desc: 'Sanksi tidak konsisten antar petugas.' },
        { title: 'Dokumen tak rapi', desc: 'Bukti & surat manual mudah hilang.' },
        { title: 'Wali tidak tahu', desc: 'Komunikasi sering terlambat.' }
      ],
      capabilities: [
        { title: 'Skema Poin', desc: 'Kategori pelanggaran & bobot poin.', icon: 'lucide:scales' },
        { title: 'Bukti Pendukung', desc: 'Foto/scan kronologi kejadian.', icon: 'lucide:paperclip' },
        { title: 'Tindak Lanjut', desc: 'Tahap konseling → tugas → skors.', icon: 'lucide:route' },
        { title: 'Surat Otomatis', desc: 'Surat pernyataan & panggilan.', icon: 'lucide:file-text' },
        { title: 'Notifikasi Wali', desc: 'WA/Email saat kasus dibuat.', icon: 'lucide:bell' },
        { title: 'Dashboard Disiplin', desc: 'Tren pelanggaran per kelas/jenis.', icon: 'lucide:chart-line' }
      ],
      workflow: [
        { title: 'Input Kasus', desc: 'Isi form + bukti.' },
        { title: 'Validasi', desc: 'Pembina mengecek fakta.' },
        { title: 'Penetapan Poin', desc: 'Poin otomatis sesuai kategori.' },
        { title: 'Tindak Lanjut', desc: 'Tahapan berdasarkan total poin.' },
        { title: 'Surat & Notifikasi', desc: 'Dokumen & info ke wali.' },
        { title: 'Monitoring', desc: 'Pantau grafik & rekap.' },
        { title: 'Evaluasi', desc: 'Review kategori & bobot tiap semester.' }
      ],
      integrations: [
        { name: 'Hak Akses', icon: 'lucide:user-cog' },
        { name: 'Autobot', icon: 'lucide:bot' },
        { name: 'SIAKAD', icon: 'lucide:school' },
        { name: 'Drive/Cloud', icon: 'lucide:cloud' },
        { name: 'Excel/PDF', icon: 'lucide:file-text' },
        { name: 'ToriID', icon: 'lucide:contact' }
      ],
      useCases: [
        { title: 'Program Pembinaan', desc: 'Tracking tugas pembinaan yang progresif.' },
        { title: 'Analitik Disiplin', desc: 'Hotspot waktu/kelas untuk pencegahan.' },
        { title: 'Kolaborasi Wali', desc: 'Wali dilibatkan sejak awal kasus.' }
      ],
      benefits: [
        { title: 'Tertib & Adil', desc: 'Standar yang sama untuk semua kasus.', metric: '↓ subjektivitas' },
        { title: 'Dokumen Lengkap', desc: 'Bukti & surat aman tersimpan.' },
        { title: 'Komunikasi Cepat', desc: 'Wali langsung tahu status.' }
      ],
      faqs: [
        { q: 'Skema poin fleksibel?', a: 'Benar, bisa disesuaikan kebijakan.' },
        { q: 'Privasi data?', a: 'Akses dibatasi per peran & audit log.' },
        { q: 'Cetak rekap?', a: 'Ekspor PDF/Excel tersedia.' }
      ],
      related: ['perizinan-printout', 'hak-akses', 'autobot']
    }
  },

  /* ======================= Jadwal Piket (slug: perizinan) ======================= */
  {
    slug: 'perizinan',
    title: 'Jadwal Piket',
    icon: 'uil:list-ol',
    tone: 'violet',
    category: 'Operasional',
    short: 'Penjadwalan piket berkala, rekap hadir, dan printout otomatis.',
    tags: ['Piket', 'Jadwal', 'Rekap'],
    images: {
      cover: 'https://images.unsplash.com/photo-1517976487492-576ea1085bf4?q=80&w=1400&auto=format&fit=crop',
      useCases: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1400&auto=format&fit=crop',
      benefits: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=1400&auto=format&fit=crop'
    },
    detail: {
      overview:
        'Atur jadwal piket kelas/asrama secara berkala, pantau kehadiran, dan cetak daftar piket dengan QR.',
      topHighlights: [
        'Template rotasi otomatis',
        'Integrasi presensi',
        'Printout daftar piket',
        'Pengingat jadwal',
        'Tukar jadwal terkendali',
        'Rekap bulanan'
      ],
      kpis: [
        { label: 'Ketertiban piket', value: '↑ signifikan' },
        { label: 'Administrasi', value: '↓ 70% beban' },
        { label: 'Kepatuhan', value: '↑ 30%' },
        { label: 'Dokumentasi', value: '100%' }
      ],
      problems: [
        { title: 'Rotasi manual', desc: 'Tanpa template, rotasi sering tidak adil.' },
        { title: 'Tidak hadir', desc: 'Kehadiran piket sulit dimonitor.' },
        { title: 'Printout lama', desc: 'Daftar piket manual sering berubah.' }
      ],
      capabilities: [
        { title: 'Generator Jadwal', desc: 'Rotasi otomatis adil & transparan.', icon: 'lucide:repeat' },
        { title: 'Integrasi Presensi', desc: 'Tarik hadir dari ToriID.', icon: 'lucide:contact' },
        { title: 'Tukar Jadwal', desc: 'Permintaan tukar dengan approval.', icon: 'lucide:swap-horizontal' },
        { title: 'Pengingat', desc: 'Notifikasi sebelum giliran.', icon: 'lucide:bell' },
        { title: 'Printout QR', desc: 'Cetak daftar piket + QR cek online.', icon: 'lucide:qrcode' },
        { title: 'Rekap & Grafik', desc: 'Laporan kepatuhan per kelas.', icon: 'lucide:chart-bar' }
      ],
      workflow: [
        { title: 'Buat Template', desc: 'Pilih pola rotasi & periode.' },
        { title: 'Generate Jadwal', desc: 'Otomatis untuk kelas/asrama.' },
        { title: 'Sinkron Presensi', desc: 'Tarik hadir per sesi piket.' },
        { title: 'Tukar & Approval', desc: 'Tukar terkontrol sesuai aturan.' },
        { title: 'Cetak Daftar', desc: 'Tempel daftar piket dengan QR.' },
        { title: 'Pantau & Rekap', desc: 'Grafik kepatuhan & rekap bulanan.' },
        { title: 'Evaluasi', desc: 'Perbaiki pola untuk periode berikut.' }
      ],
      integrations: [
        { name: 'ToriID', icon: 'lucide:contact' },
        { name: 'Autobot', icon: 'lucide:bot' },
        { name: 'SIAKAD', icon: 'lucide:school' },
        { name: 'Excel/PDF', icon: 'lucide:file-text' },
        { name: 'Drive/Cloud', icon: 'lucide:cloud' },
        { name: 'Hak Akses', icon: 'lucide:user-cog' }
      ],
      useCases: [
        { title: 'Piket Kelas', desc: 'Rotasi harian mingguan untuk kebersihan.' },
        { title: 'Piket Asrama', desc: 'Pembagian tugas pagi/sore/malam.' },
        { title: 'Piket Upacara', desc: 'Tim upacara & peralatan.' }
      ],
      benefits: [
        { title: 'Adil & Transparan', desc: 'Rotasi otomatis, minim protes.' },
        { title: 'Ringkas', desc: 'Administrasi piket jauh berkurang.', metric: '↓ 70% beban' },
        { title: 'Terukur', desc: 'Kepatuhan terlihat di dashboard.' }
      ],
      faqs: [
        { q: 'Custom pola?', a: 'Bisa—hari tertentu/skip libur.' },
        { q: 'QR untuk apa?', a: 'Cek daftar resmi & perubahan online.' },
        { q: 'Notifikasi otomatis?', a: 'Lewat Autobot (WA/Email/Telegram).' }
      ],
      related: ['toriid', 'perizinan-printout', 'hak-akses']
    }
  }
]
