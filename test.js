// script-download-images.js
const fs = require('fs');
const https = require('https');
const path = require('path');
const { promisify } = require('util');
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);

// Liste des images et de leurs catégories
const images = [
    // Crâne Amande Double Spirale
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240624_140100-705x1024.jpg', category: 'amande', index: 1 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_184808-scaled.jpg', category: 'amande', index: 2 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_184820-scaled.jpg', category: 'amande', index: 3 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_190454-scaled.jpg', category: 'amande', index: 4 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_184715-scaled.jpg', category: 'amande', index: 5 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_190111-scaled.jpg', category: 'amande', index: 6 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_190033-scaled.jpg', category: 'amande', index: 7 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_185131-scaled.jpg', category: 'amande', index: 8 },
    
    // Crâne Étoile
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240624_134850-748x1024.jpg', category: 'etoile', index: 1 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_191546-scaled.jpg', category: 'etoile', index: 2 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_191541.jpg', category: 'etoile', index: 3 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_191738-scaled.jpg', category: 'etoile', index: 4 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_191655-scaled.jpg', category: 'etoile', index: 5 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_191617-scaled.jpg', category: 'etoile', index: 6 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_191639-scaled.jpg', category: 'etoile', index: 7 },
    
    // Crâne Rose
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_185653-1024x922.jpg', category: 'rose', index: 1 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_191031-scaled.jpg', category: 'rose', index: 2 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_185700-scaled.jpg', category: 'rose', index: 3 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_185721-scaled.jpg', category: 'rose', index: 4 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_190941-scaled.jpg', category: 'rose', index: 5 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_191003-scaled.jpg', category: 'rose', index: 6 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_185619-scaled.jpg', category: 'rose', index: 7 },
    
    // Crâne Cœur Lemniscate
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_191144-1024x663.jpg', category: 'coeur', index: 1 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_191236-scaled.jpg', category: 'coeur', index: 2 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_191359-scaled.jpg', category: 'coeur', index: 3 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_191411-scaled.jpg', category: 'coeur', index: 4 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_191144-scaled.jpg', category: 'coeur', index: 5 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_191151-scaled.jpg', category: 'coeur', index: 6 },
    
    // Crâne Bouche Ouverte
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_192126-1024x840.jpg', category: 'bouche', index: 1 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_191848-scaled.jpg', category: 'bouche', index: 2 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_192038-scaled.jpg', category: 'bouche', index: 3 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_191948-scaled.jpg', category: 'bouche', index: 4 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_191919-scaled.jpg', category: 'bouche', index: 5 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_192152-scaled.jpg', category: 'bouche', index: 6 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240624_135851-scaled.jpg', category: 'bouche', index: 7 },
    
    // Crânes sur Commande
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2025/01/A-O-S-face3-copie-300x222.jpg', category: 'commande', index: 1 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2025/07/20250731_101153-225x300.jpg', category: 'commande', index: 2 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2025/01/A-O-S-contre-plonge-copie-200x300.jpg', category: 'commande', index: 3 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2025/07/20250731_101220-225x300.jpg', category: 'commande', index: 4 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2025/01/A-O-S-cosmique-Detail-serpent-copie-300x200.jpg', category: 'commande', index: 5 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2025/07/20250731_101536-225x300.jpg', category: 'commande', index: 6 },
    
    // Images de l'Artiste
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/AtelierLM-682x1024.jpg', category: 'artiste', index: 1 },
    { url: 'https://tamboursdelaterre.com/wp-content/uploads/2024/06/20240518_193236-1024x577.jpg', category: 'artiste', index: 2 }
];

// Créer le dossier de destination
const outputDir = './public/images';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Fonction asynchrone pour mettre en pause l'exécution du script.
 * @param {number} ms - Le nombre de millisecondes à attendre.
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Télécharge une image et la sauvegarde.
 * @param {object} imageData - Les données de l'image (url, category, index).
 * @param {number} retryCount - Le nombre de tentatives déjà effectuées.
 * @returns {Promise<object>} - Une promesse qui se résout avec les informations sur le fichier téléchargé.
 */
function downloadImage(imageData, retryCount = 0) {
    return new Promise((resolve, reject) => {
        const filename = `${imageData.category}-${imageData.index}.jpg`;
        const filepath = path.join(outputDir, filename);
        const file = fs.createWriteStream(filepath);
        
        console.log(`📥 Téléchargement: ${filename} (tentative ${retryCount + 1})`);
        
        const request = https.get(imageData.url, { timeout: 60000 }, (response) => {
            if (response.statusCode !== 200) {
                file.destroy();
                unlink(filepath).catch(() => {});
                reject(new Error(`HTTP ${response.statusCode} pour ${filename}`));
                return;
            }
            
            response.pipe(file);
            
            file.on('finish', async () => {
                file.close();
                try {
                    const stats = await stat(filepath);
                    if (stats.size < 1000) { // Moins de 1KB = probablement corrompu
                        await unlink(filepath);
                        return reject(new Error(`Fichier trop petit (${stats.size} bytes) pour ${filename}`));
                    }
                    console.log(`✅ ${filename} - ${stats.size} bytes`);
                    resolve({
                        originalUrl: imageData.url,
                        newPath: `/images/${filename}`,
                        category: imageData.category,
                        index: imageData.index,
                        size: stats.size
                    });
                } catch (err) {
                    reject(err);
                }
            });
        });
        
        request.on('timeout', () => {
            request.destroy();
            file.destroy();
            unlink(filepath).catch(() => {});
            reject(new Error(`Timeout pour ${filename}`));
        });
        
        request.on('error', (err) => {
            file.destroy();
            unlink(filepath).catch(() => {});
            reject(err);
        });
        
        file.on('error', (err) => {
            file.destroy();
            unlink(filepath).catch(() => {});
            reject(err);
        });
    });
}

/**
 * Gère le téléchargement avec tentatives de reconnexion et des pauses plus longues.
 * @param {object} imageData - Les données de l'image.
 * @param {number} maxRetries - Le nombre maximum de tentatives.
 * @returns {Promise<object>} - Le résultat du téléchargement.
 */
async function downloadWithRetry(imageData, maxRetries = 5) { // Augmentation du nombre de tentatives
    const pauseDurations = [1000, 3000, 5000, 10000, 15000]; // Pauses progressives de 1, 3, 5, 10, 15 secondes
    for (let i = 0; i < maxRetries; i++) {
        try {
            if (i > 0) {
                console.log(`⏸️  Pause de ${pauseDurations[i-1] / 1000} secondes avant de réessayer...`);
                await sleep(60000);
            }
            return await downloadImage(imageData, i);
        } catch (error) {
            console.log(`❌ Échec ${i + 1}/${maxRetries} pour ${imageData.category}-${imageData.index}: ${error.message}`);
            
            if (i === maxRetries - 1) {
                throw error;
            }
        }
    }
}

/**
 * Télécharge toutes les images avec des pauses entre chaque image.
 */
async function downloadAllImages() {
    console.log('🚀 Début du téléchargement de 39 images...\n');
    
    const results = [];
    const errors = [];
    const mapping = {};
    
    const totalImages = images.length;

    for (let i = 0; i < totalImages; i++) {
        const imageData = images[i];
        
        console.log('\n' + '-'.repeat(50));
        console.log(`[${i + 1}/${totalImages}] Traitement de ${imageData.category}-${imageData.index}`);
        
        try {
            const result = await downloadWithRetry(imageData);
            results.push(result);
            mapping[result.originalUrl] = result.newPath;
        } catch (error) {
            console.error(`💥 ÉCHEC DÉFINITIF pour ${imageData.category}-${imageData.index}: ${error.message}`);
            errors.push({
                url: imageData.url,
                category: imageData.category,
                index: imageData.index,
                error: error.message
            });
        }
    }
    
    // Créer le fichier de mapping JavaScript
    const mappingContent = `// Mapping des URLs originales vers les nouveaux chemins locaux
// Généré automatiquement le ${new Date().toISOString()}

export const imageMapping = ${JSON.stringify(mapping, null, 2)};

// Mapping par catégorie pour faciliter l'usage
export const imagesByCategory = ${JSON.stringify(
        results.reduce((acc, item) => {
            if (!acc[item.category]) acc[item.category] = [];
            acc[item.category].push(item.newPath);
            return acc;
        }, {}), null, 2
    )};

// Statistiques
export const downloadStats = {
    total: ${totalImages},
    success: ${results.length},
    failed: ${errors.length},
    totalSize: ${results.reduce((sum, item) => sum + item.size, 0)}
};
`;
    
    fs.writeFileSync('./image-mapping.js', mappingContent);
    
    // Créer un fichier texte lisible pour le mapping
    const textMapping = [
        '=== MAPPING DES IMAGES ===\n',
        ...results.map(item => 
            `✅ ${item.originalUrl}\n    → ${item.newPath} (${item.size} bytes)\n`
        ),
        '\n=== ERREURS ===\n',
        ...errors.map(error => 
            `❌ ${error.url}\n    → ${error.category}-${error.index}.jpg\n    Erreur: ${error.error}\n`
        )
    ].join('');
    
    fs.writeFileSync('./url-mapping.txt', textMapping);
    
    // Résumé final
    console.log('\n' + '='.repeat(50));
    console.log(`✨ TERMINÉ !`);
    console.log(`📊 Résultats: ${results.length}/${totalImages} images téléchargées`);
    console.log(`📁 Images dans: ./public/images/`);
    console.log(`📄 Mapping JavaScript: ./image-mapping.js`);
    console.log(`📄 Mapping détaillé: ./url-mapping.txt`);
    
    if (errors.length > 0) {
        console.log(`\n⚠️  ${errors.length} erreurs - voir url-mapping.txt pour les détails`);
    }
    
    const totalSize = results.reduce((sum, item) => sum + item.size, 0);
    console.log(`💾 Taille totale: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    
    return { results, errors, mapping };
}

// Lancer le téléchargement
downloadAllImages().catch(console.error);