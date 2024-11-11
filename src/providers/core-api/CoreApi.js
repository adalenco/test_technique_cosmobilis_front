import BaseApi from "@/providers/BaseApi"
import config from "@/app.config"

class CoreApi extends BaseApi {
  get baseUrl() {
    return config.baseApiUrl
  }
}

const client = new CoreApi
export default client
