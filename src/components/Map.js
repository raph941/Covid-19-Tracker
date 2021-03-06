import React from 'react'
import '../styles/Map.css'
import { showDataOnMap } from "../utils"
import {Map as LeafletMap, TileLayer} from "react-leaflet"

function Map({ mapCountries, center, zoom, caseType }) {
    return (
        <div className="map">
            <LeafletMap center={center} zoom={zoom}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
                {showDataOnMap(mapCountries, caseType)}
            </LeafletMap>
        </div>
    )
}

export default Map