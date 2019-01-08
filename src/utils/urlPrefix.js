import { getSession } from '@/utils/auth'
const urlPrefix = getPrefix()
function getPrefix() {
  let sessionData = JSON.parse(getSession('userInfo'))
  return sessionData.OSS_CDN_DOMAIN
}
export default urlPrefix
