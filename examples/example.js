var fullscreen = true

// set the scene size
var WIDTH = 1200,
  HEIGHT = 300

// required for iOS safari
var updateTween = window.performance ?
  function highResTimer(time) {
      TWEEN.update(time)
  } :
  function dateTimer(time) {
    TWEEN.update(+new Date())
  }


var SECOND = 1000
  , MINUTE = SECOND * 60
  , HOUR = MINUTE * 60

// set some camera attributes
var VIEW_ANGLE = 30,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 0.1,
  FAR = 50000

// create a WebGL renderer, camera and a scene
var renderer = new THREE.WebGLRenderer({ alpha: true })
renderer.setClearColor( 0x000000, 0)


var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
camera.position.set(0, WIDTH, HEIGHT)
camera.lookAt(new THREE.Vector3(0,0,0))

var scene = new THREE.Scene()
scene.add(camera)

var main = new THREE.Object3D
main.rotateZ(0.1)
// main.rotateX(0.1)
scene.add(main)

renderer.setSize(WIDTH, HEIGHT)

// attach the render-supplied DOM element
document.getElementById('container').appendChild(renderer.domElement)

// create a point light
var pointLight = new THREE.PointLight(0xc0c0c0)
pointLight.position.x = 200
pointLight.position.y = 100
pointLight.position.z = 0
scene.add(pointLight)

var ambientLight = new THREE.AmbientLight(0x404040)
scene.add(ambientLight)

var dirLight = new THREE.DirectionalLight( 0xc0c0c0, 1 )
dirLight.position.set(0, 1, 0)
scene.add( dirLight )



var BG_WIDTH = 29
var BG_HEIGHT = 7

var clock = []
var endTime = new Date('Fri Mar 27 2015 10:00:00 GMT-0700 (PDT)').getTime()
function updateTimer(d) {
  d = d ? new Date(d) : new Date()
  // var delta = endTime - d.getTime()

  // var hours = Math.floor(delta / HOUR)
  //   , minutes = Math.floor((delta % HOUR) / MINUTE)
  //   , seconds = Math.floor((delta % MINUTE) / SECOND)
  //   , symbols

  var hours = d.getHours()
    , minutes = d.getMinutes()
    , seconds = d.getSeconds()
    , symbols


  function pad(n, c) {
    n = n.toString()
    if (n.length === 1) {
      n = c + n
    }
    return n
  }

  symbols = []
    .concat(pad(hours, ' ').split(''))
    .concat(':')
    .concat(pad(minutes, '0').split(''))
    .concat(':')
    .concat(pad(seconds, '0').split(''))

  var curX = 1
    , curY = 1
  symbols.forEach(function (s, i) {
    var c = clock[i]
    if (!c) {
      clock[i] = c = { symbols: {} }
    }
    if (c.symbol !== s) {
      if (c.block) {
        removeBlock(c.block)
        c.symbols[c.symbol] = c.block
      }

      var block
      if (c.symbols[s]) {
        block = c.symbols[s]
      } else {
        block = makeSymbol(s, curX, curY)
      }
      c.symbol = s
      c.block = addBlock(block)
    }
    curX += (s === ':' ? 2 : 4)
  })
}

function addBlock(block) {
  main.add(block)

  block.traverse(function (thing) {
    var initial
    if (thing instanceof Lego.Plate) {
      initial = {
          x: thing.position.x
        , y: thing.position.y
        , z: thing.position.z
        , rx: 0
        , ry: 0
        , rz: 0
      }
      var y = 50 + 100 * Math.random()
      var z = 50 + 100 * Math.random()
      var rx = Math.PI/2 + Math.PI/2 * Math.random()
      var tween1 = new TWEEN.Tween({ y: y, z: z })
          .to(initial, 750 )
          .easing( TWEEN.Easing.Exponential.Out )
          .onUpdate( function () {
            thing.position.y = this.y
            thing.position.z = this.z
          } )
          .start();
      var tween2 = new TWEEN.Tween({ rx: rx })
          .to(initial, 300 )
          .easing( TWEEN.Easing.Exponential.Out )
          .onUpdate( function () {
            thing.rotateX(-thing.rotation._x)
            thing.rotateX(this.rx)
          } )
          .start();
    }
  })
  return block
}
function removeBlock(block) {
  main.remove(block)
}

function position(obj, x, y, z) {
  var offX = - Lego.computePlateLength(BG_WIDTH / 2)
  var offY = - Lego.computePlateLength(BG_HEIGHT / 2)

  obj.position.y = Lego.computePlateDepth(z)
  obj.position.x = Lego.computePlateLength(x) + offX + Lego.computePlateLength(obj.size.width) / 2
  obj.position.z = Lego.computePlateLength(y) + offY + Lego.computePlateLength(obj.size.height) / 2
}

function createPlate(w, h, d, x, y, z) {
  var plate = new Lego.Plate('white', w, h, d)
  position(plate, x, y, z)
  return plate
}

function makeSymbol(s, offX, offY, offZ) {
  offX = offX || 0
  offY = offY || 0
  offZ = offZ || 3
  var depth = 1
  var assembly = new THREE.Object3D()
  switch (s) {
    case ':':
      assembly.add(createPlate(1, 1, depth, offX, offY + 1, offZ))
      assembly.add(createPlate(1, 1, depth, offX, offY + 3, offZ))
      break
    case '0':
      assembly.add(createPlate(1, 5, depth, offX, offY, offZ))
      assembly.add(createPlate(2, 1, depth, offX + 1, offY, offZ))
      assembly.add(createPlate(1, 5, depth, offX + 2, offY, offZ))
      assembly.add(createPlate(2, 1, depth, offX + 1, offY + 4, offZ))
      break
    case '1':
      assembly.add(createPlate(1, 5, depth, offX + 2, offY, offZ))
      break
    case '2':
      assembly.add(createPlate(2, 1, depth, offX, offY, offZ))
      assembly.add(createPlate(1, 2, depth, offX + 2, offY, offZ))
      assembly.add(createPlate(3, 1, depth, offX, offY + 2, offZ))
      assembly.add(createPlate(1, 2, depth, offX, offY + 3, offZ))
      assembly.add(createPlate(2, 1, depth, offX + 1, offY + 4, offZ))
      break
    case '3':
      assembly.add(createPlate(2, 1, depth, offX, offY, offZ))
      assembly.add(createPlate(2, 1, depth, offX, offY + 2, offZ))
      assembly.add(createPlate(2, 1, depth, offX, offY + 4, offZ))
      assembly.add(createPlate(1, 5, depth, offX + 2, offY, offZ))
      break
    case '4':
      assembly.add(createPlate(1, 3, depth, offX, offY, offZ))
      assembly.add(createPlate(1, 1, depth, offX + 1, offY + 2, offZ))
      assembly.add(createPlate(1, 5, depth, offX + 2, offY, offZ))
      break
    case '5':
      assembly.add(createPlate(2, 1, depth, offX + 1, offY, offZ))
      assembly.add(createPlate(1, 2, depth, offX, offY, offZ))
      assembly.add(createPlate(3, 1, depth, offX, offY + 2, offZ))
      assembly.add(createPlate(1, 2, depth, offX + 2, offY + 3, offZ))
      assembly.add(createPlate(2, 1, depth, offX, offY + 4, offZ))
      break
    case '6':
      assembly.add(createPlate(1, 5, depth, offX, offY, offZ))
      assembly.add(createPlate(1, 1, depth, offX + 1, offY + 2, offZ))
      assembly.add(createPlate(1, 3, depth, offX + 2, offY + 2, offZ))
      assembly.add(createPlate(1, 1, depth, offX + 1, offY + 4, offZ))
      break
    case '7':
      assembly.add(createPlate(2, 1, depth, offX, offY, offZ))
      assembly.add(createPlate(1, 5, depth, offX + 2, offY, offZ))
      break
    case '8':
      assembly.add(createPlate(1, 5, depth, offX, offY, offZ))
      assembly.add(createPlate(1, 1, depth, offX + 1, offY, offZ))
      assembly.add(createPlate(1, 1, depth, offX + 1, offY + 2, offZ))
      assembly.add(createPlate(1, 1, depth, offX + 1, offY + 4, offZ))
      assembly.add(createPlate(1, 5, depth, offX + 2, offY, offZ))
      break
    case '9':
      assembly.add(createPlate(1, 3, depth, offX, offY, offZ))
      assembly.add(createPlate(1, 5, depth, offX + 2, offY, offZ))
      assembly.add(createPlate(1, 1, depth, offX + 1, offY, offZ))
      assembly.add(createPlate(1, 1, depth, offX + 1, offY + 2, offZ))
      break
  }
  return assembly
}


var background = new Lego.Plate('black', BG_WIDTH, BG_HEIGHT, 3)

main.add(background)

setInterval(updateTimer, 250)


renderer.render(scene, camera)

var controls = new THREE.TrackballControls( camera )

controls.rotateSpeed = 1.0
controls.zoomSpeed = 1.2
controls.panSpeed = 0.8

controls.noZoom = false
controls.noPan = false

controls.staticMoving = true
controls.dynamicDampingFactor = 0.3

animate()


function animate(time) {
  requestAnimationFrame( animate )
  render(time)
}

function render(time) {
  updateTween(time)
  controls.update()
  renderer.render( scene, camera )
}

function resize() {
  var w = window.innerWidth * 2
    , h = window.innerHeight * 2


  if (fullscreen) {
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
}

window.addEventListener('resize', resize)
resize()
