const mongoose = require('mongoose')

const AssetSchema = new mongoose.Schema({
  asset_name: String,
  downloads: Number
})

const ReleaseSchema = new mongoose.Schema({
  release_version: String,
  downloads: Number,
  assets: [AssetSchema]
})

const StatsSchema = new mongoose.Schema({
  total_downloads: Number,
  releases: [ReleaseSchema]
})

const RepoSchema = new mongoose.Schema({
  repo: String,
  stats: {
    type: Map,
    of: StatsSchema
  }
})

module.exports = mongoose.model('Repo', RepoSchema)
