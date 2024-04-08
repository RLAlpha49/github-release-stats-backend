/* global describe, beforeAll, it, expect, afterAll */

const request = require('supertest')
const { run, client } = require('../src/index')

let server

// Before all tests, start the server
beforeAll(async () => {
  server = await run()
}, 20000)

const username = 'RLAlpha49'
const repos = ['Idle-Slayer-Script', 'Anilist-Manga-Updater', 'Anilist-Follower-And-Liking-Tool']

repos.forEach(repo => {
  describe(`POST /github-release-stats/api/save-stats/${username}/${repo}`, () => {
    it('saves stats and responds with json', async () => {
      const response = await request(server)
        .post(`/github-release-stats/api/save-stats/${username}/${repo}`)
        .expect(200)
        .expect('Content-Type', /json/)

      // Add more assertions based on the structure of your response
      expect(response.body).toHaveProperty('message', 'Stats saved successfully')
    })
  })

  describe(`GET /github-release-stats/api/get-stats/${username}/${repo}`, () => {
    it('retrieves stats and responds with json', async () => {
      const response = await request(server)
        .get(`/github-release-stats/api/get-stats/${username}/${repo}`)
        .expect(200)
        .expect('Content-Type', /json/)

      // Add more assertions based on the structure of your response
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty('username', username)
      expect(response.body).toHaveProperty('repo', repo)
    })
  })
})

// After all tests, close the server
afterAll(async () => {
  if (server) {
    await new Promise(resolve => server.close(resolve))
  }
  await client.close()
}, 20000)
