"use client";

// LIFF bridge. Does nothing until NEXT_PUBLIC_LIFF_ID is set, so the site works
// identically in a normal browser. Inside LINE it exposes the in-app share picker.
// No profile / user ID is read or stored (PDPA) — we only need isInClient + share.
let ready = null;

export function initLiff() {
  const id = process.env.NEXT_PUBLIC_LIFF_ID;
  if (!id || typeof window === "undefined") return Promise.resolve(null);
  if (!ready) {
    ready = import("@line/liff")
      .then(async ({ default: liff }) => {
        await liff.init({ liffId: id });
        return liff;
      })
      .catch(() => null);
  }
  return ready;
}

export async function inLine() {
  const liff = await initLiff();
  return !!liff && liff.isInClient();
}

// Share a short text + URL into a LINE chat/group chosen by the user.
export async function shareToLine(text, url) {
  const liff = await initLiff();
  if (liff && liff.isInClient() && liff.isApiAvailable("shareTargetPicker")) {
    const res = await liff.shareTargetPicker([{ type: "text", text: `${text}\n${url}` }]);
    return !!res;
  }
  window.open(`https://line.me/R/share?text=${encodeURIComponent(`${text}\n${url}`)}`, "_blank", "noopener");
  return true;
}
