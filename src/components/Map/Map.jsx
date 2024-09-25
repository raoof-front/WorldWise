
import { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvent } from 'react-leaflet'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCities } from '../../contexts/CitiesContext'
import { useGeolocation } from '../../hooks/useGeolocation'

import Button from '../Button/Button'
import styles from './Map.module.css'
function Map() {
  const { cities } = useCities()
  const [mapPosition, setMapPosition] = useState([40, 0])
  const [searchParams] = useSearchParams()
  const { 
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition
  } = useGeolocation()

  const mapLat = searchParams.get("lat")
  const mapLng = searchParams.get("lng")

  useEffect(function () {
    if (mapLat && mapLng) setMapPosition([mapLat, mapLng])
  }, [mapLat, mapLng])

  useEffect(() => {
    if (geolocationPosition) setMapPosition([geolocationPosition.lat, geolocationPosition.lng])
  }, [geolocationPosition])


  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && <Button type="position" onClick={getPosition}>
        {isLoadingPosition ? "loading..." : "Use your position"}
      </Button>}
      <MapContainer center={[mapLat, mapLng] && mapPosition} zoom={6} scrollWheelZoom={true} className={styles.map}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map(city => {

          return (

            <Marker position={[city.position.lat, city.position.lng]} key={city.id}>
              <Popup>
                <span>{city.emoji}</span> <span>{city.cityName}</span>
              </Popup>
            </Marker>
          )
        })}

        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  )
}

function ChangeCenter({ position }) {
  const map = useMap()
  map.setView(position)
  return null
}

function DetectClick() {
  const navigate = useNavigate()
  useMapEvent({
    click: e => {
      console.log(e)
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
    }
  })
}

export default Map
