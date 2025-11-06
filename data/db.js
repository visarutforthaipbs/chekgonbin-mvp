// data/db.js
import fs from "fs";
import path from "path";

// Improved CSV parser that handles quoted fields properly
function parseCSV(csvText) {
  const lines = csvText.split("\n");
  const result = [];

  // Parse first line as headers
  const headers = parseCSVLine(lines[0]).map((h) => h.trim());

  // Parse data lines
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = parseCSVLine(lines[i]);
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] ? values[index].trim() : "";
      });
      result.push(row);
    }
  }

  return result;
}

// Helper to parse a single CSV line with quoted fields
function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

// Read and parse whitelist CSV
let whitelist = [];
try {
  const whitelistPath = path.join(process.cwd(), "data", "whitelist.csv");
  const whitelistCSV = fs.readFileSync(whitelistPath, "utf-8");
  const whitelistData = parseCSV(whitelistCSV);

  whitelist = whitelistData.map((row, index) => ({
    id: `w${String(index + 1).padStart(3, "0")}`,
    name:
      row["ชื่อบริษัทจัดหางาน (ไทย)"] || row["ชื่อบริษัทจัดหางาน (ไทย) "] || "",
    nameEn:
      row["ชื่อบริษัทจัดหางาน (อังกฤษ)"] ||
      row["ชื่อบริษัทจัดหางาน (อังกฤษ) "] ||
      "",
    license: row["เลขที่ใบอนุญาต"] || "",
    phone: row["โทรศัพท์"] || row["โทรศัพท์ "] || "",
    email: row["อีเมล/เว็บไซต์"] || row["อีเมล/เว็บไซต์ "] || "",
  }));
} catch (error) {
  console.error("Error loading whitelist:", error);
  // Fallback to sample data
  whitelist = [
    { id: "w001", name: "บริษัท จัดหางาน ก. จำกัด" },
    { id: "w002", name: "บริษัท จัดหางาน ข. อินเตอร์เนชั่นแนล จำกัด" },
  ];
}

// Read and parse blacklist CSV
let blacklist = [];
try {
  const blacklistPath = path.join(process.cwd(), "data", "blacklist.csv");
  const blacklistCSV = fs.readFileSync(blacklistPath, "utf-8");
  const blacklistData = parseCSV(blacklistCSV);

  blacklist = blacklistData.map((row, index) => {
    const contacts = [];
    if (row["เบอร์โทรศัพท์"]) contacts.push(row["เบอร์โทรศัพท์"]);
    if (row["อีเมล"]) contacts.push(row["อีเมล"]);
    if (row["LINE ID/QR Code"]) contacts.push(row["LINE ID/QR Code"]);
    if (row["Facebook Profile/Page"])
      contacts.push(row["Facebook Profile/Page"]);

    return {
      id: `b${String(index + 1).padStart(3, "0")}`,
      name: row["ชื่อบริษัท/นายหน้า"] || "",
      contact: contacts.filter((c) => c && c !== "(ไม่ระบุ)"),
      type: row["ประเภท"] || "",
      scamMethod: row["รูปแบบการหลอก"] || "",
    };
  });
} catch (error) {
  console.error("Error loading blacklist:", error);
  // Fallback to sample data
  blacklist = [
    {
      id: "b001",
      name: "บจก. สุขสบายไปทำงาน ตปท.",
      contact: ["081-123-4567", "jobs.th@gmail.com", "richjob99"],
    },
  ];
}

export { whitelist, blacklist };
