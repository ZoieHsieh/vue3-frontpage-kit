import { LoadingStore } from '@/store'
const loadingStore = LoadingStore()

export class AxiosLoading {
  constructor() {}

  addLoading() {
    loadingStore.loadingCount++
  }

  closeLoading() {
    if (loadingStore.loadingCount > 0) {
      loadingStore.loadingCount--
    }
  }
}
