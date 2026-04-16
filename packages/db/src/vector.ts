export function toPgVector(values: number[]) {
  return `[${values.join(",")}]`;
}
