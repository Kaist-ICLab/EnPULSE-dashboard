import { useState } from "react"

type CategoryType = { [key: string]: number }
const MAX_SELECTED_CATEGORY = 10

export default function useCategoryToIndex(
  uniqueElements: string[],
): [CategoryType, (c: string) => void] {
  const [categoryToIndex, setCategoryToIndex] = useState(
    uniqueElements.filter((_, i) => i < MAX_SELECTED_CATEGORY).reduce((acc, curr, idx) => (acc[curr] = idx, acc), {} as CategoryType)
  )

  const modifySelectedCategory = (c: string) => {
    const newCategoryToIndex = { ...categoryToIndex }
    if (c in categoryToIndex) {
      delete newCategoryToIndex[c]
    } else {
      const indices = Object.values(categoryToIndex)
      let nextFreeIndex = 0;
      for (; nextFreeIndex < MAX_SELECTED_CATEGORY; nextFreeIndex++) {
        if (!indices.includes(nextFreeIndex)) break
      }

      if (nextFreeIndex < MAX_SELECTED_CATEGORY) newCategoryToIndex[c] = nextFreeIndex
    }

    setCategoryToIndex(newCategoryToIndex)
  }

  return [categoryToIndex, modifySelectedCategory]
}