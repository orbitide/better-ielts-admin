import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr'

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000').replace(/\/$/, '')

let connection: HubConnection | null = null
let startPromise: Promise<void> | null = null

function getConnection(): HubConnection {
  if (!connection) {
    connection = new HubConnectionBuilder()
      .withUrl(`${API_URL}/hubs/presence`, { withCredentials: true })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build()
  }
  return connection
}

export async function ensurePresenceConnection(): Promise<HubConnection> {
  const conn = getConnection()
  if (conn.state === HubConnectionState.Connected) return conn
  if (!startPromise) {
    startPromise = conn.start().catch((err) => {
      startPromise = null
      throw err
    })
  }
  await startPromise
  return conn
}

// ─── Server → client event subscriptions ────────────────────────────────────

export function onOnlineCountChanged(handler: (count: number) => void) {
  const conn = getConnection()
  conn.on('OnlineCountChanged', handler)
  return () => conn.off('OnlineCountChanged', handler)
}
