var sprite_sheet;
var an, an_flip;
var rects = [];
var xxc = 330;

var anim_x = 0, anim_y = 0;


var mario_walking = [[12, 410, 23, 40], 
                     [35, 410, 23, 40],
                    [58, 410, 28, 40],
                    [88, 410, 28, 40],
                   
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

var mario_jump = [
  [13, 460, 23, 40],
  [39, 460, 25, 40],
  [68, 460, 25, 40],
  [93, 460, 25, 40],
  [118, 460, 25, 40],
  [143, 460, 25, 40],
  [168, 460, 25, 40],
  [193, 460, 25, 40]
];

var mario_fall_stand = [
  [10, 265, 23, 40],
  [35, 265, 23, 40],
  [60, 265, 30, 40],
  [90, 265, 33, 40],
  [130, 265, 35, 40],
  [172, 265, 35, 40],
  [212, 265, 35, 40],
  [253, 265, 35, 40],
  [295, 265, 37, 40],
  [360, 265, 35, 40],
  [395, 265, 25, 40],
  [420, 265, 25, 40],
  [445, 265, 23, 40],
  [468, 265, 23, 40],

];



function preload() {
  sprite_sheet = loadImage("images/01.png");

}




  function setup() {
    enhance_sprite();
    createCanvas(2700, 3500);
    // saveJSON(mario_fall_stand, 'saved_json.json');
    an = get_animation(mario_walking);
    // an_flip = flip_animation(an);
    
    
    an.play();
    an.frameDelay = 4;
    // an_flip.frameDelay = 4;
    setTimeout(incr_xxc, 20);
    // get_animation();
    window.scroll(165, 2285);
    
  }
  
function incr_xxc(){
  // console.log('incr_xxc');
  // xxc += 1;
  // setTimeout(incr_xxc, 20);
}

function draw_rects(){
  for (rct of rects){
    noFill();
    strokeWeight(1);
    stroke(255);
    rect(rct[0], rct[1], rct[2], rct[3]);
    
  }
}

function flip_animation(ann){
  var imgs = [];

  for (img of ann.images){
    img = flip_image(img);
    imgs.push(img);
  }
  var flipped_ann = new Animation();
  flipped_ann.images = imgs;
  return flipped_ann;

}

function get_animation(anim_rects){
  var animation_n = [];
  for (rct of anim_rects){
    

    var img = sprite_sheet.get(rct[0], rct[1], rct[2], rct[3]);
    if (rct[4] == 'flip'){var img = flip_image(img);}
    rects.push([rct[0], rct[1], rct[2], rct[3]]);
    animation_n.push(img);
  }
    var ann = new Animation();
    ann.images = animation_n;
    return ann
}

function mouseClicked() {
  console.log(mouseX, mouseY);
  anim_x = mouseX;
  anim_y = mouseY;
  console.log('scroll.X: ' + window.scrollX);
  console.log('scroll.Y: ' + window.scrollY);
  
}

  function draw() {
    background(0);
    image(sprite_sheet, 0, 0);
    animation(an, anim_x, anim_y);
    // animation(an_flip, xxc + 35, 40);
    
    draw_rects();
    // camera(0, 0, 0);
  // drawSprites();
  
  }

function flip_image(img){
  var flipped_img = new p5.Image(img.width, img.height); 
  var lngt = flipped_img.width;
  img.loadPixels();
  flipped_img.loadPixels();
  

  for (row = 0; row < img.height; row++){
    for (clm = 0; clm < img.width; clm++){

    pxl = img.get(clm, row);
    flipped_img.set(lngt - clm, row, pxl) ;
    // flipped_img.set(clm, row, pxl) ;
  }
}


  flipped_img.updatePixels();
  img.updatePixels();
  return flipped_img;
}


function get_pxl(img, x, y) {
  let index = (x + y * width) * 4;
  red = img.pixels[index];
  green = img.pixels[index + 1];
  blue = img.pixels[index + 2];
  alpha = img.pixels[index + 3];

  return [red, green, blue, alpha];

  
}

function set_pxl(img, x, y, pxl) {
  let index = (x + y * width) * 4;
  img.pixels[index] = pxl[0];
  img.pixels[index + 1] = pxl[1];
  img.pixels[index + 2] = pxl[2];
  img.pixels[index + 3] = pxl[3];

}