import { SendMessageResponse } from "./app";

export async function sendCheckConnection(callback: (connected: boolean) => void) {
  const eventType = 'checkConnection'
  const response: SendMessageResponse<{ isConnected: boolean }> = await chrome.runtime.sendMessage({
    type: eventType,
  })

  if (!response) {
    window.$message.warning(`事件 "${eventType}" 已发送，但后台脚本未响应。`);
    return
  }
  const { data } = response
  callback(data.isConnected)
}
