const frustumSize = 1000;

main = function()
{
    function degrees_to_radians(degrees)
    {
	const pi = Math.PI;
	return degrees * (pi/180);
    }

    function radians_to_degrees(radians)
    {
	const pi = Math.PI;
	return radians * (180/pi);
    }

    const aspect = window.innerWidth / window.innerHeight;
    
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 );
    camera.lookAt(0,0,0);
    camera.zoom = 100;
    camera.updateProjectionMatrix();
    
    scene.add( camera );

    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x000000, 1 );
    document.body.appendChild( renderer.domElement );

    const controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enablePan = false;
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.minDistance = 100;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 2;

    const lights = [];
    lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

    lights[ 0 ].position.set( 0, 200, 0 );
    lights[ 1 ].position.set( 100, 200, 100 );
    lights[ 2 ].position.set( - 100, - 200, - 100 );

    scene.add( lights[ 0 ] );
    scene.add( lights[ 1 ] );
    scene.add( lights[ 2 ] );
    
    const group = new THREE.Group();
    
    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( [], 3 ) );

    const lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.5 } );
    const meshMaterial = new THREE.MeshPhongMaterial( { color: 0x156289, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true } );

    const r = 1;

    const thirty = degrees_to_radians(30);
    const fortyfive = degrees_to_radians(45);
    const sixty =  degrees_to_radians(60 );
    const ninety = degrees_to_radians(90);
    const onetwenty =  degrees_to_radians(120 );
    const oneeighty = degrees_to_radians(180);
    
    const tanThirty = Math.tan( thirty );
    const sinSixty = Math.sin( sixty );
    const sinFortyFive = Math.sin( fortyfive );
    
    const s = Math.sqrt(2)*2*r*sinFortyFive;

    const h = s*sinSixty;

    const theta = Math.acos(s/2/h);

    console.log(r);
    console.log(s);
    console.log(h);
    console.log(theta);
    
    const axis = new THREE.Vector3(-sinFortyFive, sinFortyFive, 0);

    for (let i = 0; i < 6; i++) {
	group.add( new THREE.LineSegments( geometry, lineMaterial ) );
	group.add( new THREE.Mesh( geometry, meshMaterial ) );

	group.children[ 2*i ].geometry.dispose();
	group.children[ 2*i+1 ].geometry.dispose();

	const tetra = new THREE.TetrahedronGeometry( r, 0 );
	const origin = new THREE.Matrix4().makeTranslation( -tanThirty, -tanThirty, -tanThirty );
	tetra.applyMatrix(origin);  
	
	if (i % 2 == 1) {
            const flipMat = new THREE.Matrix4().makeRotationX( oneeighty );   
            tetra.applyMatrix(flipMat);
            
            const flopMat = new THREE.Matrix4().makeRotationZ( ninety );   
            tetra.applyMatrix(flopMat);
	}

	const times = Math.floor(i / 2);
	const rotation = new THREE.Matrix4().makeRotationAxis( axis, times*onetwenty );   
	tetra.applyMatrix(rotation);
        
	group.children[ 2*i ].geometry = new THREE.WireframeGeometry( tetra );
	group.children[ 2*i+1 ].geometry = tetra;
    }
    
    scene.add( group );

    //const axes = new THREE.AxesHelper(10);
    //scene.add(axes);

    let current = 0;
    let flip = 1;
    const incr = 0.01;

    const animate = function () {
	requestAnimationFrame( animate );

	controls.update();
	
	current += flip*incr;

	if (current > theta) {
            flip *= -1;
	} else if (current < -theta) {
            flip *= -1;
	}
	
	for (let i = 0; i < 6; ++i) {
            const times = Math.floor(i / 2);

            if (i % 2 == 0) {
		const flap = new THREE.Vector3(-sinFortyFive, -sinFortyFive, 0);
		flap.applyAxisAngle( axis, times*onetwenty );   

		const rotation = new THREE.Matrix4().makeRotationAxis( flap, flip*incr );

		group.children[ 2*i ].geometry.applyMatrix(rotation);
		group.children[ 2*i+1 ].geometry.applyMatrix(rotation);

            } else {
		const flap = new THREE.Vector3(sinFortyFive, sinFortyFive, 0);
		flap.applyAxisAngle( axis, times*onetwenty );   

		const rotation = new THREE.Matrix4().makeRotationAxis( flap, flip*incr );

		group.children[ 2*i ].geometry.applyMatrix(rotation);
		group.children[ 2*i+1 ].geometry.applyMatrix(rotation);

            }
            
	}
	
	//group.rotation.x += 0.01;
	//group.rotation.y += 0.01;
	
	renderer.render( scene, camera );
    };
    
    animate();  
}
