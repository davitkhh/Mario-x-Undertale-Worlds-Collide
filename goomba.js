class GoombaBase {
    constructor(gmbx, gmby, hp, atk) {
        this.type = 'base'
        this.x = gmbx;
        this.y = gmby;
        this.hp = hp;
        this.atk = atk;
        this.image = null;
        this.img_path = null;
        this.sprite = null;
    }

    display() {
        push();
        translate(this.x, this.y);
        imageMode(CENTER);
        pop();
    }

    init_sprite() {
        this.image = loadImage(this.img_path);
        this.sprite = createSprite(0, 0, 0, 0);
        this.sprite.addImage('norm', this.image);
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.scale = 0.2;
    }
}


class Goomba extends GoombaBase {
    constructor(name, gmbx, gmby, hp, atk) {
        super(gmbx, gmby, hp, atk);
        this.type = 'normal'
        this.name = name;
        this.img_path = 'images/goomba/goomba.png'
        this.init_sprite();
      
    }
}

class RoboGoomba extends GoombaBase {
    constructor(name, gmbx, gmby, hp, atk) {
        super(gmbx, gmby, hp, atk);
        this.type = 'robo';
        this.name = name;
        this.img_path = 'images/goomba/robo_goomba.png'
        this.init_sprite();

    }
}