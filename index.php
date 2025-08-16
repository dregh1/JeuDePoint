<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<title>Jeu Local - Sprint 1</title>
</head>
<body>

<h2 id="currentPlayer">Tour de : </h2>
<canvas id="monCanvas" width="400" height="400" style="border:1px solid #000;"></canvas>

<script src="Grid.js"></script>
<script src="Point.js"></script>
<script src="Player.js"></script>
<script src="Game.js"></script>
<script>
    const canvas = document.getElementById('monCanvas');
    const size = { width: 400, height: 400 };
    const unite = 50; // taille de la grille

    const game = new Game(canvas, size, unite);
</script>

</body>
</html>