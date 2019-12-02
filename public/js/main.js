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
    const build = new Builder();
    
    for (let i = 0; i < 3; i++) {
	const tetras = build.tetras();

	const rotation = new THREE.Matrix4().makeRotationAxis( axis, i*onetwenty );   
	tetras.applyMatrix(rotation);
        
	group.add(tetras);
    }

    const offset_a_alpha = new THREE.Vector3(r/2,r/2,0);
    const offset_b_alpha = new THREE.Vector3(-r/2,-r/2,0);
	
    const position_a_alpha = new THREE.Matrix4();
    position_a_alpha.setPosition(offset_a_alpha);

    const position_b_alpha = new THREE.Matrix4();
    position_b_alpha.setPosition(offset_b_alpha);

    const offset_a_beta = new THREE.Vector3(r/2,r/2,0);
    const offset_b_beta = new THREE.Vector3(-r/2,-r/2,0);
	
    const position_a_beta = new THREE.Matrix4();
    position_a_beta.setPosition(offset_a_beta);

    const position_b_beta = new THREE.Matrix4();
    position_b_beta.setPosition(offset_b_beta);

    scene.add( group );

    const axes = new THREE.AxesHelper(10);
    scene.add(axes);

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

	const x = new THREE.Vector3(1, 0, 0);
	const y = new THREE.Vector3(0, 1, 0);
	const z = new THREE.Vector3(0, 0, 1);
	const rotate_exx = new THREE.Matrix4().makeRotationAxis( x, incr );
	const rotate_why = new THREE.Matrix4().makeRotationAxis( y, incr );
	const rotate_zed = new THREE.Matrix4().makeRotationAxis( z, incr );

	//group_alpha.applyMatrix(position_a_alpha);
	//group_beta.applyMatrix(position_a_beta);

	//group_alpha.applyMatrix(rotate_zed);
	//group_beta.applyMatrix(rotate_why);

	//group_alpha.applyMatrix(position_b_alpha);
	//group_beta.applyMatrix(position_b_beta);

	for (let i = 0; i < 3; ++i) {
	    let sub = group.children[ i ];

	    {
		const flap = new THREE.Vector3(-sinFortyFive, -sinFortyFive, 0);
		const rotation = new THREE.Matrix4().makeRotationAxis( flap, flip*incr );

		sub.children[ 0 ].geometry.applyMatrix(rotation);
		sub.children[ 1 ].geometry.applyMatrix(rotation);
	    }

	    
	    {
		const flap = new THREE.Vector3(sinFortyFive, sinFortyFive, 0);
		const rotation = new THREE.Matrix4().makeRotationAxis( flap, flip*incr );

		sub.children[ 2 ].geometry.applyMatrix(rotation);
		sub.children[ 3 ].geometry.applyMatrix(rotation);
	    }
	}
	
	//group.rotation.x += 0.01;
	//group.rotation.y += 0.01;
	
	renderer.render( scene, camera );
    };
    
    animate();  
}
