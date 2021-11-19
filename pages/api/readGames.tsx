import type {NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

async function getGames(){
    var result = await prisma.game.findMany()
    return result
}


const main = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        var result = await getGames()

        if (result == null) {
            res.status(500).json({error: true, message: "no games"})
            return
        } else {
            res.status(200).json({error: false, games: result})
            return
        }
    }
}

export default main