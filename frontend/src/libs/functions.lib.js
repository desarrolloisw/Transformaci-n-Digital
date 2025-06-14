export function getGridClass() {
    // Más espacio entre cartas y mejor responsividad
    return "grid gap-8 w-full px-2 py-4 place-items-center my-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
}

export function formatToDatetimeLocal(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  // Ajusta a tu zona si lo necesitas
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
}

export function toISOStringIfFilled(datetimeLocal) {
  if (!datetimeLocal) return undefined;
  // datetimeLocal: "YYYY-MM-DDTHH:mm"
  const date = new Date(datetimeLocal);
  return date.toISOString();
}