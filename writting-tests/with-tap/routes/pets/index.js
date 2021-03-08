export default async function pets(app, opts) {
  app.get('/', async () => {
    return { hello: 'world from pets' }
  })
}
