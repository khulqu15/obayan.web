export type ProductKey = 'webprofile' | 'siakad' | 'payment' | 'academic' | 'attendance' | 'visitor' | 'violation' | 'permission'


export function useObayan() {
    const brand = 'Obayan'


    const nav = [
        { label: 'Fitur', href: '#features' },
        { label: 'Produk', href: '#products' },
        { label: 'Integrasi', href: '#integrations' },
        { label: 'Harga', href: '#pricing' },
        { label: 'FAQ', href: '#faq' },
    ]


    const features = [
        { title: 'Satu akun untuk semua', desc: 'Single Sign‑On bagi pengasuh, guru, wali, dan santri.', icon: 'ph:user-switch' },
        { title: 'Dashboard real‑time', desc: 'Data akademik, absensi, dan keuangan dalam satu layar.', icon: 'ph:gauge' },
        { title: 'Mobile‑first', desc: 'Ringan, responsif, dan ramah PWA untuk akses cepat.', icon: 'ph:device-mobile' },
        { title: 'Keamanan terukur', desc: 'RBAC, audit log, enkripsi at‑rest dan in‑transit.', icon: 'ph:shield-check' },
        { title: 'Multicampus', desc: 'Atur beberapa unit/komplek dengan satu panel.', icon: 'ph:buildings' },
        { title: 'Integrasi pembayaran', desc: 'QRIS, VA, dan rekonsiliasi otomatis.', icon: 'ph:qr-code' },
    ]


    const products: Array<{ key: ProductKey; title: string; desc: string; icon: string }>= [
        { key:'webprofile', title:'Web Profile', desc:'Profil pondok modern yang hangat, ringan, SEO‑ready.', icon:'ph:globe' },
        { key:'siakad', title:'SIAKAD', desc:'Manajemen data santri, kelas, nilai, rapor.', icon:'ph:student' },
        { key:'payment', title:'Pembayaran', desc:'Tagihan, cicilan, beasiswa, QRIS/VA & laporan.', icon:'ph:bank' },
        { key:'academic', title:'Akademik', desc:'Jadwal, materi, ujian, kehadiran kelas.', icon:'ph:chalkboard-teacher' },
        { key:'attendance', title:'Absensi', desc:'RFID & Fingerprint (ToriID), shift, keterlambatan.', icon:'ph:identification-badge' },
        { key:'visitor', title:'Kunjungan', desc:'Pengajuan wali, jadwal, pass, dan log keamanan.', icon:'ph:map-pin' },
        { key:'violation', title:'Pelanggaran', desc:'Poin pelanggaran, pembinaan, dan notifikasi.', icon:'ph:warning' },
        { key:'permission', title:'Perizinan', desc:'Izin keluar, sakit, tugas; alur persetujuan.', icon:'ph:note-pencil' },
    ]


    const steps = [
        { title:'Daftar & Onboarding', desc:'Buat tenant pondok, atur domain subdomain, dan import data santri/guru.' },
        { title:'Aktifkan Modul', desc:'Pilih produk (SIAKAD, Pembayaran, Absensi, dst), sesuaikan peran & kebijakan.' },
        { title:'Integrasi ToriID', desc:'Hubungkan perangkat RFID & Fingerprint ke gateway Obayan dengan token aman.' },
        { title:'Go‑Live', desc:'Umumkan portal wali & santri, jalankan operasional harian.' },
    ]


    const faqs = [
        { q:'Apa itu ToriID dan bagaimana integrasinya?', a:'ToriID adalah perangkat RFID + Fingerprint yang terhubung ke Obayan melalui gateway (Wi-Fi/LAN). Scan akan dikirimkan ke endpoint aman dengan tenantKey sehingga absensi, izin, dan kunjungan tercatat real-time.' },
        { q:'Apakah bisa custom branding?', a:'Bisa. Logo, warna, domain, hingga komposisi halaman dapat disesuaikan tanpa kode.' },
        { q:'Metode pembayaran apa yang didukung?', a:'QRIS, Virtual Account, transfer manual dengan bukti, serta rekonsiliasi otomatis.' },
        { q:'Bagaimana skema lisensi?', a:'Berbasis langganan per modul. Diskon tersedia untuk skala besar/multi-campus.' },
    ]


    const plans = [
        {
            id: 'basic',
            name: 'Basic',
            price: { monthly: 399_000, yearly: 3_990_000 }, // hemat 2 bulan
            highlight: false,
            perks: [
            'Website profil lembaga',
            'Subdomain *.obayan.id',
            'SIAKAD inti (santri, kelas, jadwal)',
            'Absensi ToriID (1 device)',
            'Portal wali santri dasar',
            'E-Raport format dasar',
            'Pengelolaan SPP & tagihan sederhana',
            'Notifikasi WA template dasar',
            'Broadcast WA manual',
            'PPDB online sederhana',
            'Kartu santri digital (QR)',
            'Rekap presensi harian & bulanan',
            'Ekspor laporan (CSV/XLS) dasar',
            'Manajemen pengguna: admin & operator',
            'Hak akses per modul (basic)',
            'Backup mingguan otomatis',
            'Panduan & video tutorial',
            'Import data via Google Sheets/CSV',
            'Widget pengumuman & agenda',
            'Support via email & ticketing'
            ]
        },
        {
            id: 'pro',
            name: 'Pro',
            price: { monthly: 799_000, yearly: 7_990_000 }, // hemat 2 bulan
            highlight: true,
            perks: [
            'Semua fitur Basic',
            'Pembayaran online QRIS / Virtual Account',
            'Absensi ToriID (hingga 3 device)',
            'Automasi notifikasi WA (SPP, presensi, pengumuman)',
            'E-Raport kustomisasi template',
            'PPDB end-to-end (verifikasi & berkas)',
            'Keuangan SPP & multi-tagihan',
            'Template surat & dokumen (kop, nomor, arsip)',
            'Inventori & aset dasar',
            'Perpustakaan sederhana (peminjaman & denda)',
            'Kalender akademik & agenda terpusat',
            'LMS materi & tugas (unggah, komentar)',
            'Ujian/CBT dasar (bank soal)',
            'Integrasi Google Workspace (Drive, Login)',
            'Dashboard analitik (SPP, presensi, akademik)',
            'Approval berjenjang (keuangan/administrasi)',
            'Multi-peran (kepala, wali kelas, bendahara)',
            'Backup harian otomatis',
            'SLA respons 1×24 jam (hari kerja)',
            'Support via chat WhatsApp (jam kerja)',
            'Website profil lanjutan (blog/berita)',
            'Multi bahasa (ID/EN) untuk portal',
            'Akses API terbatas (read)',
            'Webhook dasar (notif ke Discord/Slack)',
            'Branding minor (logo & warna utama)'
            ]
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: { monthly: 0, yearly: 0 }, // custom
            highlight: false,
            perks: [
            'Semua fitur Pro',
            'Multi-campus & multi-brand management',
            'SSO (Google/Microsoft/Keycloak)',
            'Custom feature & workflow sesuai SOP',
            'Integrasi ERP/Keuangan (Odoo, Accurate, dsb.)',
            'Data warehouse & BI connector',
            'Ujian/CBT skala besar (proctoring & anti-cheat)',
            'Pengelolaan kuota & kapasitas kelas lanjutan',
            'Advanced RBAC (role-permission granular)',
            'Akun & perangkat tak terbatas',
            'Backup realtime + Disaster Recovery plan',
            'Audit log tingkat lanjut & pelacakan aktivitas',
            'Enkripsi data at-rest & in-transit',
            'CDN + WAF + rate limiting',
            'Custom domain & email pengirim (SMTP/DMARC)',
            'White-label mobile app (Android/iOS)',
            'Penagihan multi-channel & rekonsiliasi',
            'On-premise/hybrid deployment opsional',
            'Migrasi data menyeluruh (legacy system)',
            'Pelatihan onsite & dedicated account manager',
            'SLA prioritas (jadwal disepakati)',
            'Kapabilitas multi-tenant',
            'Advanced API & webhook (read/write)',
            'Monitoring & alerting terpusat',
            'Pelaporan compliance & audit eksternal'
            ]
        }
    ]


    return { brand, nav, features, products, steps, faqs, plans }
}