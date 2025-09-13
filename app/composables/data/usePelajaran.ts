// composables/data/usePelajaran.ts
import { ref, computed, onUnmounted } from 'vue'
import { useNuxtApp } from '#app'
import {
  ref as dref, push, set, update, remove, get,
  onValue, off, serverTimestamp, query as dquery, orderByChild
} from 'firebase/database'

export type Jenjang = 'SD'|'SMP'|'SMA'|'SMK'
export type MapelItem = {
  id: string; name: string; code?: string; jenjang?: Jenjang | string; group?: string; kkm?: number; active?: boolean
  createdAt?: number | { '.sv':'timestamp' }; updatedAt?: number | { '.sv':'timestamp' }
}
export type GradeWeights = { tugas: number; harian: number; pts: number; pas: number; proyek?: number; lainnya?: number }
export type GradeRecord  = { tugas?: number; harian?: number; pts?: number; pas?: number; proyek?: number; lainnya?: number; akhir?: number; predikat?: 'A'|'B'|'C'|'D'|'E'; catatan?: string; updatedAt?: number }

const DEFAULT_WEIGHTS: GradeWeights = { tugas: 30, harian: 20, pts: 20, pas: 30 }
const clamp01 = (x:number)=> Math.max(0, Math.min(100, Math.round(x)))
const safeNum = (v:any)=> Number.isFinite(Number(v)) ? Number(v) : 0
const sum = (o:Record<string,number>)=> Object.values(o).reduce((a,b)=>a+b,0)

function computeFinal(komp: GradeRecord, weights: GradeWeights, kkm?: number) {
  const w:any = { tugas: safeNum(weights.tugas), harian: safeNum(weights.harian), pts: safeNum(weights.pts), pas: safeNum(weights.pas), proyek: safeNum(weights.proyek||0), lainnya: safeNum(weights.lainnya||0) }
  const totalW = Math.max(1, sum(w))
  const val = safeNum(komp.tugas)*w.tugas + safeNum(komp.harian)*w.harian + safeNum(komp.pts)*w.pts + safeNum(komp.pas)*w.pas + safeNum(komp.proyek)*w.proyek + safeNum(komp.lainnya)*w.lainnya
  const akhir = clamp01(val/totalW)
  let pred:'A'|'B'|'C'|'D'|'E'='E'
  if (!kkm) { pred = akhir>=92?'A':akhir>=83?'B':akhir>=75?'C':akhir>=65?'D':'E' }
  else {
    const span=100-kkm, A=kkm+span*0.8, B=kkm+span*0.6, C=kkm+span*0.4, D=kkm
    pred = akhir>=A?'A':akhir>=B?'B':akhir>=C?'C':akhir>=D?'D':'E'
  }
  return { akhir, predikat: pred }
}

export function makeTermKey(tahunAwal:number, semester:'Ganjil'|'Genap'){ return `${tahunAwal}-${tahunAwal+1}_${semester}` }

export function usePelajaran() {
  const { $realtimeDb } = useNuxtApp() as any
  const subjects = ref<MapelItem[]>([])
  let unsubSub: null | (()=>void) = null

  function subscribeSubjects() {
    if (unsubSub) unsubSub()
    const base = dref($realtimeDb, 'alberr/pelajaran')
    const q = dquery(base, orderByChild('name'))
    const h = onValue(q, snap => {
      const arr:MapelItem[]=[]
      snap.forEach(ch=>{
        const v=ch.val()||{}
        arr.push({ id: ch.key!, name: v.name, code:v.code||'', jenjang:v.jenjang||'', group:v.group||'', kkm:Number(v.kkm??0), active: v.active!==false, createdAt:v.createdAt, updatedAt:v.updatedAt })
      })
      subjects.value = arr
    })
    unsubSub = () => off(q, 'value', h as any)
  }
  function unbindSubjects(){ if (unsubSub) { unsubSub(); unsubSub=null } }

  async function createSubject(p: Omit<MapelItem,'id'|'createdAt'|'updatedAt'>){
    const node = push(dref($realtimeDb, 'alberr/pelajaran'))
    await set(node, { name:p.name?.trim(), code:p.code||'', jenjang:p.jenjang||'', group:p.group||'', kkm:Number(p.kkm??0), active:p.active!==false, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
    return node.key!
  }
  async function updateSubject(id:string, patch: Partial<Omit<MapelItem,'id'>>){
    const node = dref($realtimeDb, `alberr/pelajaran/${id}`)
    const data:any = { updatedAt: serverTimestamp() }
    if (patch.name !== undefined) data.name = patch.name?.trim()
    if (patch.code !== undefined) data.code = patch.code || ''
    if (patch.jenjang !== undefined) data.jenjang = patch.jenjang || ''
    if (patch.group !== undefined) data.group = patch.group || ''
    if (patch.kkm !== undefined) data.kkm = Number(patch.kkm ?? 0)
    if (patch.active !== undefined) data.active = !!patch.active
    await update(node, data)
  }
  async function deleteSubject(id:string){ await remove(dref($realtimeDb, `alberr/pelajaran/${id}`)) }
  const getSubject = (id?:string)=> subjects.value.find(x=>x.id===id)

  // ===== Nilai =====
  const nilaiMap = ref<Record<string, GradeRecord>>({})
  let unsubNilai: null | (()=>void) = null
  function subscribeNilai(termKey:string, mapelId:string){
    if (unsubNilai) unsubNilai()
    const node = dref($realtimeDb, `alberr/nilai/${termKey}/${mapelId}`)
    const h = onValue(node, snap=>{
      const val = snap.val()||{}
      const o:Record<string,GradeRecord> = {}
      for (const [sid,v] of Object.entries<any>(val)) {
        o[sid] = { tugas:Number(v.tugas??0), harian:Number(v.harian??0), pts:Number(v.pts??0), pas:Number(v.pas??0), proyek: v.proyek!==undefined?Number(v.proyek):undefined, lainnya: v.lainnya!==undefined?Number(v.lainnya):undefined, akhir:Number(v.akhir??0), predikat:v.predikat||undefined, catatan:v.catatan||'', updatedAt:Number(v.updatedAt||0) }
      }
      nilaiMap.value = o
    })
    unsubNilai = () => off(node, 'value', h as any)
    return unsubNilai
  }
  function unsubscribeNilai(){ if (unsubNilai) { unsubNilai(); unsubNilai=null } nilaiMap.value = {} }

  async function readWeights(termKey:string, mapelId:string):Promise<GradeWeights>{
    try{ const s=await get(dref($realtimeDb, `alberr/nilai_weights/${termKey}/${mapelId}`)); const v=s.val()||{}; return { tugas:Number(v.tugas??DEFAULT_WEIGHTS.tugas), harian:Number(v.harian??DEFAULT_WEIGHTS.harian), pts:Number(v.pts??DEFAULT_WEIGHTS.pts), pas:Number(v.pas??DEFAULT_WEIGHTS.pas), proyek: v.proyek!==undefined?Number(v.proyek):undefined, lainnya: v.lainnya!==undefined?Number(v.lainnya):undefined } }
    catch { return DEFAULT_WEIGHTS }
  }
  async function saveWeights(termKey:string, mapelId:string, w:GradeWeights){
    await update(dref($realtimeDb, `alberr/nilai_weights/${termKey}/${mapelId}`), { tugas:Number(w.tugas||0), harian:Number(w.harian||0), pts:Number(w.pts||0), pas:Number(w.pas||0), proyek:w.proyek!==undefined?Number(w.proyek):null, lainnya:w.lainnya!==undefined?Number(w.lainnya):null, updatedAt:serverTimestamp() })
  }

  async function saveNilai(termKey:string, mapelId:string, santriId:string, patch:Partial<GradeRecord>){
    const sub = getSubject(mapelId)
    const w = await readWeights(termKey, mapelId)
    const current = nilaiMap.value[santriId] || {}
    const next:GradeRecord = { ...current, ...patch }
    const { akhir, predikat } = computeFinal(next, w, sub?.kkm)
    await update(dref($realtimeDb, `alberr/nilai/${termKey}/${mapelId}/${santriId}`), {
      ...(patch.tugas!==undefined?{tugas:clamp01(Number(patch.tugas))}:{})
      ,...(patch.harian!==undefined?{harian:clamp01(Number(patch.harian))}:{})
      ,...(patch.pts!==undefined?{pts:clamp01(Number(patch.pts))}:{})
      ,...(patch.pas!==undefined?{pas:clamp01(Number(patch.pas))}:{})
      ,...(patch.proyek!==undefined?{proyek:clamp01(Number(patch.proyek))}:{})
      ,...(patch.lainnya!==undefined?{lainnya:clamp01(Number(patch.lainnya))}:{})
      ,...(patch.catatan!==undefined?{catatan:String(patch.catatan||'')}:{})
      ,akhir, predikat, updatedAt: serverTimestamp()
    })
  }
  async function bulkSaveNilai(termKey:string, mapelId:string, payload:Record<string,GradeRecord>){
    const sub = getSubject(mapelId)
    const w = await readWeights(termKey, mapelId)
    const base = dref($realtimeDb, `alberr/nilai/${termKey}/${mapelId}`)
    const updates:Record<string,any>={}
    for (const [sid,r] of Object.entries(payload)){
      const { akhir, predikat } = computeFinal(r, w, sub?.kkm)
      updates[sid] = { tugas:clamp01(Number(r.tugas??0)), harian:clamp01(Number(r.harian??0)), pts:clamp01(Number(r.pts??0)), pas:clamp01(Number(r.pas??0)), ...(r.proyek!==undefined?{proyek:clamp01(Number(r.proyek))}:{}) ,...(r.lainnya!==undefined?{lainnya:clamp01(Number(r.lainnya))}:{}) ,catatan:String(r.catatan||''), akhir, predikat, updatedAt:serverTimestamp() }
    }
    await update(base, updates)
  }

  onUnmounted(()=>{ unbindSubjects(); unsubscribeNilai() })

  return {
    subjects, subscribeSubjects, unbindSubjects,
    createSubject, updateSubject, deleteSubject, getSubject,
    nilaiMap, subscribeNilai, unsubscribeNilai, saveNilai, bulkSaveNilai,
    readWeights, saveWeights, DEFAULT_WEIGHTS, computeFinal, makeTermKey
  }
}
