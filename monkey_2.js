var monkey, monkey_running;
var banana, banana_image, obstacle, obstacle_image, ground_image;
var jungle_background_img;
var food_group, obstacle_group;
var ground;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var survival_time = 0;
var gl_debug = false;
var last_background, clean_up_group;
var is_jumping = false, score = 0;

function preload() {
  monkey_running = loadAnimation("images/monkey_0.png", "images/monkey_01.png",
                                 "images/monkey_02.png", "images/monkey_03.png",
                                 "images/monkey_04.png", "images/monkey_05.png",
                                 "images/monkey_06.png", "images/monkey_07.png",
                                 "images/monkey_08.png", "images/monkey_09.png");
  monkey_running.frameDelay = 1.5;
  banana_image = loadImage("images/banana.png");
  obstacle_image = loadImage("images/stone.png");
  //ground_image = loadImage("images/jungle_ground_3.png");
  jungle_background_img = loadImage("images/jungle3.jpg")
}

function add_background() {
  var jungle_background = createSprite(0, 0, 0, 0)
  jungle_background.addImage("jungle", jungle_background_img);
  jungle_background.depth = 0;
  jungle_background.top = 0;
  
  if (typeof last_background == 'undefined'){
    jungle_background.left = 0;
  }
  else{
    jungle_background.left = last_background.right;
  }
  

  // jungle_background.life = 230 ;
  jungle_background.velocityX = -7;
  clean_up_group.add(jungle_background);
  last_background = jungle_background;
}


  function setup() {
    enhance_sprite();
    createCanvas(700, 500);
    clean_up_group = createGroup();
    
    add_background();
    // add_background();

    ground = createSprite(0, 409, 700, 50);
    ground.top = 430;
    ground.left = 0;
    ground.depth = 0;
    ground.visible = false;
    // ground.addImage("ground", ground_image);                      
    // ground.scale = 3;
    // ground.setCollider("rectangle", 0, 3);
    obstacle_group = createGroup();
    food_group = createGroup();
    textSize(25);      
    fill(255, 255, 255);
    monkey = createSprite(0, 0, 0, 0);
    monkey.addAnimation("running", monkey_running);
    monkey.scale = 0.15;
    monkey.depth = 3;
    monkey.left = 120;
    // monkey.debug = gl_debug;
    monkey.setCollider('rectangle', 10, -40, 300, 650);
    console.log(ground.top);                                     //
    monkey.velocityY = 8;
    frameRate(30);
    setTimeout(spawn_obstacles, Math.round(random(2500, 4500)));
    setTimeout(spawn_banana, Math.round(random(2000, 3750)));
    setTimeout(clean_up, 5000);
  }
  
 
  function eat_banana(mnky, bnna){
    
    bnna.remove();
    score += 1;
    mnky.velocityX = 0;
    // mnky.left = 120;
    
  }

  function draw() {
    background(0);
    if (monkey.isTouching(obstacle_group)) {
      gameState = END;
    }

    if (monkey.isTouching(ground)) {
      is_jumping = false;
    }
    monkey.velocityY += 0.8;
    monkey.collide(ground);

    survival_time = Math.round(millis() / 1000)
    if (gameState === PLAY) {
      if (last_background.right < 710){
        add_background();

      }

      if (monkey.collide(food_group, eat_banana)) {
       


      }
      //ground.velocityX = -7;

      // if (keyDown("space") && monkey.isTouching(ground)) {
      if (keyDown("space") && ! is_jumping) {
      monkey.velocityY = -14; 
      is_jumping = true;
    }

      

      
  }

  else if (gameState === END) {
    var anim = monkey.animation;
    anim.stop();
    allSprites.setVelocityXEach(0);
    allSprites.setVelocityYEach(0);
    allSprites.setLifetimeEach(-1);
    
  }
  

  drawSprites();
  
    switch (score) {
      case 1:
        monkey.scale = 0.18;
        break;
      case 2:
        monkey.scale = 0.2;
        break;
      case 3:
        monkey.scale = 0.25;
        break;
      case 4:
        monkey.scale = 0.3;
        break;
      case 5:
        monkey.scale = 0.35;
        break;
    }
  
  text("Score: " + score, 230, 50);
  // text("All sprites count" + allSprites.length, 230, 75);
  // text("monkey.bottom " + monkey.bottom, 230, 100);
  
}

function clean_up(){
  console.log('cleaning_up')
  for (var spr of clean_up_group){
    if (spr.right < 0){spr.remove();}
  }
  setTimeout(clean_up, 5000);
}

function spawn_obstacles() {
    var obstacle = createSprite(0, 0, 0, 0);
    obstacle.addImage("obstacle", obstacle_image);
    obstacle.scale = 0.2;
    obstacle.left = 700;
    obstacle.bottom = ground.top + 17;
    obstacle.depth = 5;
    obstacle.debug = gl_debug;
    obstacle.velocityX = -7;
    obstacle.setCollider('circle', -20, 30, 170);
    obstacle_group.add(obstacle);
    clean_up_group.add(obstacle);
    // obstacle.life = 120;
    
    if (gameState === PLAY) {
      setTimeout(spawn_obstacles, Math.round(random(1500, 4500)));
    }
  }

  function spawn_banana() {
    var rand_y = Math.round(random(300, 380));
    var banana = createSprite(0, rand_y, 0, 0);
    banana.addImage("banana", banana_image);
    banana.scale = 0.135;
    banana.left = 700;
    banana.depth = 2;
    banana.velocityX = -7;
    banana.setCollider('circle', -20, 30, 200);
    food_group.add(banana); 
    clean_up_group.add(banana);
    // banana.life = 120;
    if (gameState === PLAY) {
      setTimeout(spawn_banana, Math.round(random(1500, 4500)));
    }

  }
