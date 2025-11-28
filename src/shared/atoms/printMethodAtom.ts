import { atom } from 'jotai'

export type PrintMethod = 'dtf' | 'uvdtf'

const printMethodAtom = atom<PrintMethod>('dtf')

export const printMethodWriteAtom = atom(
  null,
  (get, set, update: PrintMethod) => {
    set(printMethodAtom, update)
  }
)

export const printMethodReadAtom = atom((get) => get(printMethodAtom))

export const isDTFAtom = atom((get) => get(printMethodAtom) === 'dtf')
export const isUVDTFAtom = atom((get) => get(printMethodAtom) === 'uvdtf')
