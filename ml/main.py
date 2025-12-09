import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field
import pandas as pd
import uvicorn
# Updated import to match your filename preference
from fastapi.middleware.cors import CORSMiddleware

from predictive_model import PredictiveMaintenanceModel

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("api")

# Global model instance
model_service = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events.
    Loads the model into memory when the API starts.
    """
    global model_service
    try:
        logger.info("Loading Predictive Maintenance Model...")
        # Ensure the 'artifacts/' directory exists and contains pipeline.pkl/encoder.pkl
        model_service = PredictiveMaintenanceModel(model_path='artifacts/')
        model_service.load_model()
        logger.info("Model loaded successfully.")
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        # In production, you might want to stop startup here
        raise RuntimeError("Could not load model artifacts") from e
    
    yield
    
    # Cleanup (if needed)
    logger.info("Shutting down API...")
    model_service = None

app = FastAPI(
    title="Predictive Maintenance API",
    description="Enterprise API for Vehicle Failure Prediction",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # allow all origins (for testing). Replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],        # allow GET, POST, OPTIONS, etc.
    allow_headers=["*"],        # allow any headers
)


# --- Pydantic Models for Validation ---

class VehicleData(BaseModel):
    vehicle_id: str = Field(..., description="Unique identifier for the vehicle")
    engine_temp: float = Field(..., ge=-50, le=200, description="Engine temperature in Celsius")
    brake_health: float = Field(..., ge=0, le=100, description="Brake health percentage (0-100)")
    battery_health: float = Field(..., ge=0, le=100, description="Battery health percentage (0-100)")
    vibration_level: float = Field(..., ge=0, description="Vibration level reading")
    oil_level: float = Field(..., ge=0, le=1.0, description="Oil level normalized (0.0-1.0)")

    class Config:
        json_schema_extra = {
            "example": {
                "vehicle_id": "V-1234",
                "engine_temp": 95.5,
                "brake_health": 88.0,
                "battery_health": 92.0,
                "vibration_level": 0.4,
                "oil_level": 0.85
            }
        }

class PredictionResponse(BaseModel):
    vehicle_id: str
    predicted_risk: str
    confidence_score: float
    status: str

# --- Endpoints ---

@app.get("/health", status_code=status.HTTP_200_OK)
def health_check():
    """Health check endpoint for Kubernetes/Load Balancers."""
    if model_service is None or model_service.pipeline is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    return {"status": "healthy", "service": "predictive-maintenance"}

@app.post("/predict", response_model=PredictionResponse)
def predict_failure(data: VehicleData):
    """
    Predicts the failure risk for a specific vehicle based on telemetry data.
    """
    if model_service is None:
        raise HTTPException(status_code=503, detail="Model service unavailable")

    try:
        # Convert Pydantic model to DataFrame (format expected by our class)
        # We explicitly exclude vehicle_id from the features dataframe
        input_data = {
            "engine_temp": [data.engine_temp],
            "brake_health": [data.brake_health],
            "battery_health": [data.battery_health],
            "vibration_level": [data.vibration_level],
            "oil_level": [data.oil_level]
        }
        df_input = pd.DataFrame(input_data)

        # Use the class method for prediction (handles preprocessing internally)
        results = model_service.predict(df_input)
        
        # Extract results
        risk = results['predicted_risk'].iloc[0]
        confidence = float(results['confidence_score'].iloc[0])

        logger.info(f"Prediction for {data.vehicle_id}: {risk} ({confidence:.2f})")

        return {
            "vehicle_id": data.vehicle_id,
            "predicted_risk": risk,
            "confidence_score": confidence,
            "status": "success"
        }

    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal processing error")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)