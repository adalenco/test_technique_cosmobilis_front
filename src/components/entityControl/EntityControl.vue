<template>
  <li class="relative p-4 bg-gray-50 rounded-lg mb-2">
    <!-- Bouton de suppression -->
    <button
      @click="deleteEntity"
      class="absolute top-2 right-2 text-red-500 hover:text-red-700 group">
      <svg class="h-6 w-6 fill-current"><use href="#delete"></use></svg>
      <span class="absolute -top-8 right-0 bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
        Delete device
      </span>
    </button>

    <div class="flex flex-col space-y-2">
      <!-- Informations de l'entité -->
      <div>
        <p class="text-sm font-medium text-gray-600">{{ getNameWithEntityType(newEntity) }}</p>
        <p class="text-xs text-gray-400">{{ newEntity.type }}</p>
      </div>

      <!-- Interrupteur pour on/off -->
      <div
        v-if="newEntity.status === 'on' || newEntity.status === 'off'"
        class="flex items-center space-x-2">
        <span
          class="text-sm font-semibold"
          :class="{
            'text-green-600': newEntity.status === 'on',
            'text-red-600': newEntity.status === 'off'
          }">
          {{ newEntity.status }}
        </span>
        <label class="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            class="sr-only peer"
            :checked="newEntity.status === 'on'"
            @input="toggleEntityStatus"/>
          <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500"></div>
          <div class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
        </label>
      </div>
    </div>

    <!-- Affichage des valeurs de capteurs -->
    <div
      v-if="newEntity.type === 'sensor'"
      class="mt-4">
      <p
        v-if="newEntity.status === 'on'"
        class="text-sm font-medium text-amber-500">Temperature : {{ newEntity.value }}</p>
    </div>

    <!-- Contrôle des appareils -->
    <div
      v-else
      class="mt-4">
      <!-- Menu déroulant pour télévision -->
      <div v-if="newEntity.type === 'multimedia'">
        <label class="block text-sm font-medium text-amber-500 mb-2">Chaîne</label>
        <select
          v-model="newEntity.value"
          class="input-field"
          @change="changeEntityValue">
          <option
            v-for="channel in tvChannels"
            :key="channel"
            :value="channel">{{ channel }}</option>
        </select>
      </div>

      <!-- Barre de glissement pour lumière -->
      <div v-else-if="newEntity.type === 'light'">
        <label class="block text-sm font-medium text-amber-500 mb-2">Intensité</label>
        <input
          type="range"
          min="0"
          max="255"
          v-model="newEntity.value"
          @input="changeEntityValue"
          class="range-slider"/>
        <span class="text-sm text-amber-500">{{ newEntity.value }}</span>
      </div>

      <!-- Barre de glissement pour climatiseur -->
      <div v-else-if="newEntity.type === 'air_conditioner'">
        <label class="block text-sm font-medium text-amber-500 mb-2">Température</label>
        <input
          type="range"
          min="-20"
          max="50"
          v-model="newEntity.value"
          @input="changeEntityValue"
          class="range-slider"/>
        <span class="text-sm text-amber-500">{{ newEntity.value }}°C</span>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    entity: Object,
    tvChannels: Array,
  },
  data() {
    return { newEntity: this.entity }
  },
  methods: {
    toggleEntityStatus() {
      this.$emit("toggle-status", this.newEntity)
    },
    changeEntityValue() {
      this.$emit("change-value", this.newEntity)
    },
    getNameWithEntityType(entity) {
      switch (entity.type) {
        case "light":
          return `💡 ${entity.name}`
        case "multimedia":
          return `📺 ${entity.name}`
        case "air_conditioner":
          return `🥵 ${entity.name}`
        case "sensor":
          return `🌡️ ${entity.name}`
        case "switch":
          return `🎛️ ${entity.name}`
          
        default:
          return entity.name
      }
    },
    deleteEntity() {
      this.$emit("delete-entity", this.newEntity)
    }
  }
}
</script>
