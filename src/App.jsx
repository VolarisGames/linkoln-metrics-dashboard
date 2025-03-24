import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";

const CONTRACT_ADDRESS = "0xdD9fD03352611CFEADbF40b769012F6Bc634DD4D";
const ABI = [
  "function totalSupply(uint256 id) public view returns (uint256)"
];

const METRICS = [
  { id: 1, label: "Unique Agents Alive" },
  { id: 2, label: "Daily Active Users" },
  { id: 3, label: "Daily User Input" },
  { id: 4, label: "Total User Input" },
];

function App() {
  const [data, setData] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchSupplies = async () => {
    try {
      const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

      const updated = {};
      for (const metric of METRICS) {
        const supply = await contract.totalSupply(metric.id);
        updated[metric.id] = supply.toString();
      }

      setData(updated);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      console.error("Failed to fetch metrics:", err);
    }
  };

  useEffect(() => {
    fetchSupplies();
    const interval = setInterval(fetchSupplies, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      <div className="cards">
        {METRICS.map(({ id, label }) => (
          <div key={id} className="card">
            <div className="title">{label}</div>
            <div className="value">{data[id] ?? "..."}</div>
          </div>
        ))}
      </div>
      {lastUpdated && (
        <div className="timestamp">Last updated: {lastUpdated}</div>
      )}
    </div>
  );
}

export default App;
