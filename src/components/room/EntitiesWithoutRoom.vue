<template>
  <div class="container-box-no-room relative">
    <h2 class="title-heading">Appareils sans pièce</h2>
    <ul>
      <EntityControl
        v-for="entity in entitiesWithoutRoom"
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
    entitiesWithoutRoom: Array,
    tvChannels: Array,
  },
  components: { EntityControl, },
  methods: {
    toggleEntityStatus(entity) {
      this.$emit("toggle-status", entity)
    },
    changeEntityValue(entity) {
      this.$emit("change-value", entity)
    },
    deleteEntity(entity) {
      this.$emit("delete-entity", entity)
    }
  }
}
</script>
