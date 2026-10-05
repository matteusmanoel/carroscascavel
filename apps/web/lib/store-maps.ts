/** Official Google Maps place used as the provisional pin until the store sets its own. */
export const STORE_MAPS_PLACE_URL =
  "https://www.google.com/maps/place/Facil+Car+Multimarcas/@-24.9378419,-53.4174801,17z/data=!4m6!3m5!1s0x94f3d5fa8e563b3d:0x1b058bf087478d91!8m2!3d-24.9378419!4d-53.4174801!16s%2Fg%2F11z0v9d6xc";

export const STORE_MAPS_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3623.2!2d-53.4174801!3d-24.9378419!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94f3d5fa8e563b3d%3A0x1b058bf087478d91!2sFacil%20Car%20Multimarcas!5e0!3m2!1spt-BR!2sbr";

export function storeMapEmbedSrc(
  latitude?: number | null,
  longitude?: number | null,
): string {
  if (latitude != null && longitude != null) {
    return `https://maps.google.com/maps?q=${latitude},${longitude}&z=17&output=embed`;
  }
  return STORE_MAPS_EMBED_SRC;
}
