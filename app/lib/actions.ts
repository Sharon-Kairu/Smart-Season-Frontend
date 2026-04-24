import { NextResponse } from 'next/server'

export async function handleLogin(userId: string, accessToken: string, refreshToken: string) {
  const response = NextResponse.json({ success: true })

  response.cookies.set('session_userid', userId, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  response.cookies.set('session_access_token', accessToken, {
    httpOnly: true,
    maxAge: 60 * 60,
    path: '/',
  })
  response.cookies.set('session_refresh_token', refreshToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return response
}