import {
    GoogleMap, Marker, useLoadScript, Circle, StandaloneSearchBox
  } from "@react-google-maps/api";
  import { useMemo, useState, useEffect, useRef } from "react";
  import "./style.css";
  
  const GoogleMaps = ({
    radius,
    setLatitude,
    style,
    address,
    setAddress,
    latitude,
    longitude,
    setLongitude
  }) => {
    const [map, setMap] = useState(null);
  
    const { isLoaded } = useLoadScript({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      libraries: ["places"],
    });
  
    const center = useMemo(() => ({ lat: latitude, lng: longitude }), [latitude, longitude]);
  
    const changeCoordinate = (coord, index) => {
      const { latLng } = coord;
      const lat = latLng.lat();
      const lng = latLng.lng();
      setLatitude(lat);
      setLongitude(lng);
    };
  
    useEffect(() => {
      map?.panTo({ lat: latitude, lng: longitude });
    }, [latitude, longitude]);
  
    const inputRef = useRef();
  
    const handlePlaceChanged = () => {
      const [place] = inputRef.current.getPlaces();
  
      if (place) {
        setAddress(place.formatted_address);
        setLatitude(place.geometry.location.lat());
        setLongitude(place.geometry.location.lng());
      }
    };
  
    return (
      <div className="w-full height-96">
        {
          !isLoaded ? (
            <h1>Loading...</h1>
          ) : (
            <>
              <GoogleMap
                mapContainerClassName="map-container"
                center={center}
                zoom={10}
                onLoad={(map) => setMap(map)}
              >
                <Marker
                  draggable
                  animation={google.maps.Animation.DROP}
                  onDragEnd={changeCoordinate}
                  position={{ lat: latitude, lng: longitude }}
                />
                <Circle
                  center={center}
                  radius={radius}
                  options={{
                    fillColor: "#AAFFAA",
                    fillOpacity: 0.3,
                    strokeColor: "#008000",
                    strokeOpacity: 0.8,
                    strokeWeight: 1,
                  }}
                />
              </GoogleMap>
              
              <StandaloneSearchBox
                onLoad={(ref) => (inputRef.current = ref)}
                onPlacesChanged={handlePlaceChanged}
              >
                <div className="relative ml-48 mt-[10px] w-[500px]">
                  <input
                    type="text"
                    className={`form-control text-black rounded-full bg-white ${style}`}
                    value={address}
                    placeholder="Search Location..."
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </StandaloneSearchBox>
  
              <button
                className="z-50 flex justify-center items-center w-12 h-12 transition duration-300"
                onClick={() => map.panTo({ lat: latitude, lng: longitude })}
              >
                <span className="text-xs text-black">Click Me!</span>
              </button>
            </>
          )
        }
      </div>
    );
  };
  
  export default GoogleMaps;
  
