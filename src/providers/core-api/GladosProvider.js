import coreApiClient from "@/providers/core-api/CoreApi"

export default {
  getEntities() {
    return coreApiClient.sendRequest("get", "/entities", {})
  },
  getRooms() {
    return coreApiClient.sendRequest("get", "/rooms", {})
  },
  updateEntites(id, data) {
    return coreApiClient.sendRequest("patch", `/entities?id=${id}`, data)
  }
}
