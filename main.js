
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {AxesHelper } from 'three/src/helpers/AxesHelper'
// 创建一个场景
const scene = new THREE.Scene();
// scene.background = 

// let imageBackground = new THREE.ImageLoader().load('/public/texture/background/pexels-fox-750843.jpg', (image) => {
//   // const canvas = document.createElement( 'canvas' );
//   // canvas.width = 375
//   // canvas.height = 750
//   // const context = canvas.getContext( '2d' );
//   // context.drawImage( image, 0, 0);
//   console.log(image, 'image')
//   let texture = new THREE.Texture(image);
//   console.log(texture, 'texture')
//   scene.background = texture
 
// });
 let backgroudTexture = new THREE.TextureLoader().load('/public/texture/background/pexels-fox-750843.jpg', (texture) => {

  // texture.image.width = 1000;
  // texture.image.height = 1000;
  // scene.background = texture;
  // camera.updateProjectionMatrix()
  // return texture
 });

 const canvasAspect = window.innerWidth / window.innerHeight

 console.log(window.clientWidth, 'canvas')

 const imageAspect = backgroudTexture.image ? backgroudTexture.image.width / backgroudTexture.image.height : 1;
 
 const aspect = imageAspect / canvasAspect;
 
 backgroudTexture.offset.x = aspect > 1 ? (1 - 1 / aspect) : 0;
 
 backgroudTexture.repeat.x = aspect > 1 ? 1 / aspect : 1;
 
 backgroudTexture.offset.y = aspect > 1 ? 0 : (1 - aspect);
 
 backgroudTexture.repeat.y = aspect > 1 ? 1 : aspect;


 scene.background = backgroudTexture;





// scene.background = 

// 创建一个相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 10, 500 ) // 75角度， 拍摄面长宽比  近裁剪面， 远裁剪面
camera.position.set(0, 0, 100); //设置相机位置
camera.lookAt(scene.position); //设置相机方向(指向的场景对象)



// 创建一个渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
renderer.setSize(window.innerWidth, window.innerHeight);

let pixelRatio = renderer.getPixelRatio();
renderer.setPixelRatio(pixelRatio)



// 聚光灯
var spotLight = new THREE.SpotLight(0xFFFF00, 1, 100);
spotLight.position.set(1, 1, 10);
spotLight.isSpotLightShadow = true
spotLight.castShadow = true
spotLight.shadow.camera.near = 1;    // default
spotLight.shadow.camera.far = 1000      // default
camera.updateProjectionMatrix()
scene.add(spotLight);


// 环境光
let ambientlight = new THREE.AmbientLight(0xFFFFFF, 2); // soft white light
scene.add(ambientlight);



// 平行光
let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(100, 20, 20);
directionalLight.castShadow = true
directionalLight.shadow.radius = 1000;
directionalLight.shadow.mapSize.set(4096, 4096)
scene.add(directionalLight);


// 点光源
var light = new THREE.PointLight(0xFF00FF, 10, 100);
light.position.set(50, 120, 50);
scene.add(light);

// 加载一个3D模型
const loader = new GLTFLoader().setPath( 'models/tree/' );
loader.load('scene.gltf', function (gltf) {
  gltf.scene.scale.set(2, 2, 2)
  gltf.scene.position.set(0, 1, 0)
  gltf.scene.castShadow = true
  scene.add(gltf.scene);
}, undefined, function (error) {
  console.error(error);
});

// 加载一个六面体
const cylinderGeometry = new THREE.CylinderGeometry( 15, 15, 10, 32 );
const cylinderMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
const cylinder = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
scene.add( cylinder );





const rgbeloader = new RGBELoader();
 let Texture = rgbeloader.load('./public/snowy_field_4k.hdr',(texture) => {
    let squerLoader = new THREE.TextureLoader();
      //球形环境贴图
     let material = new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 0.5,
      bumpMap: squerLoader.load('./public/texture/ball/TilesCeramicSubwayOffsetCrackle002_BUMP_2K.jpg'),
      aoMap: squerLoader.load('./public/texture/ball/TilesCeramicSubwayOffsetCrackle002_AO_2K.jpg'),
      lightMap: squerLoader.load('./public/texture/ball/TilesCeramicSubwayOffsetCrackle002_AO_2K.jpg'),
     });
     let squer = new THREE.SphereGeometry( 20, 100, 100 )
     var Sphere = new THREE.Mesh(squer,material);
     Sphere.position.set(0, 20, 0)
     Sphere.castShadow = true
    //  texture.mapping = THREE.EquirectangularReflectionMapping;
    //  scene.background = texture;
    //  scene.environment = texture;
     scene.add( Sphere );  

    const Plane = new THREE.PlaneGeometry(100, 100 );
    const snowTexture = new THREE.TextureLoader()
    const snowDisplacementMap = snowTexture.load('./public/texture/Snow/Snow005_2K_Displacement.png')
    const snowColorMap = snowTexture.load('./public/texture/Snow/Snow005_2K_Color.png')
    const snowNormalMap = snowTexture.load('./public/texture/Snow/Snow005_2K_NormalDX.png')
    const snowRoughnessMap = snowTexture.load('./public/texture/Snow/Snow005_2K_Roughness.png')
    const PlaneMaterial = new THREE.MeshStandardMaterial({
        map: snowColorMap,
        displacementMap: snowDisplacementMap,
        normalMap: snowNormalMap,
        roughnessMap: snowRoughnessMap
    });
    const PlaneMesh = new THREE.Mesh(Plane, PlaneMaterial);
    PlaneMesh.position.set(0, -1, 0)
    PlaneMesh.rotation.x = (-Math.PI / 2)
    PlaneMesh.receiveShadow = true

    // scene.add(PlaneMesh);
 })


//移动下相机的位置
// camera.position.z = 0;




// 添加一个线条 
const materialLine = new THREE.LineBasicMaterial({ color: '#fff' });

// 添加点
const points = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 10, 0),
  new THREE.Vector3(20, 10, 0)
];

const geometryLine = new THREE.BufferGeometry().setFromPoints(points)


const line = new THREE.Line(geometryLine, materialLine);

//  控制器
const control = new OrbitControls(camera, renderer.domElement)
control.enableDamping = true;
// 比例尺辅助
 var axisHelper = new AxesHelper( 100);
 scene.add( axisHelper );

// 渲染动画
function render() {
  control.update();
  camera.updateProjectionMatrix()
  // scene.rotation.y += 0.01;
  renderer.render(scene, camera)
  requestAnimationFrame(render);
}

render();


document.body.appendChild(renderer.domElement);


