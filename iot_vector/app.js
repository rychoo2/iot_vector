

init();
addGridHelper();
addPoints();
// drawLine();
animate();



function animate() {
    requestAnimationFrame( animate );
    // animateCamera();
    movePoints();
    // moveLine();
    renderer.render( scene, camera );
}

function animateCamera() {
    var timer = Date.now() * 0.0001;
    camera.position.x = Math.cos( timer ) * 800;
    camera.position.z = Math.sin( timer ) * 800;
    camera.lookAt( scene.position );
}

function init(){
    pointsData = [];
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
    var n = 1000, n2 = n / 2; // particles spread in the cube
    
    for ( var i = 0; i < particles; i ++ ) {
        // positions
        var x = Math.random() * n - n2;
        var y = Math.random() * n;
        var z = Math.random() * n - n2;
        addPoint(x,y,z);
    }
    drawPoints();
}

function drawPoints(){
    var geometry = new THREE.BufferGeometry();
    var positions = [];
    movementVectors = [];
    var colors = [];
    var color = new THREE.Color();
    pointsData.forEach(p => {
        positions.push( p.position.x, p.position.y, p.position.z );
        colors.push( 0, 255, 0 );
    });

    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    geometry.computeBoundingSphere();
    var material = new THREE.PointsMaterial( { size: 15, vertexColors: THREE.VertexColors } );
    points = new THREE.Points( geometry, material );
    scene.add( points );
}

function addPoint(x, y, z){
    
    pointsData.push({
        position: {x: x, y: y, z: z, t: (new Date).getTime()},
        trail: [],
        movementVector: {x: 0, y: 0, z: 0},
    });
}

function redrawPoints(){
    pointsData.forEach((p,i) => {
        redrawPoint(i);
    });
}

function redrawPoint(i){
    var p = pointsData[i];
    var positions = points.geometry.attributes.position.array;
    positions[i*3] = p.position.x;
    positions[i*3+1] = p.position.y;
    positions[i*3+2] = p.position.z;
    points.geometry.attributes.position.needsUpdate = true;   
    
    if(p.line) scene.remove(p.line);
    p.line = createLine(p.trail);
    scene.add(p.line);

}

function createLine(trail){
    var material = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 2 });
    var geometry = new THREE.Geometry();
    var line = new THREE.Line(geometry, material);
    line.geometry.vertices = trail.map(t => {return new THREE.Vector3(t.x, t.y, t.z);});
    // p.line.geometry.verticesNeedUpdate = true;
    return line;
}

function movePoints(){
    var trailDuration = 1000;
    pointsData.forEach((p,i) => {
        if(i < 5 + Math.random() * 10){
            if(Math.random() < 0.01) p.movementVector.x += Math.random()-0.5;
            if(Math.random() < 0.001) p.movementVector.y += Math.random()-0.5;
            if(Math.random() < 0.02) p.movementVector.z += Math.random()-0.5;
        }
        var newPos = {t: (new Date).getTime()};
        ['x', 'y', 'z'].forEach(i => {
            newPos[i] = p.position[i] + p.movementVector[i];
            if(newPos[i] > 500 || newPos[i] < -500) {p.movementVector[i] *= -0.5;newPos[i] += 2* p.movementVector[i]; };
        });
       
        if(newPos.x != p.position.x ||  newPos.z != p.position.z || newPos.y != p.position.y){
            p.trail.push(p.position);
            p.position = newPos;
        }
        _.remove(p.trail, t => p.position.t - t.t > trailDuration);
    });
    redrawPoints();
}