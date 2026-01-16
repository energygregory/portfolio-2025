import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const IMAGES_DIR = 'public/Images/2025';
const OUTPUT_DIR = 'public/Images/2025'; // Overwrite originals (backup first!)
const MAX_DIMENSION = 800; // Max width/height for portfolio thumbnails
const QUALITY = 80; // PNG compression quality

async function optimizeImage(inputPath) {
  try {
    const metadata = await sharp(inputPath).metadata();
    const filename = path.basename(inputPath);
    
    // Skip if already small
    const stats = await fs.stat(inputPath);
    if (stats.size < 50000) {
      console.log(`⏭️  Skipping ${filename} (already small: ${(stats.size / 1024).toFixed(1)}KB)`);
      return;
    }

    // Calculate new dimensions maintaining aspect ratio
    let width = metadata.width;
    let height = metadata.height;
    
    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      if (width > height) {
        height = Math.round((height / width) * MAX_DIMENSION);
        width = MAX_DIMENSION;
      } else {
        width = Math.round((width / height) * MAX_DIMENSION);
        height = MAX_DIMENSION;
      }
    }

    const outputPath = inputPath; // Overwrite

    await sharp(inputPath)
      .resize(width, height, { fit: 'inside', withoutEnlargement: true })
      .png({ 
        quality: QUALITY,
        compressionLevel: 9,
        palette: true, // Use palette-based PNG for smaller files
        effort: 10 // Maximum compression effort
      })
      .toFile(outputPath + '.tmp');

    // Replace original with optimized version
    await fs.rename(outputPath + '.tmp', outputPath);

    const newStats = await fs.stat(outputPath);
    const savings = ((stats.size - newStats.size) / stats.size * 100).toFixed(1);
    console.log(`✅ ${filename}: ${(stats.size / 1024).toFixed(1)}KB → ${(newStats.size / 1024).toFixed(1)}KB (${savings}% smaller)`);

  } catch (error) {
    console.error(`❌ Error processing ${inputPath}:`, error.message);
  }
}

async function main() {
  console.log('🖼️  Optimizing PNG images...\n');
  
  const files = await fs.readdir(IMAGES_DIR);
  const pngFiles = files.filter(f => f.toLowerCase().endsWith('.png'));
  
  console.log(`Found ${pngFiles.length} PNG files to optimize\n`);

  // Process in batches to avoid memory issues
  const batchSize = 5;
  for (let i = 0; i < pngFiles.length; i += batchSize) {
    const batch = pngFiles.slice(i, i + batchSize);
    await Promise.all(
      batch.map(file => optimizeImage(path.join(IMAGES_DIR, file)))
    );
  }

  console.log('\n✨ Done!');
}

main().catch(console.error);
