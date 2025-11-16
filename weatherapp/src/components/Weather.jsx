import React, { useEffect, useState } from 'react'
import './Weather.css'
import searchIcon from '../assets/search.png'
import clearIcon from '../assets/clear.png'
import cloudIcon from '../assets/cloud.png'
import drizzleIcon from '../assets/drizzle.png'
import humidityIcon from '../assets/humidity.png'
import rainIcon from '../assets/rain.png'
import snowIcon from '../assets/snow.png'
import windIcon from '../assets/wind.png'

const mapWeatherCodeToIcon = (code) => {
    // Basic mapping for Open-Meteo weather codes
    if (code === 0) return clearIcon
    if (code >= 1 && code <= 3) return cloudIcon
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return rainIcon
    if (code >= 71 && code <= 77) return snowIcon
    if (code >= 45 && code <= 48) return drizzleIcon
    return clearIcon
}

const Weather = () => {
    const [city, setCity] = useState('London')
    const [weather, setWeather] = useState(null)
    const [icon, setIcon] = useState(clearIcon)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const search = async (q) => {
        const name = (q || city).trim()
        if (!name) return
        setLoading(true)
        setError('')
        try {
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1`
            const geoRes = await fetch(geoUrl)
            const geoData = await geoRes.json()
            if (!geoData || !geoData.results || geoData.results.length === 0) {
                setError('City not found')
                setWeather(null)
                setIcon(clearIcon)
                setLoading(false)
                return
            }

            const place = geoData.results[0]
            const lat = place.latitude
            const lon = place.longitude

            // Fetch current weather + hourly humidity
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m&timezone=auto`
            const wRes = await fetch(weatherUrl)
            const wData = await wRes.json()

            if (!wData || !wData.current_weather) {
                setError('Weather data not available')
                setLoading(false)
                return
            }

            const current = wData.current_weather
            // find humidity for current time (match hourly.time)
            let humidity = null
            if (wData.hourly && wData.hourly.time && wData.hourly.relativehumidity_2m) {
                const idx = wData.hourly.time.indexOf(current.time)
                if (idx !== -1) humidity = wData.hourly.relativehumidity_2m[idx]
            }

            const result = {
                name: place.name,
                temp: current.temperature,
                wind: current.windspeed,
                humidity: humidity,
                code: current.weathercode
            }

            setWeather(result)
            setIcon(mapWeatherCodeToIcon(current.weathercode))
        } catch (err) {
            console.error(err)
            setError('Error fetching weather')
            setWeather(null)
            setIcon(clearIcon)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        
        search('London')
        
    }, [])

    return (
        <div className='weather'>
            <div className='weather-card'>
                <div className='search-row'>
                    <input
                        className='search-field'
                        type='text'
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && search(city)}
                        placeholder='Enter city name (e.g. Tokyo)'
                        aria-label='City'
                    />
                    <button
                        className='search-btn'
                        onClick={async () => { await search(city); setCity('') }}
                        disabled={loading}
                        aria-label='Search'
                    >
                        {loading ? <span className='dot-loader'/> : <img src={searchIcon} alt='search' />}
                    </button>
                </div>

                {error && <div className='error'>{error}</div>}

                <div className='main-row'>
                    <div className='left'>
                        <div className='icon-wrap'>
                            <img src={icon} alt='condition' className='weather-icon' />
                        </div>
                        <div className='temp-block'>
                            <div className='temperature'>{weather ? `${Math.round(weather.temp)}°C` : '--°C'}</div>
                            <div className='location'>{weather ? weather.name : '—'}</div>
                        </div>
                    </div>

                    <div className='right'>
                        <div className='weather-data'>
                            <div className='col'>
                                <img src={humidityIcon} alt='humidity' />
                                <div>
                                    <p>{weather && weather.humidity !== null ? `${weather.humidity}%` : '--'}</p>
                                    <span>Humidity</span>
                                </div>
                            </div>
                            <div className='col'>
                                <img src={windIcon} alt='wind' />
                                <div>
                                    <p>{weather ? `${Math.round(weather.wind)} km/h` : '--'}</p>
                                    <span>Wind</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Weather