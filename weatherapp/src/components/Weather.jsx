import React, { useEffect } from 'react'
import './Weather.css'
import searchIcon from '../assets/search.png'
import clearIcon from '../assets/clear.png'
import cloudIcon from '../assets/cloud.png'
import drizzleIcon from '../assets/drizzle.png'
import humidityIcon from '../assets/humidity.png'
import rainIcon from '../assets/rain.png'
import snowIcon from '../assets/snow.png'
import windIcon from '../assets/wind.png'
import { useState } from 'react';


const Weather = () => {

    const search = async (city) => {
        try {
           const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_APP_ID}`; 

           const response = await fetch(url);
           const data = await response.json();
           console.log(data);
        } catch (error) {
            
        }
    }

    useEffect(() =>{
        search("London");
    }, [])

  const [icon, setIcon] = useState(clearIcon);
  return (
    <div className='weather'>
        <div className='search-bar'>
            <div className='search-input'>
                <input type="text" name="" id="Search" placeholder="Enter city name" />
                <img src={searchIcon} alt="search" />
            </div>
            <img src={icon} alt="weather condition" className='weather-icon'/>
            <p className='temperature'>15°C</p>
            <p className='location'>London</p>
            <div className='weather-data'>
                <div className='col'>
                    <img src={humidityIcon} alt="humidity icon" />
                    <div>
                        <p>91%</p>
                        <span>Humidity</span>
                    </div>
                </div>
                <div className='col'>
                    <img src={windIcon} alt="wind icon" />
                    <div>
                        <p>91%</p>
                        <span>Wind</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Weather