import { ensureTablesExist, autoImportGoals } from "./init";

async function main() {
  await ensureTablesExist();
  await autoImportGoals();
  console.log("✅ Import van stageleerdoelen voltooid!");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Fout bij importeren van doelen:", err);
    process.exit(1);
  });
