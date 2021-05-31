export default async function pets(app, opts) {
  app.get('/', async () => {
    return { msg: 'Hello from pets manager' }
  })
}
