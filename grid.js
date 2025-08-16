class Grid {
    constructor(canvas, size, unite) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.size = size; // {width, height}
        this.unite = unite; // taille de chaque case
    }

    draw(color='black', lineWidth=1) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        // Lignes verticales
        for (let j = 0; j <= this.size.width; j += this.unite) {
            this.ctx.beginPath();
            this.ctx.moveTo(j, 0);
            this.ctx.lineTo(j, this.size.height);
            this.ctx.stroke();
        }
        // Lignes horizontales
        for (let i = 0; i <= this.size.height; i += this.unite) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.size.width, i);
            this.ctx.stroke();
        }
    }

    isOnGrid(x, y) {
        // Vérifie si (x,y) est une intersection
        return (x % this.unite === 0 && y % this.unite === 0);
    }
}