// Лиценци од регистарот на Министерството за финансии (архивна страница):
// ги парсира насловите на лиценците (тип, приредувач, адреса), ги геокодира
// адресите преку Nominatim и ги спојува во public/data/venues.json без
// дупликати спрема OSM точките.
//
// Употреба:  node scripts/fetch-registry.mjs
// Геокодираните резултати се кешираат во public/data/registry-venues.json —
// повторно извршување не ги геокодира одново.

import { readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import * as turf from "@turf/turf";

const ARCHIVE_URL =
  "https://arhiva.finance.gov.mk/%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D1%86%D0%B8-%D0%B7%D0%B0-%D0%BF%D1%80%D0%B8%D1%80%D0%B5%D0%B4%D1%83%D0%B2%D0%B0%D1%9A%D0%B5-%D0%B8%D0%B3%D1%80%D0%B8-%D0%BD%D0%B0-%D1%81%D1%80%D0%B5%D1%9C%D0%B0/";

const USER_AGENT =
  "gambling-law-map/0.1 (compliance map; vikvasdesign@gmail.com)";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function decodeEntities(s) {
  return s
    .replace(/&#8220;|&#8221;|&#822[01];/g, "„")
    .replace(/,,/g, "„") // некои наслови користат две запирки како наводник
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "’")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ");
}

// Познати хотелски/казино брендови — латинично име за геокодирање по име.
const BRAND_LATIN = {
  "ХОЛИДЕЈ ИН": "Holiday Inn",
  МЕРИОТ: "Marriott",
  АПОЛОНИЈА: "Apollonia",
  ФЛАМИНГО: "Flamingo",
  ПРИНЦЕСС: "Princess",
  ЕПИНАЛ: "Epinal",
  ЛУКСОР: "Luxor",
};

// ---------- 1. Преземи и парсирај ----------

console.log("Преземам архивна страница со лиценци…");
// curl.exe заради проблем со TLS сертификатот на arhiva.finance.gov.mk
const html = execFileSync("curl.exe", ["-sk", "-L", ARCHIVE_URL], {
  maxBuffer: 16 * 1024 * 1024,
  encoding: "utf8",
});

const links = [...html.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
  .map((m) => [
    m[1],
    decodeEntities(m[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()),
  ])
  .filter(([, t]) => /^.{0,3}[Лл]?иценца за приредување/i.test(t));

console.log(`Најдени лиценци: ${links.length}`);

const KNOWN_PLACES = [
  "Скопје", "Битола", "Гевгелија", "Охрид", "Тетово", "Куманово", "Кочани",
  "Ресен", "Стар Дојран", "Гостивар", "Радовиш", "Виница", "Богданци",
  "Боговиње", "Илинден", "Турново", "Босилово", "Блаце", "Волково", "Теарце",
  "Кадино", "Богородица", "Прилеп", "Струмица", "Велес", "Штип", "Кавадарци",
  "Неготино", "Струга", "Кичево", "Дебар", "Крива Паланка", "Делчево",
];

function parseLicense(url, title) {
  let kind = null;
  if (/во казино/i.test(title)) kind = "casino";
  else if (/автомат клуб/i.test(title)) kind = "automat_club";
  else if (/обложувалница/i.test(title)) kind = "betting_shop";
  if (!kind) return null;

  // затворен наводник може да биде “, ” или повторно „
  const operator = title.match(/„([^„““”]+)[„“”]/)?.[1]?.trim();

  // адресен дел: по последното „се наоѓа“ / „деловната просторија“ / „уплатно-исплатното место“
  const locMatch = title.match(
    /(?:се наоѓа(?: на| во)?|деловната просторија(?: на| во)?|уплатно-исплатното место(?: кое се наоѓа)?(?: на| во)?)\s+(.+)$/i,
  );
  const locText = locMatch ? locMatch[1] : title;

  const hotel = title.match(/хотел\s+„([^““”]+)[“”]/i)?.[1]?.trim();
  const branch = title
    .match(/Подружница\s+(?:бр\.?\s*\d+\s+)?([^,„“]+?)\s+(?:на|во)\s/i)?.[1]
    ?.trim();

  // град: последното познато место споменато во насловот
  let city;
  for (const place of KNOWN_PLACES) {
    const idx = title.lastIndexOf(place);
    if (idx !== -1 && (!city || idx > city.idx)) city = { name: place, idx };
  }
  city = city?.name;

  // улица + број
  const street = locText.match(
    /(?:ул|бул|булевар)\.{0,2}\s*[„"]?([^„““”"]+?)[“”"]?\s*бр\.?\s*([\w/.-]+)/i,
  );

  let name;
  if (kind === "casino") {
    name = hotel
      ? `Казино во хотел „${hotel}“`
      : branch
        ? branch
        : `Казино „${operator ?? "?"}“`;
  } else if (kind === "automat_club") {
    name = branch ?? `Автомат клуб „${operator ?? "?"}“`;
  } else {
    name = branch ? `Обложувалница ${branch}` : `Обложувалница „${operator ?? "?"}“`;
  }

  const licenseUrl = url.startsWith("http")
    ? url
    : `https://arhiva.finance.gov.mk${url}`;

  return {
    kind,
    operator,
    name,
    hotel,
    city,
    street: street ? `${street[1].trim()} ${street[2]}` : undefined,
    addressText: locText.replace(/\s+/g, " ").trim(),
    licenseUrl,
  };
}

const parsed = links.map(([u, t]) => parseLicense(u, t)).filter(Boolean);
// Исправки/измени на лиценци не се локации
const entries = parsed.filter((e) => e.city);
console.log(`Парсирани со град: ${entries.length}`);
for (const e of entries) {
  console.log(
    `  [${e.kind}] ${e.name} | ${e.street ?? "(без улица)"} | ${e.city}`,
  );
}

// ---------- 2. Геокодирање (Nominatim, 1 барање/сек) ----------

const cacheUrl = new URL("../public/data/registry-venues.json", import.meta.url);
let cache = [];
try {
  cache = JSON.parse(await readFile(cacheUrl, "utf8"));
} catch {
  /* нема кеш — прв пат */
}
const cacheByLicense = new Map(cache.map((c) => [c.licenseUrl, c]));

async function nominatim(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=mk&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) return null;
  const json = await res.json();
  return json[0] ? { lat: +json[0].lat, lng: +json[0].lon } : null;
}

const results = [];
for (const e of entries) {
  const cached = cacheByLicense.get(e.licenseUrl);
  // кешот важи само за прецизни погодоци; „град“ се обидува повторно
  if (cached?.lat && cached.geocodePrecision !== "city") {
    results.push(cached);
    continue;
  }

  // редослед на обиди: улица → име на хотел/казино (мк и латинично) → град
  const attempts = [];
  if (e.street) attempts.push([`${e.street}, ${e.city}`, "street"]);
  if (e.hotel) {
    attempts.push([`хотел ${e.hotel}, ${e.city}`, "poi"]);
    const latin = BRAND_LATIN[e.hotel.toUpperCase()];
    if (latin) {
      attempts.push([`${latin}, ${e.city}`, "poi"]);
      attempts.push([`casino ${latin}, ${e.city}`, "poi"]);
    }
  } else if (e.kind === "casino") {
    attempts.push([`${e.name.replace(/[„“]/g, "")}, ${e.city}`, "poi"]);
  }
  attempts.push([e.city, "city"]);

  let hit = null;
  let precision = null;
  for (const [query, prec] of attempts) {
    hit = await nominatim(query);
    await sleep(1200);
    if (hit) {
      precision = prec;
      break;
    }
  }
  if (!hit) {
    console.warn(`  ✗ не се геокодира: ${e.name} (${e.city})`);
    continue;
  }
  console.log(`  ✓ ${e.name} → ${precision}`);
  results.push({ ...e, lat: hit.lat, lng: hit.lng, geocodePrecision: precision });
}

await writeFile(cacheUrl, JSON.stringify(results, null, 2) + "\n", "utf8");
console.log(`Кеш: registry-venues.json (${results.length})`);

// ---------- 3. Спојување во venues.json ----------

const EARTH_RADIUS_M = 6371008.8;
function distanceMeters(a, b) {
  const t = (d) => (d * Math.PI) / 180;
  const h =
    Math.sin(t(b.lat - a.lat) / 2) ** 2 +
    Math.cos(t(a.lat)) * Math.cos(t(b.lat)) * Math.sin(t(b.lng - a.lng) / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

const venuesUrl = new URL("../public/data/venues.json", import.meta.url);
const venues = JSON.parse(await readFile(venuesUrl, "utf8"));

let added = 0;
let enriched = 0;
for (const [i, r] of results.entries()) {
  // постоечка OSM точка од ист тип на < 200 м = иста локација
  const match = venues.find(
    (v) => v.kind === r.kind && distanceMeters(v, r) < 200,
  );
  if (match) {
    if (!match.operator && r.operator) match.operator = r.operator;
    if (!match.licenseUrl) match.licenseUrl = r.licenseUrl;
    match.source = `${match.source} + Министерство за финансии`.replace(
      / \+ Министерство за финансии( \+ Министерство за финансии)+/,
      " + Министерство за финансии",
    );
    enriched++;
    continue;
  }
  // градска прецизност без улица е прегруба за правилото од 500 м — прескокни
  if (r.geocodePrecision === "city" && r.kind !== "casino") {
    console.warn(`  ~ прескокнато (само град): ${r.name}, ${r.city}`);
    continue;
  }
  venues.push({
    id: `reg-${String(i + 1).padStart(4, "0")}`,
    name: r.name,
    kind: r.kind,
    operator: r.operator,
    lat: r.lat,
    lng: r.lng,
    address: r.addressText,
    source: "Министерство за финансии",
    licenseUrl: r.licenseUrl,
    geocodePrecision: r.geocodePrecision,
    verified: false,
  });
  added++;
}

// Реална општина за точките без неа (од локалните граници).
try {
  const fc = JSON.parse(
    await readFile(
      new URL("../public/data/municipalities.geojson", import.meta.url),
      "utf8",
    ),
  );
  for (const v of venues) {
    if (v.municipality) continue;
    const hit = fc.features.find((f) =>
      turf.booleanPointInPolygon(turf.point([v.lng, v.lat]), f),
    );
    if (hit?.properties?.name) v.municipality = hit.properties.name;
  }
} catch {
  console.warn("municipalities.geojson не постои — без доделување општини.");
}

await writeFile(venuesUrl, JSON.stringify(venues, null, 2) + "\n", "utf8");
console.log(
  `\nvenues.json: додадени ${added}, збогатени ${enriched}, вкупно ${venues.length}`,
);
