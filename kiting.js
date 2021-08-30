var kiting_clockwise = true;
/// CHANGE kiting_origin to your training location!
var kiting_origin = {
    "x": 1221.6769383603669,
	"y": -782.6235295448917
}
// can be changed to something else
var kiting_range = 2*character.range/3;

// to be called whenever you want to attack or move to attack
function attack_kite() {
    if(character.rip) return;
    loot();

    target=get_targeted_monster();
    if(target) {
        if(target.dead || !target.visible) {
            change_target(null);
            return;
        } else if (can_attack(target)) {
            attack(target);
            let movePoint = get_kite_point(kiting_origin,target,kiting_range,kiting_clockwise);
            move(movePoint.x, movePoint.y);
            return;
        } else {
            let movePoint = get_kite_point(kiting_origin,target,kiting_range,kiting_clockwise);
            move(movePoint.x, movePoint.y);
            return;
        }
        
    } else {
        //replace with your preferred way of finding a target.
        target = get_nearest_monster();
        if(target){
            change_target(target);
            //got a new target, check if its better to rotate clockwise or counter-clockwise
            kiting_clockwise = determine_clockwise(kiting_origin,target,kiting_range);
            let movePoint = get_kite_point(kiting_origin,target,kiting_range,kiting_clockwise);
            move(movePoint.x, movePoint.y);
            return;
        }
        else
        {
            set_message("No Monsters");
            return;
        }
    }
}

function determine_clockwise(origin, target, range) {
    cw = get_kite_point(origin,target,range,true);
    acw = get_kite_point(origin,target,range,false);
    if(distance(character,cw) < distance(character,acw)){
        return true;
    } else {
        return false;
    }
}
// determines the point where the character is:
// * in range of the enemy
// * positioned such that the enemy stays close to the training spot
function get_kite_point(origin, target, range, clockwise) {
    let mod = 1;
    if(!clockwise){
        mod = -1;
    }
    let opp = target.y - origin.y;
    let adj = target.x - origin.x;
    let hyp = Math.sqrt(Math.pow(opp,2) + Math.pow(adj,2))
    let theta = null;
    let yDif = null;
    if(adj > 0) {
        theta = Math.asin(opp/hyp) + (mod * (8 * Math.PI/12))
        yDif = range*Math.sin(theta);
    } else {
        theta = Math.asin(opp/hyp) + (mod * (4 * Math.PI/12))
        yDif = -range*Math.sin(theta);
    }
    let xDif = range*Math.cos(theta);
    return {
        "x":(target.x + xDif),
        "y":(target.y + yDif)
    }
}
