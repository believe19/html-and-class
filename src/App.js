import { useEffect, useState } from "react";
import {Country, City} from "country-state-city"
import Select from "react-select";
import {  Card, Metric, Title } from "@tremor/react";
import AreaChartCard from "./component/AreaChartCard";
import LineChartCard from "./component/LineChartCard";

function App() {
  const [allCountries, setAllCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [weatherDetails, setWeatherDetails] = useState([]);

  useEffect(() =>{
    setAllCountries(
      Country.getAllCountries().map((country) => ({
      value:{
        latitude: country.latitude,
        longitude: country.longitude,
        isoCode: country.isoCode,
      },
      label: country.name,
    }))
  );
  }, []);

  const handleSelectedCountry = (option) =>{
    setSelectedCountry(option);
    setSelectedCity(null);
  };

  const handleSelectedCity = (option) =>{
    setSelectedCity(option);
  };

  const getWeatherDetails = async(e) =>{
    e.preventDefault();

    const fetchweather= await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity?.value?.latitude}&longitude=${selectedCity?.value?.longitude}&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weathercode,windspeed_180m,temperature_180m,is_day&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,uv_index_clear_sky_max,windspeed_10m_max&timezone=GMT`
    );

    const data = await fetchweather.json();

    setWeatherDetails(data);
  };

  return (
    <div className="flex max-w-7xl mx-auto space-x-1">
      {/* sidebar */}
      <div className="flex flex-col space-y-3 h-screen bg-blue-950 p-3 w-[25%]">
        {/* form */}
        <Select
         options={allCountries} 
         value={selectedCountry} 
         onChange={handleSelectedCountry}
        />

        <Select
          options={City.getCitiesOfCountry(selectedCountry?.value?.isoCode).map(
            (city) => ({
              value: {
                latitude: city.latitude,
                longitude: city.longitude,
              },
              label: city.name,
            })
            )}
            value={selectedCity}
            onChange={handleSelectedCity}
        />
        <button onClick={getWeatherDetails} className="bg-green-400 py-3 w-full text-white text-sm font-bold
        hover:scale-105 transition-all duration-200 ease-in-out" >
          Get Weather
        </button>

        <div className="flex flex-col space-y-2 text-white font-semibold" >
          <p>
            {selectedCountry?.label} | {selectedCity?.label}
          </p>
          <p>
            Coordinates: {selectedCity?.value?.longitude} | {" "}
            {selectedCity?.value?.latitude} 
          </p>
        </div>

        <div> {/* sunrise / sunset */}</div>
      </div>

      {/* body */}
      <div className="w-[75%] h-screen">
        <div className="flex items-center">
          <Card 
          decoration="top"
          decorationColor="green" 
          className="bg-gray-300 text-center"
          >
            <Title className="text-gray-600">Wind Speed</Title>
            <Metric>
            {weatherDetails?.daily?.windspeed_10m_max[0]} Km/h
            </Metric>
          </Card>
          <Card 
          decoration="top"
          decorationColor="red" 
          className="bg-gray-300 text-center"
          >
            <Title className="text-gray-600">Temperature</Title>
            <Metric>
              {weatherDetails?.daily?.temperature_2m_max[0]} 	&#8451;
            </Metric>
          </Card>
          <Card 
          decoration="top"
          decorationColor="blue" 
          className="bg-gray-300 text-center"
          >
            <Title className="text-gray-600">UV Index</Title>
            <Metric>
            {weatherDetails?.daily?.uv_index_max[0]}
            </Metric>
          </Card>
        </div>
        
        <div>
          <AreaChartCard weatherDetails={weatherDetails}/>
          <LineChartCard weatherDetails={weatherDetails}/>
        </div>
      </div>
    </div>
  );
}

export default App;
