import { reactive } from 'vue'
import { cloneDeep } from 'lodash-es'

export function usePvData({ filter, fetchData }: { filter?: any; fetchData: () => Promise<void> }) {
  const filterClone = filter ? cloneDeep(filter.value) : null

  const table = reactive({
    totalRecords: 0,
    currentPage: 1,
    perPage: 10
  })

  const resetFilter = () => {
    if (filter) {
      filter.value = cloneDeep(filterClone)
    }
    fetchData()
  }

  const handleUpdatePaginator = (event: any) => {
    table.currentPage = event.currentPage
    table.perPage = event.perPage
    fetchData()
  }

  return {
    filter,
    table,
    resetFilter,
    handleUpdatePaginator
  }
}
