var STUD_WIDTH = 10
var STUD_SPACING = STUD_WIDTH / 1.5
var PLATE_HEIGHT = STUD_SPACING
var STUD_HEIGHT = PLATE_HEIGHT / 1.88
var STUD_PADDING = STUD_WIDTH / 3.2
var STUD_NUM_SIDES = 32

function computePlateLength(studs) {
  return STUD_PADDING * 2 + studs * (STUD_WIDTH + STUD_SPACING) - STUD_SPACING
}
function computePlateDepth(depth) {
  return depth * PLATE_HEIGHT
}
var Lego = {
    computePlateLength: computePlateLength,
    computePlateDepth: computePlateDepth
};


Lego.color=function(val){
    var codes={
        black: 0x191a1b,
        white: 0xfafafa
    }
    return codes[val];
}
//Basic  plate/Lego

Lego.Plate = function(colorCode, w, h, d){
    w = w || 1;
    h = h || 1;
    d = d || 3;

    THREE.Object3D.call( this );
    var color = Lego.color(colorCode)
    var faceMaterial = new THREE.MeshLambertMaterial({
        color: color, ambient: color
    });


    var width = computePlateLength(w)
    var length = computePlateLength(h)
    var depth = computePlateDepth(d)
    var mesh=new THREE.Mesh(new THREE.BoxGeometry(width, depth, length), faceMaterial);
    mesh.position.y = depth/2
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();

    var stud = new THREE.Mesh(new THREE.CylinderGeometry(STUD_WIDTH/2, STUD_WIDTH/2, STUD_HEIGHT, STUD_NUM_SIDES), faceMaterial);

    for(var i=0; i<w; i++){
        for(var j=0; j<h; j++){
            stud.position.y=depth / 2 + STUD_HEIGHT / 2
            stud.position.x=STUD_WIDTH / 2 + STUD_PADDING + i * (STUD_WIDTH + STUD_SPACING) - width/2
            stud.position.z=STUD_WIDTH / 2 + STUD_PADDING + j * (STUD_WIDTH + STUD_SPACING) - length/2

            stud.matrixAutoUpdate = false;
            stud.updateMatrix();

            mesh.geometry.merge(stud.geometry, stud.matrix);
        }
    }
    this.size = {
        width: w, height: h, depth: d
    }
    this.add(mesh);
}

Lego.Plate.prototype = new THREE.Object3D();
Lego.Plate.prototype.constructor = Lego.Plate;
