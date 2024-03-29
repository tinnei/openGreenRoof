import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import * as turf from '@turf/turf';
import styles from './styles/map.module.css';

import { Link } from 'react-router-dom';

mapboxgl.accessToken = 'pk.eyJ1IjoidGlubmVpIiwiYSI6ImNsNG1xNGJxMzAwOHQzam1jcTlqd2FtZXUifQ.6OUTbV6SvN668iZOJAoCGQ';

// TODO
// show selected area 
// show type of houses

function Map() {
    const mapContainer = useRef(null);
    const [map, setMap] = useState(null);
    const [lng, setLng] = useState(-0.0885);
    // const [lng, setLng] = useState(-0.0885);
    const [lat, setLat] = useState(51.5267);
    // const [lat, setLat] = useState(51.5267);
    const [zoom, setZoom] = useState(16);
    const [labelLayerId, setLabelLayerId] = useState(null);
    const [selectedBuildingGeometry, setSelectedBuildingGeometry] = useState(null);
    const [selectedBuildingHeight, setSelectedBuildingHeight] = useState(null);
    const [nearbyBuildingData, setNearbyBuildingData] = useState(null);
    var [selectedBuildingID, setselectedBuildingID] = useState(null);

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom,
            attribution:
                '© Data <a href="https://openstreetmap.org/copyright/">OpenStreetMap</a> © Map <a href="https://mapbox.com/">Mapbox</a> © 3D <a href="https://osmbuildings.org/copyright/">OSM Buildings</a>',
            pitch: 20,
            bearing: 20,
            antialias: true
        });

        map.on('load', () => {
            // Insert the layer beneath any symbol layer.
            const layers = map.getStyle().layers;
            const labelLayerId = layers.find(
                (layer) => layer.type === "symbol" && layer.layout["text-field"]
            ).id;
            setLabelLayerId(labelLayerId);

            // Add 3d layer and feature state styles
            map.addLayer({
                id: "add-3d-buildings",
                source: "composite",
                "source-layer": "building",
                filter: ["==", "extrude", "true"],
                type: "fill-extrusion",
                minzoom: 15,
                paint: {
                    "fill-extrusion-color": [
                        "case",
                        ["boolean", ["feature-state", "selected"], false],
                        "#00ff00",
                        "#aaa"
                    ],
                    "fill-extrusion-height": [
                        "interpolate", // for smooth transition when zoomed in
                        ["linear"],
                        ["zoom"],
                        15,
                        0,
                        15.05,
                        ["get", "height"]
                    ],
                    "fill-extrusion-base": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        15,
                        0,
                        15.05,
                        ["get", "min_height"]
                    ],
                    "fill-extrusion-opacity": 0.6
                }
            }, labelLayerId // add back text on top
            ); // close add layer
            setMap(map);
        });

        return () => map.remove(); // Clean up on unmount
    }, []);

    // Update Lng Lat Zoom info on mouse move
    useEffect(() => {
        if (!map) return;
        map.on('move', () => {
            setLng(map.getCenter().lng.toFixed(4));
            setLat(map.getCenter().lat.toFixed(4));
            setZoom(map.getZoom().toFixed(2));
        });
    });

    function mapClickFn(coordinates) {
        console.log("finding address!!!-", coordinates);

        const url =
            "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
            coordinates.lng +
            "," +
            coordinates.lat +
            ".json?access_token=" +
            mapboxgl.accessToken +
            "&types=address";

        // not returning data here
        // fetch(url).then(data => {
        //     console.log("fetch returned data-", data);

        //     if (data.features.length > 0) {
        //         const address = data.features[0].place_name;
        //         console.log(address);
        //     } else {
        //         console.log("No address found");
        //     }
        // });
    }

    // Select building on mouse click
    useEffect(() => {
        if (!map) return;
        map.on("mousedown", (e) => {
            mapClickFn(e.lngLat);
            // Select properties to display
            const features = map.queryRenderedFeatures(e.point);
            const displayProperties = [
                "type",
                "properties",
                "id",
                "layer",
                "source",
                "sourceLayer",
                "state"
            ];

            const displayFeatures = features.map((feat) => {
                const displayFeat = {};
                displayProperties.forEach((prop) => {
                    displayFeat[prop] = feat[prop];
                });
                return displayFeat;
            });
            document.getElementById("features").innerHTML = JSON.stringify(
                displayFeatures,
                null,
                2
            );

            // Add featureState to selected building
            let thisID = features[0]["id"];
            // console.log("thisID", thisID);
            if (thisID !== null) {
                // console.log("last selected building ID", selectedBuildingID);
                console.log("----- selected building ID:", thisID);

                if (selectedBuildingID !== null) {
                    map.setFeatureState(
                        {
                            source: "composite",
                            sourceLayer: "building",
                            id: selectedBuildingID
                        },
                        { selected: false }
                    );
                }
                selectedBuildingID = thisID;
                map.setFeatureState(
                    {
                        source: "composite",
                        sourceLayer: "building",
                        id: selectedBuildingID
                    },
                    { selected: true }
                );

                // ---- get nearby buildings
                const bbox = [
                    [e.point.x - 50, e.point.y - 50],
                    [e.point.x + 50, e.point.y + 50]
                ];
                const selectedFeatures = map.queryRenderedFeatures(bbox, {
                    layers: ["building"]
                });

                // ---- get nearby building data
                let nearbyBuildingData = selectedFeatures.map((feat) => {
                    const buildingsFeats = {};
                    buildingsFeats["id"] = feat["id"];
                    // console.log("neaby feature---", feat);
                    buildingsFeats["height"] = feat["properties"]["height"];
                    let buildingArray = feat.geometry["coordinates"][0];
                    buildingsFeats["coors"] = buildingArray.map(lnglat => map.project(lnglat));
                    return buildingsFeats;
                });
                setNearbyBuildingData(nearbyBuildingData);
                console.log("[passing state] nearbyBuildingData --", nearbyBuildingData);

                // ---- get selected building ID
                setselectedBuildingID(selectedBuildingID);

                // ---- get building height
                let selectedBuildingHeight = features[0]["properties"]["height"];
                setSelectedBuildingHeight(selectedBuildingHeight);
                console.log("[passing state] building height --", selectedBuildingHeight);

                // ---- get building lnglat arrays
                let selectedBuildingGeometryArray = features[0].geometry["coordinates"][0];
                let selectedBuildingGeometryPoints = selectedBuildingGeometryArray.map(lnglat => map.project(lnglat));
                setSelectedBuildingGeometry(selectedBuildingGeometryPoints);

                const area = turf.area(features[0].geometry);
                // Restrict the area to 2 decimal points.
                const rounded_area = Math.round(area);
                console.log("get building area:", rounded_area);

                console.log("passing state] building geometry --", selectedBuildingGeometryPoints);

            } else {
                console.log("there's no id");
            }
        }); // close mousedown
    });

    return (
        <div>
            <div className={styles.sidebar}>
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
            <div ref={mapContainer} className={styles.mapContainer} />
            <Link to="/grassfield" state={{ buildingID: selectedBuildingID, buildingGeometry: selectedBuildingGeometry, buildingHeight: selectedBuildingHeight, nearbyBuildings: nearbyBuildingData }}><button className={styles.button}>Select Building</button></Link>
            <pre id="features" className={styles.infoBox} ></pre>
        </div>
    );
}

export default Map;
