#TODO#

=============================================

08/02/2022 - 08/22/2022
P0 - priority to be done by 22

# map.jsx
[DONE] get surrounding context info
    https://docs.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures-around-point
[DONE] put surrounding context to center
    just realized that moving the entire thing to center is not necessarily the center, 
    [----] need to move according to the center of the main building
[----] add map data points from London mayor
    [----] upload to tileSet
    [----] zoom into ONE general neignborhood area
    [----] show types of buildings
[----] raycast - get sunlight per hour per day on areas
[----] get area of building
[----] overlay clickables on top of satelite

# grassfield.jsx
[DONE] randomize https://jsfiddle.net/prisoner849/L9sr46d2/
[----] 3D projection of buildings
[----] build up dataset of vegetations
    [----] draw vegs
    [DONE] sort out usuable veg in London
    [DONE] use array.map to generate buttons
    [DONE] add image to buttons
[----] build up dataset of soil
    [----] sort out usuable soil in London
[----] add ID link: make this page only accessible if user selected a building

# results.jsx
[DONE] create new file just for computing output
[DONE] set up basic generic algo
https://www.thisdot.co/blog/quick-intro-to-genetic-algorithms-with-a-javascript-example
[----] optimization algo - look at c# multi-objective from Vaselio
[----] output - % of each veg

# logistics.jsx
[----] add company data

=============================================

07/19/2022 - 08/15/2022

# grassfield.jsx
[DONE] get building geometry from map selectedBuildingGeometry
https://docs.mapbox.com/mapbox-gl-js/api/map/#project-parameters
[DONE] draw plane based on points
https://threejs.org/docs/#api/en/core/BufferGeometry
[DONE] improve geometry - use shapes
https://threejs.org/examples/#webgl_geometry_shapes
[DONE] add instanced mesh
https://threejs.org/examples/#webgl_instancing_raycast
[DONE] check if within bounding box - use RayCast
https://jsfiddle.net/f2Lommf5/11557/
[DONE] add vegetation menu - added initial json menu

# tie everything together
[DONE] add react router
[DONE] fix build router issues
https://v5.reactrouter.com/web/guides/quick-start
[DONE] connect page to page with button

=============================================

06/29/2022 - 07/18/2022

# public handling
[DONE] get domain name
[DONE] launch to vercel

# map visualization
[DONE] select building
[DONE] get height of building from OSM
[DONE] turn buildings into 3d features - extrude polygon
    https://osmbuildings.org/?lat=52.51809&lon=13.41072&zoom=16.0&tilt=30
    https://blog.mapbox.com/3d-features-in-mapbox-gl-js-e94734f12110 
    https://wiki.openstreetmap.org/wiki/Key:height

# green roof visualization
[07/18] grass simulation
    https://threejs.org/docs/#api/en/objects/InstancedMesh
    https://woodenraft.games/blog/tackling-transparent-textures-in-threejs  
    https://ubm-twvideo01.s3.amazonaws.com/o1/vault/gdc2018/presentations/gilbert_sanders_between_tech_and.pdf 
    https://discourse.threejs.org/t/lod-instancing/20524

# fitting
[07/19] get building geometry
[----] get area of building
[----] panelize area

# algorithm
[DONE] GA: read algo https://ieeexplore.ieee.org/document/996017
[----] GA: organize data

# tie everything together
[DONE] add react router
[] fix build router issues
https://v5.reactrouter.com/web/guides/quick-start
[] connect page to page with button