import { faker } from '@faker-js/faker'

type MockData = { [key: string]: any }

export function useMockData<T>(interfaceType: T, count: number): T | T[] {
  const generateMockData = (type: any): MockData => {
    const data: MockData = {}
    for (const key in type) {
      if (typeof type[key] === 'string' && type[key] !== '' && type[key] !== 'date') {
        data[key] = type[key]
      } else if (Array.isArray(type[key])) {
        data[key] = type[key].map(() => generateMockData(type[key][0]))
      } else if (typeof type[key] === 'object' && type[key] !== null) {
        data[key] = generateMockData(type[key])
      } else if (key === 'fileUrl') {
        data[key] = 'https://picsum.photos/500/400?random=1' // 指定固定 URL
      } else if (type[key] == 'date') {
        data[key] = '2024-08-30T00:00:00Z'
      } else if (typeof type[key] === 'string') {
        data[key] = faker.lorem.words()
      } else if (typeof type[key] === 'number') {
        data[key] = faker.number.int()
      } else if (typeof type[key] === 'object') {
        data[key] = generateMockData(type[key])
      }
    }
    return data
  }

  if (count === 1) {
    return generateMockData(interfaceType) as T
  } else {
    return Array.from({ length: count }, () => generateMockData(interfaceType)) as T[]
  }
}
