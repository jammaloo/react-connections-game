const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvFilePath = path.join(__dirname, 'games.csv');
const csvContent = fs.readFileSync(csvFilePath, 'utf-8');

// Parse CSV lines
const lines = csvContent.split('\n').filter(line => line.trim());

// Skip the header row
const dataLines = lines.slice(1);

// Process each line
const games = dataLines
    .map(line => {
        // Split by comma, but handle quoted commas
        const parts = [];
        let currentPart = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                parts.push(currentPart);
                currentPart = '';
            } else {
                currentPart += char;
            }
        }
        parts.push(currentPart);

        // Extract fields: index, category, word1, word2, word3, word4
        const index = parts[0]?.trim();
        const category = parts[1]?.trim();
        const words = [
            parts[2]?.trim(),
            parts[3]?.trim(),
            parts[4]?.trim(),
            parts[5]?.trim()
        ].filter(Boolean); // Remove empty strings

        // Skip if index is not a number or if we don't have 4 words
        if (!index || !/^\d+$/.test(index) || words.length !== 4) {
            return null;
        }

        return {
            category,
            words,
            difficulty: 1,
            imageSrc: null
        };
    })
    .filter(Boolean); // Remove null entries

// Output the JSON
console.log(JSON.stringify(games, null, 2));

// Optionally write to a file
const outputPath = path.join(__dirname, 'games.json');
fs.writeFileSync(outputPath, JSON.stringify(games, null, 2), 'utf-8');
console.error(`\nProcessed ${games.length} games and saved to ${outputPath}`);

