/*

The sound effects extension was fairly easy to implement compared to the other two. I looked the sound effects in Splice.com, it is a web page where you can download all types of sounds that fits with what you want to do. I ran into some bugs while adding them. 
One of them was that the sound would just play its first second in a loop, sounding a bit strange.
While making the platforms I encountered some difficulty in the "Contact" argument, I struggled trying to make the character stand on top of them and then being able to jump off them. In order for the game to be a bit more of a challenge I wanted to make the platforms tricky for the player, so you might run into some trouble on the last platforms.
Because of my constant try and error way of doing things I got pretty good at debugging. Not only at spotting syntax errors but also problems related to game mechanics and particles.

*/
var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;
var mountains;
var pillars_x;
var canyon;
var collectable;

var game_score;
var flagPole;
var lives;

var platforms;

var jumpSound;
var coinSound;
var deathSound;
var finishLine;
var bMusic



function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.07);
    
    coinSound = loadSound("assets/coinSound.wav");
    coinSound.setVolume(0.07);
    
    deathSound = loadSound("assets/deathSound.wav");
    deathSound.setVolume(0.2 );
    
    finishLine = loadSound("assets/finishLine.wav");
    finishLine.setVolume(0.1);  
    
    bMusic = loadSound("assets/bMusic.wav");
    bMusic.setVolume(0.05);
    
}


function setup()
{
	createCanvas(1024, 576);
    
    floorPos_y = height * 3/4;
    lives = 3
    startGame();
}
// Function to start the game
function startGame()
{
    gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
    
	// Initialise arrays of scenery objects.
    
    pillars_x = [300, 700, 1200, 1700, 1999, 2500, 2800, 3700];
    clouds = [{x_pos: -50, y_pos: 180, size: 1, speed: random(0.1, 1)},
              {x_pos: -200, y_pos: 100, size: 1, speed: random(0.1, 1)},
              {x_pos: 1200, y_pos: 120, size: 1, speed: random(0.1, 1)},
              {x_pos: 250, y_pos: 120, size: 1, speed: random(0.1, 1)},
              {x_pos: 500, y_pos: 180, size: 1, speed: random(0.1, 1)},
              {x_pos: 700, y_pos: 100, size: 1, speed: random(0.1, 1)}];
    mountains = [{x_pos: 430, size: 2.0},
                {x_pos: 1080, size: 1.3},
                {x_pos: 1950, size: 2.5},
                {x_pos: 2800, size: 2.5}];
    canyon = [{x_pos: -120, width: 300},
             {x_pos: 820, width: 100},
             {x_pos: 1300, width: 300},
             {x_pos: 2340, width: 130},
             {x_pos: 3200, width: 400}] 
    collectable = [{x_pos: 870, y_pos: 350, size: 1, isFound: false},
                 {x_pos: 1450, y_pos: 250, size: 1, isFound: false},
                 {x_pos: 1200, y_pos: 390, size: 1, isFound: false},
                 {x_pos: 1700, y_pos: 360, size: 1, isFound: false},
                 {x_pos: 2000, y_pos: 390, size: 1, isFound: false },
                 {x_pos: 2400, y_pos: 390, size: 1, isFound: false },
                 {x_pos: 3045, y_pos: floorPos_y - 140, size: 1, isFound: false },
                 {x_pos: 3245, y_pos: floorPos_y - 160, size: 1, isFound: false },
                 {x_pos: 3345, y_pos: floorPos_y - 240, size: 1, isFound: false },
                 {x_pos: 3445, y_pos: floorPos_y - 290, size: 1, isFound: false },
                 {x_pos: 2845, y_pos: floorPos_y - 120, size: 1, isFound: false }]

    game_score = 0;
    
    flagPole = {isReached: false, x_pos: 3800};
    
    platforms = [];
    
    platforms.push(createPlatforms(1300, floorPos_y - 60, 110));
    platforms.push(createPlatforms(1500, floorPos_y - 100, 70));
    platforms.push(createPlatforms(2800, floorPos_y - 80, 90));
    platforms.push(createPlatforms(3000, floorPos_y - 100, 90));
    platforms.push(createPlatforms(3200, floorPos_y - 120, 90));
    platforms.push(createPlatforms(3300, floorPos_y - 200, 90));
    platforms.push(createPlatforms(3400, floorPos_y - 250, 90));
    
};


function draw()
{
	background(33,23,70); // fill the sky blue

	noStroke();
	fill(166, 122, 25);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    //Play background music in loop
    backgroundMusic();
    // Lock the backrownd
    push();
    // Move the background
    translate (scrollPos,0);
	// Draw clouds.
    drawClouds();
	// Draw mountains.
    drawPyramids();
	// Draw trees.
    drawPillars();
    //Draw platforms
    for (var i = 0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }
	// Draw canyons.
    for (var i = 0; i < canyon.length; i++)
    {
        drawCanyon(canyon[i]);
        checkCanyon(canyon[i]);
    }
    if (isPlummeting == true)
    {
        gameChar_y += 3;
    }
	// Draw collectable items.
    for (var i = 0; i < collectable.length; i++)
        {
            if (collectable[i].isFound == false)
            {
                drawCollectable(collectable[i]);
                checkCollectable(collectable[i]);
            }
        

        }
    
    //Render the FlagPole
    renderFlagPole();
    
    //Check if the character died
    checkPlayerDie();
    
    // Lock the backrownd
    pop();
    
	// Draw game character.
	drawGameChar();
    
    fill(225);
    strokeWeight(2);
    textAlign(CENTER);
    text("Score : " + game_score, 40, 20);
    for (var i = 0; i < lives; i++)
    {
        fill(255, 50, 50);
        textSize(20);
        text("♥", 100 + i * 18, 20,);
    }
    noStroke();
    textSize(13);
    
    // Message if there are no more lives
    if (lives < 1)
    {
        fill(200);
        textSize(50);
        text("GAME OVER", width/2, height/2);
        textSize(20);
        text("Press enter to continue", width/2, height/2 + 30)
        textSize(13);
        return;
    }
    // Message if the flagpole is reached
    if (flagPole.isReached)
    {
        fill(200);
        textSize(50);
        text("Level Complete", width/2, height/2);
        textSize(20);
        text("Press enter to continue", width/2, height/2 + 30);
        textSize(13);
        return;
    }
	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    if (gameChar_y < floorPos_y)
    {
        var isContact = false;
        for (var i = 0; i < platforms.length; i++)
        {
            if (platforms[i].checkContact(gameChar_world_x, gameChar_y))
            {
                isContact = true;
                isFalling = false;
                break;
            }
        }
        if (isContact == false)
        {
            gameChar_y += 2;
            isFalling = true;
        }
        
    }
    else
    {
        isFalling = false;
    }

    // check if im touching the flagpole
    if (flagPole.isReached == false)
    {
         checkFlagPole();
    }
   
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed(){

    if (keyCode == 37)
    {
        isLeft = true;
    }
    else if (keyCode == 39)
    {
        isRight = true;
    }
//Jump key
    if (keyCode == 32 && isPlummeting == false && flagPole.isReached == false)
    {
        if(!isFalling)
        {   
            gameChar_y -= 100;
            jumpSound.play();
        }
        
    }
// Restart Game
    if (keyCode == 13 && (flagPole.isReached || lives == 0))
    {
        startGame();
        lives = 3;
    }


}
function keyReleased()
{

    if (keyCode == 37)
    {
        isLeft = false;
    }
    else if (keyCode == 39)
    {
        isRight = false;
    }
}


// ------------------------------
// Game character render function
// ------------------------------
// Function to draw the game character.
function drawGameChar()
{
	if(isLeft && isFalling)
	{
		// add your jumping-left code
        fill(255,200, 200);
        ellipse(gameChar_x, gameChar_y - 55, 25, 25);
        triangle(gameChar_x - 18, gameChar_y - 52, gameChar_x + - 7, gameChar_y - 65, gameChar_x + 5, gameChar_y - 50);
        fill(100)
        rect(gameChar_x - 10, gameChar_y - 43, 20, 35, 8)
        fill(220,100,56)
        ellipse(gameChar_x - 12, gameChar_y - 8, 10);
        ellipse(gameChar_x + 12, gameChar_y - 8, 10);
        stroke(0)
        point(gameChar_x - 4 , gameChar_y - 58);

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        fill(255,200, 200);
        ellipse(gameChar_x, gameChar_y - 55, 25, 25);
        triangle(gameChar_x + 18, gameChar_y - 52, gameChar_x + 7, gameChar_y - 65, gameChar_x + 5, gameChar_y - 50);
        fill(100)
        rect(gameChar_x - 10, gameChar_y - 43, 20, 35, 8)
        fill(220,100,56)
        ellipse(gameChar_x - 12, gameChar_y - 8, 10);
        ellipse(gameChar_x + 12, gameChar_y - 8, 10);
        stroke(0)
        point(gameChar_x + 4 , gameChar_y - 58);

	}
	else if(isLeft)
	{
		// add your walking left code
        fill(255,200, 200);
        ellipse(gameChar_x, gameChar_y - 55, 25, 25);
        triangle(gameChar_x - 18, gameChar_y - 52, gameChar_x + - 7, gameChar_y - 65, gameChar_x + 5, gameChar_y - 50);
        fill(100)
        rect(gameChar_x - 10, gameChar_y - 43, 20, 35, 8)
        fill(220,100,56)
        ellipse(gameChar_x - 7, gameChar_y - 4, 10);
        ellipse(gameChar_x + 7, gameChar_y - 4, 10);
        stroke(0)
        point(gameChar_x - 4 , gameChar_y - 58);

	}
	else if(isRight)
	{
		// add your walking right code
        fill(255,200, 200);
        ellipse(gameChar_x, gameChar_y - 55, 25, 25);
        triangle(gameChar_x + 18, gameChar_y - 52, gameChar_x + 7, gameChar_y - 65, gameChar_x + 5, gameChar_y - 50);
        fill(100)
        rect(gameChar_x - 10, gameChar_y - 43, 20, 35, 8)
        fill(220,100,56)
        ellipse(gameChar_x - 7, gameChar_y - 4, 10);
        ellipse(gameChar_x + 7, gameChar_y - 4, 10);
        stroke(0)
        point(gameChar_x + 4 , gameChar_y - 58);

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
        fill(255,200, 200);
        ellipse(gameChar_x, gameChar_y - 55, 25, 25);
        fill(100)
        rect(gameChar_x - 10, gameChar_y - 43, 20, 35, 8)
        fill(220,100,56)
        ellipse(gameChar_x - 12, gameChar_y - 8, 10);
        ellipse(gameChar_x + 12, gameChar_y - 8, 10);
        stroke(0)
        point(gameChar_x - 4 , gameChar_y - 58);
        point(gameChar_x + 4 , gameChar_y - 58);

	}
	else
	{
		// add your standing front facing code
        fill(255,200, 200);
        ellipse(gameChar_x, gameChar_y - 55, 25, 25);
        fill(100)
        rect(gameChar_x - 10, gameChar_y - 43, 20, 35, 8)
        fill(220,100,56)
        ellipse(gameChar_x - 7, gameChar_y - 4, 10);
        ellipse(gameChar_x + 7, gameChar_y - 4, 10);
        stroke(0)
        strokeWeight(2)
        point(gameChar_x - 4 , gameChar_y - 58);
        point(gameChar_x + 4 , gameChar_y - 58);

	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
    for (var i = 0; i < clouds.length; i++)
    {
        clouds[i].x_pos += clouds[i].speed;
        noStroke();
        fill(220);
        ellipse(clouds[i].x_pos,
                clouds[i].y_pos,
                100 * clouds[i].size,
                70 * clouds[i].size);
        ellipse(clouds[i].x_pos - 40 * clouds[i].size,
                clouds[i].y_pos,
                70 * clouds[i].size,
                50 * clouds[i].size);
        ellipse(clouds[i].x_pos + 40 * clouds[i].size,
                clouds[i].y_pos,
                70 * clouds[i].size,
                50 * clouds[i].size); 
        if (clouds[i].x_pos - 160 > gameChar_world_x + width)
        {
            clouds[i].x_pos = gameChar_world_x - width;
        }
    }
}

// Function to draw mountains objects.
function drawPyramids()
{
    for (var i = 0; i < mountains.length; i++)
    {
        fill(117, 83, 8);
        triangle(mountains[i].x_pos + 75 * mountains[i].size,
                 floorPos_y,
                 mountains[i].x_pos + 150 * mountains[i].size,
                 floorPos_y,
                 mountains[i].x_pos + 45,
                 floorPos_y - 120 * mountains[i].size);
        fill(153, 114, 31);
        triangle(mountains[i].x_pos - 75 * mountains[i].size,
                 floorPos_y,
                 mountains[i].x_pos + 75 * mountains[i].size,
                 floorPos_y,
                 mountains[i].x_pos + 45,
                 floorPos_y - 120 * mountains[i].size);
    }
}
// Function to draw trees objects.
function drawPillars()
{
    for (var i = 0; i < pillars_x.length; i++)
    {
        fill(122, 71, 2);
        rect(pillars_x[i], height/2 + 45, 25, 100);
        fill(51, 31, 5);
        rect(pillars_x[i] - 13, height/2 + 125, 50, 20);
        rect(pillars_x[i] - 13, height/2 + 25, 50, 20);
    }
    
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    for (var i = 0; i < canyon.length; i++)
    {
        fill(33,23,70);
        rect(t_canyon.x_pos, floorPos_y, t_canyon.width, 200);
        strokeWeight(5);
        stroke(112, 54, 18);
        line(t_canyon.x_pos, floorPos_y, t_canyon.x_pos, t_canyon.width + 500);
        line(t_canyon.x_pos + t_canyon.width, floorPos_y, t_canyon.x_pos + t_canyon.width, t_canyon.width + 500);
        noStroke();
        strokeWeight(2);
    }
}

// Function to render the Flagpole
function renderFlagPole()
{
    push();
    strokeWeight(5);
    stroke(180);
    line(flagPole.x_pos, floorPos_y, flagPole.x_pos, floorPos_y - 250);
    fill(148, 30, 37);
    noStroke();
    
    if (flagPole.isReached)
    {
        rect(flagPole.x_pos, floorPos_y - 250, 50, 50);

    }
    else
    {
        rect(flagPole.x_pos, floorPos_y - 50, 50, 50);
    }
    
    
    pop();
}
   
// Function to check if we reached the flagpole

function checkFlagPole()
{
    var d = abs(gameChar_world_x - flagPole.x_pos);
    if (d < 15 )
    {
        flagPole.isReached = true;
    }
    if (flagPole.isReached)
    {
        finishLine.play();
    }
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if (gameChar_world_x < (t_canyon.width + t_canyon.x_pos) 
        && gameChar_world_x > t_canyon.x_pos 
        && isPlummeting == false 
        && gameChar_y == floorPos_y)
    {
        isPlummeting = true;
        
    }
    
}
// Function to check if the player died
function checkPlayerDie()
{
    if (gameChar_y > height + 50 && lives > 0)
    {
        lives -= 1;
        if (lives > 0)
        {
            startGame();
            deathSound.play();
        }
    }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.
function drawCollectable(t_collectable)
{
    for (var i = 0; i < collectable.length; i++)
    {
        fill(230, 204, 14);
        stroke(2);
        strokeWeight(2);
        ellipse(t_collectable.x_pos,
                t_collectable.y_pos,
                t_collectable.size * 20,
                t_collectable.size * 25);
        point(t_collectable.x_pos,
                t_collectable.y_pos);
        noStroke();
    }
}
// Function to check character has collected an item.
function checkCollectable(t_collectable)
{
    if (dist(gameChar_world_x, gameChar_y - 20, t_collectable.x_pos, t_collectable.y_pos) < 25)
    {
        t_collectable.isFound = true;
        game_score += 1;
        coinSound.play();
    }

}
// Factory of Platforms
function createPlatforms(x, y, length)
{
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function()
        {
            fill(112, 54, 18);
            rect(this.x, this.y, this.length, 20, 4);
            fill(166, 122, 25);
            rect(this.x, this.y, this.length, 8);
        },
        checkContact: function(gc_x, gc_y)
        {
            if(gc_x >= this.x && gc_x <= this.x + this.length)
            {
                var d = this.y - gc_y;
                
                if (d >= 0 && d < 1)
                {
                    return true;
                }
            }
            return false;
        }
    }
    return p;
}
function backgroundMusic()
{
    if (!bMusic.isPlaying())
    {
        bMusic.play();
    }
}