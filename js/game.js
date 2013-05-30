var scene = null;
var bar = null;
var rectArray = new Array();
var SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = 600;
var BAR_WIDTH = 800;
var BAR_HEIGHT = 20;
var time = Date.now();
var score = 0;
var bonus = 10;
var spawnRect = 0;
var spawnMode = 0;
var spawnBlink = 0;
var player = new Object();
var gameOver = 0;

player.x = 0;
player.y = 0;
player.size = 20;
player.render = function(){
    scene.fillStyle = "black";
    scene.fillRect( player.x, player.y,  player.size, player.size ); 
};    

scene = document.getElementById("game").getContext("2d");
bar = document.getElementById("score");

var game = function() {
    if ( gameOver == 1 ){
        clearInterval(interval);
        end();
        return;
    }
    update();
    render();    

    if ( Date.now() - time > 500 ) {
        time = Date.now();
        score += 1 * bonus;
        spawnBlink = ( spawnBlink + 1 ) % 2;
        if ( spawnRect == 4 ){
            spawnMode = 1;
            size = Math.round( ( Math.random() * 50 ) + 10 );
            x = Math.round( ( Math.random() * ( SCREEN_WIDTH - ( size * 2 ))) + size );
            y = Math.round( ( Math.random() * ( SCREEN_HEIGHT - ( size * 2 ))) + size );
            color = Math.round( ( Math.random() * 32 ) );
            rectArray.push( new Rect( x, y, size, color ) );
        } else if ( spawnRect == 10 ) {
            spawnMode = 0;
            spawnRect = 0;
        }
        spawnRect++;
    }
};

function end(){
    scene.fillStyle = "#D0D0D0";
    scene.fillRect( SCREEN_WIDTH / 2 - 300, SCREEN_HEIGHT / 2 - 120, 600, 200 );

    scene.fillStyle = "black";
    scene.textAlign = "center";
    scene.font = "45pt Arial";
    scene.fillText("End of the game", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 60);
    scene.font = "35pt Arial";
    scene.fillText("Score: " + score, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 );
    scene.font = "25pt Arial";
    scene.fillText("To start again press ENTER", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 60);
    scene.fill();
    bar.innerText = "SCORE: " + score + " ( +" + bonus + " )";
}

function restart(){
    player.size = 20;
    bonus = 10;
    rectArray = new Array();
    time = 0;
    score = 0;
    spawnRect = spawnMode = spawnBlink = 0;
    gameOver = 0;
    scene.fillStyle = "white";
    scene.fillRect( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
    
    interval = setInterval( game, 1 );
}

function render() {
    scene.fillStyle = "white";
    scene.fillRect( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );

    for (var i = 0; i < rectArray.length-( spawnBlink * spawnMode ); i++) {
         rectArray[i].render();
    }
    player.render();

    bar.innerText = "SCORE: " + score + " ( +" + bonus + " )";

}

function update() {
     for (var i = 0; i < rectArray.length-spawnMode; i++) {
         rectArray[i].update();
     }
     
}

function Rect( x, y, width, color ) {
    this.posX = x; 
    this.posY = y;
    this.size = width;
    this.velocityX = 1;
    this.velocityY = 1;
    color = Math.round( color ); 
    frequency = 0.3;
    red = Math.sin( frequency * color + 0 ) * 127 + 128;
    red = Math.round( red );
    green = Math.sin( frequency * color + 2 ) * 127 + 128;
    green = Math.round( green );
    blue = Math.sin( frequency * color + 4 ) * 127 + 128;
    blue = Math.round( blue );
    this.color = "#" + getRightNumber( red ) + getRightNumber( green ) + getRightNumber( blue );

    this.update = function() {
        this.posX += this.velocityX;
        this.posY += this.velocityY;        

        if ( this.posX + this.size > SCREEN_WIDTH ) {
            this.velocityX = -1;
            this.posX = SCREEN_WIDTH - this.size;
        } else if ( this.posX < 0 ) {
            this.velocityX = 1;
            this.posX = 0;
        }

        if ( this.posY + this.size > SCREEN_HEIGHT ) {
            this.velocityY = -1;
            this.posY = SCREEN_HEIGHT - this.size;
        } else if ( this.posY < 0 ) {
            this.velocityY = 1;
            this.posY = 0;
        }
        if ( player.x < this.posX + this.size &&
                player.x + player.size > this.posX &&
                player.y < this.posY + this.size &&
                player.y + player.size > this.posY ){
            gameOver = 1;
        }
    };

    this.render = function( spawnTime ) {
        if ( spawnTime == null ){
            scene.fillStyle = this.color;
            scene.fillRect( this.posX, this.posY, this.size, this.size ); 
        }
    };
    this.getInfo = function() {
            return "x = " + this.posX + " y = " + this.posY + " color = " + this.color + " size = " + this.size;
    };

}

function getRightNumber( number ){
    numString = number.toString( 16 );
    if ( numString.length == 1 )
        numString = "0" + numString;
    return numString;        
}


var interval = setInterval(game, 1);

document.getElementById("game").addEventListener( "mousemove", function( e ){ 
       player.x = e.offsetX - player.size / 2;
       player.y = e.offsetY - player.size / 2;
       if ( player.x + player.size > SCREEN_WIDTH ) 
            player.x = SCREEN_WIDTH - player.size;
        else if ( player.x < 0 ) 
            player.x = 0;
       if ( player.y + player.size > SCREEN_HEIGHT ) 
            player.y = SCREEN_HEIGHT - player.size;
        else if ( player.y < 0 ) 
            player.y = 0;

    }, false );

        
addEventListener( "keydown", function( e ){
        if ( e.keyCode == 38 ){
            player.size += 1;
            bonus += 1;
        } else if ( e.keyCode == 40 ){
            if ( bonus > 1 ) {
                player.size -= 1;
                bonus -= 1;
            }
        } else if ( e.keyCode == 13 ) {
            if ( gameOver == 1 ) 
                restart();
        }
    }, false);
