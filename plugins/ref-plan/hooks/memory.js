export function register(on, options) {
  if (options.automaticMemory === false) return
  on('prompt.context', async ($, event, next) => {
    const context = await next(event)
    try {
      const config = JSON.parse(await $.fs.read(`${$.plugin.root}/hooks/memory.json`))
      const connection = await $.mcp.connect(config.server)
      if (!connection.isConnected) {
        $.ui.log(
          `Ref memory could not connect (${connection.reason}). Connect Ref and start a new chat.`,
        )
        return context
      }
      const result = await $.mcp.call(connection.server, config.tool, config.arguments)
      if (result.isError) {
        $.ui.log('Ref memory index request failed. Try Memory list to check your Ref connection.')
        return context
      }
      const text = result.content
        .filter((part) => part.type === 'text')
        .map((part) => part.text)
        .join('\n')
      if (!text.trim()) {
        $.ui.log('Ref memory returned no context. Try Memory list to check your Ref connection.')
        return context
      }
      return { ...context, blocks: [...context.blocks, { name: 'refMemory', text }] }
    } catch {
      $.ui.log(
        'Ref memory index unavailable. Check the plugin configuration and Ref connection, then start a new chat. Use Memory list to retry now.',
      )
      return context
    }
  })
}
