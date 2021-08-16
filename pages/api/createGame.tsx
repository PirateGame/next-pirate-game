import type {NextApiRequest, NextApiResponse } from 'next'

async function createGame(gameName: string, gridSizex: number, gridSizey: number) {
    //this is where we need to start the kubernetes pod
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        var gameName = req.body.gameName
        var playerName = req.body.playerName
        var gridSizex = req.body.gridSizex
        var gridSizey = req.body.gridSizey
    }
}