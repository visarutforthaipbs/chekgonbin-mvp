// Phone numbers arrive from the DOE scrape as free text, e.g.
//   "ที่สามารถติดต่อได้\n02-5590919,02-5593878"  or  "...\n02-5834571-2" (a range).
// Never put that raw string in a tel: link. This turns it into clean, dialable
// Thai numbers with a readable display form.

function normalize(digits) {
  // Thai numbering: mobiles 06/08/09 = 10 digits; landlines (02, 03x–07x) = 9.
  const isMobile = /^0[689]/.test(digits);
  const len = isMobile ? 10 : 9;
  if (digits.length < len) return null;
  return digits.slice(0, len); // drops range suffixes like "-2"
}

function format(d) {
  if (/^0[689]/.test(d)) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  if (d.startsWith("02")) return `02-${d.slice(2, 5)}-${d.slice(5)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
}

/** @returns {{display: string, tel: string}[]} up to `max` unique numbers */
export function parsePhones(raw, max = 3) {
  if (!raw) return [];
  const text = String(raw);
  const out = [];
  const seen = new Set();
  for (const part of text.split(/[,/;\n]|หรือ/)) {
    const digits = part.replace(/\D/g, "");
    if (!digits.startsWith("0")) continue;
    const d = normalize(digits);
    if (!d || seen.has(d)) continue;
    seen.add(d);
    out.push({ display: format(d), tel: d });
    if (out.length >= max) break;
  }
  return out;
}

export function primaryPhone(raw) {
  return parsePhones(raw, 1)[0] || null;
}
