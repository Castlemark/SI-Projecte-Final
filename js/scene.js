var renderer;
var scene;
var camera;

function createRenderer(){
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
}

function createCamera(){
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,//near plane
        1000000//far plane
    );
    camera.position.x = 90;
    camera.position.y = 32;
    camera.position.z = 32;
    camera.lookAt(scene.position);

    cameraControl = new THREE.OrbitControls(camera);
}

function createLight() {


    var directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(100, 10, -50);
    directionalLight.name = 'directional';
    scene.add(directionalLight);

    var ambirentLight = new THREE.AmbientLight(0x111111);
    scene.add(ambirentLight);

}

function createBox(){
    var boxGeometry = new THREE.BoxGeometry(6,4,6);
    var boxMaterial = createEarthMaterial();
        //new THREE.MeshLambertMaterial({color: "red"});

    var box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.castShadow = true;
    scene.add(box);

}

function createPlane() {
    var planeGeometry = new THREE.PlaneGeometry(20,20);
    var planeMaterial = new THREE.MeshLambertMaterial(
        {color: 0xcccccc}
    );
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.y = -2;
    scene.add(plane);

}

function createEarth(){
    var sphereGeometry = new THREE.SphereGeometry(15, 30, 30);
    var sphereMaterial = new createEarthMaterial();
    var earthMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    earthMesh.name = 'earth';

    scene.add(earthMesh);
}

function createClouds(){
    var sphereGeometry = new THREE.SphereGeometry(15.1, 30, 30);
    var sphereMaterial = new createCloudMaterial();
    var cloudMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    cloudMesh.name = 'cloud';

    scene.add(cloudMesh);
}

function createEnviroment(){
    var envGeometry = new THREE.SphereGeometry(9000,32,32);

    var envMaterial = new THREE.MeshBasicMaterial();
    envMaterial.map = THREE.ImageUtils.loadTexture('assets/galaxy_starfield.png');
    envMaterial.side = THREE.BackSide;

    var envMesh = new THREE.Mesh(envGeometry, envMaterial);

    scene.add(envMesh)
}

function createLee(){
    var material = new createLeeMaterial();

    var loader = new THREE.OBJLoader();

    loader.load('assets/lee/lee.obj', function(object){

        object.traverse(function (child) {

            if (child instanceof THREE.Mesh){
                child.material = material;
                child.receiveShadow = true;
                child.castShadow = true;
            }
        });
        scene.add(object);

    });
}

function createLeeMaterial(){
    var leeTexture = new THREE.Texture();
    var loader = new THREE.ImageLoader();
    loader.load('assets/lee/lee_diffuse.jpg', function(image){
        leeTexture.image = image;
        leeTexture.needsUpdate = true;
    });

    var leeMaterial = new THREE.MeshPhongMaterial();
    leeMaterial.map = leeTexture;

    var normalMap = new THREE.Texture();
    loader.load('assets/lee/lee_normal_tangent.jpg', function(image){
        normalMap.image = image;
        normalMap.needsUpdate = true;
    });

    leeMaterial.normalMap = normalMap;
    leeMaterial.normalScale = new THREE.Vector2(1.0, 1.0);

    var specularMap = new THREE.Texture();
    loader.load('assets/lee/lee_spec.jpg', function(image){
        specularMap.image = image;
        specularMap.needsUpdate = true;
    });

    leeMaterial.specularMap = specularMap;
    leeMaterial.specular = new THREE.Color(0x262626);

    return leeMaterial;
}

function createCloudMaterial(){
    var cloudTexture = new THREE.Texture();
    var loader = new THREE.ImageLoader();
    loader.load('assets/fair_clouds_1k.png', function(image){
        cloudTexture.image = image;
        cloudTexture.needsUpdate = true;
    });

    var cloudMaterial = new THREE.MeshLambertMaterial();
    cloudMaterial.map = cloudTexture;
    cloudMaterial.transparent = true;

    return cloudMaterial;
}

function createEarthMaterial() {
  var earthTexture = new THREE.Texture();
  var loader = new THREE.ImageLoader();
  loader.load('assets/earthmap2k.jpg', function(image){
    earthTexture.image = image;
    earthTexture.needsUpdate = true;
  });

  var earthMaterial = new THREE.MeshPhongMaterial();
  earthMaterial.map = earthTexture;

  var normalMap = new THREE.Texture();
  loader.load('assets/earth_normalmap_flat2k.jpg', function(image){
      normalMap.image = image;
      normalMap.needsUpdate = true;
  });

  earthMaterial.normalMap = normalMap;
  earthMaterial.normalScale = new THREE.Vector2(1.0, 1.0);

  var specularMap = new THREE.Texture();
  loader.load('assets/earthspec2k.jpg', function(image){
      specularMap.image = image;
      specularMap.needsUpdate = true;
  });

  earthMaterial.specularMap = specularMap;
  earthMaterial.specular = new THREE.Color(0x262626);

    return earthMaterial;

}

function init() {

    scene = new THREE.Scene();

    createRenderer();
    createCamera();

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );

    geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );
    geometry.faces.splice(6,2);


    var buildingMesh = new THREE.Mesh(geometry);

    var cityGeometry = new THREE.Geometry();
    for( var i = 0; i < 2000; i ++ ){
        buildingMesh.position.x   = Math.floor( Math.random() * 200 - 100 ) * 10;
        buildingMesh.position.z   = Math.floor( Math.random() * 200 - 100 ) * 10;
        // put a random rotation
        buildingMesh.rotation.y   = Math.random()*Math.PI*2;
        // put a random scale
        buildingMesh.scale.x  = Math.random() * Math.random() * Math.random() * Math.random() * 50 + 10;
        buildingMesh.scale.y  = (Math.random() * Math.random() * Math.random() * buildingMesh.scale.x) * 8 + 8;
        buildingMesh.scale.z  = buildingMesh.scale.x;

            // merge it with cityGeometry - very important for performance
           // THREE.GeometryUtils.merge( cityGeometry, buildingMesh );

            cityGeometry.mergeMesh(buildingMesh);

    }

    var texture = new THREE.Texture();
    var loader = new THREE.ImageLoader();
    loader.load('assets/fair_clouds_1k.png', function(image){
        texture.image = image;
        texture.needsUpdate = true;
    });

    var material = new THREE.MeshLambertMaterial();
    material.map = texture;

    var final = new THREE.Mesh(cityGeometry);

    console.log(cityGeometry, new THREE.MeshPhongMaterial());
    //var cube = new THREE.Mesh( geometry );
    scene.add( final );


    /*
    createLight();
    //createBox();
    //createPlane();
    //createEarth();
    //createClouds();
    createLee();
    //createEnviroment();*/

    document.body.appendChild( renderer.domElement );

    render();
}

function render() {
    cameraControl.update();

    //scene.getObjectByName('earth').rotation.y += 0.005;
    //scene.getObjectByName('cloud').rotation.y += 0.003;

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

init();