# 工具函数文档

本目录包含了项目中使用的所有工具函数，按功能分类组织。

## 目录结构

```
utils/
├── index.ts          # 工具函数索引文件
├── README.md         # 本文档
└── ../utils.ts       # 主要工具函数实现
```

## 功能分类

### 1. 连接相关工具函数

#### `sendCheckConnection(callback)`

发送检查连接状态的消息到后台脚本。

```typescript
import { sendCheckConnection } from '@/utils/index'

await sendCheckConnection((connected: boolean) => {
  console.log('连接状态:', connected)
})
```

#### `sendEventToBackground(eventName, data)`

发送事件到后台脚本。

```typescript
import { sendEventToBackground } from '@/utils/index'

await sendEventToBackground('sendParamsToBackground', { bvId: 'BV123456' })
```

### 2. URL 解析工具函数

#### `isBilibiliVideoPage(url)`

检测当前页面是否为 Bilibili 视频播放页面。

```typescript
import { isBilibiliVideoPage } from '@/utils/index'

const isVideoPage = isBilibiliVideoPage(
  'https://www.bilibili.com/video/BV123456'
)
// 返回: true
```

#### `parseBilibiliVideoUrl(url)`

解析 Bilibili 视频 URL 参数。

```typescript
import { parseBilibiliVideoUrl } from '@/utils/index'

const params = parseBilibiliVideoUrl(
  'https://www.bilibili.com/video/BV123456?p=1'
)
// 返回: { bvId: 'BV123456', p: '1' }
```

#### `getPageTypeDescription(url)`

获取页面类型描述。

```typescript
import { getPageTypeDescription } from '@/utils/index'

const type = getPageTypeDescription('https://www.bilibili.com/video/BV123456')
// 返回: 'Bilibili 视频页面'
```

### 3. 页面类型信息工具函数

#### `getPageTypeInfo(type)`

获取页面类型对应的图标和颜色信息。

```typescript
import { getPageTypeInfo } from '@/utils/index'

const info = getPageTypeInfo('Bilibili 其他页面')
// 返回: { icon: 'Info', color: 'info', message: '...' }
```

### 4. 浏览器操作工具函数

#### `goToBilibili()`

跳转到 Bilibili 首页。

```typescript
import { goToBilibili } from '@/utils/index'

goToBilibili() // 在新标签页打开 Bilibili
```

#### `copyToClipboard(text, successMessage?, errorMessage?)`

复制文本到剪贴板。

```typescript
import { copyToClipboard } from '@/utils/index'

await copyToClipboard('要复制的文本', '复制成功', '复制失败')
```

#### `getCurrentTabUrl()`

获取当前活动标签页的 URL。

```typescript
import { getCurrentTabUrl } from '@/utils/index'

const url = await getCurrentTabUrl()
// 返回: 'https://www.bilibili.com/video/BV123456'
```

### 5. 验证工具函数

#### `isValidUrl(url)`

验证 URL 是否有效。

```typescript
import { isValidUrl } from '@/utils/index'

const isValid = isValidUrl('https://www.bilibili.com')
// 返回: true
```

#### `isBilibiliDomain(url)`

验证是否为 Bilibili 域名。

```typescript
import { isBilibiliDomain } from '@/utils/index'

const isBilibili = isBilibiliDomain('https://www.bilibili.com/video/BV123456')
// 返回: true
```

### 6. 错误处理工具函数

#### `showError(message, error?)`

显示错误消息。

```typescript
import { showError } from '@/utils/index'

showError('操作失败', error)
```

#### `showWarning(message)`

显示警告消息。

```typescript
import { showWarning } from '@/utils/index'

showWarning('请确认当前页面')
```

#### `showSuccess(message)`

显示成功消息。

```typescript
import { showSuccess } from '@/utils/index'

showSuccess('操作成功')
```

## 使用示例

### 在 Vue 组件中使用

```vue
<script setup lang="ts">
import {
  isBilibiliVideoPage,
  parseBilibiliVideoUrl,
  sendEventToBackground,
  showWarning
} from '@/utils/index'

const url = 'https://www.bilibili.com/video/BV123456'

// 检查是否为视频页面
if (!isBilibiliVideoPage(url)) {
  showWarning('请确认当前源为b站视频播放页面')
  return
}

// 解析 URL 参数
const params = parseBilibiliVideoUrl(url)
if (params) {
  await sendEventToBackground('sendParamsToBackground', params)
}
</script>
```

### 在工具函数中使用

```typescript
import {
  getCurrentTabUrl,
  isBilibiliVideoPage,
  getPageTypeDescription
} from '@/utils/index'

async function analyzeCurrentPage() {
  const url = await getCurrentTabUrl()
  const isVideoPage = isBilibiliVideoPage(url)
  const pageType = getPageTypeDescription(url)

  return { url, isVideoPage, pageType }
}
```

## 注意事项

1. 所有工具函数都支持 TypeScript 类型检查
2. 异步函数都返回 Promise，需要使用 await 或 .then() 处理
3. 错误处理函数会自动显示消息，无需手动调用 window.$message
4. 浏览器 API 相关函数需要在浏览器扩展环境中使用
5. URL 解析函数会进行错误处理，无效 URL 会返回 null 或 false

## 扩展建议

如需添加新的工具函数：

1. 在 `utils.ts` 中添加函数实现
2. 在 `utils/index.ts` 中导出新函数
3. 更新本文档说明新函数的用法
4. 添加相应的 TypeScript 类型定义
