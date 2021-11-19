import type {NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

async function getGame(gameName: string){
    var result = await prisma.game.findUnique({
        where: {
            name: gameName,
        }
    })
    return result
}


const main = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        var gameName = req.body.gameName
        var result = await getGame(gameName)

        if (result == null) {
            res.status(500).json({error: true, message: "game not found"})
            return
        } else {
            res.status(200).json({error: false, game: result})
            return
        }
    }
}

export default main