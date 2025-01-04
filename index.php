<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grille avec Points d'Intersection</title>
    <style>
        .grid {
            display: grid;
            grid-template-columns: repeat(4, 100px); /* 4 colonnes de 100px */
            grid-template-rows: repeat(4, 100px);    /* 4 lignes de 100px */
            position: relative;                       /* Pour positionner les points */
        }
        .cell {
            border: 1px solid black; /* bordure de chaque cellule */
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            position: relative; /* Pour le positionnement des points */
        }
        .point {
            width: 10px;
            height: 10px;
            background-color: red;
            border-radius: 50%; /* Pour faire un point */
            position: absolute;
            transform: translate(-50%, -50%); /* Centrer le point */
            display: none; /* Cacher par défaut */
        }
    </style>
</head>
<body>

  
<p id="para"> hola</p>
<canvas id="monCanvas" width="400" height="400" style="border:1px solid #000;"></canvas>
    <script>

    // objet position
     class Point  {
            x  ;
            y ;
            sibling ;
            friends ;
            ancestors;
            children;
            
            constructor ( x_, y_ ){
                this.x = x_;
                this.y = y_;
                this.sibling = [];
                this.friends = [];
                this.ancestors = [];
                this.children = [];
              
            }
            
            getSibling(left , right , top , bottom , unite){
                
                if( left <= (this.x - unite )   )
                {
                    this.sibling.push( new Point( this.x - unite, this.y))
                }
                
                if( right >= this.x + unite){
                    this.sibling.push(new 
                        Point(this.x + unite, this.y))
                }
                
                if(top <= this.y - unite)
                {
                    this.sibling.push(new 
                    Point(this.x, this.y - unite))
                }
                if(bottom >= this.y + unite)
                {
                    this.sibling.push( new Point(this.x, this.y + unite) )
                }
                      
                return this.sibling;
            }
        
        setFriend(sibling, allPointsOfCurrentPlayer){
            if(allPointsOfCurrentPlayer){
                for( let j = 0 ; j< allPointsOfCurrentPlayer.length; j++)  {
                    for(let i = 0 ; i< sibling.length; i++){
                        
                        if(sibling[i].x==allPointsOfCurrentPlayer[j].x && sibling[i].y==allPointsOfCurrentPlayer[j].y){
                            this.friends.push(sibling[i])
                        }
                    }
                }
            }
        }

        getFriend(){
            return this.friends;
        }
    }   
    
    class Player {
        score ;
        name ;
        color ;
        points ;
       

        increment( nb ){
            this.score += nb; 
        }

        constructor ( name_ , color_){
            this.score = 0;
            this.name = name_;
            this.color = color_;
            this.points = [];
        }   
    }

        const unite = 25;
        const canvas = document.getElementById('monCanvas');
        const ctx = canvas.getContext('2d');
        const para = document.getElementById('para');
        let p1 = new Player ("Drew" ,  "blue");
        let p2 = new Player ("Alex" , "red");

        let currentPlayer ;
        let tabCol =[];
        let tabLine = [];
        let tabPoint = [];

        const rect = canvas.getBoundingClientRect();

        const position = {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
        };

        // Dessiner des points
        ctx.fillStyle = 'black';
        const cw = canvas.width;
        const ch = canvas.height;
        

    //INITIALISATION
    tabCol = fillTab(cw , unite);
    tabLine = fillTab(ch , unite);
        // dessiner les colonnes
        for( let j =0 ; j<cw ; j+=unite)
        {
            for( let i =0 ; i<ch ; i++ ){
                ctx.fillRect(j, i, 1, 1); 
                ctx.fillRect(i, j, 1, 1);
            }
        }

        const pointCtx = canvas.getContext('2d');
     
        setCurrentPlayer(pointCtx, p1);       


        canvas.addEventListener('click', (event) => {
            // Positionner le point à l'emplacement de l'intersection
            let x = placeCorrectly_x(tabCol, event.clientX - position.left);
            let y = placeCorrectly_y(tabLine, event.clientY - position.top);
            
            
    
            


            const point = new Point(x , y);
            
            if( !isAvailable(tabPoint , point)){
                para.innerHTML= "POINT NOT AVALAIBLE";
            } else {
               
                tabPoint.push(point);
                currentPlayer = getCurrentPlayer();
                addPoint(x,y, p1, p2, currentPlayer);
                pointCtx.fillRect( x -2 , y -2 , 5, 5);
                
                let sbl = " ";
                
                const sb = point.getSibling(
                position.left,
                position.left + position.width,
                position.top,
                position.top + position.height,
                unite);

                point.setFriend(sb,currentPlayer.points);
               
                para.innerHTML=tabPoint.length + " "+ sb.length;
                
                
                const friend = point.getFriend();  
                console.log("GEN",countGenerations(point));
                
                if(friend.length > 0){

                    // joindre les points continus d'un joueur
                    // for(let i=0; i < friend.length; i++){
                    //     if( !isTheSamePoint(friend[i], friend.at(-1))){
                    //         joinTwoPoints(pointCtx, friend[i], friend[i+1],currentPlayer.color );
                    //     } else if ( isTheSamePoint(friend[i], friend.at(-1))){
                    //         joinTwoPoints(pointCtx, friend[i],friend[0],currentPlayer.color);
                    //     }
                    // }
                    // console.log("GEN",countGenerations(point));
                    
                }
                revertPlayer( ctx , p1 , p2);
            }

           

        });
        

        function isTheSamePoint(p1, p2){
            if(p1.x == p2.x && p1.y == p2.y) 
                return true;

            return false;
        }

        
        function countGenerations(startPoint, maxDepth = 100) {
        const queue = [[startPoint, 0]];

        const visited = new Set([startPoint]);
        
        let generations = 0;
        
        while (queue.length > 0) {
        console.log("Q: ",queue.length)
            
            const [currentPoint, depth] = queue.shift();
            console.log("Q",queue.length)
            
            if (depth > generations) {
                generations++;
            }
            
            const neighbors = currentPoint.getFriend();
            console.log("V:",visited)
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    currentPoint.children.push(neighbor);
                    neighbor.ancestors.push(currentPoint);
                    queue.push([neighbor, depth + 1]);
                }
            }
        }
        
        return generations;
        }

        function getNeighbors(point) {
            const { x, y } = point;
            return [
                { x: x + 1, y },
                { x: x - 1, y },
                { x, y: y + 1 },
                { x, y: y - 1 }
            ];
        }

        class Dot {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.ancestors = [];
                this.children = [];
            }
        }


        function joinTwoPoints(ctx, p1, p2, color){
            const x1 = p1.x;
            const y1 = p1.y;
            const x2 = p2.x;
            const y2 = p2.y;

            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();


        }

        function addPoint(x, y, player1, player2, currentPlayer){
            if( currentPlayer ==  player1){
                console.log(currentPlayer.name  +" add point")
                player1.points.push(new Point(x, y));
            } else
            if( currentPlayer ==  player2){
                console.log(currentPlayer.name  +" add point")
                player2.points.push(new Point(x, y));
            }
        }

        function revertPlayer( ctx, p1 , p2){
            if( currentPlayer ==  p1){
                console.log('revert 1 to 2')
                ctx.fillStyle = p2.color;
                currentPlayer = p2;
            } else
            if( currentPlayer ==  p2){
                console.log('revert 2 to 1')
                ctx.fillStyle = p1.color;
                currentPlayer = p1;
            }
        }

        function getCurrentPlayer(){
            return currentPlayer;
        }

        function setCurrentPlayer(ctx, player){
            ctx.fillStyle = player.color;
            currentPlayer = player;
        }
       
        
        function placeCorrectly_x ( tabCol , x ){
            
            let correctX = valeurProche(tabCol , x);

            return correctX;
        }

        function placeCorrectly_y (  tabLine , y ){   
            let correctY = valeurProche( tabLine , y);

            return correctY;
        }   

        function valeurProche(tableau, valeur) {
            if (tableau.length === 0) return -1; // Retourne -1 si le tableau est vide

            let indiceProche = 0;
            let differenceMin = Math.abs(tableau[0] - valeur);

            for (let i = 1; i < tableau.length; i++) {
                const difference = Math.abs(tableau[i] - valeur);
                if (difference < differenceMin) {
                    differenceMin = difference;
                    indiceProche = i; // Met à jour l'indice
                }
            }

            return tableau[indiceProche];
        }

        function fillTab( size , unite){
            let tabCol = [];
            for( let i= 0 ; i< size ; i+= unite){
                tabCol.push(i);
            }
            return tabCol;
        }

        function isAvailable(tabPoint , point){
           

            for( let i = 0 ; i<tabPoint.length ; i++){
                if(point.x == tabPoint[i].x && point.y == tabPoint[i].y)
                    return false;
            }
            return true;
        }
        
        function equationPointToLine(
            x1, y1, x2, y2) {
            
          const dx = x2 - x1;
          const dy = y2 - y1;
          
          const a = dy / dx;
          const b = y1 - a * x1;
          
          return { a, b };
        }
        
    </script>

 
</body>
</html>
<!-- placer les lignes & colonne OK-->
<!-- placer les points OK -->
        <!-- sur l'intersection OK-->
        <!-- nearest () => index OK-->
        <!-- enregistrer les positions des points OK-->
        <!-- eviter les superposition OK-->
<!-- multijoueur -->
        <!-- à tour de role OK-->
        <!-- reunir deux point OK-->
        <!-- reunir le point si il y a un prisonnier -->
    

