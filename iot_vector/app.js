

init();
addGridHelper();
addPoints();
drawLine();
animate();



function animate() {
    requestAnimationFrame( animate );
    // animateCamera();
    movePoints();
    moveLine();
    renderer.render( scene, camera );
}

function animateCamera() {
    var timer = Date.now() * 0.0001;
    camera.position.x = Math.cos( timer ) * 800;
    camera.position.z = Math.sin( timer ) * 800;
    camera.lookAt( scene.position );
}

function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.autoClearColor = false;
    document.body.appendChild( renderer.domElement );
    
    var geometry = new THREE.BoxGeometry(  200, 200, 200, 2, 2, 2 );
    var material = new THREE.MeshBasicMaterial( { color: 0xfefefe, wireframe: true, opacity: 0.5 } );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.set(0, 300, 0);
    scene.add( cube );
    
    camera.position.z = -1000;
    camera.position.x = -800;
    camera.position.y = 800;
    
    var controls = new THREE.OrbitControls( camera, renderer.domElement );
}

function addGridHelper(){
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
}

function addPoints(){
    var particles = 25;
    var n = 1000; 
    var geometry = new THREE.BufferGeometry();
    var positions = [];
    movementVectors = [];
    var colors = [];
    var color = new THREE.Color();
    var n = 1000, n2 = n / 2; // particles spread in the cube
    for ( var i = 0; i < particles; i ++ ) {
        // positions
        var x = Math.random() * n - n2;
        var y = Math.random() * n;
        var z = Math.random() * n - n2;
        positions.push( x, y, z );

        colors.push( 0, 255, 0 );
        movementVectors.push( Math.random() * 2 - 1, Math.random() * 6 - 3, Math.random() * 6 - 3)
    }

    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    geometry.computeBoundingSphere();
    var material = new THREE.PointsMaterial( { size: 15, vertexColors: THREE.VertexColors } );
    points = new THREE.Points( geometry, material );
    scene.add( points );
}

function movePoints(){
    var positions = points.geometry.attributes.position.array;
    for(var i =0; i< positions.length; i++){
        positions[i]+= movementVectors[i];
        if(positions[i] > 500 || positions[i] < -500) movementVectors[i] *= -1;
    }
    points.geometry.attributes.position.needsUpdate = true;
}

function drawLine() {
    var material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-100, 0, 0));
    geometry.vertices.push(new THREE.Vector3(0, 100, 0));
    geometry.vertices.push(new THREE.Vector3(100, 0, 0));
    line = new THREE.Line(geometry, material);
    scene.add(line);
}

function moveLine(){
    var last = line.geometry.vertices[line.geometry.vertices.length -1];
    line.geometry.vertices.push(last.clone().add(new THREE.Vector3(Math.random() * 12 - 6, Math.random() * 16 - 8, Math.random() * 16 - 8)));
    if(line.geometry.vertices.length > 12) { line.geometry.vertices.shift(); }
    line.geometry.verticesNeedUpdate = true;
}
