// grid.js

// Fonction pour dessiner la grille
function drawGrid(ctx, width, height, unite, color='black', lineWidth=1) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    // Dessiner les lignes verticales
    for (let j = 0; j <= width; j += unite) {
        ctx.beginPath();
        ctx.moveTo(j, 0);
        ctx.lineTo(j, height);
        ctx.stroke();
    }
    // Dessiner les lignes horizontales
    for (let i = 0; i <= height; i += unite) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
    }
}