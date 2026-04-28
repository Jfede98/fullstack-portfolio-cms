export const generateStarRating = (
  rating: number
): Array<{ type: "star" | "star_half" }> => {
  if (rating < 0 || rating > 5) {
    throw new Error("El rating debe estar entre 0 y 5");
  }
  if (rating % 0.5 !== 0) {
    throw new Error("El rating debe ser múltiplo de 0.5");
  }
  const stars: Array<{ type: "star" | "star_half" }> = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push({ type: "star" });
  }
  if (hasHalfStar) {
    stars.push({ type: "star_half" });
  }
  return stars;
};
