
import { useState, useEffect } from "react";

export default function DragDropGrid({ aircraft }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    label: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    type: "cargo",
    isHazmat: false,
    cargoType: "palletized"
  });

  const [cgStatus, setCgStatus] = useState(null);
  const apiBase = "https://military-load-planner-back-end.onrender.com";

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      label: form.label,
      weight: parseFloat(form.weight),
      length: parseFloat(form.length),
      width: parseFloat(form.width),
      height: parseFloat(form.height),
      x: 20,
      y: 20,
      type: form.type,
      isHazmat: form.isHazmat,
      cargoType: form.cargoType
    };
    setItems([...items, newItem]);
    setForm({
      label: "",
      weight: "",
      length: "",
      width: "",
      height: "",
      type: "cargo",
      isHazmat: false,
      cargoType: "palletized"
    });
  };

  const deleteItem = (id) => {
    setItems(items.filter(i => i.id !== id));
  };

  const onDrag = (e, id) => {
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    const updated = items.map(item =>
      item.id === id
        ? { ...item, x: e.clientX - rect.left - 50, y: e.clientY - rect.top - 20 }
        : item
    );
    setItems(updated);
  };

  useEffect(() => {
    const payload = {
      aircraft: aircraft,
      cargo: items.filter(i => i.type === "cargo").map(i => ({
        name: i.label,
        weight: i.weight,
        length: i.length,
        width: i.width,
        height: i.height,
        position: i.x / 10,
        cargoType: i.cargoType,
        isHazmat: i.isHazmat
      })),
      personnel: items.filter(i => i.type === "personnel").map(i => ({
        name: i.label,
        weight: i.weight,
        position: i.x / 10
      })),
      user: "demo-user"
    };

    fetch(`${apiBase}/check-cg`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => setCgStatus(data))
      .catch(err => console.error("CG Error:", err));
  }, [items, aircraft]);

  const layoutFile = {
    "C-130J": "/layouts/c130.svg",
    "C-17": "/layouts/c17.svg",
    "C-5": "/layouts/c5.svg"
  }[aircraft];

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Add Cargo or Personnel</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <input placeholder="Name" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} className="border p-1" />
          <input placeholder="Weight (lbs)" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} className="border p-1" />
          <input placeholder="Length (ft)" value={form.length} onChange={e => setForm({ ...form, length: e.target.value })} className="border p-1" />
          <input placeholder="Width (ft)" value={form.width} onChange={e => setForm({ ...form, width: e.target.value })} className="border p-1" />
          <input placeholder="Height (ft)" value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} className="border p-1" />
          <select value={form.cargoType} onChange={e => setForm({ ...form, cargoType: e.target.value })} className="border p-1">
            <option value="palletized">Palletized</option>
            <option value="rolling">Rolling Stock</option>
          </select>
          <label className="flex items-center space-x-2 col-span-2">
            <input type="checkbox" checked={form.isHazmat} onChange={e => setForm({ ...form, isHazmat: e.target.checked })} />
            <span>Hazardous Material</span>
          </label>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="border p-1">
            <option value="cargo">Cargo</option>
            <option value="personnel">Personnel</option>
          </select>
          <button onClick={addItem} className="bg-blue-600 text-white px-4 py-1 rounded">Add</button>
        </div>
      </div>

      <div className="relative border bg-white shadow-md p-4">
        <img src={layoutFile} alt="Layout" className="w-full h-auto mb-4" />
        <div className="relative -mt-[100px] h-[100px]">
          {items.map(item => (
            <div key={item.id} onMouseDown={e => onDrag(e, item.id)}
              className={"absolute p-2 rounded cursor-move text-white text-xs " + (item.type === "cargo" ? "bg-blue-500" : "bg-green-500")}
              style={{ left: item.x, top: item.y }}>
              {item.label} ({item.weight} lbs)
              {item.isHazmat && <div className="text-yellow-300 text-[10px]">HAZMAT</div>}
              <button onClick={() => deleteItem(item.id)} className="ml-2 text-red-200 text-xs">✕</button>
            </div>
          ))}
        </div>
      </div>

      {cgStatus && (
        <div className="mt-4 p-3 border rounded bg-gray-100 space-y-1">
          <p><strong>CG:</strong> {cgStatus.cg.toFixed(2)} ft</p>
          <p><strong>Limits:</strong> {cgStatus.limits[0]}–{cgStatus.limits[1]} ft</p>
          <p><strong>Status:</strong> {cgStatus.within_limits ? <span className="text-green-600">Safe</span> : <span className="text-red-600">Outside Safe Zone!</span>}</p>
        </div>
      )}
    </div>
  );
}
