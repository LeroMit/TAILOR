import React, { createContext, useContext, useEffect } from 'react'
import { I18n } from 'i18n-js'
import en from '@/locales/en.json'

const i18n = new I18n()

interface LocaleContextProps {
  i18n: I18n
}

const LocaleContext = createContext<LocaleContextProps>({ i18n })

export const useLocale = () => useContext(LocaleContext)

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    i18n.store({ en })
    // load the locale from the device
  }, [])

  const value = {
    i18n,
  }

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}
