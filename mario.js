class Mario {
    constructor(name, x, y, hp, atk, level, actions) {
        this.x = x;
        this.y = y;
        this.hp = hp;
        this.atk = atk;
        this.actions = []
        this.name = name;
        this.level = level;
        this.img_path = "images/mario/mario.png";
    }
    
    display() {
        push();
        translate(this.x, this.y);
        imageMode(CENTER);
        this.image = loadImage(this.img_path);
        this.sprite = createSprite(180, 175, 0, 0);
        this.sprite.addImage(this.image);
        this.sprite.scale = 0.3;
        pop();
    }
}