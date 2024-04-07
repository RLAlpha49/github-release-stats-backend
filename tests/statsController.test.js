/* global describe, beforeAll, it, expect, afterAll */

const request = require('supertest')
const { run, client } = require('../src/index')

describe('POST /api/save-stats/:username/:repo', () => {
  let server

  // Before all tests, start the server
  beforeAll(async () => {
    server = await run()
  })
  it('saves stats and responds with json', async () => {
    const username = 'RLAlpha49'
    const repo = 'Anilist-Manga-Updater'

    const response = await request(server)
      .post(`/api/save-stats/${username}/${repo}`)
      .expect(200)
      .expect('Content-Type', /json/)

    // Add more assertions based on the structure of your response
    expect(response.body).toHaveProperty('message', 'Stats saved successfully')
  })
  // After all tests, close the server
  afterAll(async () => {
    await new Promise(resolve => server.close(resolve))
    await client.close()
  })
})

describe('GET /api/get-stats/:username/:repo', () => {
  let server

  // Before all tests, start the server
  beforeAll(async () => {
    server = await run()
  })
  it('retrieves stats and responds with json', async () => {
    const username = 'RLAlpha49'
    const repo = 'Anilist-Manga-Updater'

    const response = await request(server)
      .get(`/api/get-stats/${username}/${repo}`)
      .expect(200)
      .expect('Content-Type', /json/)

    // Add more assertions based on the structure of your response
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('username', username)
    expect(response.body).toHaveProperty('repo', repo)
  })
  // After all tests, close the server
  afterAll(async () => {
    await new Promise(resolve => server.close(resolve))
    await client.close()
  })
})
