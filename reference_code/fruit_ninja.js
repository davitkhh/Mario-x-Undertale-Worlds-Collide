var swoosh, peach_image, apple_image, pear_image, banana_image;
var microbe1_image, microbe2_image, game_over_image, sword_image;
var sword, fruit_group, microbe_group;
var microbe_frequency = 200;
var vlc = 4; 
var double_microbe_prob = 10;
var score = 0;
var PLAY = 1;
var END = 0;
var gamestate = PLAY;
var gl_debug = false;

function preload() {
    //load your images here 
    peach_image = loadImage("/images/fruit1.png");
    apple_image = loadImage("/images/fruit2.png");
    pear_image = loadImage("/images/fruit3.png");
    banana_image = loadImage("/images/fruit4.png");
    microbe1_image = loadImage("/images/alien1.png");
    microbe2_image = loadImage("/images/alien2.png");
    game_over_image = loadImage("/images/gameover.png");
    sword_image = loadImage("/images/sword.png");
    swoosh_sound = loadSound("/sounds/knifeSwooshSound.mp3");
    game_over_sound = loadSound("/sounds/gameover.mp3");
}

function setup() {
    createCanvas(400, 400);
    sword = createSprite(200, 200, 5, 10);
    sword.addImage("sword", sword_image);
    sword.addImage("Game over", game_over_image);

    sword.scale = 0.5;
    fruit_group = createGroup();
    microbe_group = createGroup();
    textSize(25);
    fill(255, 204, 0);
    microbe_animation = loadAnimation("/images/alien1.png", "/images/alien2.png");
    
}

function spawn_microbe() {
    var rand_y = Math.round(random(1, 400));
    [rand_x, vlc_loc] = get_rand_x();
    microbe = createSprite(rand_x, rand_y, 10, 10);
    // microbe = createSprite(400, 200, 10, 10);
    
    microbe.addAnimation('microbe', microbe_animation);
    microbe.velocityX = vlc_loc;
    microbe_group.add(microbe);
    microbe.setCollider("circle")
    microbe.debug = gl_debug;
    rnd = Math.round(random(0, double_microbe_prob));
    if (rnd == 1){
        spawn_microbe();
    }

}

function draw() {
    background(80, 160, 160);
    
    if (gamestate == PLAY){
        sword.y = World.mouseY;
        sword.x = World.mouseX;
        
        if (frameCount % 80 === 0) {draw_rand_fruit()}
        if (frameCount % microbe_frequency === 0) {spawn_microbe()}

        text("score: " + score, 150, 30);
        if (sword.isTouching(fruit_group, fruit_hit)) {
        }

        if (sword.isTouching(microbe_group, microbe_hit)) {
        }

    }

    if (gamestate == END){
        text("score: " + score, 150, 30);

    }
drawSprites();

}

function get_rand_x() {
    var dict = {
        1: [-10, vlc],
        2: [410, -1 * vlc],
    }
    var rand = Math.round(random(1, 2));
    return dict[rand];
}

function draw_rand_fruit() {
    var rand_y = Math.round(random(1, 400));
    var rand_x, vlc_loc; 
    [rand_x, vlc_loc] = get_rand_x();
    fruit_details = get_rand_fruit_image();
    fruit_image = fruit_details[0];
    fruit_score = fruit_details[1];
    rand_fruit = createSprite(rand_x, rand_y, 10, 10);
    rand_fruit.addImage("fruit", fruit_image);
    rand_fruit.score = fruit_score;
    rand_fruit.velocityX = vlc_loc;
    fruit_group.add(rand_fruit);
    rand_fruit.life = 430;
    rand_fruit.setCollider("circle")
    rand_fruit.scale = 0.25
    
    rand_fruit.debug = gl_debug;
}

function fruit_hit(sword, fruit) {
    fruit.remove();
    score += fruit.score;
    swoosh_sound.play()
    if (score > 3 && score < 10) {
        vlc = 6;
        double_microbe_prob = 8;
    }
    else if (score > 9 && score < 20) {
        vlc = 8;
        double_microbe_prob = 6;
    }
    else if (score > 19) {
        vlc = score / 2.5;
        double_microbe_prob = 3;
    }
    
    if (score > 11) {
        microbe_frequency = 170;
    }
    
  
}

function microbe_hit(sword, microbe) {
    sword.changeImage("Game over");
    sword.scale = 1;
    sword.depth = 50;
    sword.x = 200;
    sword.y = 200;
    game_over_sound.play();
    gamestate = END;
    allSprites.setVelocityEach(0, 0);

}

function get_rand_fruit_image() {
    var dict = {
        1: [apple_image, 1],
        2: [pear_image, 0.5],
        3: [peach_image, 1],
        4: [banana_image, 2]
    }
    var rand = Math.round(random(1, 4));

    return dict[rand];
}