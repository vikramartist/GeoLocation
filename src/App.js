import "./styles.css";
import { useState } from "react";

function useGeolocation() {
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({});
  const [clicks, setClicks] = useState(0);
  const [error, setError] = useState(null);

  const handleReset = () => {
    setIsLoading(false);
    setClicks(0);
    setPosition({});
    setError("");
  };

  function getPosition() {
    setClicks((c) => c + 1);
    if (!navigator.geolocation) {
      return setError("Your browser does not support geolocation");
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          long: pos.coords.longitude
        });
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );
  }

  return { clicks, isLoading, error, position, getPosition, handleReset };
}

export default function App() {
  const {
    isLoading,
    clicks,
    error,
    position,
    getPosition,
    handleReset
  } = useGeolocation();

  const { lat, long } = position;

  return (
    <div className="App">
      <h1>Geo Locator</h1>
      <button onClick={getPosition} disabled={isLoading}>
        Get Position
      </button>

      {isLoading && <p>Loading position...</p>}
      {error && <p>{error}</p>}
      {!isLoading && !error && lat && long && (
        <p>
          Your GPS Position is:{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://www.openstreetmap.org/#map=18/${lat}/${long}`}
          >
            {lat}, {long}
          </a>
        </p>
      )}

      <p>You requested position {clicks} times.</p>

      <button onClick={handleReset}>Reset</button>
    </div>
  );
}
