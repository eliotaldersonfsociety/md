require('dotenv').config({ path: '.env.local' })
const crypto = require('crypto')
const { createClient } = require('@libsql/client')

async function main() {
  const turso = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_DATABASE_AUTH_TOKEN
  })

  const username = process.argv[2] || 'admin'
  const password = process.argv[3]

  if (!password) {
    console.error('Usage: node scripts/create-admin.js <username> <password>')
    process.exit(1)
  }

  const salt = crypto.randomBytes(16).toString('hex')
  const passwordHash = crypto.scryptSync(password, salt, 64).toString('hex')

  try {
    await turso.execute({
      sql: 'INSERT INTO admin_users (username, password_hash, salt) VALUES (?, ?, ?)',
      args: [username, passwordHash, salt]
    })
    console.log('Admin user "' + username + '" created successfully')
  } catch (e) {
    if (e.message && e.message.includes('UNIQUE')) {
      console.log('User "' + username + '" already exists, updating password...')
      await turso.execute({
        sql: 'UPDATE admin_users SET password_hash = ?, salt = ? WHERE username = ?',
        args: [passwordHash, salt, username]
      })
      console.log('Admin user "' + username + '" updated successfully')
    } else {
      console.error('Error:', e.message)
      process.exit(1)
    }
  }
}

main().catch(console.error)