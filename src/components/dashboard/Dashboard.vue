<template>

  <!-- svg icone poubelle -->
  <svg style="display: none;">
    <symbol
      id="delete"
      viewBox="0 0 24 24">
      <path d="M3 6h18v2H3zM6 6V5c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v1h3v2H3V6h3zM8 10h2v10H8zm4 0h2v10h-2zm4 0h2v10h-2z" />
    </symbol>
  </svg>

  <div class="flex space-x-4 mb-6">
    <!-- Bouton de création d'une nouvelle Room -->
    <button
      @click="showAddRoomForm = true"
      class="bg-orange-600 text-white py-2 px-4 rounded hover:bg-green-600">
      New Room
    </button>

    <!-- Bouton de création d'une nouvelle Entity -->
    <button
      @click="showAddEntityForm = true"
      class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
      New Entity
    </button>
  </div>

  <!-- Formulaire pour ajouter une room -->
  <div
    v-if="showAddRoomForm"
    class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
      <h2 class="text-xl font-semibold mb-4">Add a New Room</h2>
      <input
        v-model="roomCreated.name"
        type="text"
        placeholder="Room Name"
        class="mb-4 px-4 py-2 border rounded-md w-full"/>
      <p
        v-if="roomNameError"
        class="text-red-500 text-xs mt-2">This name is already taken. Please choose another one.</p>
      <button
        @click="addRoom"
        class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
        Add Room
      </button>
      <button
        @click="showAddRoomForm = false"
        class="mt-2 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
        Cancel
      </button>
    </div>
  </div>

  <!-- Modal Formulaire de création d'entité -->
  <div 
    v-if="showAddEntityForm"
    class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
      <h2 class="text-xl font-semibold mb-4">Create New Entity</h2>
      
      <!-- Formulaire -->
      <input
        v-model="entityCreated.name"
        type="text"
        placeholder="Entity Name"
        class="mb-4 px-4 py-2 border rounded-md w-full" />

      <p
        v-if="entityNameError"
        class="text-red-500 text-xs mt-2">This name is already taken. Please choose another one.</p>

      <select
        v-model="entityCreated.type"
        class="mb-4 px-4 py-2 border rounded-md w-full">
        <option value="sensor">Sensor</option>
        <option value="light">Light</option>
        <option value="switch">Switch</option>
        <option value="multimedia">Multimedia</option>
        <option value="air_conditioner">Air Conditioner</option>
      </select>

      <select
        v-model="entityCreated.room_id"
        class="mb-4 px-4 py-2 border rounded-md w-full">
        <option
          v-for="room in rooms"
          :key="room.id"
          :value="room.id">{{ room.name }}</option>
      </select>

      <select
        v-model="entityCreated.status"
        class="mb-4 px-4 py-2 border rounded-md w-full">
        <option value="on">On</option>
        <option value="off">Off</option>
      </select>

      <button
        @click="addEntity"
        class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mb-2">
        Add Entity
      </button>

      <button
        @click="showAddEntityForm = false"
        class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
        Cancel
      </button>
    </div>
  </div>

  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Room
        v-for="room in rooms"
        :key="room.id"
        :room="room"
        :entitiesInRoom="entitiesInRoom(room.id)"
        :tvChannels="tvChannels"
        @toggle-status="toggleEntityStatus"
        @change-value="changeEntityValueDebounced"
        @delete-room="deleteRoom"
        @delete-entity="deleteEntity"/>
      <EntitiesWithoutRoom
        :entitiesWithoutRoom="entitiesWithoutRoom"
        :tvChannels="tvChannels"
        @toggle-status="toggleEntityStatus"
        @change-value="changeEntityValueDebounced"
        @delete-room="deleteRoom"
        @delete-entity="deleteEntity"/>

    </div>
    <!-- Popup de confirmation de suppression -->
    <div
      v-if="showDeletePopup"
      class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
        <p class="text-gray-700 font-semibold">The device has been deleted 👋</p>
        <button
          @click="closeDeletePopup"
          class="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash"

import coreApi from "@/providers/core-api"
import EntitiesWithoutRoom from "@/components/room/EntitiesWithoutRoom.vue"
import Room from "@/components/room/Room.vue"

export default {
  name: "Dashboard",
  created() {
    this.getEntities()
    this.getRooms()
    this.initSpeechSynthesis()
    this.debouncedChangeValue = _.debounce(this.changeEntityValue, 300)
  },
  components: {
    Room,
    EntitiesWithoutRoom,
  },
  data() {
    return {
      rooms: [],
      entities: [],
      showDeletePopup: false,
      showAddRoomForm: false,
      showAddEntityForm: false,
      entityNameError: false,
      roomNameError: false,
      entityCreated: {
        name: "",
        type: "sensor",
        room_id: null,
        status: "on"
      },
      roomCreated: { name: "" },
      tvChannels: [
        "TF1", "France 2", "France 3", "Canal+", "France 5", "M6", "Arte", "C8", "W9", "TMC", "TFX", "NRJ 12",
        "La Chaîne Parlementaire", "France 4", "BFM TV", "CNews", "CSTAR", "Gulli", "L'Équipe", "6ter", "LCI", "Franceinfo"
      ]
    }
  },
  computed: {
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
    initSpeechSynthesis() {
      const utter = new SpeechSynthesisUtterance()
      const voicesAvailable = window.speechSynthesis.getVoices()
      console.log(this.voicesAvailable)
      utter.lang = "en-US"
      utter.text = "Hello World"
      utter.voice = voicesAvailable[1]
      utter.pitch = 1.9
      utter.volume = 0.5
      this.utter = utter
    },
    toggleEntityStatus(entity) {
      entity.status = entity.status === "on" ? "off" : "on"
      this.utter.text = `${entity.name} turned ${entity.status}`
      window.speechSynthesis.speak(this.utter)

      const data = {
        status: entity.status
      }
      coreApi.glados.updateEntites(entity.id, data)
        .catch((error) => {
          console.error(error)
          this.isError = true
        })
    },
    changeEntityValue(entity) {
      this.utter.text = `Value of ${entity.name} changed to ${entity.value}`
      window.speechSynthesis.speak(this.utter)

      const data = {
        value: entity.value
      }
      coreApi.glados.updateEntites(entity.id, data)
        .catch((error) => {
          console.error(error)
          this.isError = true
        })
    },
    changeEntityValueDebounced(entity) {
      this.debouncedChangeValue(entity)
    },
    entitiesInRoom(roomId) {
      return this.entities.filter(entity => entity.room && entity.room.id === roomId)
    },
    deleteEntity(deletedEntity) {
      coreApi.glados.deleteEntity(deletedEntity.id)
        .then(() => {
          this.showDeletePopup = true
          this.entities = this.entities.filter(entity => entity.id !== deletedEntity.id)

          setTimeout(() => {
            this.showDeletePopup = false
          }, 2000)
        })
        .catch((error) => {
          console.error(error)
          this.isError = true
        })
        .finally(() => {
        })
    },
    deleteRoom(deletedRoom) {
      coreApi.glados.deleteRoom(deletedRoom.id)
        .then(() => {
          this.showDeletePopup = true
          this.rooms = this.rooms.filter(room => room.id !== deletedRoom.id)

          setTimeout(() => {
            this.showDeletePopup = false
          }, 2000)
        })
        .catch((error) => {
          console.error(error)
          this.isError = true
        })
        .finally(() => {
        })
    },
    addRoom() {
      if (this.roomCreated.name) {
        const existingRoom = this.rooms.find(room => room.name.toLowerCase() === this.roomCreated.name.toLowerCase())
        if (existingRoom) {
          this.roomNameError = true
          return
        }
        coreApi.glados.createRoom(this.roomCreated)
          .then((room) => {
            this.rooms.push(room)
            this.roomCreated.name = ""
            this.showAddRoomForm = false
            this.roomNameError = false
          })
          .catch((error) => {
            console.error(error)
            this.isError = true
          })
      }
    },
    addEntity() {
      if (!this.entityCreated.name || !this.entityCreated.type || !this.entityCreated.status) {
        alert("Please fill in all fields.")
        return
      }
      const existingEntity = this.entities.find(entity => entity.name.toLowerCase() === this.entityCreated.name.toLowerCase())
      if (existingEntity) {
        this.entityNameError = true
        return
      }
      const data = this.entityCreated.room_id === null
        ? {
          name: this.entityCreated.name,
          type: this.entityCreated.type,
          status: this.entityCreated.status
        }
        : { ...this.entityCreated }
      coreApi.glados.createEntity(data).then((entity) => {
        this.entities.push(entity)
        this.showAddEntityForm = false
        this.entityCreated = {
          name: "",
          type: "sensor",
          room_id: null,
          status: "on"
        }
        this.entityNameError = false
      }).catch((error) => {
        console.error(error)
      })
    }
  }
}
</script>