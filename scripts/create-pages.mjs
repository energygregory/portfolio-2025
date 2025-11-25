// scripts/create-pages.mjs

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Folder where we’ll put the React pages
const pagesDir = path.join(__dirname, "..", "src", "pages");

// List all the pages you want
const pages = [
  { file: "Home.jsx", component: "Home" },
  { file: "About.jsx", component: "About" },
  { file: "Work.jsx", component: "Work" },
  { file: "Project.jsx", component: "Project" },
  { file: "Testimonials.jsx", component: "Testimonials" },
  { file: "Contact.jsx", component: "Contact" },
];

function pageTemplate(name) {
  return `import React from "react";

export default function ${name}() {
  return (
    <main className="min-h-screen px-6 py-16">
      <h1 className="text-3xl font-semibold">${name} page</h1>
      <p className="mt-4 text-neutral-400">
        Replace this with your real ${name.toLowerCase()} content.
      </p>
    </main>
  );
}
`;
}

async function ensurePagesDir() {
  await fs.mkdir(pagesDir, { recursive: true });
}

async function createPages() {
  await ensurePagesDir();

  for (const page of pages) {
    const filePath = path.join(pagesDir, page.file);

    try {
      // If file exists, this will NOT throw
      await fs.access(filePath);
      console.log(`Skipped (already exists): ${filePath}`);
    } catch {
      // If access throws, file doesn't exist — create it
      await fs.writeFile(filePath, pageTemplate(page.component), "utf8");
      console.log(`Created: ${filePath}`);
    }
  }
}

createPages().catch((err) => {
  console.error("Error creating pages:", err);
  process.exit(1);
});
