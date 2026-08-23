import { useState, useEffect } from 'preact/hooks'

export function useSessionStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    const readValue = (): T => {
        if (typeof window === 'undefined') {
            return initialValue
        }
        try {
            const item = window.sessionStorage.getItem(key)
            return item ? (JSON.parse(item) as T) : initialValue
        } catch (error) {
            console.warn(`Error reading sessionStorage key "${key}":`, error)
            return initialValue
        }
    }

    const [storedValue, setStoredValue] = useState<T>(readValue)

    const setValue = (value: T | ((val: T) => T)) => {
        if (typeof window === 'undefined') {
            console.warn(`Tried setting sessionStorage key "${key}" even though window is not defined`)
            return
        }
        try {
            const newValue = value instanceof Function ? value(storedValue) : value
            window.sessionStorage.setItem(key, JSON.stringify(newValue))
            setStoredValue(newValue)
        } catch (error) {
            console.warn(`Error setting sessionStorage key "${key}":`, error)
        }
    }

    useEffect(() => {
        setStoredValue(readValue())
    }, [key])

    return [storedValue, setValue]
}