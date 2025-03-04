// ev-model.js

// Function to generate random sensor data (input features)
function generateRandomSensorData() {
    return {
      throttle: Math.random() * 100,                // 0-100%
      rpm: 1000 + Math.random() * 5000,             // 1000-6000 RPM
      wheelSpeed: Math.random() * 120,              // 0-120 km/h
      batterySoc: 20 + Math.random() * 80,          // 20-100% State of Charge
      brakePressure: Math.random() * 100,           // 0-100%
      acceleration: -2 + Math.random() * 7,         // -2 to 5 m/s²
      temperature: 10 + Math.random() * 40,         // 10-50°C
      humidity: 30 + Math.random() * 50,            // 30-80%
      roadGrade: -10 + Math.random() * 20,          // -10 to 10% (downhill to uphill)
      vehicleWeight: 1500 + Math.random() * 500     // 1500-2000 kg
    };
  }
  
  // Function to normalize input data (scale to 0-1 range)
  function normalizeInputs(data) {
    return {
      throttle: data.throttle / 100,
      rpm: (data.rpm - 1000) / 5000,
      wheelSpeed: data.wheelSpeed / 120,
      batterySoc: (data.batterySoc - 20) / 80,
      brakePressure: data.brakePressure / 100,
      acceleration: (data.acceleration + 2) / 7,
      temperature: (data.temperature - 10) / 40,
      humidity: (data.humidity - 30) / 50,
      roadGrade: (data.roadGrade + 10) / 20,
      vehicleWeight: (data.vehicleWeight - 1500) / 500
    };
  }
  
  // Function to simulate a neural network model
  function predictOptimalParameters(normalizedInputs) {
    // Simulated weights for each input feature (these would normally be learned)
    const weights = {
      // Weights for torque calculation
      torque: {
        throttle: 0.7,
        rpm: -0.2,
        wheelSpeed: -0.1,
        batterySoc: 0.3,
        brakePressure: -0.5,
        acceleration: 0.4,
        temperature: -0.1,
        humidity: -0.05,
        roadGrade: 0.3,
        vehicleWeight: -0.2,
        bias: 0.2
      },
      // Weights for regenerative braking calculation
      regenBraking: {
        throttle: -0.6,
        rpm: 0.1,
        wheelSpeed: 0.3,
        batterySoc: -0.4,
        brakePressure: 0.8,
        acceleration: -0.5,
        temperature: 0.05,
        humidity: 0.0,
        roadGrade: -0.4,
        vehicleWeight: 0.2,
        bias: 0.1
      },
      // Weights for traction control calculation
      tractionControl: {
        throttle: 0.3,
        rpm: 0.2,
        wheelSpeed: -0.3,
        batterySoc: 0.0,
        brakePressure: 0.2,
        acceleration: 0.6,
        temperature: 0.1,
        humidity: 0.2,
        roadGrade: 0.5,
        vehicleWeight: 0.1,
        bias: 0.3
      }
    };
  
    // Calculate weighted sums for each output
    const weightedSums = {
      torque: weights.torque.bias,
      regenBraking: weights.regenBraking.bias,
      tractionControl: weights.tractionControl.bias
    };
  
    // Add weighted contributions from each input
    for (const feature in normalizedInputs) {
      weightedSums.torque += normalizedInputs[feature] * weights.torque[feature];
      weightedSums.regenBraking += normalizedInputs[feature] * weights.regenBraking[feature];
      weightedSums.tractionControl += normalizedInputs[feature] * weights.tractionControl[feature];
    }
  
    // Apply sigmoid activation function to constrain outputs between 0 and 1
    const sigmoid = x => 1 / (1 + Math.exp(-x));
  
    return {
      torque: sigmoid(weightedSums.torque),
      regenBraking: sigmoid(weightedSums.regenBraking),
      tractionControl: sigmoid(weightedSums.tractionControl)
    };
  }
  
  // Main function to run the model
  function runEVModel() {
    console.log("=== EV Neural Network System ===\n");
    
    // Generate 5 random input scenarios
    for (let i = 1; i <= 5; i++) {
      console.log(`\n--- Scenario ${i} ---`);
      
      // 1. Generate random sensor data
      const sensorData = generateRandomSensorData();
      console.log("Input Features:");
      console.log(JSON.stringify(sensorData, null, 2));
      
      // 2. Normalize the data
      const normalizedInputs = normalizeInputs(sensorData);
      
      // 3. Make predictions
      const predictions = predictOptimalParameters(normalizedInputs);
      
      // 4. Display results
      console.log("\nPredicted Optimal Parameters:");
      console.log(`Torque: ${(predictions.torque * 100).toFixed(2)}%`);
      console.log(`Regenerative Braking: ${(predictions.regenBraking * 100).toFixed(2)}%`);
      console.log(`Traction Control: ${(predictions.tractionControl * 100).toFixed(2)}%`);
      
      // 5. Provide explanation for the predictions
      console.log("\nExplanation:");
      
      // Torque explanation
      if (sensorData.throttle > 70 && sensorData.batterySoc > 50) {
        console.log("- High torque due to high throttle input and sufficient battery charge");
      } else if (sensorData.brakePressure > 50) {
        console.log("- Low torque due to brake application");
      } else if (sensorData.roadGrade > 5) {
        console.log("- Increased torque to handle uphill grade");
      }
      
      // Regen braking explanation
      if (sensorData.brakePressure > 60 && sensorData.batterySoc < 80) {
        console.log("- High regenerative braking due to brake application and room for battery charging");
      } else if (sensorData.acceleration < 0 && sensorData.throttle < 20) {
        console.log("- Moderate regenerative braking during deceleration");
      } else if (sensorData.roadGrade < -5) {
        console.log("- Increased regenerative braking on downhill to recover energy");
      }
      
      // Traction control explanation
      if (sensorData.acceleration > 3 || (sensorData.throttle > 80 && sensorData.wheelSpeed < 20)) {
        console.log("- High traction control to prevent wheel slip during rapid acceleration");
      } else if (sensorData.roadGrade > 8 || sensorData.roadGrade < -8) {
        console.log("- Increased traction control on steep grade for stability");
      } else if (sensorData.humidity > 70) {
        console.log("- Moderate traction control due to potentially slippery conditions");
      }
      
      console.log("\n" + "-".repeat(50));
    }
    
    console.log("\n=== Model Execution Complete ===");
  }
  
  // Run the model
  runEVModel();