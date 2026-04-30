import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const packages = [
  '@scandit/web-datacapture-core',
  '@scandit/web-datacapture-barcode'
];

async function main() {
  try {
    console.log("[copy-scandit] Starting Scandit file copy process...");
    
    const destDir = path.join(process.cwd(), "public", "scandit");
    console.log(`[copy-scandit] Destination directory: ${destDir}`);
    
    await fsp.mkdir(destDir, { recursive: true });

    let totalCopiedFiles = 0;

    for (const packageName of packages) {
      try {
        console.log(`[copy-scandit] Processing package: ${packageName}`);
        const packageJsonPath = require.resolve(`${packageName}/package.json`);
        const packageDirectory = path.dirname(packageJsonPath);
        
        console.log(`[copy-scandit] Package directory: ${packageDirectory}`);
        
        const possiblePaths = [
          path.join(packageDirectory, 'build', 'browser', 'sdc-lib'),
          path.join(packageDirectory, 'sdc-lib'),
          path.join(packageDirectory, 'lib', 'sdc-lib')
        ];
        
        let sdcLibPath = null;
        
        for (const possiblePath of possiblePaths) {
          try {
            await fsp.access(possiblePath);
            sdcLibPath = possiblePath;
            console.log(`[copy-scandit] Found sdc-lib at: ${possiblePath}`);
            break;
          } catch {
            // Path doesn't exist, try next one
          }
        }
        
        if (!sdcLibPath) {
          console.log(`[copy-scandit] No sdc-lib directory found for ${packageName}`);
          continue;
        }
        
        const copiedCount = await copyFiles(sdcLibPath, destDir);
        totalCopiedFiles += copiedCount;
        console.log(`[copy-scandit] Copied ${copiedCount} files from ${packageName}`);
        
      } catch (error) {
        console.log(`[copy-scandit] Could not process ${packageName}: ${error.message}`);
      }
    }

    async function copyFiles(src, dst) {
      console.log(`[copy-scandit] Copying from ${src} to ${dst}`);
      
      const entries = await fsp.readdir(src, { withFileTypes: true });
      let copiedCount = 0;
      
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dst, entry.name);
        
        if (entry.isFile()) {
          await fsp.copyFile(srcPath, destPath);
          console.log(`[copy-scandit] Copied file: ${entry.name}`);
          copiedCount++;
        } else if (entry.isDirectory()) {
          await fsp.mkdir(destPath, { recursive: true });
          const subCopiedCount = await copyFiles(srcPath, destPath);
          copiedCount += subCopiedCount;
        }
      }
      
      return copiedCount;
    }

    const finalFiles = await fsp.readdir(destDir);
    console.log(`[copy-scandit] Successfully copied ${totalCopiedFiles} total files to ${destDir}`);
    console.log(`[copy-scandit] Final files in destination:`, finalFiles);
    
    if (totalCopiedFiles === 0) {
      console.warn("[copy-scandit] WARNING: No files were copied!");
      console.warn("[copy-scandit] Scanner may not work properly.");
    }
  } catch (error) {
    console.error("[copy-scandit] Error:", error);
    process.exit(1);
  }
}

main();
