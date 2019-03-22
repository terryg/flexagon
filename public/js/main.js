
main = function()
{
    function degrees_to_radians(degrees)
    {
        var pi = Math.PI;
        return degrees * (pi/180);
    }
    
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    camera.position.z = 3;

    var renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x000000, 1 );
    document.body.appendChild( renderer.domElement );

    var orbit = new THREE.OrbitControls( camera, renderer.domElement );
    orbit.enableZoom = false;

    var lights = [];
    lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

    lights[ 0 ].position.set( 0, 200, 0 );
    lights[ 1 ].position.set( 100, 200, 100 );
    lights[ 2 ].position.set( - 100, - 200, - 100 );

    scene.add( lights[ 0 ] );
    scene.add( lights[ 1 ] );
    scene.add( lights[ 2 ] );
    
    var group = new THREE.Group();
    
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( [], 3 ) );

    var lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.5 } );
    var meshMaterial = new THREE.MeshPhongMaterial( { color: 0x156289, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true } );


    for (var i = 0; i < 6; i++) {
	group.add( new THREE.LineSegments( geometry, lineMaterial ) );
	group.add( new THREE.Mesh( geometry, meshMaterial ) );

        group.children[ 2*i ].geometry.dispose();
        group.children[ 2*i+1 ].geometry.dispose();

        var tetra = new THREE.TetrahedronGeometry( 1, 0 );
    
        var mat = new THREE.Matrix4().makeRotationZ(degrees_to_radians(i*60.0));
    
        tetra.applyMatrix(mat);
            
	group.children[ 2*i ].geometry = new THREE.WireframeGeometry( tetra );
	group.children[ 2*i+1 ].geometry = tetra;
    }
    
    scene.add( group );

    var animate = function () {
	requestAnimationFrame( animate );
        
	group.rotation.x += 0.01;
	group.rotation.y += 0.01;
        
	renderer.render( scene, camera );
    };
    
    animate();
    
}
