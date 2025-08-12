import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'

// 定义 Socket.IO 服务器的地址和端口
// 确保与 Electron 客户端监听的地址和端口一致
const SOCKET_SERVER_URL = 'http://localhost:25885' // 注意是 http:// 而不是 ws://

let socket: Socket | null = null

// 定义连接 Socket.IO 服务器的函数
function connectSocketServer() {
  if (socket && socket.connected) {
    console.log('Socket.IO 客户端已连接，无需重复连接。')
    return
  }

  console.log('尝试连接 Socket.IO 服务器...')

  // 使用 io() 函数连接服务器
  socket = io(SOCKET_SERVER_URL, {
    // 可以在这里添加一些配置，例如超时时间、认证信息等
    reconnection: false, // 允许自动重连
    // reconnectionAttempts: 5, // 尝试重连 5 次
    // reconnectionDelay: 1000, // 每次重连间隔 1 秒
    transports: ['websocket', 'polling'], // 优先使用 WebSocket
  })

  // 监听连接成功事件
  socket.on('connect', () => {
    console.log('Socket.IO 客户端已成功连接到 Electron 服务器！Socket ID:', socket?.id)
    // 连接成功后，可以立即发送一些身份信息
    socket?.emit('browserPluginConnected', {
      message: 'Hello Electron! This is the Bilibili Helper plugin.',
      browser: 'chrome', // 或者根据实际浏览器判断
    })
  })

  // 监听连接断开事件
  socket.on('disconnect', (reason: Socket.DisconnectReason) => {
    console.log(`Socket.IO 客户端已断开连接: ${reason}`)
    // 如果是意外断开，可以尝试重新连接 (如果 reonnection: true 没起作用)
    if (reason === 'io server disconnect') {
      // 服务器主动断开，可能需要特殊处理
    }
  })

  // 监听连接错误事件
  socket.on('connect_error', (err: Error) => {
    console.error('Socket.IO 连接错误:', err.message)
    // 这里可以添加错误提示或日志记录
  })

  // 监听来自服务器的自定义事件（例如，Electron 服务器发送的数据）
  socket.on('dataFromElectron', (data: any) => {
    console.log('从 Electron 服务器收到数据:', data)
    // 在这里处理来自 Electron 的数据，例如更新插件状态、向内容脚本发送消息等
    // 例：向所有内容脚本发送消息
    // chrome.tabs.query({}, (tabs) => {
    //   tabs.forEach(tab => {
    //     if (tab.id) {
    //       chrome.tabs.sendMessage(tab.id, { type: 'UPDATE_UI', payload: data });
    //     }
    //   });
    // });
  })

  // 监听 Electron 服务器发出的确认消息
  socket.on('dataReceivedAck', (data) => {
    console.log('收到 Electron 服务器的确认:', data)
  })
}

// 在后台脚本启动时连接 Socket.IO
// defineBackground 是 WXT 推荐的后台脚本入口函数
export default defineBackground({
  type: 'module',
  main() {
    console.log('WXT 后台脚本正在启动...')
    connectSocketServer()

    // sendResponse 回调函数可以用来向发送者返回数据
    chrome.runtime.onMessage.addListener(({ type, payload }, _sender, sendResponse) => {
      console.log('后台脚本收到消息: 消息类型为=> ', type)

      switch (type) {
        case 'sendParamsToBackground': {
          const params = payload
          console.log('后台脚本正在处理从 Popup 接收到的 URL 参数:', params)

          if (socket && socket.connected) {
            sendDataToElectron('sendDataToElectron', params)
            sendResponse({ status: 'success', message: '参数已发送到 Electron 服务器。' })
          } else {
            sendResponse({ status: 'error', message: 'Socket.IO 未连接，无法发送参数。' })
          }

          // 必须返回 true 来指示你将异步地调用 sendResponse
          return true
        }
        case 'OTHER_EVENT': {
          console.log('收到其他事件:', payload)
          sendResponse({ status: 'acknowledged', message: '收到其他事件。' })
          return true
        }

        case 'checkConnection': {
          const isConnected = socket?.connected
          sendResponse({ status: 'success', message: '检测成功', data: { isConnected } })

          if (!isConnected) {
            socket?.connect()
            if (socket?.connected) {
              sendResponse({ status: 'success', message: '重连成功', data: { isConnected } })
            }
          }
          return true
        }

        default: {
          return false
        }
      }
    })
  },
})

// 定义一个函数，供其他模块（如 Popup 或 Content Script）在需要时调用以获取 Socket 实例
export function getSocketInstance(): Socket | null {
  return socket
}

// 也可以定义一个发送函数，方便其他模块直接调用而无需直接操作 socket 对象
export function sendDataToElectron(event: string, data: any) {
  if (socket && socket.connected) {
    socket.emit(event, data)
    console.log(`已发送事件 '${event}' 到 Electron:`, data)
  } else {
    console.warn(`Socket.IO 未连接，无法发送事件 '${event}'。`)
  }
}
