import { ref } from 'vue'

export type ArticleSegment = 'TK' | 'SD' | 'SMP' | 'Madin' | 'Pondok' | 'Umum'

export type NewsAiRecommendation = {
  language: string
  mainTheme: string
  category: string
  segment: ArticleSegment
  tags: string[]
  summary: string
  confidence: 'Rendah' | 'Sedang' | 'Tinggi'
  model: 'tfjs-use-local'
}

type PrototypeItem = {
  label: string
  type: 'category' | 'segment'
  segment?: ArticleSegment
  texts: string[]
  tags: string[]
}

let modelPromise: Promise<any> | null = null
let prototypeCache: {
  labels: PrototypeItem[]
  embeddings: number[][]
} | null = null

const loading = ref(false)
const ready = ref(false)
const error = ref<string | null>(null)

function normalizeKey(v: string) {
  return String(v || '')
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeText(v: string) {
  return String(v || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function detectLanguage(raw: string) {
  if (/[\u0600-\u06FF]/.test(raw)) return 'Arab'
  if (/[\u3040-\u30ff\u3400-\u9fff]/.test(raw)) return 'Jepang'
  if (/\b(the|student|school|competition|event|program|admission|kindergarten|primary|junior)\b/i.test(raw)) {
    return 'English'
  }
  return 'Indonesia / Campuran'
}

function cosineSimilarity(a: number[], b: number[]) {
  let dot = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1)
}

const prototypes: PrototypeItem[] = [
  {
    type: 'category',
    label: 'Prestasi',
    tags: ['prestasi', 'juara', 'lomba', 'kompetisi'],
    texts: [
      'siswa meraih juara lomba tingkat kabupaten',
      'santri memenangkan kompetisi tahfidz',
      'student wins school competition award',
      'achievement contest champion olympiad winner',
      'musabaqah tilawatil quran juara prestasi'
    ]
  },
  {
    type: 'category',
    label: 'Kegiatan',
    tags: ['kegiatan', 'agenda', 'event', 'sekolah'],
    texts: [
      'kegiatan sekolah dan acara santri',
      'agenda pondok pesantren bersama wali santri',
      'school activity event program training workshop',
      'kunjungan pelatihan seminar acara siswa'
    ]
  },
  {
    type: 'category',
    label: 'Pengumuman',
    tags: ['pengumuman', 'informasi', 'jadwal'],
    texts: [
      'pengumuman jadwal libur dan informasi sekolah',
      'announcement notice schedule information',
      'pemberitahuan resmi untuk wali santri',
      'edaran libur semester jadwal kegiatan'
    ]
  },
  {
    type: 'category',
    label: 'PPDB',
    tags: ['ppdb', 'pendaftaran', 'santri-baru'],
    texts: [
      'pendaftaran peserta didik baru',
      'penerimaan santri baru pondok pesantren',
      'student admission registration enrollment',
      'ppdb psb registrasi sekolah madrasah'
    ]
  },
  {
    type: 'category',
    label: 'Akademik',
    tags: ['akademik', 'pembelajaran', 'ujian'],
    texts: [
      'ujian semester nilai rapor pembelajaran kelas',
      'academic exam curriculum lesson report card',
      'kegiatan belajar mengajar mapel penilaian siswa',
      'assessment school subject class learning'
    ]
  },
  {
    type: 'category',
    label: 'Tahfidz',
    tags: ['tahfidz', 'alquran', 'hafalan'],
    texts: [
      'program tahfidz hafalan al quran santri',
      'murojaah setoran hafalan juz quran',
      'quran memorization program hifz student',
      'khatam alquran tahfiz pesantren'
    ]
  },
  {
    type: 'category',
    label: 'Madin',
    tags: ['madin', 'diniyah', 'kitab-kuning'],
    texts: [
      'madrasah diniyah belajar kitab kuning',
      'madin nahwu shorof fiqih aqidah akhlak',
      'islamic studies arabic grammar classical book',
      'kajian kitab jurumiyah fathul qorib imrithi'
    ]
  },
  {
    type: 'category',
    label: 'Pondok',
    tags: ['pondok', 'pesantren', 'santri'],
    texts: [
      'kegiatan pondok pesantren santri asrama',
      'islamic boarding school students dormitory',
      'pengasuh kyai kiai nyai musyrif pesantren',
      'wali santri kehidupan santri pondok'
    ]
  },
  {
    type: 'segment',
    label: 'TK',
    segment: 'TK',
    tags: ['tk', 'paud', 'ra'],
    texts: [
      'tk paud ra raudhatul athfal taman kanak kanak',
      'kindergarten preschool early childhood students',
      'anak usia dini kegiatan bermain belajar'
    ]
  },
  {
    type: 'segment',
    label: 'SD',
    segment: 'SD',
    tags: ['sd', 'mi', 'sekolah-dasar'],
    texts: [
      'sd mi sekolah dasar madrasah ibtidaiyah',
      'elementary school primary school students',
      'siswa kelas satu dua tiga empat lima enam'
    ]
  },
  {
    type: 'segment',
    label: 'SMP',
    segment: 'SMP',
    tags: ['smp', 'mts'],
    texts: [
      'smp mts madrasah tsanawiyah',
      'junior high school middle school students',
      'siswa kelas tujuh delapan sembilan'
    ]
  },
  {
    type: 'segment',
    label: 'Madin',
    segment: 'Madin',
    tags: ['madin', 'diniyah'],
    texts: [
      'madin madrasah diniyah kitab kuning',
      'nahwu shorof fiqih aqidah akhlak',
      'kelas diniyah pembelajaran agama islam'
    ]
  },
  {
    type: 'segment',
    label: 'Pondok',
    segment: 'Pondok',
    tags: ['pondok', 'pesantren', 'santri'],
    texts: [
      'pondok pesantren santri asrama',
      'islamic boarding school boarding students',
      'kegiatan santri pengasuh kyai pondok'
    ]
  },
  {
    type: 'segment',
    label: 'Umum',
    segment: 'Umum',
    tags: ['umum'],
    texts: [
      'informasi umum yayasan lembaga sekolah masyarakat',
      'general public announcement school foundation',
      'berita umum untuk orang tua wali santri'
    ]
  }
]

function ruleBoost(title: string, result: NewsAiRecommendation) {
  const text = normalizeText(title)

  const addTag = (tag: string) => {
    const key = normalizeKey(tag)
    if (key && !result.tags.includes(key)) result.tags.push(key)
  }

  const has = (...keys: string[]) => keys.some((k) => text.includes(normalizeText(k)))

  if (has('tk', 'paud', 'raudhatul athfal', 'kindergarten', 'preschool')) {
    result.segment = 'TK'
    addTag('tk')
  } else if (has('sd', 'mi', 'madrasah ibtidaiyah', 'elementary', 'primary school')) {
    result.segment = 'SD'
    addTag('sd')
  } else if (has('smp', 'mts', 'madrasah tsanawiyah', 'junior high', 'middle school')) {
    result.segment = 'SMP'
    addTag('smp')
  } else if (has('madin', 'madrasah diniyah', 'diniyah', 'kitab kuning', 'nahwu', 'shorof', 'fiqih')) {
    result.segment = 'Madin'
    result.category = result.category === 'Umum' ? 'Madin' : result.category
    addTag('madin')
    addTag('diniyah')
  } else if (has('pondok', 'pesantren', 'santri', 'asrama', 'boarding school')) {
    result.segment = 'Pondok'
    addTag('pondok')
    addTag('santri')
  }

  if (has('juara', 'lomba', 'kompetisi', 'olimpiade', 'winner', 'champion', 'award')) {
    result.category = 'Prestasi'
    result.mainTheme = 'Prestasi'
    addTag('prestasi')
    addTag('lomba')
  }

  if (has('tahfidz', 'tahfiz', 'hafalan', 'quran', 'alquran', 'murojaah', 'hifz')) {
    if (result.category === 'Umum') result.category = 'Tahfidz'
    result.mainTheme = result.mainTheme === 'Umum' ? 'Tahfidz' : result.mainTheme
    addTag('tahfidz')
    addTag('alquran')
  }

  if (has('ppdb', 'psb', 'pendaftaran', 'admission', 'registration')) {
    result.category = 'PPDB'
    result.mainTheme = 'Pendaftaran'
    addTag('ppdb')
  }

  for (const token of text.split(' ')) {
    const key = normalizeKey(token)
    if (key.length >= 4) addTag(key)
  }

  result.tags = result.tags.slice(0, 10)

  return result
}

async function loadModel() {
  if (modelPromise) return modelPromise

  loading.value = true
  error.value = null

  modelPromise = Promise.all([
    import('@tensorflow/tfjs'),
    import('@tensorflow-models/universal-sentence-encoder')
  ])
    .then(async ([tf, use]) => {
      await tf.ready()
      const model = await use.load()
      ready.value = true
      return model
    })
    .catch((err) => {
      console.error(err)
      error.value = 'Model TensorFlow.js gagal dimuat.'
      throw err
    })
    .finally(() => {
      loading.value = false
    })

  return modelPromise
}

async function embedTexts(model: any, texts: string[]) {
  const tensor = await model.embed(texts)
  const values = await tensor.array()
  tensor.dispose?.()
  return values as number[][]
}

async function preparePrototypes(model: any) {
  if (prototypeCache) return prototypeCache

  const labels: PrototypeItem[] = []
  const texts: string[] = []

  for (const item of prototypes) {
    labels.push(item)
    texts.push(item.texts.join('. '))
  }

  const embeddings = await embedTexts(model, texts)

  prototypeCache = { labels, embeddings }
  return prototypeCache
}

function fallbackRecommendation(title: string): NewsAiRecommendation {
  const result: NewsAiRecommendation = {
    language: detectLanguage(title),
    mainTheme: 'Umum',
    category: 'Umum',
    segment: 'Umum',
    tags: [],
    summary: 'Rekomendasi dibuat dari rule lokal karena model belum tersedia.',
    confidence: 'Rendah',
    model: 'tfjs-use-local'
  }

  return ruleBoost(title, result)
}

export const useNewsTfjsRecommendation = () => {
  async function recommend(title: string): Promise<NewsAiRecommendation> {
    const cleanTitle = String(title || '').trim()
    if (!cleanTitle || cleanTitle.length < 4) {
      return fallbackRecommendation(cleanTitle)
    }

    try {
      const model = await loadModel()
      const cache = await preparePrototypes(model)
      const [titleEmbedding] = await embedTexts(model, [cleanTitle])

      const scored = cache.labels
        .map((item, index) => ({
          item,
          score: cosineSimilarity(titleEmbedding, cache.embeddings[index])
        }))
        .sort((a, b) => b.score - a.score)

      const bestCategory = scored.find((s) => s.item.type === 'category')
      const bestSegment = scored.find((s) => s.item.type === 'segment')

      const tags = new Set<string>()

      for (const candidate of scored.slice(0, 5)) {
        for (const tag of candidate.item.tags) {
          const key = normalizeKey(tag)
          if (key) tags.add(key)
        }
      }

      const confidenceScore = Math.max(bestCategory?.score || 0, bestSegment?.score || 0)

      const result: NewsAiRecommendation = {
        language: detectLanguage(cleanTitle),
        mainTheme: bestCategory?.item.label || 'Umum',
        category: bestCategory?.item.label || 'Umum',
        segment: bestSegment?.item.segment || 'Umum',
        tags: Array.from(tags).slice(0, 10),
        summary: `AI lokal TensorFlow.js mencocokkan judul dengan tema "${bestCategory?.item.label || 'Umum'}" dan segment "${bestSegment?.item.label || 'Umum'}".`,
        confidence:
          confidenceScore >= 0.55
            ? 'Tinggi'
            : confidenceScore >= 0.38
              ? 'Sedang'
              : 'Rendah',
        model: 'tfjs-use-local'
      }

      return ruleBoost(cleanTitle, result)
    } catch {
      return fallbackRecommendation(cleanTitle)
    }
  }

  return {
    recommend,
    loading,
    ready,
    error
  }
}