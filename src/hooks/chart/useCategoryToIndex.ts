import { useState } from "react"

type CategoryType = { [key: string]: number }

export default function useCategoryToIndex(
  uniqueElements: string[],
  max_selected_category: number,
): [CategoryType, (c: string) => void] {
  const [categoryToIndex, setCategoryToIndex] = useState(
    uniqueElements.filter((_, i) => i < max_selected_category).reduce((acc, curr, idx) => (acc[curr] = idx, acc), {} as CategoryType)
  )

  const modifySelectedCategory = (c: string) => {
    const newCategoryToIndex = { ...categoryToIndex }
    if (c in categoryToIndex) {
      delete newCategoryToIndex[c]
    } else {
      const indices = Object.values(categoryToIndex)
      let nextFreeIndex = 0;
      for (; nextFreeIndex < max_selected_category; nextFreeIndex++) {
        if (!indices.includes(nextFreeIndex)) break
      }

      if (nextFreeIndex < max_selected_category) newCategoryToIndex[c] = nextFreeIndex
    }

    setCategoryToIndex(newCategoryToIndex)
  }

  return [categoryToIndex, modifySelectedCategory]
}