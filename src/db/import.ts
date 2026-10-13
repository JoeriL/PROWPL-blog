import { ensureTablesExist, autoImportLogs } from "./init";

async function main() {
  await ensureTablesExist();
  await autoImportLogs();
  console.log("✅ Import van logs voltooid!");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Fout bij importeren van logs:", err);
    process.exit(1);
  });
