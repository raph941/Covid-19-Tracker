import React from "react"; //we import this because we would be using JSX in th map util
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet"; //this would be used for the circles and tooltip

export const sortData = (data) => {
    const sortedData = [...data];

    return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1))
}

export const buildChartData = (data, caseType="cases") => {
    const chartData = [];
    let lastDataPoint;
    
    for (let date in data.cases) {

        if(lastDataPoint) {
            const newDataPoint = {
                x: date,
                y: data[caseType][date] - lastDataPoint,
            };
            chartData.push(newDataPoint);
        }
        lastDataPoint = data[caseType][date];
    }
    return chartData
}

//Draw ciircles on maps with interactive tooltips
const casesTypeColors = {
    cases: {
        hex: "#CC1034",
        multiplier: 800,
    },
    recovered: {
        hex: "#7dd71d",
        multiplier: 1200,
    },
    deaths: {
        hex: "#fb4443",
        multiplier: 2000,
    },
}

export const showDataOnMap = (data, caseType="cases") =>
        data.map((country) => (
            <Circle
                center={[ country.countryInfo.lat, country.countryInfo.long ]}
                // setMapCenter({lat:data.countryInfo.lat, lng:data.countryInfo.long})
                fillOpacity={0.4}
                color={casesTypeColors[caseType].hex}
                fillColor={casesTypeColors[caseType].hex}
                radius={
                    Math.sqrt(country[caseType]) * casesTypeColors[caseType].multiplier
                }
            >
                <Popup>
                    <div className="info-container">
                        <div className="info-flag" style={{backgroundImage: `url(${country.countryInfo.flag})`}}></div>
                        <div className="info-name">{ country.country }</div>
                        <div className="info-cases">Cases: {numeral(country.cases).format("0,0")}</div>
                        <div className="info-recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
                        <div className="info-deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
                    </div>
                </Popup>
            </Circle>
        ))

//optional configs for the line graph
export const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0")
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function (value, index, values) {
                        return numeral(value).format("Ba");
                    },
                },
            },
        ],
    },
}


//returns a nicely formated number for infoBox display
export const prettyPrintStat = (stat) => 
    (
        stat ? `+${numeral(stat).format("0.0a")}` : "+0"
    )
