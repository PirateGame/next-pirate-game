import Router from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '../components/Layout'


export default function Index(){
    return (
        <Layout>
            <div className="bg-generic">
                <h1 className="title3">The</h1>
                <h1 className="title1">Pirate</h1>
                <h1 className="title2">Game</h1>
                <h1 className="subtitle1">Conquer the seven seas!</h1>
                <div className="mainMenu">
                    <ul id="menuUL">
                        <li className="bg-index-0 bg-opacity-25">
                            <Link href='/QuickPlay'>Quick Play</Link>
                        </li>
                        <li className="bg-index-1 bg-opacity-25">
                            <Link href='/Join'>Join Game</Link>
                        </li>
                        <li className="bg-index-2 bg-opacity-25">
                            <Link href='/Host'>Host Game</Link>
                        </li>
                        <li className="bg-index-3 bg-opacity-25">
                            <Link href='/Rules'>Rules</Link>
                        </li>
                        <li id="inputLI">
                        </li>
                    </ul>
                <h1 className="bottomText1">v3</h1>
                <h1 className="bottomText1">Developed by</h1>
                <h1 className="bottomText2">Alex Pegg</h1>
                </div>
            </div>
        </Layout>
    )
}
