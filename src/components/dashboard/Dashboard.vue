<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Boucle sur les pièces avec leurs appareils -->
      <div
        v-for="room in rooms"
        :key="room.id"
        class="p-4 bg-white shadow-lg rounded-lg border border-gray-200">
        <h2 class="text-xl font-semibold text-gray-700 mb-2">{{ room.name }}</h2>
        <ul>
          <li
            v-for="entity in entitiesInRoom(room.id)"
            :key="entity.id"
            class="flex items-center justify-between p-2 bg-gray-50 rounded-lg mb-2">
            <div>
              <p class="text-sm font-medium text-gray-600">{{ entity.name }}</p>
              <p class="text-xs text-gray-400">{{ entity.type }}</p>
              <p class="text-xs text-blue-600">{{ entity.value }}</p>
            </div>
            <!-- Interrupteur pour activer/désactiver l'appareil -->
            <div
              v-if="entity.status === 'on' || entity.status === 'off'"
              class="flex items-center">
              <span
                class="mr-2 text-sm font-semibold"
                :class="{
                  'text-green-600': entity.status === 'on',
                  'text-red-600': entity.status === 'off'}">
                {{ entity.status }}
              </span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  class="sr-only peer"
                  :checked="entity.status === 'on'"
                  @change="toggleEntityStatus(entity)"/>
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-300 peer-checked:bg-green-500">
                </div>
                <div class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5"></div>
              </label>
            </div>
          </li>
        </ul>
      </div>

      <!-- Carré pour les appareils sans pièce -->
      <div class="p-4 bg-white shadow-lg rounded-lg border border-gray-200">
        <h2 class="text-xl font-semibold text-gray-700 mb-2">Devices without room</h2>
        <ul>
          <li
            v-for="entity in entitiesWithoutRoom"
            :key="entity.id"
            class="flex items-center justify-between p-2 bg-gray-50 rounded-lg mb-2">
            <div>
              <p class="text-sm font-medium text-gray-600">{{ entity.name }}</p>
              <p class="text-xs text-gray-400">{{ entity.type }}</p>
              <p class="text-xs text-blue-600">{{ entity.value }}</p>
            </div>
            <!-- Interrupteur pour activer/désactiver l'appareil sans pièce -->
            <div
              v-if="entity.status === 'on' || entity.status === 'off'"
              class="flex items-center">
              <span
                class="mr-2 text-sm font-semibold"
                :class="{
                  'text-green-600': entity.status === 'on',
                  'text-red-600': entity.status === 'off'
                }">
                {{ entity.status }}
              </span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  class="sr-only peer"
                  :checked="entity.status === 'on'"
                  @change="toggleEntityStatus(entity)"/>
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-300 peer-checked:bg-green-500"></div>
                <div class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5"></div>
              </label>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import coreApi from "@/providers/core-api"

export default {
  name: "Dashboard",
  created() {
    this.getEntities()
    this.getRooms()
  },
  data() {
    return {
      entities: [],
      rooms: [],
      isLoading: false,
      isError: false 
    }
  },
  computed: {
    // Retourne les appareils sans pièce
    entitiesWithoutRoom() {
      return this.entities.filter(entity => !entity.room)
    }
  },
  methods: { 
    getEntities() {
      this.isLoading = true

      coreApi.glados.getEntities()
        .then((entities) => {
          this.entities = entities
        })
        .catch((error) => {
          console.error(error)
          this.isError = true
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    getRooms() {
      this.isLoading = true

      coreApi.glados.getRooms()
        .then((rooms) => {
          this.rooms = rooms
        })
        .catch((error) => {
          console.error(error)
          this.isError = true
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    entitiesInRoom(roomId) {
      return this.entities.filter(entity => entity.room && entity.room.id === roomId)
    },
    // Méthode pour inverser le statut d'un appareil
    toggleEntityStatus(entity) {
      entity.status = entity.status === "on" ? "off" : "on"

      const data = { status: entity.status }
      coreApi.glados.updateEntites(entity.id, data)
        .then( () => {
          console.log("TADA")
        })
        .catch((error) => {
          console.error(error)
          this.isError = true
        })
    }
  } 
}
</script>