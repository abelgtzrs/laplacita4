export const DEFAULT_HERO_SLIDES = [
  {
    title: "Verdura",
    image_url: "/store/verdura.jpg",
    is_active: true,
    sort_order: 0,
  },
  {
    title: "Galletas",
    image_url: "/store/galletas.png",
    is_active: true,
    sort_order: 1,
  },
  {
    title: "Chips",
    image_url: "/store/chips.png",
    is_active: true,
    sort_order: 2,
  },
  {
    title: "Carnes",
    image_url: "/store/carnes.png",
    is_active: true,
    sort_order: 3,
  },
];

export const DEFAULT_HERO_SLIDE_IMAGES = DEFAULT_HERO_SLIDES.map(
  (slide) => slide.image_url
);