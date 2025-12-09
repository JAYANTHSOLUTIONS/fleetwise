import pandas as pd
import numpy as np
import joblib
import logging
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

# Configure Enterprise Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("model_training.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class PredictiveMaintenanceModel:
    """
    Enterprise-grade Predictive Maintenance Model using Random Forest.
    Includes pipeline handling for preprocessing, hyperparameter tuning,
    and robust serialization.
    """

    def __init__(self, model_path='artifacts/'):
        self.model_path = model_path
        self.pipeline = None
        self.label_encoder = LabelEncoder()
        self.best_params = None
        
        # Create artifacts directory if it doesn't exist
        os.makedirs(self.model_path, exist_ok=True)

    def _create_pipeline(self):
        """
        Builds a scikit-learn pipeline to ensure preprocessing 
        steps (Imputation, Scaling) are strictly coupled with the model.
        """
        pipeline = Pipeline([
            # Handle missing values (Mean imputation)
            ('imputer', SimpleImputer(strategy='mean')),
            # Scale features to standard normal distribution (essential for many algorithms)
            ('scaler', StandardScaler()),
            # The Classifier
            ('classifier', RandomForestClassifier(random_state=42, class_weight='balanced'))
        ])
        return pipeline

    def generate_synthetic_data(self, n_samples=1000):
        """
        Generates a larger, more realistic dataset for training simulation.
        """
        np.random.seed(42)
        logger.info(f"Generating synthetic dataset with {n_samples} samples...")
        
        data = {
            "vehicle_id": [f"V{str(i).zfill(4)}" for i in range(n_samples)],
            # Normal operating temps with random spikes
            "engine_temp": np.random.normal(90, 15, n_samples),
            # Brake health degrades over time
            "brake_health": np.random.uniform(50, 100, n_samples),
            "battery_health": np.random.uniform(60, 100, n_samples),
            "vibration_level": np.random.exponential(0.5, n_samples),
            "oil_level": np.random.uniform(0.3, 1.0, n_samples)
        }
        
        df = pd.DataFrame(data)
        
        # Introduce synthetic logic for targets (Ground Truth Generation)
        conditions = [
            (df['engine_temp'] > 110) | (df['oil_level'] < 0.4),
            (df['brake_health'] < 60) | (df['vibration_level'] > 1.0),
            (df['battery_health'] < 70)
        ]
        choices = ['high', 'high', 'medium']
        df['failure_risk'] = np.select(conditions, choices, default='low')
        
        return df

    def train(self, df, feature_cols, target_col):
        """
        Trains the model using GridSearchCV for hyperparameter optimization.
        """
        logger.info("Starting training process...")

        X = df[feature_cols]
        y_raw = df[target_col]

        # Encode Target
        y = self.label_encoder.fit_transform(y_raw)
        
        # Split Data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )

        # Initialize Pipeline
        self.pipeline = self._create_pipeline()

        # Define Hyperparameters grid for tuning
        param_grid = {
            'classifier__n_estimators': [100, 200],
            'classifier__max_depth': [None, 10, 20],
            'classifier__min_samples_split': [2, 5],
            'classifier__min_samples_leaf': [1, 2]
        }

        # Grid Search with Cross Validation (5-fold)
        grid_search = GridSearchCV(
            self.pipeline, 
            param_grid, 
            cv=5, 
            n_jobs=-1, 
            verbose=1,
            scoring='f1_weighted'
        )

        logger.info("Running GridSearch for Hyperparameter Tuning...")
        grid_search.fit(X_train, y_train)

        self.pipeline = grid_search.best_estimator_
        self.best_params = grid_search.best_params_
        
        logger.info(f"Best Parameters found: {self.best_params}")

        # Evaluation
        logger.info("Evaluating model on test set...")
        y_pred = self.pipeline.predict(X_test)
        
        report = classification_report(
            y_test, 
            y_pred, 
            target_names=self.label_encoder.classes_
        )
        
        logger.info("\n" + report)
        
        # Return accuracy for quick checking
        return accuracy_score(y_test, y_pred)

    def save_model(self):
        """
        Saves the pipeline and label encoder to disk.
        """
        if self.pipeline is None:
            raise ValueError("Model has not been trained yet.")
        
        pipeline_path = os.path.join(self.model_path, 'pipeline.pkl')
        encoder_path = os.path.join(self.model_path, 'encoder.pkl')
        
        joblib.dump(self.pipeline, pipeline_path)
        joblib.dump(self.label_encoder, encoder_path)
        
        logger.info(f"Model saved to {self.model_path}")

    def load_model(self):
        """
        Loads the pipeline and encoder from disk.
        """
        pipeline_path = os.path.join(self.model_path, 'pipeline.pkl')
        encoder_path = os.path.join(self.model_path, 'encoder.pkl')
        
        if not os.path.exists(pipeline_path):
            raise FileNotFoundError("Model artifacts not found.")
            
        self.pipeline = joblib.load(pipeline_path)
        self.label_encoder = joblib.load(encoder_path)
        logger.info("Model loaded successfully.")

    def predict(self, new_data):
        """
        Predicts outcomes for new data. 
        Args:
            new_data (pd.DataFrame): Dataframe containing feature columns.
        Returns:
            pd.DataFrame: Original data with 'prediction' and 'probability' columns.
        """
        if self.pipeline is None:
            self.load_model()
            
        predictions = self.pipeline.predict(new_data)
        probs = self.pipeline.predict_proba(new_data)
        
        # Decode numeric labels back to strings (high/medium/low)
        decoded_predictions = self.label_encoder.inverse_transform(predictions)
        
        results = new_data.copy()
        results['predicted_risk'] = decoded_predictions
        results['confidence_score'] = np.max(probs, axis=1)
        
        return results

if __name__ == "__main__":
    # --- usage example ---
    
    # 1. Initialize System
    pm_system = PredictiveMaintenanceModel()

    # 2. Generate Data (Simulating a database fetch)
    df = pm_system.generate_synthetic_data(n_samples=2000)
    
    # 3. Define Features
    features = ["engine_temp", "brake_health", "battery_health", "vibration_level", "oil_level"]
    target = "failure_risk"

    # 4. Train
    pm_system.train(df, features, target)

    # 5. Save
    pm_system.save_model()

    # 6. Inference Example (Simulating a production API call)
    logger.info("Running inference on new vehicle data...")
    new_vehicle_data = pd.DataFrame([{
        "vehicle_id": "V-NEW-99",
        "engine_temp": 115,       # High temp
        "brake_health": 88,
        "battery_health": 92,
        "vibration_level": 0.3,
        "oil_level": 0.2          # Low oil
    }, {
        "vehicle_id": "V-NEW-100",
        "engine_temp": 85,        # Normal
        "brake_health": 95,
        "battery_health": 98,
        "vibration_level": 0.1,
        "oil_level": 0.9
    }])

    # We only pass features expected by the model
    prediction_input = new_vehicle_data[features]
    
    results = pm_system.predict(prediction_input)
    
    print("\n--- Inference Results ---")
    print(results[['predicted_risk', 'confidence_score']])