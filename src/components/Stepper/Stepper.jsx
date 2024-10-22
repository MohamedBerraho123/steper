import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TiTick } from 'react-icons/ti';
import './stepper.css';

const Stepper = ({ token, skipTokenStep }) => {
  const steps = ["Token Authorization", "Choisir Sport", "Choisir Match", "Réserver terrain"];
  const [currentStep, setCurrentStep] = useState(skipTokenStep ? 2 : 1); // Skip to step 2 if authenticated
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sports, setSports] = useState([]);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (skipTokenStep) {
      // Fetch sports if token step is skipped
      fetchSports();
    }
  }, [skipTokenStep]);

  const fetchSports = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://localhost:7125/api/SportCategorys/list', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSports(response.data);
      setError('');
    } catch (error) {
      setError('Error fetching sports data');
    } finally {
      setLoading(false);
    }
  };

  const handleSportSelection = (e) => {
    const selectedSport = e.target.value;
    setSelectedSport(selectedSport);
    // Fetch matches for the selected sport category
    fetchMatchesForCategory(selectedSport);
  };

  const fetchMatchesForCategory = async (sportId) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://localhost:7125/api/Sports/category/${sportId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMatches(response.data);
    } catch (error) {
      setError('Failed to fetch matches for the selected sport');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-8 p-6 max-w-2xl bg-white">
      <div className="flex justify-between">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`step-item ${currentStep === i + 1 && "active"} ${i + 1 < currentStep && "complete"}`}
          >
            <div className="step">
              {i + 1 < currentStep ? <TiTick size={24} /> : i + 1}
            </div>
            <p className="text-gray-500">{step}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        {currentStep === 2 && (
          <div>
            <h3>Choose a sport:</h3>
            {loading && <p>Loading sports...</p>}
            {error && <p className="text-red-600">{error}</p>}
            <select value={selectedSport} onChange={handleSportSelection}>
              <option value="">-- Select Sport --</option>
              {sports.map((sport) => (
                <option key={sport.id} value={sport.id}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {currentStep === 3 && selectedSport && matches.length > 0 && (
          <div>
            <h3>Choose a match:</h3>
            <div className="card-container">
              {matches.map((match) => (
                <div key={match.id} className="card" onClick={() => setSelectedCategory(match.id)}>
                  <img src={match.image} alt={match.name} />
                  <p>{match.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6 -mx-6">
          {currentStep > 1 && (
            <button className="btn btn-secondary" onClick={() => setCurrentStep(currentStep - 1)}>
              Previous
            </button>
          )}
          {currentStep < steps.length && (
            <button className="btn btn-primary" onClick={() => setCurrentStep(currentStep + 1)}>
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stepper;
