const frustumSize = 1000;

main = function()
{
  function degrees_to_radians(degrees)
  {
    var pi = Math.PI;
    return degrees * (pi/180);
  }

  const aspect = window.innerWidth / window.innerHeight;
  
  var scene = new THREE.Scene();
  var camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 );
  camera.lookAt(0,0,0);
  camera.zoom = 100;
  camera.updateProjectionMatrix();
  
  //var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  //camera.position.z = 3;
  
  scene.add( camera );

  var renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0x000000, 1 );
  document.body.appendChild( renderer.domElement );

  var controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.enablePan = false;
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.25;
  controls.screenSpacePanning = false;
  controls.minDistance = 100;
  controls.maxDistance = 500;
  controls.maxPolarAngle = Math.PI / 2;

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

  var r = 1;

  var thirty = degrees_to_radians(30);
  var fortyfive = degrees_to_radians(45);
  var sixty =  degrees_to_radians(60 );
  var ninety = degrees_to_radians(90);
  var onetwenty =  degrees_to_radians(120 );
  var oneeighty = degrees_to_radians(180);
  
  var tanThirty = Math.tan( thirty );

  var sinFortyFive = Math.sin( fortyfive );

  for (var i = 0; i < 2; i++) {
    group.add( new THREE.LineSegments( geometry, lineMaterial ) );
    group.add( new THREE.Mesh( geometry, meshMaterial ) );

    group.children[ 2*i ].geometry.dispose();
    group.children[ 2*i+1 ].geometry.dispose();

    var tetra = new THREE.TetrahedronGeometry( r, 0 );
    
    var origin = new THREE.Matrix4().makeTranslation( -tanThirty, -tanThirty, -tanThirty );
    tetra.applyMatrix(origin);  
    
    if (i % 2 == 1) {
      var flipMat = new THREE.Matrix4().makeRotationX( oneeighty );   
      tetra.applyMatrix(flipMat);
      
      var flopMat = new THREE.Matrix4().makeRotationZ( ninety );   
      tetra.applyMatrix(flopMat);
    }

    var times = Math.floor(i / 2);
    console.log(times);
    var axis = new THREE.Vector3(-sinFortyFive, sinFortyFive, 0);
    var rotation = new THREE.Matrix4().makeRotationAxis( axis, times*onetwenty );   
    tetra.applyMatrix(rotation);
          
    group.children[ 2*i ].geometry = new THREE.WireframeGeometry( tetra );
    group.children[ 2*i+1 ].geometry = tetra;
  }
  
  scene.add( group );

  const axes = new THREE.AxesHelper(10);
  scene.add(axes);

  const frequency = 0.1;
  const clock = new THREE.Clock();
  
  const animate = function () {
    requestAnimationFrame( animate );

    controls.update();

    console.log(clock.getElapsedTime());
    
    for (let i = 0; i < 2; ++i) {

      if (i % 2 == 0) {
        const axis = new THREE.Vector3(-sinFortyFive, -sinFortyFive, 0);
        const rotation = new THREE.Matrix4().makeRotationAxis( axis, 0.01 );

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
