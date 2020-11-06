import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'
import "../styles/InfoBox.css"

function InfoBox({ title, cases, isactive, total, caseType, ...props }){
    console.log(cases)
    return (
        <Card className={`infoBox ${caseType} ${isactive && "infoBox--selected"}`}
            onClick={props.onClick}
        >
            <CardContent>
                <Typography className={`infoBox__title ${caseType} `} color="textSecondary">
                    {title}
                </Typography>
                
                <h2 className={`infoBox__cases ${caseType} `}>{cases}</h2>

                <Typography className="infoBox__total">
                    {total} total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox