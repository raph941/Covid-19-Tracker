import React, {useState, useEffect} from 'react'
import { Line } from "react-chartjs-2"
import { buildChartData, options } from "../utils"


function LineGraph({ caseType = "cases" }) {
    const [data, setData] = useState({});

    useEffect (() => {
        const fetchData = async () => {
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
                .then(response => response.json())
                .then(response => {
                    const chartData = buildChartData(response, caseType)
                    setData(chartData)
                })
        }
        fetchData();
    }, [caseType]);

    return (
        <div className="line--graph">
            {data?.length > 0 && (
                <Line 
                options={options}           
                data={{ 
                    datasets: [
                        {
                            backgroundColor: "rgba(204, 16, 52, 0.5)",
                            borderColor: "#CC1034",
                            data: data,
                        }
                    ]
                }}
                >

                </Line>
            )}
        </div>
    )
}

export default LineGraph