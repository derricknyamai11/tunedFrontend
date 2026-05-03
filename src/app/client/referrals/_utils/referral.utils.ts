export function calculateTierProgress(monthlyCompleted: number) {
  let currentTier = 1;
  let nextTier = 2;
  let pointsPerReferral = 10;
  let referralsNeeded = 1;
  let progressPercentage = 0;

  if (monthlyCompleted === 0) {
    currentTier = 1;
    nextTier = 2;
    pointsPerReferral = 10;
    referralsNeeded = 1;
    progressPercentage = 0;
  } else if (monthlyCompleted >= 1 && monthlyCompleted <= 4) {
    currentTier = 2;
    nextTier = 3;
    pointsPerReferral = 12;
    referralsNeeded = 5 - monthlyCompleted;
    progressPercentage = ((monthlyCompleted - 1) / 4) * 100;
  } else {
    currentTier = 3;
    nextTier = 3;
    pointsPerReferral = 15;
    referralsNeeded = 0;
    progressPercentage = 100;
  }

  return {
    currentTier,
    nextTier,
    pointsPerReferral,
    referralsNeeded,
    progressPercentage,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}
