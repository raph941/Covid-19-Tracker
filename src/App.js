import React, { useState, useEffect } from "react";
import { FormControl, MenuItem, Select, Card, CardContent } from "@material-ui/core";
import InfoBox from "./components/InfoBoxes";
import Table from "./components/Table"
import Map from "./components/Map";
import LineGraph from "./components/LineGraph"
import { sortData, prettyPrintStat } from "./utils"
import "leaflet/dist/leaflet.css"; //css file for the leaflet map
import "./styles/Header.css";
import "./App.css";


function App() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 })
  const [mapZoom, setMApZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])
  const [caseType, setCaseType] = useState('cases')

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) => {setCountryInfo(data)})
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country?.country,
            value: country.countryInfo?.iso2,
          }));

          const sortedData = sortData(data) //returns a sorted data based on the cases
          setTableData(sortedData)
          setCountries(countries);
          setMapCountries(data); //we need the complete country data to plot circles on the map
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    if (countryCode=='worldwide') {
      setMApZoom(2) 
    }
    else{
      let url =
        countryCode === "worldwide"
          ? "https://disease.sh/v3/covid-19/countries/"
          : `https://disease.sh/v3/covid-19/countries/${countryCode}`; //this is a tenary oparator, so we can make an Api call to a different url when the user selects the worldwide option
   
      await fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setSelectedCountry(countryCode);
          setCountryInfo(data) // set the countryinfo state to the country the user selects on the dropdown menu

          console.log(data)
          setMapCenter({lat:data.countryInfo.lat, lng:data.countryInfo.long})
          setMApZoom(4)
        })
    }
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1 className="app__header">COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={selectedCountry}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">worldwide</MenuItem>
              {countries.map((country) => {
                return (
                  <MenuItem key={country.value} value={country.value}>
                    {country.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox caseType="cases" isactive={caseType == 'cases'} title="Coronavirus Cases" onClick={e => setCaseType('cases')} cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)} />
          <InfoBox caseType="recovered" isactive={caseType == 'recovered'} title="Recovered" onClick={e => setCaseType('recovered')} cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)} />
          <InfoBox caseType="deaths" isactive={caseType == 'deaths'} title="Deaths" onClick={e => setCaseType('deaths')} cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)} />
        </div>

        <Map 
          mapCountries={mapCountries} center={mapCenter} zoom={mapZoom} caseType={caseType}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          <h1>Live Cases by Country</h1>
          <Table countries={tableData} />
            <h1>World Wide new {caseType}</h1>
        </CardContent>

        <LineGraph caseType={caseType} />
      </Card>
    </div>
  );
}

export default App;
