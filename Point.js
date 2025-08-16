class Point {
    constructor(x, y, owner=null) {
        this.x = x;
        this.y = y;
        this.owner = owner; // 'player1' ou 'player2'
    }

    draw(ctx, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}
