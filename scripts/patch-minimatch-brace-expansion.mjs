import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const lockPath = path.join(root, "package-lock.json");
const legacyImport = "var expand = require('brace-expansion')";
const compatibleImport = [
  "var braceExpansion = require('brace-expansion')",
  "var expand = typeof braceExpansion === 'function' ? braceExpansion : braceExpansion.expand",
].join("\n");

async function patchLegacyMinimatch() {
  const lock = JSON.parse(await readFile(lockPath, "utf8"));
  const packageEntries = Object.entries(lock.packages ?? {});
  let patched = 0;
  let compatible = 0;

  for (const [packagePath, metadata] of packageEntries) {
    if (!packagePath.endsWith("node_modules/minimatch")) continue;
    if (typeof metadata?.version !== "string" || !metadata.version.startsWith("3.")) continue;

    const packageJsonPath = path.join(root, packagePath, "package.json");
    const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
    const entryPath = path.join(root, packagePath, packageJson.main ?? "minimatch.js");
    const source = await readFile(entryPath, "utf8");

    if (source.includes(compatibleImport)) {
      compatible += 1;
      continue;
    }

    if (!source.includes(legacyImport)) {
      throw new Error(
        `Unsupported minimatch ${metadata.version} source layout at ${packagePath}. ` +
          "Review the compatibility patch before continuing.",
      );
    }

    await writeFile(entryPath, source.replace(legacyImport, compatibleImport), "utf8");
    patched += 1;
  }

  if (patched === 0 && compatible === 0) {
    throw new Error("No minimatch@3 installation was found for the brace-expansion compatibility patch.");
  }

  console.log(
    `[dependencies] minimatch@3 compatibility ready (${patched} patched, ${compatible} already compatible).`,
  );
}

await patchLegacyMinimatch();
