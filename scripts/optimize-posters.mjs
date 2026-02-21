import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const POSTERS_DIR = 'public/Images/2025/POSTERS';

async function optimizePosters() {
    try {
        const files = await fs.readdir(POSTERS_DIR);
        // target all common image types in the posters folder
        const targetFiles = files.filter(f => /\.(jpe?g|png|webp|jpeg)$/i.test(f));

        console.log(`Found ${targetFiles.length} files to optimize in ${POSTERS_DIR}`);

        // widths to generate for responsive delivery
        const widths = [400, 800, 1200];

        for (const file of targetFiles) {
            const filePath = path.join(POSTERS_DIR, file);
            const stats = await fs.stat(filePath);
            const originalSize = stats.size;

            console.log(`Processing ${file} (${(originalSize / 1024 / 1024).toFixed(2)} MB)...`);

            const buffer = await fs.readFile(filePath);

            try {
                // 1) Create full-size lossless AVIF and WebP variants for perfect-quality fallbacks
                const basename = path.basename(file, path.extname(file));
                const fullAvif = path.join(POSTERS_DIR, `${basename}.avif`);
                const fullWebp = path.join(POSTERS_DIR, `${basename}.webp`);

                try {
                    await sharp(buffer).avif({lossless: true}).toFile(fullAvif);
                } catch (e) {
                    // continue if avif generation fails for any reason
                }
                try {
                    await sharp(buffer).webp({lossless: true}).toFile(fullWebp);
                } catch (e) {
                }

                // 2) Generate resized responsive variants in AVIF, WebP and JPEG/PNG (high quality)
                for (const w of widths) {
                    const suffix = `@${w}`;
                    const outAvif = path.join(POSTERS_DIR, `${basename}${suffix}.avif`);
                    const outWebp = path.join(POSTERS_DIR, `${basename}${suffix}.webp`);
                    const outJpg = path.join(POSTERS_DIR, `${basename}${suffix}.jpg`);

                    // create AVIF (lossless to preserve visual fidelity)
                    try {
                        await sharp(buffer).resize({ width: w }).avif({lossless: true}).toFile(outAvif);
                    } catch (e) { }

                    // create WebP (lossless)
                    try {
                        await sharp(buffer).resize({ width: w }).webp({lossless: true}).toFile(outWebp);
                    } catch (e) { }

                    // create JPEG fallback at very high quality and 4:4:4 chroma
                    try {
                        await sharp(buffer).resize({ width: w }).jpeg({ quality: 100, mozjpeg: true, chromaSubsampling: '4:4:4' }).toFile(outJpg);
                    } catch (e) { }
                }

                // 3) Re-encode original file with high-quality settings when it's a JPEG (this often reduces size without visual change)
                if (/\.jpe?g$/i.test(file)) {
                    try {
                        const optimizedBuffer = await sharp(buffer)
                            .jpeg({ quality: 95, mozjpeg: true, chromaSubsampling: '4:4:4' })
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
                    } catch (e) {
                        console.error(`❌ Error re-encoding ${file}:`, e);
                    }
                }

                console.log(`✅ Generated responsive variants for ${file}`);

            } catch (err) {
                console.error(`❌ Error processing ${file}:`, err);
            }
        }

    } catch (err) {
        console.error('Error reading directory:', err);
    }
}

optimizePosters();
