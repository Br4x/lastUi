<template>
  <div
    class="shadow-lg relative w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg p-4  min-w-50 min-h-50 max-w-50 max-h-50">
    <div v-if="['loading', 'initial'].includes(state)" class="w-full space-y-4 flex flex-col items-center justify-center">
      <textarea v-model="prompt"
        class="w-full p-3 border border-gray-300 rounded-lg outline-none bg-transparent"
        :disabled="state === 'loading'"
        placeholder="Décrivez l'image que vous souhaitez générer..." rows="4" />
      <Button :label="state === 'initial' ? 'Go' : 'Génération en cours...'" @click="generateImages" :loading="state === 'loading'" />
    </div>

    <div v-else-if="state === 'suggestions'" class="w-full flex flex-col gap-2 items-center justify-center">
      <h3 class="text-xs font-medium ">Sélectionnez une image</h3>
      <div class="grid grid-cols-2 gap-2 w-full">
        <div v-for="(img, index) in suggestions" :key="index"
          class="aspect-square cursor-pointer rounded-lg overflow-hidden hover:ring-2 hover:ring-primary"
          @click="selectImage(img)">
          <img :src="img.url" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>

    <div v-else-if="state === 'selected'" class="w-full h-full">
      <div v-if="viewMode === '2D'" class="w-full h-full">
        <img :src="selectedImage.url" class="w-full h-full object-contain" />
      </div>
      <div v-else class="w-full h-full">
        <div v-if="has3DModel" class="w-full h-full">
          <ThreeViewer :modelPath="modelPath" />
        </div>
        <div v-else class="flex flex-col items-center justify-center w-full h-full">
          <Button label="Générer le modèle 3D" @click="generate3DModel"/>
        </div>
      </div>
    </div>

    <div v-if="state === 'selected'" class="absolute top-4 right-4 flex button-group bg-white overflow-hidden rounded-full">
      <Button label="2D" @click="viewMode = '2D'" :transparent="viewMode !== '2D'" />
      <Button label="3D" @click="viewMode = '3D'" :transparent="viewMode !== '3D'" />
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  prompt: String,
  suggestions: Array,
  savedImage: String,
  savedModel: String,
  generateImageFromPrompt: Function,
  generate3DFromImage: Function
})

// États possibles: 'initial', 'loading', 'suggestions', 'selected'
const state = ref('initial')
const prompt = ref('')
const suggestions = ref([])
const selectedImage = ref(props.savedImage || null)
const viewMode = ref('2D')
const modelPath = ref(props.savedModel || null)

// Vérifier si un modèle 3D existe déjà pour l'image sélectionnée
const has3DModel = computed(() => {
  return !!modelPath.value
})

// Fonction pour générer les images
const generateImages = async () => {
  if (!prompt.value.trim()) return

  state.value = 'loading'

  try {
    // Simuler un appel API
    // En production, remplacez par votre véritable appel API
    await props.generateImageFromPrompt(prompt.value)

    // Simuler les résultats
    suggestions.value = [
      { id: 1, url: '/api/placeholder/200/200', prompt: prompt.value },
      { id: 2, url: '/api/placeholder/200/200', prompt: prompt.value },
      { id: 3, url: '/api/placeholder/200/200', prompt: prompt.value },
      { id: 4, url: '/api/placeholder/200/200', prompt: prompt.value }
    ]

    // Sauvegarder les prompts et suggestions dans lowdb
    saveToDatabase({
      prompt: prompt.value,
      suggestions: suggestions.value,
      timestamp: new Date().toISOString()
    })

    state.value = 'suggestions'
  } catch (error) {
    console.error('Erreur lors de la génération des images:', error)
    state.value = 'initial'
  }
}

// Fonction pour sélectionner une image
const selectImage = (image) => {
  selectedImage.value = image

  // Vérifier si un modèle 3D existe déjà pour cette image
  checkFor3DModel(image.id)

  state.value = 'selected'

  // Sauvegarder l'image sélectionnée
  saveImageToDatabase(image)
}

// Vérifier si un modèle 3D existe pour l'image
const checkFor3DModel = async (imageId) => {
  try {
    // Simuler la vérification dans la base de données
    // Remplacez par votre véritable logique d'accès à lowdb
    await new Promise(resolve => setTimeout(resolve, 500))

    // Pour la démonstration, on supposera qu'il n'y a pas de modèle 3D
    modelPath.value = ''
  } catch (error) {
    console.error('Erreur lors de la vérification du modèle 3D:', error)
  }
}

// Générer un modèle 3D via Meshy
const generate3DModel = async () => {
  if (!selectedImage.value) return

  try {
    // Afficher l'état de chargement
    state.value = 'loading'

    // Simuler un appel à l'API Meshy
    // Remplacez par votre véritable appel API
    await props.generate3DFromImage(selectedImage.value)

    // Simuler la réponse
    modelPath.value = '/models/sample-model.glb'

    // Sauvegarder le chemin du modèle dans lowdb
    saveModelToDatabase(selectedImage.value.id, modelPath.value)

    // Revenir à l'état d'affichage
    state.value = 'selected'
  } catch (error) {
    console.error('Erreur lors de la génération du modèle 3D:', error)
    state.value = 'selected'
  }
}

// Fonctions d'interaction avec la base de données (lowdb)
const saveToDatabase = (data) => {
  // Implémentez la logique pour sauvegarder dans lowdb
  console.log('Sauvegarde dans lowdb:', data)
}

const saveImageToDatabase = (image) => {
  // Implémentez la logique pour sauvegarder l'image sélectionnée
  console.log('Image sauvegardée:', image)
}

const saveModelToDatabase = (imageId, path) => {
  // Implémentez la logique pour sauvegarder le modèle 3D
  console.log('Modèle 3D sauvegardé pour l\'image', imageId, ':', path)
}
</script>