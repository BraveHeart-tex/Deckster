export const areArraysEqualUnordered = (
  array1: string[],
  array2: string[]
): boolean => {
  if (array1.length !== array2.length) {
    return false;
  }

  const countMap = new Map<string, number>();

  for (const string_ of array1) {
    countMap.set(string_, (countMap.get(string_) ?? 0) + 1);
  }

  for (const string_ of array2) {
    if (!countMap.has(string_)) {
      return false;
    }
    countMap.set(string_, countMap.get(string_)! - 1);
    if (countMap.get(string_)! < 0) {
      return false;
    }
  }

  return true;
};
