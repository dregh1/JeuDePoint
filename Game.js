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
        this.intersections = []; // stocker toutes les intersections
        this.init();
    }

    init() {
        this.grid.draw();
        this.generateIntersections();
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

    generateIntersections() {
        // Génère toutes les intersections de la grille
        for (let x = 0; x <= this.size.width; x += this.unite) {
            for (let y = 0; y <= this.size.height; y += this.unite) {
                this.intersections.push({x, y});
            }
        }
    }

    getClosestGridPoint(x, y) {
        let minDist = Infinity;
        let closestPoint = null;
        for (const point of this.intersections) {
            const dist = Math.hypot(point.x - x, point.y - y);
            if (dist < minDist) {
                minDist = dist;
                closestPoint = point;
            }
        }
        return closestPoint;
    }

    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        // Obtenir la position la plus proche sur la grille
        const closestPoint = this.getClosestGridPoint(clickX, clickY);

        // Vérifier si le point est disponible
        if (this.isPointAvailable(closestPoint.x, closestPoint.y)) {
            const point = new Point(closestPoint.x, closestPoint.y, this.currentPlayer.name);
            this.points.push(point);
            this.currentPlayer.addPoint(point);
            point.draw(this.ctx, this.currentPlayer.color);

            // Obtenir la liste des points du joueur actuel
            const playerPoints = this.currentPlayer.points;

            // Après avoir placé le point
            const shortestClosedChain = this.findShortestClosedChain(point, playerPoints, new Set(), [], null);
 
            if (shortestClosedChain && shortestClosedChain.length >= 4) {
                 // Vérifier si l’adversaire a un point à l’intérieur
                const adversairePoints = this.getOpponentPoints(); // À définir selon ton code
                const adversaireInside = this.doesOpponentHavePointInside(shortestClosedChain, adversairePoints);

                if (adversaireInside) {
                    // Il y a un point adverse à l’intérieur
                    this.joinClosedChaîn(shortestClosedChain, this.currentPlayer.color);
                }
            }


            this.switchPlayer();
        } else {
            alert('Point déjà pris');
        }
    }

    isPointAvailable(x, y) {
        return !this.points.some(p => p.x === x && p.y === y);
    }

    renderCurrentPlayer() {
        document.getElementById('currentPlayer').innerText = "Tour de : " + this.currentPlayer.name;
    }

    areAdjacent(p1, p2) {
        const dx = Math.abs(p1.x - p2.x);
        const dy = Math.abs(p1.y - p2.y);
        return (
            (dx === 0 && dy === this.unite) || // haut/bas
            (dy === 0 && dx === this.unite) || // gauche/droite
            (dx === this.unite && dy === this.unite) // diagonale
        );
    }

    connectAdjacentPoints(newPoint) {
        const playerColor = this.currentPlayer.color; // couleur du joueur actuel
        // Filtrer les points du même joueur
        const playerPoints = this.currentPlayer.points;
    
        for (let p of playerPoints) {
            if (p !== newPoint && this.areAdjacent(newPoint, p)) {
                this.drawLine(newPoint, p, playerColor);
            }
        }
    }    

    drawLine(p1, p2, color) {
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = color;  // couleur du joueur
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
    }

    findShortestClosedChain(currentPoint, pointsConsidered, visited, chain, bestChain) {
        visited.add(currentPoint);
        chain.push(currentPoint);
    
        // Vérifier si la chaîne est fermée (plus d'un point, et premier et dernier sont adjacents)
        if (chain.length >= 4 && this.areAdjacent(chain[0], chain[chain.length - 1])) {
            // Si c'est la première boucle ou si cette chaîne est plus courte que la meilleure trouvée
            if (!bestChain || chain.length < bestChain.length) {
                bestChain = [...chain]; // copier la chaîne
            }
            // On ne continue pas plus loin pour cette branche
            visited.delete(currentPoint);
            chain.pop();
            return bestChain;
        }
    
        // Explorer les points adjacents non visités
        for (let p of pointsConsidered) {
            if (!visited.has(p) && this.areAdjacent(currentPoint, p)) {
                bestChain = this.findShortestClosedChain(p, pointsConsidered, visited, chain, bestChain);
            }
        }
    
        // Backtracking
        visited.delete(currentPoint);
        chain.pop();
    
        return bestChain;
    }

    joinClosedChaîn(chainPoints, couleur) {
        if (!chainPoints || chainPoints.length < 4) return; // Vérification
    
        // Relier chaque point à son voisin suivant, en fermant la boucle
        for (let i = 0; i < chainPoints.length; i++) {
            const p1 = chainPoints[i];
            const p2 = chainPoints[(i + 1) % chainPoints.length]; // boucle
            this.drawLine(p1, p2, couleur);
        }
    }

    getOpponentPoints() {
        // Récupère tous les points de tous les joueurs sauf le joueur actuel
        const adversaryPoints = [];
        for (const player of this.players) {
            if (player !== this.currentPlayer) {
                adversaryPoints.push(...player.points);
            }
        }
        return adversaryPoints;
    }

    doesOpponentHavePointInside(polygonePoints, adversaryPoints) {
        for (const p of adversaryPoints) {
            if (this.isOpponentPointInsidePolygon(p, polygonePoints)) {
                return true; // Au moins un point à l’intérieur
            }
        }
        return false; // Aucun point à l’intérieur
    }
    

    isOpponentPointInsidePolygon(point, polygonPoints) {
        let inside = false;
        const n = polygonPoints.length;
        for (let i = 0, j = n - 1; i < n; j = i++) {
            const xi = polygonPoints[i].x, yi = polygonPoints[i].y;
            const xj = polygonPoints[j].x, yj = polygonPoints[j].y;
    
            const intersect = ((yi > point.y) !== (yj > point.y)) &&
                (point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }
    
    //unused fonction
    getMaxChainLength(currentPoint, pointsConsidered, visited) {
        visited.add(currentPoint);
        let maxLength = 1; // Inclut le point actuel
    
        for (let p of pointsConsidered) {
            if (!visited.has(p) && this.areAdjacent(currentPoint, p)) {
                const length = 1 + this.getMaxChainLength(p, pointsConsidered, visited);
                maxLength = Math.max(maxLength, length);
            }
        }
    
        visited.delete(currentPoint);
        return maxLength;
    }

    collectChainPoints(currentPoint, pointsConsidered, visited, chainPoints) {
        visited.add(currentPoint);
        chainPoints.push(currentPoint);
        for (let p of pointsConsidered) {
            if (!visited.has(p) && this.areAdjacent(currentPoint, p)) {
                this.collectChainPoints(p, pointsConsidered, visited, chainPoints);
            }
        }
    }

    relierPointsDeMaxChain(currentPoint, pointsConsidered) {
        const visited = new Set();
        const maxLength = this.getMaxChainLength(currentPoint, pointsConsidered, visited);
        
        if (maxLength >= 4) {
            const chainPoints = [];
            this.collectChainPoints(currentPoint, pointsConsidered, new Set(), chainPoints);
            
            // Vérifier si le dernier et le premier sont adjacents
            const firstPoint = chainPoints[0];
            const lastPoint = chainPoints[chainPoints.length - 1];
    
            console.log(chainPoints);
            if (this.areAdjacent(firstPoint, lastPoint)) {
                // Relier le dernier au premier pour fermer la boucle
               // Relier chaque point à son voisin suivant
                for (let i = 0; i < chainPoints.length; i++) {
                    const p1 = chainPoints[i];
                    const p2 = chainPoints[(i + 1) % chainPoints.length]; // boucle
                    this.drawLine(p1, p2, p1.color); // ou la couleur du joueur
                }
            } else {
                // Si pas adjacents, ne pas fermer la boucle
                console.log("Les points ne sont pas adjacents, boucle non fermée");
            }        
        }
    }
    
}
