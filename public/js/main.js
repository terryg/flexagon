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
  camera.zoom = 50;
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
  
  var thirty = 30;
  var fortyfive = 45;
  var sixty = 60;
  var ninety = 90;
  var onetwenty = 120;

  var sinThirty = Math.sin( degrees_to_radians( thirty ) );
  var cosThirty = Math.cos( degrees_to_radians( thirty ) );
  var tanThirty = Math.tan( degrees_to_radians( thirty ) );
  var sinSixty = Math.sin( degrees_to_radians( sixty ) );
  var cosSixty = Math.cos( degrees_to_radians( sixty ) );
  var tanSixty = Math.tan( degrees_to_radians( sixty ) );
  var sinFortyFive = Math.sin( degrees_to_radians( fortyfive ) );
  var cosFortyFive = Math.cos( degrees_to_radians( fortyfive ) );
  var tanFortyFive = Math.tan( degrees_to_radians( fortyfive ) );
  var sinOneTwenty = Math.sin( degrees_to_radians( onetwenty ) );
  var cosOneTwenty = Math.cos( degrees_to_radians( onetwenty ) );
  var tanOneTwenty = Math.tan( degrees_to_radians( onetwenty ) );
  var sinNinety = Math.sin( degrees_to_radians( ninety ) );
  var cosNinety = Math.cos( degrees_to_radians( ninety ) );
  var tanNinety = Math.tan( degrees_to_radians( ninety ) );

  console.log(r * sinThirty);
  console.log(r * sinFortyFive);
  console.log(r * sinSixty);

  console.log(r * cosThirty);
  console.log(r * cosFortyFive);
  console.log(r * cosSixty);

  console.log(r * tanThirty);
  console.log(r * tanFortyFive);
  console.log(r * tanSixty);

  for (var i = 0; i < 6; i++) {
    group.add( new THREE.LineSegments( geometry, lineMaterial ) );
    group.add( new THREE.Mesh( geometry, meshMaterial ) );

    group.children[ 2*i ].geometry.dispose();
    group.children[ 2*i+1 ].geometry.dispose();

    var tetra = new THREE.TetrahedronGeometry( r, 0 );
    
    var origin = new THREE.Matrix4().makeTranslation( -tanThirty, -tanThirty, -tanThirty );
    tetra.applyMatrix(origin);  
    
    if (i % 2 == 0) {
      var flipMat = new THREE.Matrix4().makeRotationX( degrees_to_radians( 180 ) );   
      tetra.applyMatrix(flipMat);
      
      var flopMat = new THREE.Matrix4().makeRotationZ( degrees_to_radians( 90 ) );   
      tetra.applyMatrix(flopMat);
    }

    var times = Math.floor(i / 2);
    console.log(times);
    var axis = new THREE.Vector3(-sinFortyFive, sinFortyFive, 0);
    var rotation = new THREE.Matrix4().makeRotationAxis( axis, degrees_to_radians( times*onetwenty ) );   
    tetra.applyMatrix(rotation);
          
    group.children[ 2*i ].geometry = new THREE.WireframeGeometry( tetra );
    group.children[ 2*i+1 ].geometry = tetra;
  }
  
  scene.add( group );

  //var axes = new THREE.AxesHelper(10);
  //scene.add(axes);
  
  var animate = function () {
    requestAnimationFrame( animate );

    controls.update();
    
    group.rotation.x += 0.01;
    group.rotation.y += 0.01;
    
    renderer.render( scene, camera );
  };
  
  animate();  
}
