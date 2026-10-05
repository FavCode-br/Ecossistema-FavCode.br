/* ==========================================================================
   FavCode — sistema gráfico da marca
   O símbolo é reconstruído em vetor a partir das quatro faixas do logotipo
   (faixa superior, faixa média, faixa inferior e cauda). As mesmas formas
   alimentam loaders, thumbnails, máscaras e a FavCoin.
   ========================================================================== */

const FC_BANDS = {
  top: "M0 58.6V29.6C0 25.6 1.6 21.6 5.4 18.6L17.4 7.6C22.6 2.6 28.4 0 35.4 0H56.4C58.6 0 60.4 1.8 60.4 4V7.6C60.4 15.4 54.4 20.6 47.4 20.6H45C40.8 20.6 37.8 22 35.4 23.6L13.4 43.6C8.6 48 4.4 52.6 0 58.6Z",
  mid: "M35 44.6V35.6C35 27.6 41.4 21.6 49.4 21.6H83.4C85.6 21.6 87.4 23.4 87.4 25.6V29.6C87.4 37.8 80.2 44.6 71.4 44.6Z",
  low: "M0 77.6V60.6C0 53.4 8.4 47.6 19.4 47.6H65.4C67.6 47.6 69.4 49.4 69.4 51.6V53.6C69.4 61.4 62.6 67.6 54.4 67.6H17C9.4 67.6 3.6 71.2 0 77.6Z",
  tail: "M0 80C0 72.6 6 68 13 68H15.6C16.6 68 17.2 68.2 17.8 68.6L33.4 76.6C37.4 78.6 39.4 82 39.4 86V103.6C39.4 107 37 109 34.2 109C33.2 109 32.2 108.6 31 108L8 93.6C3 90.4 0 86 0 80Z",
};

let fcUid = 0;

/** Símbolo FavCode completo, com o gradiente original das faixas. */
function fcSymbol({ size = 32, title = "FavCode" } = {}) {
  const id = `fcs${++fcUid}`;
  return `<svg class="fc-symbol" width="${size}" height="${Math.round(size * 1.25)}" viewBox="-1 -1 89.4 111" role="img" aria-label="${title}">
    <defs>
      <linearGradient id="${id}a" x1="0" y1="58" x2="60" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#050A3D"/><stop offset=".55" stop-color="#0438D8"/><stop offset="1" stop-color="#0A9BFF"/></linearGradient>
      <linearGradient id="${id}b" x1="35" y1="44" x2="87" y2="22" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#0040FF"/><stop offset="1" stop-color="#00F0FF"/></linearGradient>
      <linearGradient id="${id}c" x1="0" y1="70" x2="69" y2="48" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1279FF"/><stop offset=".35" stop-color="#2A5BFF"/><stop offset="1" stop-color="#00E5FF"/></linearGradient>
      <linearGradient id="${id}d" x1="0" y1="70" x2="40" y2="108" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1A1C66"/><stop offset=".6" stop-color="#1230D0"/><stop offset="1" stop-color="#0D55FF"/></linearGradient>
    </defs>
    <path d="${FC_BANDS.top}" fill="url(#${id}a)"/>
    <path d="${FC_BANDS.mid}" fill="url(#${id}b)"/>
    <path d="${FC_BANDS.low}" fill="url(#${id}c)"/>
    <path d="${FC_BANDS.tail}" fill="url(#${id}d)"/>
  </svg>`;
}

/** Lockup horizontal: símbolo + wordmark. "Fav" claro, "Code" em gradiente. */
function fcLockup({ size = 28 } = {}) {
  return `<span class="fc-lockup">${fcSymbol({ size })}<span class="fc-wordmark"><span>Fav</span><span class="fc-wordmark-code">Code</span></span></span>`;
}

/** FavCoin — anel circular com o "F" reduzido a duas faixas. Não é moeda dourada. */
function fcCoin({ size = 18 } = {}) {
  const id = `fcc${++fcUid}`;
  return `<svg class="fc-coin" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true">
    <defs><linearGradient id="${id}" x1="3" y1="21" x2="21" y2="3" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#0E4EB2"/><stop offset=".55" stop-color="#126BFF"/><stop offset="1" stop-color="#00BBFF"/></linearGradient></defs>
    <circle cx="12" cy="12" r="10.25" fill="#06122A" stroke="url(#${id})" stroke-width="1.5"/>
    <path d="M8.2 16.6V10.4c0-1.9 1.5-3.4 3.4-3.4h4.2" stroke="url(#${id})" stroke-width="2.1" stroke-linecap="round" fill="none"/>
    <path d="M8.2 12.6h5.4" stroke="url(#${id})" stroke-width="2.1" stroke-linecap="round" fill="none"/>
  </svg>`;
}

/** Loader — as três faixas pulsando em sequência. */
function fcLoader() {
  return `<span class="fc-loader" aria-label="Carregando"><i></i><i></i><i></i></span>`;
}

/**
 * Arte editorial gerada a partir das faixas do símbolo.
 * Usada em thumbnails, hero, trilhas e placeholders — a interface parece
 * FavCode mesmo sem logotipo visível.
 */
function fcArt({ hue = "sites", seed = 1, variant = "thumb" } = {}) {
  const id = `fca${++fcUid}`;
  const palettes = {
    sites:      ["#011F65", "#126BFF", "#4D93FF"],
    vendas:     ["#02305E", "#1A9BFF", "#5CE1FF"],
    prospeccao: ["#120F5C", "#5A5CFF", "#8F9BFF"],
    ia:         ["#003A6B", "#00C8FF", "#7DF0FF"],
    vip:        ["#020C47", "#126BFF", "#00BBFF"],
  };
  const [deep, mid, hi] = palettes[hue] || palettes.sites;
  const r = (n) => ((Math.sin(seed * 9301 + n * 49297) + 1) / 2);
  const hero = variant === "hero";
  const rot = hero ? Math.round(-14 + r(1) * 8) : Math.round(-28 + r(1) * 22);
  const tx = hero ? Math.round(180 + r(2) * 16) : Math.round(140 + r(2) * 60);
  const ty = hero ? Math.round(4 + r(3) * 8) : Math.round(-30 + r(3) * 40);
  const sc = hero ? 1.45 + r(4) * 0.15 : 2.1 + r(4) * 0.5;
  return `<svg class="fc-art" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <radialGradient id="${id}bg" cx="78%" cy="18%" r="95%"><stop offset="0" stop-color="${mid}" stop-opacity=".55"/><stop offset=".55" stop-color="${deep}" stop-opacity=".9"/><stop offset="1" stop-color="#02060E"/></radialGradient>
      <linearGradient id="${id}a" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${deep}"/><stop offset="1" stop-color="${mid}"/></linearGradient>
      <linearGradient id="${id}b" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mid}"/><stop offset="1" stop-color="${hi}"/></linearGradient>
      <linearGradient id="${id}c" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mid}" stop-opacity=".85"/><stop offset="1" stop-color="${hi}" stop-opacity=".9"/></linearGradient>
    </defs>
    <rect width="320" height="180" fill="url(#${id}bg)"/>
    <g transform="translate(${tx} ${ty}) rotate(${rot}) scale(${sc.toFixed(2)})" opacity=".92">
      <path d="${FC_BANDS.top}" fill="url(#${id}a)"/>
      <path d="${FC_BANDS.mid}" fill="url(#${id}b)"/>
      <path d="${FC_BANDS.low}" fill="url(#${id}c)"/>
      <path d="${FC_BANDS.tail}" fill="url(#${id}a)" opacity=".75"/>
    </g>
    <rect width="320" height="180" fill="url(#${id}bg)" opacity=".18"/>
  </svg>`;
}

/** Placeholder de retrato (sem fotos reais): silhueta sobre arte da marca. */
function fcPortrait({ hue = "sites", seed = 1, initials = "" } = {}) {
  return `<div class="fc-portrait">${fcArt({ hue, seed })}
    <svg class="fc-portrait-silhouette" viewBox="0 0 200 220" aria-hidden="true">
      <circle cx="100" cy="82" r="42" fill="rgba(2,6,14,.55)"/>
      <path d="M22 220c4-52 38-82 78-82s74 30 78 82Z" fill="rgba(2,6,14,.55)"/>
    </svg>
    ${initials ? `<span class="fc-portrait-initials">${initials}</span>` : ""}
  </div>`;
}
