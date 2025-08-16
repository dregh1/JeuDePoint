class Game {
    constructor(canvas, size, unite) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.size = size;
        this.unite = unite;
        this.grid = new Grid(canvas, size, unite);
        this.players = [
            new Player('Joueur 1', 'red'),
            new Player('Joueur 2', 'blue')
        ];
        this.currentPlayerIndex = 0;
        this.points = []; // tous les points placés
        this.init();
    }

    init() {
        this.grid.draw();
        this.canvas.addEventListener('click', this.handleClick.bind(this));
        this.renderCurrentPlayer();
    }

    get currentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    switchPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.renderCurrentPlayer();
    }

    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        console.log(x,y);
        if (this.grid.isOnGrid(x, y)) {
            // Vérifier si le point est déjà pris
            if (this.isPointAvailable(x, y)) {
                const point = new Point(x, y, this.currentPlayer.name);
                this.points.push(point);
                this.currentPlayer.addPoint(point);
                point.draw(this.ctx, this.currentPlayer.color);
                this.switchPlayer();
            } else {
                alert('Point déjà pris');
            }
        }
    }

    isPointAvailable(x, y) {
        return !this.points.some(p => p.x === x && p.y === y);
    }

    renderCurrentPlayer() {
        // Affiche le nom du joueur actuel ou autre indication
        document.getElementById('currentPlayer').innerText = "Tour de : " + this.currentPlayer.name;
    }
}