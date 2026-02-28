const fs = require('fs');

function updateColors(file, replacements) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf-8');
    for (const [search, replace] of replacements) {
        content = content.replace(search, replace);
    }
    fs.writeFileSync(file, content);
}

updateColors('style.css', [
    [/#050505/g, '#030816'],           // Darker navy background
    [/#eab308/g, '#3b82f6'],           // Primary accent -> Blue
    [/#facc15/g, '#60a5fa'],           // Light accent -> Light blue
    [/#ca8a04/g, '#2563eb'],           // Dark accent -> Dark blue
    [/#fbbf24/g, '#3b82f6'],           // Border top match -> Blue
    [/#fde047/g, '#bfdbfe'],           // Match badge text -> Lightest blue
    [/color:\s*#000;/g, 'color: #ffffff;'], // Button text -> White
    [/rgba\(234,\s*179,\s*8/g, 'rgba(59, 130, 246'], 
    [/rgba\(202,\s*138,\s*4/g, 'rgba(37, 99, 235'],
    [/rgba\(250,\s*204,\s*21/g, 'rgba(96, 165, 250'],
    [/rgba\(251,\s*191,\s*36/g, 'rgba(59, 130, 246']
]);

updateColors('details.js', [
    [/#eab308/g, '#3b82f6'],           // Match label -> Blue
    [/#facc15/g, '#60a5fa'],           // Star rating / Course Overview label -> Light blue
    [/rgba\(234,\s*179,\s*8/g, 'rgba(59, 130, 246'],
    [/#f0883e/g, '#60a5fa'],           // Financials orange -> Light blue
    [/rgba\(240,\s*136,\s*62/g, 'rgba(96, 165, 250']
]);

updateColors('app.js', [
    [/#eab308/g, '#3b82f6']            // Medium match badge color -> Blue
]);

const bgColors = [
    [/vec3\(0\.02,\s*0\.02,\s*0\.03\)/g, 'vec3(0.012, 0.02, 0.05)'], // bg_color
    [/vec3\(0\.92,\s*0\.70,\s*0\.03\)/g, 'vec3(0.12, 0.35, 0.95)'], // color1 and ambient
    [/vec3\(0\.79,\s*0\.54,\s*0\.02\)/g, 'vec3(0.25, 0.55, 0.98)']  // color2
];
updateColors('background.js', bgColors);
