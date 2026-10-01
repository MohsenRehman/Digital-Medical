import fs from "fs";
import path from "path";

async function fetchAndSave(url, filename) {
  console.log("Fetching:", url);
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch ${url}: ${res.status} ${text}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const outPath = path.resolve(filename);
  fs.writeFileSync(outPath, buffer);
  console.log(`Saved ${filename} (${buffer.length} bytes)`);
}

async function main() {
  // 1. Single page standard prescription
  await fetchAndSave(
    "http://localhost:3000/api/doctor/prescriptions/RX-2026-0918-01/pdf",
    "generated_prescription_sample.pdf"
  );

  // 2. Multi-page prescription continuation test
  await fetchAndSave(
    "http://localhost:3000/api/doctor/prescriptions/RX-2026-0918-01/pdf?multipage=true",
    "generated_multipage_sample.pdf"
  );

  console.log("All test PDFs generated successfully!");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
