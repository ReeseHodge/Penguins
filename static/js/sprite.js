//Parent Sprit Class
var key_input;
class Sprite {
    constructor(sprite_json, x, y, start_state){
        this.sprite_json = sprite_json;
        this.x = x;
        this.y = y;
        this.state = start_state;
        this.root_e = "TenderBud";
        this.cur_frame = 0;
        this.idle_s=false;
        this.cur_bk_data = null;
        this.ctx= canvas.getContext('2d');
        this.x_v = 0;
        this.y_v = 0;
        this.side = "";
        this.bound_hit=false;
        this.west = 0; 
        this.north = 0;
        this.east = canvas.width;
        this.south = canvas.height;
        this.idle_state = "idle";
    }
    defineBounds(){
        var max_w=0;
        var max_h=0;
        var states=["idleWave","walk_W","walk_E","idleFall","idleLookLeft","idleLookUp","idleLayDown","walk_NE","walk_NW","idleSpin","idleBreathing","idleBackAndForth","walk_SE","walk_SW","walk_S","idleLookDown","idleLookAround","walk_N","idleSit","idleLookRight","idle"]
        for (var item=0; item<states.length;item++){
            for(var i=0;i<this.sprite_json[this.root_e][states[item]].length;i++){
                if (this.sprite_json[this.root_e][states[item]][i]["w"]>max_w){
                    max_w=this.sprite_json[this.root_e][states[item]][i]["w"];
                }
                if (this.sprite_json[this.root_e][states[item]][i]["h"]>max_h){
                    max_h=this.sprite_json[this.root_e][states[item]][i]["h"];
                }
            }
        }
        var maximums=[max_h,max_w]
        return maximums
    }
    draw(value){
        this.updateAnimationState(value["keyStates"]);
        if (this.cur_frame<this.sprite_json[this.root_e][this.state].length){
            console.log("State:"+this.state+"\nCurrent Frame:"+this.cur_frame+"\nImage Width:"+this.sprite_json[this.root_e][this.state][this.cur_frame]['w']+"\nImage Height:"+this.sprite_json[this.root_e][this.state][this.cur_frame]['h']+"\nPos:("+this.x+","+this.y+")\nVelocity("+this.x_v+','+this.y_v+")")
            if(this.sprite_json[this.root_e][this.state][this.cur_frame]['img'] == null){
                this.sprite_json[this.root_e][this.state][this.cur_frame]['img'] = new Image();
                this.sprite_json[this.root_e][this.state][this.cur_frame]['img'].src = '/static/Penguins/' + this.root_e + '/' + this.state + '/' + this.cur_frame + '.png';
            }
            if (this.west<=this.x<=this.east-180 && this.north<=this.y<=this.south-145){
                if( this.cur_bk_data != null){
                    this.ctx.putImageData(this.cur_bk_data, (this.x-this.x_v) , (this.y-this.y_v));
                }
            
                this.cur_bk_data = this.ctx.getImageData(this.x, this.y, 
                    this.sprite_json[this.root_e][this.state][this.cur_frame]['w']+3, 
                    this.sprite_json[this.root_e][this.state][this.cur_frame]['h']+4);
            
                this.ctx.drawImage(this.sprite_json[this.root_e][this.state][this.cur_frame]['img'], (this.x), (this.y) );
            }   
            var maximums=this.defineBounds();
            var max_h=maximums[0];
            var max_w=maximums[1];
            console.log(max_h);
            console.log(max_w);
            if(this.x >= this.east-max_w){
                this.bound_hit=true;
                this.side="east";
                if (this.x_v<0){
                    this.x = this.x + this.x_v;
                    this.y = this.y + this.y_v;
                }
            }else if(this.x <= this.west){
                this.bound_hit=true;
                this.side="west";
                if (this.x_v>0){
                    this.x = this.x + this.x_v;
                    this.y = this.y + this.y_v;
                }
            }else if(this.y >= this.south-max_h){
                this.bound_hit=true;
                this.side="south";
                if (this.y_v<0){
                    this.x = this.x + this.x_v;
                    this.y = this.y + this.y_v;
                }
            }else if(this.y <= this.north){
                this.bound_hit=true;
                this.side="north";
                if (this.y_v>0){
                    this.x = this.x + this.x_v;
                    this.y = this.y + this.y_v;
                }
            }else{
                this.x = this.x + this.x_v;
                this.y = this.y + this.y_v;
            }
            console.log(this.x+"/"+canvas.width)
            console.log(this.bound_hit)
            this.cur_frame+=1;
        }else{
            this.cur_frame=0;
        }
        return false;
    }
    set_idle_state(){
        this.state = this.idle_state;
    }
    
    updateAnimationState(keyState) {
        if (keyState['KeyW'] && keyState['KeyA']) {
            this.x_v=-3;
            this.y_v=-4;
            this.state = 'walk_NW';
        } else if (keyState['KeyW'] && keyState['KeyD']) {
            this.state = 'walk_NE';
            this.x_v=3;
            this.y_v=-4;
        } else if (keyState['KeyS'] && keyState['KeyA']) {
            this.state = 'walk_SW';
            this.x_v=-3;
            this.y_v=4;
        } else if (keyState['KeyS'] && keyState['KeyD']) {
            this.x_v=3;
            this.y_v=4;
            this.state = 'walk_SE';
        } else if (keyState['KeyW']) {
            this.state = 'walk_N';
            this.x_v=0;
            this.y_v=-4;
        } else if (keyState['KeyS']) {
            this.state = 'walk_S';
            this.x_v=0;
            this.y_v=4;
        } else if (keyState['KeyA']) {
            this.state = 'walk_W';
            this.x_v=-3;
            this.y_v=0;
        } else if (keyState['KeyD']) {
            this.state = 'walk_E';
            this.x_v=3;
            this.y_v=0;
        }else{
            var l=0;
            if (this.state == this.idle_state){
                l+=1;
            }
            if (l==0){
                this.set_idle_state();  
            }
            this.x_v=0;
            this.y_v=0;
        }
    }
}    

