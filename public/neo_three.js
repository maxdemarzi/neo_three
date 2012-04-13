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

	var container, separation = 100, amountX = 50, amountY = 50,
	particles, particle;

	container = document.createElement('div');
	document.body.appendChild(container);

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 100;

	scene = new THREE.Scene();

	scene.add( camera );

	renderer = new THREE.CanvasRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	// particles

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

	//var geometry = new THREE.Geometry();
    var geometry = new THREE.SphereGeometry( 50, 8, 7, false );
    var material = new THREE.MeshNormalMaterial();
    
    group = new THREE.Object3D();

	for ( var i = 0; i < 200; i ++ ) {

		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.x = Math.random() * 2000 - 1000;
		mesh.position.y = Math.random() * 2000 - 1000;
		mesh.position.z = Math.random() * 2000 - 1000;
		mesh.rotation.x = Math.random() * 360 * ( Math.PI / 180 );
		mesh.rotation.y = Math.random() * 360 * ( Math.PI / 180 );
		mesh.matrixAutoUpdate = false;
		mesh.updateMatrix();
		group.add( mesh );

	}

    scene.add( group );

	// lines

	var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 0.5 } ) );
	scene.add( line );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
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