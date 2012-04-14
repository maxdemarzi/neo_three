var mouseX = 0, mouseY = 0,

windowHalfX = window.innerWidth / 2,
windowHalfY = window.innerHeight / 2,

SEPARATION = 200,
AMOUNTX = 10,
AMOUNTY = 10,

camera, scene, renderer;

init();
animate();

function init() {

  var container, separation = 100, amountX = 50, amountY = 50;

  container = document.createElement('div');
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 100;

  scene = new THREE.Scene();

  scene.add( camera );

  renderer = new THREE.CanvasRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  // Nodes

  var PI2 = Math.PI * 2;
  var material = new THREE.ParticleCanvasMaterial( {

    color: 0xffffff,
    program: function ( context ) {

      context.beginPath();
      context.arc( 0, 0, 1, 0, PI2, true );
      context.closePath();
      context.fill();

    }

  } );

  var geometry = new THREE.SphereGeometry( 50, 8, 7, false );
  var material = new THREE.MeshNormalMaterial();
    
  group = new THREE.Object3D();
		
  for (n in gon.nodes) {
	
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.x = gon.nodes[n].position_x;
    mesh.position.y = gon.nodes[n].position_y;
    mesh.position.z = gon.nodes[n].position_z;
    mesh.rotation.x = gon.nodes[n].rotation_x;
    mesh.rotation.y = gon.nodes[n].rotation_y;
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
    group.add( mesh );

  }

  scene.add( group );
	
  // Edges

  for (n in gon.edges) {
    var line_segment = new THREE.Geometry();
    line_segment.vertices.push( new THREE.Vertex( group.children[gon.edges[n].source - 1].position ) );
    line_segment.vertices.push( new THREE.Vertex( group.children[gon.edges[n].target - 1].position ) );
    var line = new THREE.Line( line_segment, new THREE.LineBasicMaterial( { color: Math.random() * 0xffffff , opacity: 0.5 } ) );

    scene.add(line)
  }
 
  document.addEventListener( 'mousemove',  onDocumentMouseMove,  false );
  document.addEventListener( 'touchstart', onDocumentTouchStart, false );
  document.addEventListener( 'touchmove',  onDocumentTouchMove,  false );
}

//

function onDocumentMouseMove(event) {

  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart( event ) {

  if ( event.touches.length > 1 ) {

    event.preventDefault();

    mouseX = event.touches[ 0 ].pageX - windowHalfX;
    mouseY = event.touches[ 0 ].pageY - windowHalfY;

  }

}

function onDocumentTouchMove( event ) {

  if ( event.touches.length == 1 ) {

    event.preventDefault();

    mouseX = event.touches[ 0 ].pageX - windowHalfX;
    mouseY = event.touches[ 0 ].pageY - windowHalfY;

  }

}

//

function animate() {

  requestAnimationFrame( animate );

  render();

}

function render() {

  camera.position.x += ( mouseX - camera.position.x ) * .05;
  camera.position.y += ( - mouseY + 200 - camera.position.y ) * .05;
  camera.lookAt( scene.position );

  renderer.render( scene, camera );

}
