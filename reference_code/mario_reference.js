var mario;
var ground_group;

var last_element;
var clean_up_group;
var gl_debug = false;

var ground_block_1_image, pipe_image, pipe_neck_image, pipe_top_image;
var w_tree_1_image;

var sticking_x_pos = 250;

var mario_walking = [[12, 410, 23, 40],
[35, 410, 23, 40],
[58, 410, 28, 40],
[88, 410, 28, 40],

];

var jump_new = [
    [370, 2380, 25, 35, 'flip'],
    [370, 2380, 25, 35, 'flip'],
    [370, 2380, 25, 35, 'flip'],
    [370, 2380, 25, 35, 'flip'],
    [370, 2380, 25, 35, 'flip'],
    [280, 2380, 25, 35],
    [280, 2380, 25, 35],
    [280, 2380, 25, 35],
    [280, 2380, 25, 35],
    [280, 2380, 25, 35]
];

var mario_jump_2 = [
    [212, 2389, 23, 31],
    [235, 2383, 23, 34],
    [258, 2383, 23, 34],
    [281, 2380, 23, 34],
    [304, 2378, 23, 34],
    [327, 2378, 23, 34],
    [350, 2380, 23, 36],
    [373, 2381, 23, 36],
    [396, 2384, 23, 34],
    [419, 2388, 23, 32],
    [442, 2388, 23, 32],
];


function preload() {
    sprite_sheet = loadImage("images/01.png");
    ground_block_1_image = loadImage("images/ground_block_1.png");
    pipe_top_image = loadImage("images/pipe_top.png");
    pipe_neck_image = loadImage("images/pipe_neck.png");
    w_tree_1_image = loadImage("images/w_tree_1.png");
}

function add_w_tree_1(){
    if (last_element.ttype == 'block'){
        var w_tree_tmp = createSprite(0, 0, 0, 0);
        w_tree_tmp.addImage('weird tree', w_tree_1_image);
        w_tree_tmp.scale = 3;
        w_tree_tmp.bottom = last_element.top;
        w_tree_tmp.x = last_element.x;
        w_tree_tmp.velocityX = -7;
        w_tree_tmp.friction = 0;
        clean_up_group.add(w_tree_tmp);
        w_tree_tmp.debug = gl_debug;
        w_tree_tmp.depth = 0;
}
}
function add_pipe(){
    var pipe_neck = createSprite(0, 0, 0, 0);
    pipe_neck.addImage('pipe neck', pipe_neck_image);
    pipe_neck.scale = 3;
    pipe_neck.bottom = 400;
    pipe_neck.left = last_element.right;
    pipe_neck.velocityX = -7;
    pipe_neck.friction = 0;
    pipe_neck.immovable = true;
    ground_group.add(pipe_neck);
    clean_up_group.add(pipe_neck);
    last_element = pipe_neck;

    pipe_neck.ttype = 'pipe';
    pipe_neck.debug = gl_debug;

    var pipe_top = createSprite(0, 0, 0, 0);
    pipe_top.addImage('pipe top', pipe_top_image);
    pipe_top.scale = 3;
    pipe_top.bottom = pipe_neck.top;
    pipe_top.x = pipe_neck.x;
    pipe_top.velocityX = -7;
    pipe_top.friction = 0;
    pipe_top.immovable = true;
    ground_group.add(pipe_top);
    clean_up_group.add(pipe_top);
    pipe_top.debug = gl_debug;





    setTimeout(add_pipe, 5000);

}

function init_text(){
    textSize(25);      
    fill(0, 0, 0);

}

function get_ground_block(){
    var ground_block = createSprite(0, 0, 0, 0);
    ground_block.addImage('block', ground_block_1_image);
    ground_block.scale = 3;
    ground_block.bottom = 400;
    ground_block.left = 0;
    ground_block.friction = 0;
    ground_block.immovable = true;
    ground_block.ttype = 'block';
    ground_group.add(ground_block);
    clean_up_group.add(ground_block);
    return ground_block;
}

function init_ground(){
    var left = 0;
    for (i=0; i<15; i++){
        var block = get_ground_block();
        block.left = left;
        last_element = block;
        block.velocityX = -7;
        left += block.getScaledWidth();
    }
}

function add_block(){
    
    
    var block = get_ground_block();
    

    block.left = last_element.right;
    
    if (Math.round(random(1, 15)) == 5){
        block.left += Math.round(random(1, 5)) * block.getScaledWidth();
    }
    
    last_element = block;
    block.velocityX = -7;
    
    if (frameCount % 30 === 0) {add_w_tree_1()}

}

function init_mario(){
    mario = createSprite(0, 0, 0, 0);

    an_walk = get_animation(mario_walking);
    an_jump = get_animation(jump_new);
    // an_jump = flip_animation(an_jump);

    mario.addAnimation('walk', an_walk);
    mario.addAnimation('jump', an_jump);
    mario.scale = 2;
    mario.x = sticking_x_pos;
    mario.y = 200;
    mario.setCollider("rectangle", 0, 0, 14, 33);
    mario.friction = 0;
    // mario.velocityX = 2.5;
    mario.debug = gl_debug;

    mario.is_jumping = false;

}

function clean_up() {
    console.log('cleaning_up')
    for (spr of clean_up_group) {
        if (spr.right < 0) { spr.remove(); }
    }
    setTimeout(clean_up, 5000);
}

function setup() {
    enhance_sprite();
    createCanvas(700, 400);
    init_text();
    ground_group = createGroup();
    clean_up_group = createGroup();
    
    init_ground();
    init_mario();
    // an_flip = flip_animation(an);
    setTimeout(clean_up, 5000);
    setTimeout(add_pipe, 5000);


    

}


function draw(){
    background(0, 191, 255);
    drawSprites();

    if (mario.x < sticking_x_pos){
        mario.velocityX += 0.2;
    }
    else if (mario.x > sticking_x_pos){
        mario.velocityX = 0
    }

    if (mario.is_jumping && mario.isTouching(ground_group)) {
        mario.is_jumping = false;
        mario.animation.stop();
        mario.animation.rewind();
        mario.changeAnimation('walk');

    }

    mario.velocityY += 0.8;
    mario.collide(ground_group);

    if (last_element.right < 705){add_block();}
    text("most_right: " + last_element.right, 230, 50);
    text("mario.bottom: " + mario.bottom, 230, 75);
    text("mario.ground_group: " + mario.isTouching(ground_group), 230, 100);
    text("allSprites: " + allSprites.length, 230, 125);

    if (keyDown("space") && mario.is_jumping == false) {
        mario.changeAnimation('jump');
        mario.animation.play();
        mario.setCollider("rectangle", 0, 0, 14, 33);

        mario.velocityY = -12;
        mario.is_jumping = true;
    }

    

}


function get_animation(anim_rects) {
    var animation_n = [];
    for (rct of anim_rects) {


        var img = sprite_sheet.get(rct[0], rct[1], rct[2], rct[3]);
        if (rct[4] == 'flip') { var img = flip_image(img); }
        animation_n.push(img);
    }
    var ann = new Animation();
    ann.images = animation_n;
    return ann
}

function flip_image(img) {
    var flipped_img = new p5.Image(img.width, img.height);
    var lngt = flipped_img.width;
    img.loadPixels();
    flipped_img.loadPixels();


    for (row = 0; row < img.height; row++) {
        for (clm = 0; clm < img.width; clm++) {

            pxl = img.get(clm, row);
            flipped_img.set(lngt - clm, row, pxl);
            // flipped_img.set(clm, row, pxl) ;
        }
    }


    flipped_img.updatePixels();
    img.updatePixels();
    return flipped_img;
}

function flip_animation(ann) {
    var imgs = [];

    for (img of ann.images) {
        img = flip_image(img);
        imgs.push(img);
    }
    var flipped_ann = new Animation();
    flipped_ann.images = imgs;
    return flipped_ann;

}