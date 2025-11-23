/**
 * Image processing utilities for the Exchange Rate feature.
 * Primarily used for generating the PNG export.
 */

/**
 * Preloads images to ensure they are ready for canvas drawing.
 * 
 * DEVELOPER NOTES:
 * Canvas `drawImage` requires the image to be fully loaded.
 * We wrap image loading in Promises to await them all before starting to draw.
 * 
 * @param flagImages Map of country names to flag image URLs.
 * @param selectedCountries List of countries to load flags for.
 * @param storeLogoPath Path to the main store logo (Intermex/RIA).
 * @param cornerLogoPath Path to the corner logo.
 * @returns Object containing loaded image elements.
 */
export async function preloadImages(
  flagImages: { [key: string]: string },
  selectedCountries: string[],
  storeLogoPath: string,
  cornerLogoPath: string
) {
  const flagPromises = selectedCountries.map(
    (country) =>
      new Promise<{ country: string; img: HTMLImageElement | null }>((resolve) => {
        const img = new window.Image();
        img.src = flagImages[country] || "";
        img.onload = () => resolve({ country, img });
        img.onerror = () => resolve({ country, img: null });
      })
  );

  // Preload store logo (header)
  const storeLogoPromise = new Promise<HTMLImageElement | null>((resolve) => {
    const img = new window.Image();
    img.src = storeLogoPath;
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
  });

  // Preload corner logo
  const cornerLogoPromise = new Promise<HTMLImageElement | null>((resolve) => {
    const img = new window.Image();
    img.src = cornerLogoPath;
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
  });

  const flagResults = await Promise.all(flagPromises);
  const storeLogoImg = await storeLogoPromise;
  const cornerLogoImg = await cornerLogoPromise;

  return {
    flagMap: Object.fromEntries(
      flagResults.map(({ country, img }) => [country, img])
    ),
    storeLogoImg,
    storeLogoPath, // Return path for reference if needed
    cornerLogoImg,
  };
}
