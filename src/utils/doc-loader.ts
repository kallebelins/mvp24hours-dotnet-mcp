/**
 * Documentation Loader Utility
 * 
 * Loads documentation files from the docs directory.
 * Uses lazy loading to minimize memory usage.
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Resolve docs path relative to the package
const DOCS_PATH = join(__dirname, "..", "..", "docs");

/**
 * Load a documentation file by path
 */
export function loadDoc(relativePath: string): string {
  const fullPath = join(DOCS_PATH, relativePath);
  
  if (!existsSync(fullPath)) {
    throw new Error(`Documentation not found: ${relativePath}`);
  }
  
  return readFileSync(fullPath, "utf-8");
}

/**
 * Load multiple documentation files and concatenate them
 */
export function loadDocs(relativePaths: string[]): string {
  return relativePaths
    .map((path) => {
      try {
        return loadDoc(path);
      } catch {
        return `<!-- Document not found: ${path} -->`;
      }
    })
    .join("\n\n---\n\n");
}

/**
 * Load a section from a documentation file
 * Extracts content between ## headers
 */
export function loadDocSection(relativePath: string, sectionTitle: string): string {
  const content = loadDoc(relativePath);
  const lines = content.split("\n");
  const result: string[] = [];
  let inSection = false;
  let sectionLevel = 0;

  for (const line of lines) {
    // Check if this is a header
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    
    if (headerMatch) {
      const level = headerMatch[1].length;
      const title = headerMatch[2].trim();
      
      if (title.toLowerCase().includes(sectionTitle.toLowerCase())) {
        inSection = true;
        sectionLevel = level;
        result.push(line);
        continue;
      }
      
      // If we're in the section and hit a same-level or higher header, stop
      if (inSection && level <= sectionLevel) {
        break;
      }
    }
    
    if (inSection) {
      result.push(line);
    }
  }

  if (result.length === 0) {
    throw new Error(`Section "${sectionTitle}" not found in ${relativePath}`);
  }

  return result.join("\n");
}

/**
 * Check if a documentation file exists
 */
export function docExists(relativePath: string): boolean {
  const fullPath = join(DOCS_PATH, relativePath);
  return existsSync(fullPath);
}

/**
 * Get the base path for documentation
 */
export function getDocsBasePath(): string {
  return DOCS_PATH;
}
