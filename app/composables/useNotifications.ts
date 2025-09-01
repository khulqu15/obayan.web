import { computed } from 'vue'

export type Notice = {
    id: string | number
    title: string
    message?: string
    time?: string
    type?: 'info' | 'success' | 'warning' | 'error'
    read?: boolean
    href?: string
}

export const useNotifications = () => {
    const items = useState<Notice[]>('notifications', () => ([
        { id: 1, title: 'Ujian Tengah Semester', message: '20–25 Agustus', time: '5m',  type: 'info',    read: false, href: '/admin/jadwal' },
        { id: 2, title: 'Setoran Tahfidz',       message: 'Target pekan +10%',          time: '1h',  type: 'success', read: false },
        { id: 3, title: 'SPP Menunggak',         message: '3 santri belum bayar',       time: '3h',  type: 'warning', read: false, href: '/admin/keuangan' },
        { id: 4, title: 'Perawatan Ruang 101',   message: 'Besok 09:00',                time: '1d',  type: 'info',    read: true }
    ]))

    const unread = computed(() => items.value.filter(i => !i.read).length)
    const markRead = (id: Notice['id']) => { const n = items.value.find(i => i.id === id); if (n) n.read = true }
    const markAllRead = () => { items.value.forEach(i => (i.read = true)) }
    const clearAll = () => { items.value = [] }

    return { items, unread, markRead, markAllRead, clearAll }
}
