<template>
  <section class="relative overflow-hidden dark:bg-neutral-900 bg-gray-100" id="facility">
    <!-- Deco -->
    <svg aria-hidden="true" class="hidden md:block absolute top-[30%] -left-10 size-48 opacity-15 text-blue-700 dark:text-blue-500" viewBox="0 0 120 120" fill="currentColor">
      <path d="M60 10c8 7 14 12 14 22v6h6c5 0 10 4 10 9v40H30V47c0-5 5-9 10-9h6v-6c0-10 6-15 14-22Z"/>
      <rect x="18" y="87" width="84" height="8" rx="3"/>
      <path d="M46 59h28v36H46z"/>
      <path d="M34 74h8v21h-8zM78 74h8v21h-8z"/>
      <circle cx="60" cy="31" r="4" fill="white" opacity=".45"/>
    </svg>
    <svg aria-hidden="true" class="hidden md:block absolute top-[35%] -right-10 size-56 opacity-10 text-blue-700 dark:text-blue-400" viewBox="0 0 140 140" fill="currentColor">
      <path d="M70 12c10 9 18 15 18 28v7h7c6 0 11 5 11 11v50H34V58c0-6 5-11 11-11h7v-7c0-13 8-19 18-28Z"/>
      <rect x="20" y="110" width="100" height="10" rx="4"/>
      <path d="M50 72h40v40H50z"/>
    </svg>

    <div class="relative max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
      <div class="grid lg:grid-cols-12 gap-8 items-center">
        <!-- Copy -->
        <div class="lg:col-span-6">
          <p class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">
            <span class="inline-block size-1.5 rounded-full bg-blue-600"></span>
            {{ eyebrow }}
          </p>

          <h1 class="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 dark:text-white">
            {{ headingMain }}
            <span class="text-blue-600 dark:text-blue-400">{{ headingHi1 }}</span>
            <span class="text-blue-600 dark:text-emerald-400"> {{ headingHi2 }}</span>
          </h1>

          <p class="mt-3 text-gray-600 dark:text-neutral-300 max-w-2xl">
            {{ description }}
          </p>

          <div class="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div v-for="s in stats" :key="(s.label||'') + (s.value||'')" class="rounded-xl border border-gray-200 bg-white/70 backdrop-blur p-4 dark:bg-neutral-800/60 dark:border-neutral-700">
              <div class="flex-col items-center gap-3 flex-wrap">
                <ClientOnly>
                  <Icon :icon="s.icon" class="size-5 text-blue-600 dark:text-blue-400" />
                  <template #fallback><span class="size-5 inline-block" /></template>
                </ClientOnly>
                <p class="text-sm text-gray-500 dark:text-neutral-400">{{ s.label }}</p>
              </div>
              <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{{ s.value }}</p>
            </div>
          </div>

          <div class="mt-7 flex flex-wrap gap-3">
            <a :href="galleryHref" class="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-blue-700 focus:outline-hidden">
              <ClientOnly><Icon icon="lucide:image" class="size-4" /></ClientOnly>
              Lihat Galeri
            </a>

            <button v-if="brochureImages.length" aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-brochures-view" data-hs-overlay="#hs-brochures-view" type="button" class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white/80 backdrop-blur px-4 py-2.5 text-sm font-medium text-gray-800 shadow-2xs dark:bg-neutral-800/70 dark:border-neutral-700 dark:text-neutral-100">
              <ClientOnly><Icon icon="lucide:download" class="size-4" /></ClientOnly>
              Unduh Brosur
            </button>
          </div>
        </div>

        <!-- Overlay (Brosur Viewer) -->
        <div id="hs-brochures-view" class="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto" role="dialog" tabindex="-1" aria-labelledby="hs-brochures-view-label">
          <div class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all md:max-w-5xl md:w-full m-3 md:mx-auto">
            <div class="relative flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl overflow-hidden dark:bg-neutral-900 dark:border-neutral-800">
              <div class="absolute top-2 end-2">
                <button type="button" class="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-300" aria-label="Close" data-hs-overlay="#hs-brochures-view">
                  <span class="sr-only">Close</span>
                  <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 18 6M6 6l12 12"/></svg>
                </button>
              </div>

              <div class="px-5 sm:px-8 pt-6 pb-3 border-b border-gray-200 dark:border-neutral-800">
                <h3 id="hs-brochures-view-label" class="text-lg font-semibold text-gray-800 dark:text-neutral-200">Brochure Gallery</h3>
                <p class="text-xs text-gray-500 dark:text-neutral-400">Gunakan <code>CTRL</code> untuk zoom</p>
              </div>

              <div v-if="brochureImages.length" class="relative w-full aspect-video rounded-xl border border-gray-200 overflow-hidden bg-gray-100 dark:border-neutral-800 dark:bg-neutral-800 select-none">
                <div ref="stageRef" :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'" class="absolute inset-0 touch-pan-y touch-pan-x"
                  @wheel="onWheel" @mousedown="onPointerDown" @mousemove="onPointerMove" @mouseup="onPointerUp" @mouseleave="onPointerUp"
                  @touchstart.passive="onTouchStart" @touchmove.prevent="onTouchMove" @touchend="onTouchEnd" @dblclick="onDblClick">
                  <img :src="brochureImages[selectedBrochure]" :alt="`Brochure ${selectedBrochure + 1}`" class="absolute top-1/2 left-1/2 will-change-transform" :style="imgStyle" draggable="false" loading="eager" />
                </div>

                <div class="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-black/50 text-white text-xs">
                  {{ selectedBrochure + 1 }} / {{ brochureImages.length }} • {{ (scale * 100).toFixed(0) }}%
                </div>

                <button @click="prevBrochure" class="absolute left-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full size-9 bg-white/80 hover:bg-white shadow border border-gray-200 dark:bg-neutral-700/80 dark:hover:bg-neutral-700 dark:border-neutral-600">
                  <svg class="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L8.414 10l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"/></svg>
                </button>
                <button @click="nextBrochure" class="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full size-9 bg-white/80 hover:bg-white shadow border border-gray-200 dark:bg-neutral-700/80 dark:hover:bg-neutral-700 dark:border-neutral-600">
                  <svg class="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 4.293a1 1 0 011.414 0L13.707 9.293a1 1 0 010 1.414L8.707 15.707a1 1 0 01-1.414-1.414L10.586 10 7.293 6.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                </button>

                <button @click="resetZoom" class="absolute top-2 left-2 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs bg-white/80 hover:bg-white border border-gray-200 shadow dark:bg-neutral-700/80 dark:hover:bg-neutral-700 dark:border-neutral-600">
                  Reset
                </button>
              </div>

              <div class="flex flex-wrap justify-between items-center gap-2 py-3 px-4 bg-gray-50 border-t border-gray-200 dark:bg-neutral-950 dark:border-neutral-800">
                <div class="text-xs text-gray-500 dark:text-neutral-400">Total: {{ brochureImages.length }} file</div>
                <div class="flex gap-2">
                  <a :href="brochureImages[selectedBrochure]" download class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-700">
                    <ClientOnly><Icon icon="lucide:download" class="size-4" /></ClientOnly>
                    Unduh
                  </a>
                  <button type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-700" data-hs-overlay="#hs-brochures-view">Tutup</button>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Gallery grid -->
        <div class="lg:col-span-6">
          <div class="grid grid-cols-12 gap-3 sm:gap-4">
            <div v-if="tiles[0]" class="col-span-7">
              <div class="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-neutral-800">
                <img :src="tiles[0].src" :alt="tiles[0].label" class="absolute inset-0 w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                <div class="absolute bottom-3 left-3 rounded-lg bg-black/40 backdrop-blur px-3 py-1.5 text-white text-xs inline-flex items-center gap-1.5">
                  <ClientOnly><Icon :icon="tiles[0].icon" class="size-3.5" /></ClientOnly>
                  {{ tiles[0].label }}
                </div>
              </div>
            </div>

            <div class="col-span-5 space-y-3 sm:space-y-4">
              <div v-if="tiles[1]" class="relative h-32 sm:h-40 rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-neutral-800">
                <img :src="tiles[1].src" :alt="tiles[1].label" class="absolute inset-0 w-full h-full object-cover">
                <div class="absolute bottom-3 left-3 rounded-lg bg-black/40 backdrop-blur px-3 py-1.5 text-white text-xs inline-flex items-center gap-1.5">
                  <ClientOnly><Icon :icon="tiles[1].icon" class="size-3.5" /></ClientOnly>
                  {{ tiles[1].label }}
                </div>
              </div>
              <div v-if="tiles[2]" class="relative h-32 sm:h-40 rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-neutral-800">
                <img :src="tiles[2].src" :alt="tiles[2].label" class="absolute inset-0 w-full h-full object-cover">
                <div class="absolute bottom-3 left-3 rounded-lg bg-black/40 backdrop-blur px-3 py-1.5 text-white text-xs inline-flex items-center gap-1.5">
                  <ClientOnly><Icon :icon="tiles[2].icon" class="size-3.5" /></ClientOnly>
                  {{ tiles[2].label }}
                </div>
              </div>
            </div>

            <div v-if="tiles[3]" class="col-span-6">
              <div class="relative h-40 sm:h-48 rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-neutral-800">
                <img :src="tiles[3].src" :alt="tiles[3].label" class="absolute inset-0 w-full h-full object-cover">
                <div class="absolute bottom-3 left-3 rounded-lg bg-black/40 backdrop-blur px-3 py-1.5 text-white text-xs inline-flex items-center gap-1.5">
                  <ClientOnly><Icon :icon="tiles[3].icon" class="size-3.5" /></ClientOnly>
                  {{ tiles[3].label }}
                </div>
              </div>
            </div>
            <div v-if="tiles[4]" class="col-span-6">
              <div class="relative h-40 sm:h-48 rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-neutral-800">
                <img :src="tiles[4].src" :alt="tiles[4].label" class="absolute inset-0 w-full h-full object-cover">
                <div class="absolute bottom-3 left-3 rounded-lg bg-black/40 backdrop-blur px-3 py-1.5 text-white text-xs inline-flex items-center gap-1.5">
                  <ClientOnly><Icon :icon="tiles[4].icon" class="size-3.5" /></ClientOnly>
                  {{ tiles[4].label }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- /grid -->
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'

type Stat = { label?: string; value?: string | number; icon?: string }
type Tile = { src: string; label: string; icon: string }
type Shape = {
  eyebrow: string
  headingMain: string
  headingHi1: string
  headingHi2: string
  description: string
  stats: Stat[]
  gallery: Tile[]
  brochures: string[]
  galleryHref: string
}

/* Default values */
const defaults: Shape = {
  eyebrow: 'Fasilitas Pondok Alberr',
  headingMain: 'Nyaman, Tertib,',
  headingHi1: 'Inklusif',
  headingHi2: 'dirancang untuk bertumbuh',
  description: 'Dari asrama yang rapi, masjid yang lapang, ruang kelas interaktif, hingga perpustakaan. Semua disiapkan untuk mendukung adab, akademik, dan kemandirian santri.',
  stats: [
    { label: 'Asrama', value: '8', icon: 'ph:house' },
    { label: 'Ruang Kelas', value: '24', icon: 'ph:chalkboard-teacher' },
    { label: 'Perpustakaan', value: '1', icon: 'ph:books' },
    { label: 'Lapangan', value: '3', icon: 'ph:soccer-ball' }
  ],
  gallery: [
    { src: '/assets/images/masjid.jpg',   label: 'Masjid & Aula',      icon: 'ph:mosque' },
    { src: '/assets/images/kelas.jpg',    label: 'Kelas Interaktif',   icon: 'ph:chalkboard-teacher' },
    { src: '/assets/images/activity.jpg', label: 'Perpustakaan',       icon: 'ph:books' },
    { src: '/assets/images/lapangan.jpg', label: 'Lapangan Olahraga',  icon: 'ph:soccer-ball' },
    { src: '/assets/images/asrama.jpg',   label: 'Asrama & Kafetaria', icon: 'ph:house' }
  ],
  brochures: ['/assets/images/brochures/1.jpg','/assets/images/brochures/2.jpg'],
  galleryHref: '/gallery'
}

/* Menerima flattened props ATAU props.props dari CMS */
type EditorFields = {
  badge?: string; headingLead?: string; highlight1?: string; highlight2?: string;
  description?: string; stats?: Stat[]; gallery?: Tile[]; brochures?: string[]; galleryHref?: string;
}
const raw = defineProps<Partial<Shape> & EditorFields & { props?: Partial<Shape> & EditorFields }>()

/* Normalisasi: gabungkan inner props + flattened (prioritas flattened), lalu map nama field editor -> hero */
function normalize(input: any): Shape {
  const p = input || {}

  const eyebrow     = p.eyebrow     ?? p.badge       ?? defaults.eyebrow
  const headingMain = p.headingMain ?? p.headingLead ?? defaults.headingMain
  const headingHi1  = p.headingHi1  ?? p.highlight1  ?? defaults.headingHi1
  const headingHi2  = p.headingHi2  ?? p.highlight2  ?? defaults.headingHi2
  const description = p.description ?? defaults.description

  const stats: Stat[] = Array.isArray(p.stats) && p.stats.length
    ? p.stats.map((s:any)=>({ label:String(s?.label??''), value:s?.value??'', icon:String(s?.icon??'ph:info') }))
    : defaults.stats

  const gallery: Tile[] = (Array.isArray(p.gallery) && p.gallery.length ? p.gallery : defaults.gallery)
    .map((g:any)=>({ src:String(g?.src??''), label:String(g?.label??''), icon:String(g?.icon??'ph:image') }))
    .filter((t:Tile)=>!!t.src)

  const brochures: string[] = Array.isArray(p.brochures) ? p.brochures.filter(Boolean).map(String) : defaults.brochures
  const galleryHref = p.galleryHref ?? defaults.galleryHref

  return { eyebrow, headingMain, headingHi1, headingHi2, description, stats, gallery, brochures, galleryHref }
}

/* Merge order: props.props -> flattened -> defaults (flattened override inner) */
const merged = computed<Shape>(() => {
  const { props: inner, ...outer } = raw as any
  const flat = { ...(inner || {}), ...(outer || {}) }
  return normalize(flat)
})

/* Expose ke template */
const eyebrow        = computed(()=>merged.value.eyebrow)
const headingMain    = computed(()=>merged.value.headingMain)
const headingHi1     = computed(()=>merged.value.headingHi1)
const headingHi2     = computed(()=>merged.value.headingHi2)
const description    = computed(()=>merged.value.description)
const stats          = computed(()=>merged.value.stats)
const tiles          = computed(()=>merged.value.gallery)
const brochureImages = computed(()=>merged.value.brochures)
const galleryHref    = computed(()=>merged.value.galleryHref)

/* Viewer zoom/pan */
const selectedBrochure = ref(0)
function prevBrochure(){ const n=brochureImages.value.length; if(!n) return; selectedBrochure.value=(selectedBrochure.value-1+n)%n }
function nextBrochure(){ const n=brochureImages.value.length; if(!n) return; selectedBrochure.value=(selectedBrochure.value+1)%n }

const scale=ref(0.1), minScale=0.1, maxScale=4
const tx=ref(0), ty=ref(0), isDragging=ref(false)
let startX=0,startY=0,startTx=0,startTy=0, pinchStartDist=0, pinchStartScale=1, pinchCenter={x:0,y:0}
const stageRef = ref<HTMLElement|null>(null)
const imgStyle = computed(()=>({ transform:`translate(${tx.value}px, ${ty.value}px) scale(${scale.value}) translate(-50%, -50%)`, transformOrigin:'0 0', maxWidth:'none', maxHeight:'none' }))
function resetZoom(){ scale.value=0.1; tx.value=0; ty.value=0 }
function clampPan(){ if(scale.value<=0.1){ tx.value=0; ty.value=0; return } const el=stageRef.value; if(!el) return; const r=el.getBoundingClientRect(); const bx=(r.width*(scale.value-0.1))/2; const by=(r.height*(scale.value-0.1))/2; tx.value=Math.max(Math.min(tx.value,bx),-bx); ty.value=Math.max(Math.min(ty.value,by),-by) }
function onWheel(e:WheelEvent){ const rect=(e.currentTarget as HTMLElement).getBoundingClientRect(); const cx=e.clientX-rect.left-rect.width/2; const cy=e.clientY-rect.top-rect.height/2; if(e.ctrlKey){ e.preventDefault(); const prev=scale.value; let next=prev*(1-e.deltaY*0.0005); next=Math.min(Math.max(next,minScale),maxScale); if(next===prev) return; const k=next/prev; tx.value=cx-k*(cx-tx.value); ty.value=cy-k*(cy-ty.value); scale.value=next; clampPan(); return } if(scale.value>1){ e.preventDefault(); tx.value-=e.deltaX; ty.value-=e.deltaY; clampPan() } }
function onPointerDown(e:MouseEvent){ if(e.button!==0) return; isDragging.value=true; startX=e.clientX; startY=e.clientY; startTx=tx.value; startTy=ty.value }
function onPointerMove(e:MouseEvent){ if(!isDragging.value) return; tx.value=startTx+(e.clientX-startX); ty.value=startTy+(e.clientY-startY); clampPan() }
function onPointerUp(){ isDragging.value=false }
function onDblClick(e:MouseEvent){ const rect=(e.currentTarget as HTMLElement).getBoundingClientRect(); const cx=e.clientX-rect.left-rect.width/2; const cy=e.clientY-rect.top-rect.height/2; const prev=scale.value; const next=prev<2?2:1; const k=next/prev; tx.value=cx-k*(cx-tx.value); ty.value=cy-k*(cy-ty.value); scale.value=next; if(next===1){ tx.value=0; ty.value=0 } clampPan() }
function distance(t1:Touch,t2:Touch){ const dx=t2.clientX-t1.clientX, dy=t2.clientY-t1.clientY; return Math.hypot(dx,dy) }
function midpoint(t1:Touch,t2:Touch,rect:DOMRect){ return { x:((t1.clientX+t2.clientX)/2)-rect.left-rect.width/2, y:((t1.clientY+t2.clientY)/2)-rect.top-rect.height/2 } }
function onTouchStart(e:TouchEvent){ if(e.touches.length===1){ isDragging.value=true; startX=e.touches[0]!.clientX; startY=e.touches[0]!.clientY; startTx=tx.value; startTy=ty.value } else if(e.touches.length===2){ const rect=(e.currentTarget as HTMLElement).getBoundingClientRect(); pinchStartDist=distance(e.touches[0]!,e.touches[1]!); pinchStartScale=scale.value; pinchCenter=midpoint(e.touches[0]!,e.touches[1]!,rect) } }
function onTouchMove(e:TouchEvent){ if(e.touches.length===1&&isDragging.value){ tx.value=startTx+(e.touches[0]!.clientX-startX); ty.value=startTy+(e.touches[0]!.clientY-startY); clampPan() } else if(e.touches.length===2&&pinchStartDist>0){ const curr=distance(e.touches[0]!,e.touches[1]!); let next=pinchStartScale*(curr/pinchStartDist); next=Math.min(Math.max(next,minScale),maxScale); const prev=scale.value; const k=next/prev; tx.value=pinchCenter.x-k*(pinchCenter.x-tx.value); ty.value=pinchCenter.y-k*(pinchCenter.y-ty.value); scale.value=next; clampPan() } }
function onTouchEnd(){ isDragging.value=false; if(pinchStartDist>0&&scale.value<1.02) resetZoom(); pinchStartDist=0 }
</script>
