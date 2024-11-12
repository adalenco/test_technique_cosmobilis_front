<template>
  <div class="container-box-room relative">
    <h2 class="title-heading">{{ room.name }}</h2>
    <!-- Bouton de suppression -->
    <button
      @click="deleteRoom"
      class="absolute top-2 right-2 text-black hover:text-red-700 group">
      <svg class="h-6 w-6 fill-current"><use href="#delete"></use></svg>
      <span class="absolute -top-8 right-0 bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
        Delete room
      </span>
    </button>
    <ul>
      <EntityControl
        v-for="entity in entitiesInRoom"
        :key="entity.id"
        :entity="entity"
        :tvChannels="tvChannels"
        @toggle-status="toggleEntityStatus"
        @change-value="changeEntityValue"
        @delete-entity="deleteEntity"/>
    </ul>
  </div>
</template>

<script>
import EntityControl from "@/components/entityControl/EntityControl.vue"

export default {
  props: {
    room: Object,
    entitiesInRoom: Array,
    tvChannels: Array,
  },
  components: { EntityControl },
  methods: {
    toggleEntityStatus(entity) {
      this.$emit("toggle-status", entity)
    },
    changeEntityValue(entity) {
      this.$emit("change-value", entity)
    },
    deleteEntity(entity) {
      this.$emit("delete-entity", entity)
    },
    deleteRoom() {
      this.$emit("delete-room", this.room)
    }
  }
}
</script>
