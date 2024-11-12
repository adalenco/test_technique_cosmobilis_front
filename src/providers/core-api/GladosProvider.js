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
  },
  deleteEntity(id) {
    return coreApiClient.sendRequest("delete", `/entities?id=${id}`)
  },
  deleteRoom(id) {
    return coreApiClient.sendRequest("delete", `/rooms?id=${id}`)
  },
  createRoom(data) {
    return coreApiClient.sendRequest("post", "/rooms", data)
  },
  createEntity(data) {
    return coreApiClient.sendRequest("post", "/entities", data)
  },
}
