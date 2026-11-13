export function register(on, options) {
  if (options.automaticMemory === false) return
  // This hook runs on every prompt; a missing Ref connection would otherwise
  // repeat the same diagnostic each turn of the session.
  const logged = new Set()
  const logOnce = ($, message) => {
    if (logged.has(message)) return
    logged.add(message)
    $.ui.log(message)
  }
  on('prompt.context', async ($, event, next) => {
    const context = await next(event)
    try {
      const config = JSON.parse(await $.fs.read(`${$.plugin.root}/hooks/memory.json`))
      const connection = await $.mcp.connect(config.server)
      if (!connection.isConnected) {
        logOnce(
          $,
          `Ref memory is off for this chat: Ref Plans is not connected (${connection.reason}). Connect Ref Plans or add the Ref Plans connector, then start a new chat.`,
        )
        return context
      }
      const result = await $.mcp.call(connection.server, config.tool, config.arguments)
      if (result.isError) {
        logOnce($, 'Ref memory index request failed. Try Memory list to check your Ref connection.')
        return context
      }
      const text = result.content
        .filter((part) => part.type === 'text')
        .map((part) => part.text)
        .join('\n')
      if (!text.trim()) {
        logOnce($, 'Ref memory returned no context. Try Memory list to check your Ref connection.')
        return context
      }
      return { ...context, blocks: [...context.blocks, { name: 'refMemory', text }] }
    } catch {
      logOnce(
        $,
        'Ref memory index unavailable. Check the plugin configuration and Ref connection, then start a new chat. Use Memory list to retry now.',
      )
      return context
    }
  })
}
