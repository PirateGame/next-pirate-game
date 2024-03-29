import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { ToastContainer, toast } from 'react-toastify'

export const siteTitle = 'The Pirate Game'

export default function Layout({
    children,
    home
}: {
    children: React.ReactNode
    home?: boolean
}) {
    return (
        <div>
            <Script defer data-domain="pirategame.alexpegg.uk" src="https://analytics.alexpegg.uk/js/script.js"></Script>

            <Head>
                <link rel="shortcut icon" href="/pirate.ico" />
                <title>{siteTitle}</title>
                <meta
                    name="description"
                    content="Play the pirate game with your friends"
                />
                <meta
                    property="og:image"
                    content={`https://og-image.vercel.app/${encodeURI(
                        siteTitle
                    )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
                />
                <meta name="og:title" content={siteTitle} />
                <meta name="twitter:card" content="summary_large_image" />
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6284416950782621"
                    crossOrigin="anonymous">
                </script>
            </Head>
            <ToastContainer />
            <main>{children}</main>
        </div>
    )
}