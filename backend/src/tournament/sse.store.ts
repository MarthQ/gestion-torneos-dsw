import { Response } from 'express'

class SSEManager {
    private connections: Record<number, Response[]> = {}

    addConnection(tournamentId: number, res: Response) {
        if (!this.connections[tournamentId]) {
            this.connections[tournamentId] = []
        }

        this.connections[tournamentId].push(res)

        console.log(`[SSE Client] - Client connected to tournament ${tournamentId}`)
    }

    removeConnection(tournamentId: number, res: Response) {
        const tournamentConnections = this.connections[tournamentId]

        if (!tournamentConnections) return

        this.connections[tournamentId] = tournamentConnections.filter((r) => r !== res)

        if (this.connections[tournamentId].length === 0) {
            delete this.connections[tournamentId]
        }
        console.log(`[SSE Client] - Client disconnected from tournament ${tournamentId}`)
    }

    async broadcastBracketUpdate(tournamentId: number, bracketData: any) {
        const list = this.connections[tournamentId]
        if (!list) return

        // bracketData gets formmated into SSE format
        const payload = `data: ${JSON.stringify(bracketData)}\n\n`

        const validConnections = list.filter((r) => {
            try {
                r.write(payload)
                // We keep the connection if it results true
                return true
            } catch (err) {
                console.error('[SSE] Error writing to client, removing:', err)
                // We remove the client if it doesn't respond
                return false
            }
        })

        // We update the SSE connections from that tournament
        if (validConnections.length === 0) {
            delete this.connections[tournamentId]
        } else {
            this.connections[tournamentId] = validConnections
        }
    }
}

// sseManager gets exported for the singleton dessign pattern
export const sseManager = new SSEManager()
