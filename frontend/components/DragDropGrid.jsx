
import { useEffect, useState } from "react";

export default function DragDropGrid({ apiBase }) {
  const [aircraft, setAircraft] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${apiBase}/aircraft`)
      .then(res => res.json())
      .then(data => {
        setAircraft(data);
        setLoading(false);
      });
  }, [apiBase]);

  return (
    <div>
      {loading ? (
        <p>Loading aircraft...</p>
      ) : (
        <ul>
          {aircraft.map(ac => (
            <li key={ac.name}>{ac.name} - Max Payload: {ac.max_weight} lbs</li>
          ))}
        </ul>
      )}
    </div>
  );
}
