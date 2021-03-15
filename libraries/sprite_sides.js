

function enhance_sprite() {
    spr = createSprite();
    obj = spr.constructor.prototype;
    spr.remove();

    var left = {
        get() {
            lft = this.x - this.getScaledWidth() / 2;
            return lft;
        },
        set(x) {
            x += this.getScaledWidth() / 2;
            this.x = x;
        }
    }


    var right = {
        get() {
            rt = this.x + this.getScaledWidth() / 2;
            return rt;
        },
        set(x) {
            x -= this.getScaledWidth() / 2;
            this.x = x;
        }
    }

    var top = {
        get() {
            tp = this.y - this.getScaledHeight() / 2;
            return tp;
        },
        set(y) {
            y += this.getScaledHeight() / 2;
            this.y = y;
        }
    }

    var bottom = {
        get() {
            btm = this.y + this.getScaledHeight() / 2;
            return btm;
        },
        set(y) {
            y -= this.getScaledHeight() / 2;
            this.y = y;
        }
    }


    set_prototype_2(obj, 'left', left);
    set_prototype_2(obj, 'right', right);
    set_prototype_2(obj, 'top', top);
    set_prototype_2(obj, 'bottom', bottom);
}



function set_prototype_2(obj, side, funcs) {
    Object.defineProperty(spr.constructor.prototype, side, funcs);
}
