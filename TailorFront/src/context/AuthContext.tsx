import React, { createContext, useContext, useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'
import * as SecureStore from 'expo-secure-store'
import { AUTH_SERVER } from '@/constants'

interface AuthProps {
  authState?: {
    token: string | null
    authenticated: boolean | null
    id: number | null
  }
  onRegister?: (email: string, password: string) => Promise<any>
  onLogin?: (email: string, password: string) => Promise<any>
  onLogout?: () => Promise<any>
}

const TOKEN_KEY = 'my-jwt'
const REFRESH_TOKEN_KEY = 'my-refresh-token'
const AuthContext = createContext<AuthProps>({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null
    authenticated: boolean | null
    id: number | null
  }>({
    token: null,
    authenticated: null,
    id: null,
  })

  useEffect(() => {
    const loadToken = async () => {
      // TODO : remove comments when authentication is implemented
      // const token = await SecureStore.getItemAsync(TOKEN_KEY)
      // if (token) {
      //   try {
      //     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      //     await axios.get(`${AUTH_URL}/validate`)
      //     setAuthState({ token, authenticated: true })
      //   } catch (error) {
      //     await renewToken()
      //   }
      // } else {
      //   setAuthState({ token: null, authenticated: false })
      // }
      setAuthState({ token: null, authenticated: false, id: null })
    }
    loadToken()
  }, [])

  const renewToken = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY)
      const response = await axios.post(`${AUTH_SERVER}/renew`, {
        refreshToken,
      })
      const newToken = response.data.token
      const newRefreshToken = response.data.refreshToken

      await SecureStore.setItemAsync(TOKEN_KEY, newToken)
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, newRefreshToken)

      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

      setAuthState({ ...authState, token: newToken, authenticated: true })
    } catch (error) {
      await logout()
      throw error
    }
  }

  const register = async (email: string, password: string) => {
    try {
      const { data } = await axios.post(`${AUTH_SERVER}/register`, {
        email,
        password,
      })
      return { error: false }
    } catch (error) {
      return { error: true, msg: (error as any).response.data.msg }
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const { data } = await axios.post(`${AUTH_SERVER}/auth/authenticate`, {
        email,
        password,
      })

      await SecureStore.setItemAsync(TOKEN_KEY, data.access_token)
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, data.refresh_token)

      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      setAuthState({
        token: data.token,
        authenticated: true,
        id: data.user_id,
      })
      return { error: false }
    } catch (error) {
      return { error: true, msg: (error as any).response.data.msg }
    }
  }

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY)
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY)
    setAuthState({ token: null, authenticated: false, id: null })
    delete axios.defaults.headers.common['Authorization']
  }

  axios.interceptors.response.use(
    (response) => {
      return response
    },
    async (error: AxiosError) => {
      if (error.response && error.response.status === 401) {
        try {
          await renewToken()
          // Retry the original request
          return axios(error.config)
        } catch (error) {
          await logout()
          throw error
        }
      }
      return Promise.reject(error)
    }
  )

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
