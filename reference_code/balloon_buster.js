//const { Score } = require("../../../Users/hakob/.vscode/extensions/samplavigne.p5-vscode-1.2.3/p5types");

var  blue_balloon, red_balloon, pink_balloon, green_balloon
var blue_balloon_image, pink_balloon_image, red_balloon_image, green_balloon_image
var background, background_image, bow, bow_image, arrow, arrow_image
var Score = 0;
var balloon_group, arrow_group;
var last_arrow_time = 0;

function preload(){
    //load your images here 
    blue_balloon_image = loadImage("images/blue_balloon0.png");
    red_balloon_image = loadImage("images/red_balloon0.png");
    pink_balloon_image = loadImage("images/pink_balloon0.png");
    green_balloon_image = loadImage("images/green_balloon0.png");
    bow_image = loadImage("images/bow0.png");
    arrow_image = loadImage("images/arrow0.png");
    background_image = loadImage("images/background0_long.png");
  
}


function resize_balloon_images() {
    blue_balloon_image.resize(50, 0);
    red_balloon_image.resize(50, 0);
    green_balloon_image.resize(50, 0);
    pink_balloon_image.resize(50, 0);
    
}

function draw_rand_balloon() {
    var rand_y = Math.round(random(1, 500));
    
    ballon_details = get_rand_balloon_image();
    balloon_image = ballon_details[0];
    balloon_score = ballon_details[1];
    rand_balloon = createSprite(-20, rand_y, 10, 10);
    rand_balloon.addImage("Blue balloon", balloon_image);
    rand_balloon.score = balloon_score;
    rand_balloon.velocityX = 3;
    balloon_group.add(rand_balloon);
    rand_balloon.life = 330;
    rand_balloon.setCollider("rectangle", 3 , -15 , 40, 75)

}

function get_rand_balloon_image() {
    var dict = {
        1: [blue_balloon_image, 1],
        2: [red_balloon_image, 0.5],
        3: [pink_balloon_image, -1],
        4: [green_balloon_image, 2],
      }
    var rand = Math.round(random(1, 4));

    return dict[rand];
}


function setup() {
    createCanvas(600, 600);
    swoosh = loadSound('Arrow+Swoosh+1.mp3');
    balloon_group = createGroup();
    arrow_group = createGroup();
    resize_balloon_images();
    backround = createSprite(800, 300, 600, 600);
    backround.addImage("background", background_image);
    backround.scale = 1.5;
    backround.velocityX = -5;
    bow = createSprite(550, 320, 4, 6);
    bow.addImage("bow", bow_image);
    textSize(20);
}

  
function create_arrow() {
    arrow = createSprite(510, 100, 5, 10);
    arrow.velocityX = -6;       
    arrow.scale = 0.3;
    arrow.life = 95; 
    arrow_group.add(arrow);  
    swoosh.play(); 
    arrow.setCollider("rectangle", 20, -10, 300, 35)
  return arrow;
     // arrow.addImage("arrow", arrow_image);
    
 }

 function balloon_hit(arrow, balloon) {
     balloon.remove();
     arrow.remove();
     Score += balloon.score ;
 }

function draw() {
    background("white");
    bow.y = World.mouseY;
    if (frameCount % 80 === 0) {
        draw_rand_balloon()
    
    }
    //add code here
    if (backround.x < -200)
    {                       
          backround.x = 385; 
        }
    if (keyDown("space") 
        && millis() - last_arrow_time > 1000 
        && arrow_group.length < 6) {
        
        last_arrow_time = millis();
        var temp_arrow = create_arrow();
        temp_arrow.addImage(arrow_image);
        temp_arrow.y = bow.y; 
}
    drawSprites();
    text("score : "+ Score, 270, 30);

    if (arrow_group.isTouching(balloon_group, balloon_hit)) {
        
    }
}
