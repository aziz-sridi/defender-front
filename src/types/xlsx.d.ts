/* eslint-disable */
declare module 'xlsx' {
  // Minimal subset used by the app; expand as needed.
  export interface WorkBook {
    SheetNames: string[]
    Sheets: Record<string, WorkSheet>
  }
  export interface WorkSheet {
    [cell: string]: any
  }
  export function read(data: ArrayBuffer | Uint8Array, opts?: any): WorkBook
  export function utils_format_cell(cell: any): string
  export const utils: {
    book_new: () => WorkBook
    aoa_to_sheet: (data: any[][]) => WorkSheet
    json_to_sheet: (data: any[], opts?: Record<string, unknown>) => WorkSheet
    book_append_sheet: (wb: WorkBook, ws: WorkSheet, name: string) => void
  }
  export function write(workbook: WorkBook, opts?: any): ArrayBuffer
  export function writeFile(workbook: WorkBook, filename: string, opts?: any): void
}
