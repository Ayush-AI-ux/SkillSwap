export function recommendedScore(createdAt: Date, bookingCount: number): number {
  const ageDays = (Date.now() - createdAt.getTime()) / 86_400_000;
  const recency = 1 / (1 + ageDays / 7); // 1 when brand new, fades over weeks
  const fairness = bookingCount === 0 ? 1 : bookingCount === 1 ? 0.5 : 0;
  return recency + fairness;
}