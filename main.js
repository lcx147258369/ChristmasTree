
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {AxesHelper } from 'three/src/helpers/AxesHelper'
// import snow from './public/sprite/snow';
// 创建一个场景
const scene = new THREE.Scene();
 let backgroudTexture = new THREE.TextureLoader().load('/public/texture/background/chirsmas_bg2.jpg', (texture) => {

  // texture.image.width = 1000;
  // texture.image.height = 1000;
  // scene.background = texture;
  // camera.updateProjectionMatrix()
  // return texture
 });

 const canvasAspect = window.innerWidth / window.innerHeight

 const imageAspect = backgroudTexture.image ? backgroudTexture.image.width / backgroudTexture.image.height : 1;
 
 const aspect = imageAspect / canvasAspect;
 
 backgroudTexture.offset.x = aspect > 1 ? (1 - 1 / aspect) : 0;
 
 backgroudTexture.repeat.x = aspect > 1 ? 1 / aspect : 1;
 
 backgroudTexture.offset.y = aspect > 1 ? 0 : (1 - aspect);
 
 backgroudTexture.repeat.y = aspect > 1 ? 1 : aspect/2;


 scene.background = backgroudTexture;





// scene.background = 

// 创建一个相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 10, 500 ) // 75角度， 拍摄面长宽比  近裁剪面， 远裁剪面
camera.position.set(0, 0, 100); //设置相机位置
camera.lookAt(scene.position); //设置相机方向(指向的场景对象)



// 创建一个渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias : true });
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
let ambientlight = new THREE.AmbientLight(0xFFFFFF, 0.7); // soft white light
scene.add(ambientlight);



// 平行光
let directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(100, 20, 20);
directionalLight.castShadow = true
directionalLight.shadow.radius = 1000;
directionalLight.shadow.mapSize.set(4096, 4096)
scene.add(directionalLight);


// 点光源
var light = new THREE.PointLight(0xFF00FF, 10, 100);
light.position.set(50, 120, 50);
scene.add(light);

// 加载一个3D圣诞树模型
const loader = new GLTFLoader().setPath( 'models/tree/' );
loader.load('scene.gltf', function (gltf) {
  gltf.scene.scale.set(2, 2, 2)
  gltf.scene.position.set(0, 1, 0)
  gltf.scene.castShadow = true
  spotLight.target = gltf.scene;
  scene.add(gltf.scene);
}, undefined, function (error) {
  console.error(error);
});

// 加载一个六面体 底座
const textureLoader = new THREE.TextureLoader();
const cylinderGeometry = new THREE.CylinderGeometry( 18, 18, 15, 8, 100);
const cylinderMaterial = new THREE.MeshStandardMaterial({
      map: textureLoader.load('/public/texture/ball/Wood026_2K_Color.jpg'),
      // displacementMap: textureLoader.load('./public/texture/ball/Wood026_2K_Displacement.jpg'),
      normalMap: textureLoader.load('./public/texture/ball/Wood026_2K_NormalGL.jpg'),
      roughnessMap: textureLoader.load('./public/texture/ball/Wood026_2K_Roughness.jpg'),
} );
const cylinder = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
scene.add( cylinder );



//透明水晶球
let material = new THREE.MeshPhongMaterial({
transparent: true,
opacity: 0.1,
color: 0xffffff
});
let squer = new THREE.SphereGeometry( 20, 100, 100 )
var Sphere = new THREE.Mesh(squer,material);
Sphere.position.set(0, 20, 0)
Sphere.castShadow = true
//  texture.mapping = THREE.EquirectangularReflectionMapping;
//  scene.background = texture;
//  scene.environment = texture;
scene.add(Sphere)


/**
 * 雪花
 */

//1、创造粒子缓冲区几何体
const particlesGeometry = new THREE.BufferGeometry();
const count = 10000;



//3、随机生成顶点的位置并给粒子缓冲区几何体传值
//Math.random()生成0到小于1的值，生成-100到100的点
const vertices = []
  for (let i = 0; i < 10000; i++) {
      const x = Math.random() * 2000 - 1000
      const y = Math.random() * 2000 - 1000
      const z = Math.random() * 2000 - 1000
      vertices.push(x, y, z)
  }

particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

//4、设置点的纹理材质（雪花贴图）
const pointsMaterial = new THREE.PointsMaterial({size: 1,
  blending: THREE.AdditiveBlending,
  depthTest: false,
  transparent: true
});
  pointsMaterial.color.setHSL(0.9, 0.05, 0.5)
    // 载入纹理

  const texture = textureLoader.load(`./public/sprite/snow2.png`);
  // 设置点材质纹理
    pointsMaterial.map = texture;
    pointsMaterial.alphaMap = texture;
  const pointMesh = new THREE.Points( particlesGeometry, pointsMaterial );
 
//5、加入场景搞定！
scene.add(pointMesh);





const rgbeloader = new RGBELoader();
 let Texture = rgbeloader.load('./public/snowy_field_4k.hdr',(texture) => {
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

    scene.add(PlaneMesh);
 })





//  控制器
const control = new OrbitControls(camera, renderer.domElement)
control.enableDamping = true;
// 比例尺辅助
 var axisHelper = new AxesHelper( 100);
 scene.add( axisHelper );

// 渲染动画
function render() {
  control.update();
  pointMesh.rotation.y -= 3*Math.pow(10,-3);
  camera.updateProjectionMatrix()
  renderer.render(scene, camera)
  requestAnimationFrame(render);
}

render();


document.body.appendChild(renderer.domElement);


