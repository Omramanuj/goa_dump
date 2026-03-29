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

export const PREVIEW_SPOTS = [
  {
    id: "preview-1",
    created_at: "2026-03-28T19:20:00.000Z",
    name: "Purple Martini",
    category: "Party",
    rating: 9.4,
    note: "Late start, terrible decisions, excellent playlist.",
    vibes: ["night out", "crowded", "worth it"],
    added_by: "Gopal",
    photo_url:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "preview-2",
    created_at: "2026-03-27T06:45:00.000Z",
    name: "Vagator Cliff Point",
    category: "View",
    rating: 9.1,
    note: "The kind of sunset that shuts everyone up for thirty seconds.",
    vibes: ["sunset", "windy", "photo dump"],
    added_by: "Rhea",
    photo_url:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "preview-3",
    created_at: "2026-03-26T13:10:00.000Z",
    name: "Pousada By The Beach",
    category: "Food",
    rating: 8.8,
    note: "Long lunch, slow service, unreal prawn curry.",
    vibes: ["seafood", "lazy lunch", "repeatable"],
    added_by: "Arjun",
    photo_url:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "preview-4",
    created_at: "2026-03-25T10:00:00.000Z",
    name: "Ashwem Morning Stretch",
    category: "Beach",
    rating: 8.2,
    note: "Quiet water, soft sand, and no one asking for jet skis yet.",
    vibes: ["calm", "morning", "clean"],
    added_by: "Mira",
    photo_url:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "preview-5",
    created_at: "2026-03-24T15:15:00.000Z",
    name: "Parra Backroad Ride",
    category: "Activity",
    rating: 7.9,
    note: "Not a destination, just a perfect detour on scooters.",
    vibes: ["scooter", "green", "golden hour"],
    added_by: "Kabir",
    photo_url:
      "https://images.unsplash.com/photo-1468413253725-0d5181091126?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "preview-6",
    created_at: "2026-03-23T18:40:00.000Z",
    name: "Gunpowder Side Courtyard",
    category: "Hidden Gem",
    rating: 8.6,
    note: "Tucked away, low-key, and somehow every dish hit.",
    vibes: ["cozy", "spicy", "underhyped"],
    added_by: "Naina",
    photo_url:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80"
  }
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
