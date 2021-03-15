var btn_size = 120;
var action_bars = [];
var im = {tmp: {}};
var mgr;
var frame_width = 15;

class EventListenerManager{
    constructor(name){
        this.listeners = [];
        this.drag_data = {
            drag_started: false,
            drag_start_pos: {x: null, y: null},
        }
        this.name = name;
        this.mouse_x = 0;
        this.mouse_y = 0;

        this.was_mouse_down = false;
        this.last_mouse_down_event = null;

        this.was_mouse_up = false;
        this.last_mouse_up_event = null;
               
        document.addEventListener('mousedown', (evt) => {this.mouse_down(evt)});
        document.addEventListener('mouseup', (evt) => {this.mouse_up(evt)});
        document.addEventListener('mousemove', (evt) => {this.mouse_move(evt)});
    }

    get_selection_corners(){
        if (!this.drag_data.drag_started){
            return false;
        }

            var ds_x = this.drag_data.drag_start_pos.x;
            var ds_y = this.drag_data.drag_start_pos.y;

            var low_x = Math.min(ds_x, this.mouse_x);
            var high_x = Math.max(ds_x, this.mouse_x);

            var low_y = Math.min(ds_y, this.mouse_y);
            var high_y = Math.max(ds_y, this.mouse_y);

            return {low_x, high_x, low_y, high_y};

        }


    has_dragged(){
        if (!this.drag_data.drag_started){
            return false;
        }

        var ds_x = this.drag_data.drag_start_pos.x;
        var ds_y = this.drag_data.drag_start_pos.y;
        if (dist(this.mouse_x, this.mouse_y, ds_x, ds_y) > 5){
            return true;
        }else{
            return false;
        }

    }


    draw_selection_rectangle(){
        if (this.drag_data.drag_started){
            var ds_x = this.drag_data.drag_start_pos.x;
            var ds_y = this.drag_data.drag_start_pos.y;

            push();
            
            rectMode(CORNERS);
            stroke(200, 200, 200);
            fill(100, 200, 125, 100);
            strokeWeight(1);
            rect(ds_x, ds_y, this.mouse_x, this.mouse_y);
            pop();

        }
    }

    mouse_down(evt){
        this.drag_data.drag_started = true;
        this.drag_data.drag_start_pos.x = this.mouse_x;
        this.drag_data.drag_start_pos.y = this.mouse_y;
        this.was_mouse_down = true;
        this.last_mouse_down_event = evt;
        
    }
    
    mouse_up(evt){
        this.drag_data.drag_started = false;
        this.was_mouse_up = true;
        this.last_mouse_up_event = evt;
    }


    mouse_move(evt){
        this.mouse_x = evt.clientX;
        this.mouse_y = evt.clientY;
    }

    update(){
        for (const listener of this.listeners){
            listener.check_if_in_selection();
            listener.check_if_under_mouse();
            listener.check_mouse_down();
            listener.check_mouse_up();
            listener.display();
            
        }
        
        this.was_mouse_down = false;
        this.last_mouse_down_event = null;

        this.was_mouse_up = false;
        this.last_mouse_up_event = null;
        this.draw_selection_rectangle();

    }

}

mgr = new EventListenerManager('mgr');



class RectEventListener{
    constructor(x, y, width, height){
        this.manager = mgr;
        this.manager.listeners.push(this);

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this._is_in_selection_area = false;
        this._is_mouseover = false;
        
        this.is_in_selection_area = false;
        this.is_mouseover = false;

        this._was_mouse_down = false;
    }

    check_if_under_pos(x, y){
        var mX = x;
        var mY = y;
        var low_x = this.x;
        var high_x = this.x + this.width;
        var low_y = this.y;
        var high_y = this.y + this.height;

        var is_over = (mX > low_x && mX < high_x && mY > low_y && mY < high_y);

        return is_over

    }

    check_if_under_mouse(){
        var mX = this.manager.mouse_x;
        var mY = this.manager.mouse_y;
        var under_mouse = this.check_if_under_pos(mX, mY);


        this.is_mouseover = under_mouse;
        if (!this._is_mouseover && under_mouse){
            this._is_mouseover = true;
            this.on_hover_begin();
        }
        else if (this._is_mouseover && !under_mouse){
            this._is_mouseover = false;
            this.on_hover_end();
        }
    }

    check_if_in_selection(){
        if (!this.manager.has_dragged()){
            this.is_in_selection_area = false;
            this._is_in_selection_area = false;
            return}

        var corners = this.manager.get_selection_corners();
        var low_x = this.x;
        var high_x = this.x + this.width;
        var low_y = this.y;
        var high_y = this.y + this.height;

        var in_selection = (
            corners.low_x < low_x + 5 &&
            corners.high_x > high_x - 5 &&
            corners.low_y < low_y + 5 &&
            corners.high_y > high_y - 5
            )

        this.is_in_selection_area = in_selection;
        if (!this._is_in_selection_area && in_selection){
            this._is_in_selection_area = true;
            this.on_got_in_selection_area();
        }
        else if (this._is_in_selection_area && !in_selection){
            this._is_in_selection_area = false;
            this.on_got_out_selection_area();
        }

    }

    check_mouse_down(){
        if (this.manager.was_mouse_down){
            let mX = this.manager.last_mouse_down_event.x;
            let mY = this.manager.last_mouse_down_event.y;
            
            var mouse_was_down = this.check_if_under_pos(mX, mY);

            if (mouse_was_down){
                this._was_mouse_down = true;
                this.on_mouse_down(this.manager.last_mouse_down_event);
            }else{
                this.on_mouse_down_outside(this.manager.last_mouse_down_event);
            }
        }
    }

    check_mouse_up(){
        if (this.manager.was_mouse_up){
            let mX = this.manager.last_mouse_up_event.x;
            let mY = this.manager.last_mouse_up_event.y;
            
            var mouse_was_up = this.check_if_under_pos(mX, mY);

            if (mouse_was_up){
                if (this._was_mouse_down){
                    this.on_click()
                    console.log("clicked");               
                }
                this.on_mouse_up(this.manager.last_mouse_up_event);
            }else{
                this.on_mouse_up_outside(this.manager.last_mouse_up_event);
            }
            this._was_mouse_down = false;
        }
    }
    on_hover_begin(){}
    on_hover_end(){}
    on_got_in_selection_area(){}
    on_got_out_selection_area(){}
    on_mouse_down(){}
    on_mouse_up(){}
    on_mouse_down_outside(){}
    on_mouse_up_outside(){}
    on_click() {}
}

function display_action_bars(){
    for (const action_bar of action_bars){
        action_bar.display();
    }
}

function load_action_images(){
    im.tmp.act = loadImage('images/action_bar/act.png');
    im.tmp.attack = loadImage('images/action_bar/attack.png');
    im.tmp.item = loadImage('images/action_bar/item.png');
    im.tmp.spare = loadImage('images/action_bar/spare.png');
    im.tmp.super = loadImage('images/action_bar/super.png');
}

function process_images(){
    for (const [img_name, img] of Object.entries(im.tmp)) {
        img.resize(btn_size, 0);
        im[img_name] = {
            normal: create_hl(img, color(255, 149, 0)),
            hl: create_hl(img, color(255, 251, 0))
        };
    }
}

function create_hl(img, cl_col){
    var new_gp = createGraphics(img.width, img.height);
    for (i = 0; i < img.width; i++){
        for (j = 0; j < img.height; j++){
            var cl = color(img.get(i, j));
            if (cl.toString() != 'rgba(0,0,0,0)'){
                cl = cl_col;
            }else{
                cl = color(0);
            }
            new_gp.set(i, j, cl);
        }
    }
    new_gp.updatePixels();
    return new_gp;

}

class ActionBarButton extends RectEventListener{
    constructor(x, y, img_name){
        let img = im[img_name].normal
        let width = img.width;
        let height = img.height;
        
        super(x, y, width, height);
        this.action = img_name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = {
            normal: im[img_name].normal,
            hl: im[img_name].hl,
            crnt: im[img_name].normal
            }
        
        }

    on_click(){
        this.parent._on_action_selected(this.action);
    }

    on_hover_begin(){
        this.img.crnt = this.img.hl;
    }

    on_hover_end(){
        this.img.crnt = this.img.normal;
    }

    display(){
        image(this.img.crnt, this.x, this.y);
    }



    }



class ActionBar{
    constructor(x, y, buttons_s, on_action_selected){
        this.on_action_selected = on_action_selected;
        this.buttons_s = buttons_s;
        this.x = x;
        this.y = y;
        this.bw = frame_width;
        this.height = btn_size + this.bw + 4;
        this.width = this.buttons_s.length * btn_size + this.bw + 4;
        this.bcol = color(240);
        this.buttons = [];
        action_bars.push(this);
        this.init_buttons();

        


    }

    init_buttons(){
        var x = this.x + 2;
        var y = this.y + this.bw + 2;
        for (const btn of this.buttons_s){
            var new_btn = new ActionBarButton(x, y, btn);
            new_btn.parent = this;
            this.buttons.push(new_btn);
            x += btn_size + 2;
        }

    }


    _on_action_selected(action){
        this.on_action_selected(action);
    }

    display(){
        var bw = this.bw;
        var cl = this.bcol;
        push();
        translate(this.x, this.y);
        stroke(cl);
        fill(cl);
        strokeWeight(1);
        rect(0, 0, this.width, bw);
        rect(0, this.height, this.width, bw);
        rect(0 - bw, bw, bw, this.height - bw);
        rect(this.width, bw, bw, this.height - bw);

        pop();
    }
}