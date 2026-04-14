export function computeNrr(startingRevenue: number, expansionRevenue: number, churnedRevenue: number) {
  if (startingRevenue <= 0) {
    return 0;
  }
  return ((startingRevenue + expansionRevenue - churnedRevenue) / startingRevenue) * 100;
}
