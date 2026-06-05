import { createClient } from '@libsql/client'

export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || 'libsql://mundodisney-xblad3yx.aws-us-east-1.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODAxNzk5MzEsImlkIjoiMDE5ZTdhZmQtY2UwMS03YzdjLTgxODktMTFjMzFlODBkZTQwIiwicmlkIjoiMTc4N2NkOGItMGE3NS00NmViLTg5OWMtZDViZGZjMTMzNWU3In0.wUADk1xv_6eW3HKSYNsCJPake8xwwyxWx3PWO8CyoFuTfnnHZfacdC06Aw_Xv_NWOE0Kh6Ed2bv2tyzD13uhAQ'
})
