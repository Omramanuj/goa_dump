export const CATEGORY_OPTIONS = [
  { value: "Beach", label: "Beach", emoji: "🏖️" },
  { value: "Food", label: "Food", emoji: "🍤" },
  { value: "Party", label: "Party", emoji: "🪩" },
  { value: "View", label: "View", emoji: "🌅" },
  { value: "Activity", label: "Activity", emoji: "🏄" },
  { value: "Hidden Gem", label: "Hidden Gem", emoji: "🗺️" }
];

export const FILTER_OPTIONS = [
  { value: "All", label: "All" },
  ...CATEGORY_OPTIONS
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "top-rated", label: "Top Rated" }
];

export function getCategoryMeta(category) {
  return CATEGORY_OPTIONS.find((option) => option.value === category) || {
    label: category,
    emoji: "📍"
  };
}

export function getRatingTone(rating) {
  if (rating >= 9) {
    return {
      badge: "rgba(255, 107, 53, 0.92)"
    };
  }

  if (rating >= 7) {
    return {
      badge: "rgba(233, 168, 0, 0.92)"
    };
  }

  return {
    badge: "rgba(110, 110, 110, 0.92)"
  };
}
