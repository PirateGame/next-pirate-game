/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    SOCKET_URL: process.env.SOCKET_URL,
    PASSWORD: process.env.PASSWORD,
  }
}
