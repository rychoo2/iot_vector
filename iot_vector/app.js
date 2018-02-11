var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry(  200, 200, 200, 2, 2, 2 );
var material = new THREE.MeshBasicMaterial( { color: 0xfefefe, wireframe: true, opacity: 0.5 } );
var cube = new THREE.Mesh( geometry, material );
cube.position.set(0, 300, 0);
scene.add( cube );

camera.position.z = 1200;
camera.position.x = 1000;
camera.position.y = 700;

var controls = new THREE.OrbitControls( camera, renderer.domElement );

var gridXZ = new THREE.GridHelper(1000, 25, 0xFF4444, 0x404040);
gridXZ.position.set( 0,0,0 );
scene.add(gridXZ);

var gridXY = new THREE.GridHelper(1000, 5, 0xFF4444, 0x404040);
gridXY.position.set( 0,500,500 );
gridXY.rotation.x = Math.PI/2;
scene.add(gridXY);

var gridYZ = new THREE.GridHelper(1000,5, 0xFF4444, 0x404040);
gridYZ.position.set( 500,500,0 );
gridYZ.rotation.z = Math.PI/2;
scene.add(gridYZ);



function animate() {
    requestAnimationFrame( animate );
    // animateCamera();
    renderer.render( scene, camera );
}

function animateCamera() {
    var timer = Date.now() * 0.0001;
    camera.position.x = Math.cos( timer ) * 800;
    camera.position.z = Math.sin( timer ) * 800;
    camera.lookAt( scene.position );
}


animate();