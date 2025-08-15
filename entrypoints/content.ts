export default defineContentScript({
  matches: ['*://*.bilibili.com/*'],
  async main(ctx) {
    console.log('Hello content.')
    // 3. Define your UI
    const ui = await createShadowRootUi(ctx, {
      name: 'example-ui',
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        console.log(container)
      },
      onRemove: (_app) => {
      },
    })

    // 4. Mount the UI
    ui.mount()
  },

})
