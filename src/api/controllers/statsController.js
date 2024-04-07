const { MongoClient } = require('mongodb')
const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)
const { Octokit } = require('@octokit/rest')
const octokit = new Octokit()

// Save stats to database
async function saveStats (req, res) {
  const username = req.params.username
  const repo = req.params.repo

  try {
    const response = await octokit.paginate('GET /repos/{owner}/{repo}/releases', {
      owner: username,
      repo,
      per_page: 100
    })

    if (response.length === 0) {
      res.status(404).json({ message: 'There are no releases for this project' })
    } else {
      const statsPromises = response.map(async (release) => {
        // eslint-disable-next-line camelcase
        const { tag_name: releaseTag, html_url: releaseURL, assets: releaseAssets, author: authorObj, published_at } = release
        const hasAssets = releaseAssets.length !== 0
        const releaseAuthor = authorObj ? { html_url: authorObj.html_url, login: authorObj.login } : null
        const hasAuthor = releaseAuthor != null
        // eslint-disable-next-line camelcase
        const publishDate = published_at.split('T')[0]
        let ReleaseDownloadCount = 0
        const assets = []

        if (hasAssets) {
          const assetsPromises = releaseAssets.map(async (asset) => {
            const { name, size, updated_at: lastUpdate, download_count: downloadCount, browser_download_url: browserDownloadUrl } = asset
            const assetSize = (size / 1048576.0).toLocaleString(undefined, { maximumFractionDigits: 2 })
            ReleaseDownloadCount += downloadCount

            // Add asset information to the assets array
            assets.push({
              name,
              size: assetSize,
              lastUpdate,
              downloadCount,
              browserDownloadUrl
            })
          })

          await Promise.all(assetsPromises)
        }

        return {
          releaseTag,
          releaseURL,
          hasAssets,
          releaseAuthor,
          hasAuthor,
          publishDate,
          ReleaseDownloadCount,
          assets
        }
      })

      const stats = await Promise.all(statsPromises)

      let timestamp = new Date().toISOString() // Get the current timestamp in ISO format
      timestamp = timestamp.replace('T', '_') // Replace 'T' with '_'
      timestamp = timestamp.slice(0, -5) // Remove the last 5 characters (".sssZ")

      await client.connect()
      const collection = client.db('GithubReleaseStats').collection('stats')

      // Save the stats under a timestamp key in the stats object
      const update = {
        $set: {
          [`stats.${timestamp}`]: stats
        }
      }

      // Update the document for the user and repo, upserting if it doesn't exist
      await collection.updateOne({ username, repo }, update, { upsert: true })

      res.status(200).json({ message: 'Stats saved successfully' })
    }
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'An error occurred while fetching the stats.' })
  }
}

// Retrieve stats from database
async function getStats (req, res) {
  const username = req.params.username
  const repo = req.params.repo

  await client.connect()
  const collection = client.db('GithubReleaseStats').collection('stats')
  const stats = await collection.findOne({ username, repo })

  console.log(JSON.stringify(stats, null, 2))

  res.status(200).json(stats)
}

module.exports = {
  saveStats,
  getStats
}
