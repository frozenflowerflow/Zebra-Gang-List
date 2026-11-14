const express = require('express');
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
app.use(express.json());

const PACKS_PATH = path.join(__dirname, 'data', 'packs.json');
const DB_PATH = path.join(__dirname, 'data', 'app.db');
const PACK_MAP_PATH = path.join(__dirname, 'data', 'pack_level_map.json');

// Initialize DB and run migrations
const db = new Database(DB_PATH);

function migrate() {
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      points INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS user_completed_levels (
      user_id TEXT,
      level_key TEXT,
      PRIMARY KEY(user_id, level_key)
    );

    CREATE TABLE IF NOT EXISTS user_claimed_packs (
      user_id TEXT,
      pack_id TEXT,
      PRIMARY KEY(user_id, pack_id)
    );

    CREATE TABLE IF NOT EXISTS packs (
      id TEXT PRIMARY KEY,
      title TEXT,
      description TEXT,
      pointsReward INTEGER,
      verifier TEXT
    );

    CREATE TABLE IF NOT EXISTS pack_levels (
      pack_id TEXT,
      level_index INTEGER,
      level_key TEXT,
      level_title TEXT,
      PRIMARY KEY(pack_id, level_index)
    );
  `);
}
