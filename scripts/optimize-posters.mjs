import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const POSTERS_DIR = 'public/Images/2025/POSTERS';

async function optimizePosters() {
    try {
        const files = await fs.readdir(POSTERS_DIR);
        const targetFiles = files.filter(f => f.startsWith('po$t') && f.endsWith('.jpg'));

        console.log(`Found ${targetFiles.length} files to optimize in ${POSTERS_DIR}`);

        for (const file of targetFiles) {
            const filePath = path.join(POSTERS_DIR, file);
            const stats = await fs.stat(filePath);
            const originalSize = stats.size;

            console.log(`Processing ${file} (${(originalSize / 1024 / 1024).toFixed(2)} MB)...`);

            const buffer = await fs.readFile(filePath);

            try {
                // High quality optimization (95 is usually indistinguishable from original but much smaller)
                // 4:4:4 chroma subsampling prevents color bleeding
                // mozjpeg: true uses improved encoder
                const optimizedBuffer = await sharp(buffer)
                    .jpeg({
                        quality: 95,
                        mozjpeg: true,
                        chromaSubsampling: '4:4:4'
                    })
                    .toBuffer();

                const newSize = optimizedBuffer.length;
                const savings = originalSize - newSize;
                const percent = (savings / originalSize) * 100;

                if (newSize < originalSize) {
                    await fs.writeFile(filePath, optimizedBuffer);
                    console.log(`✅ Optimized ${file}: ${(newSize / 1024 / 1024).toFixed(2)} MB (Saved ${(savings / 1024 / 1024).toFixed(2)} MB / ${percent.toFixed(2)}%)`);
                } else {
                    console.log(`⏭️  Skipped ${file}: Optimization did not reduce size (New: ${(newSize / 1024 / 1024).toFixed(2)} MB)`);
                }

            } catch (err) {
                console.error(`❌ Error processing ${file}:`, err);
            }
        }

    } catch (err) {
        console.error('Error reading directory:', err);
    }
}

optimizePosters();
