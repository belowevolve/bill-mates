import { getStorageData } from '@utils/ls'
import type { Bill } from './types'

export function getHistoryBills() {
  return Object.keys(localStorage)
    .map((key) =>
      getStorageData<Bill>(key, {
        id: '',
        label: '',
        matesItems: {},
        total: 0,
        createdAt: '',
        updatedAt: ''
      })
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
}
