<script setup>
import { onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const props = defineProps({
  modelPath: String
})

const container = ref(null)

onMounted(() => {
  if (!container.value || !props.modelPath) return

  const extension = props.modelPath.split('.').pop().toLowerCase()

  // Création de la scène
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(50, container.value.clientWidth / container.value.clientHeight, 0.1, 1000)
  
  // 📏 Recule la caméra pour éviter un zoom trop proche
  camera.position.set(1.5, 1, 3) // X = droite/gauche, Y = hauteur, Z = profondeur
  camera.lookAt(0, 0, 0) // Oriente la caméra vers l'objet

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  container.value.appendChild(renderer.domElement)

  // Lumières
  const light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(5, 5, 5)
  scene.add(light)

  const ambientLight = new THREE.AmbientLight(0x404040, 2) // Lumière douce
  scene.add(ambientLight)

  let loader

  switch (extension) {
    case 'glb':
    case 'gltf':
      loader = new GLTFLoader()
      break
    case 'obj':
      loader = new OBJLoader()
      break
    case 'fbx':
      loader = new FBXLoader()
      break
    case 'stl':
      loader = new STLLoader()
      break
    default:
      console.error('Format non supporté:', extension)
      return
  }

  // Charger le modèle et centrer la vue
  loader.load(props.modelPath, (model) => {
    const object = model.scene || model
    scene.add(object)

    // 🔍 Ajuste automatiquement la position de la caméra
    const box = new THREE.Box3().setFromObject(object)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())

    object.position.sub(center) // Centre l'objet
    camera.position.set(size.x * 0.8, 0, size.z * 1.5) // Ajuste le recul en fonction de la taille
    camera.lookAt(0, 0, 0) // Oriente vers le centre
  })

  // Contrôles utilisateur
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  // Animation
  const animate = () => {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()
})
</script>

<template>
  <div ref="container" class="w-50 h-50 bg-gradient-radial from-[#777] to-[#333] rounded-lg"></div>
</template>
