import pandas as pd
import joblib
import numpy as np
from settings import BASE_DIR
import os


class SingletonInstane:
    __instance = None

    @classmethod
    def __getInstance(cls):
        return cls.__instance

    @classmethod
    def instance(cls, *args, **kargs):
        cls.__instance = cls(*args, **kargs)
        cls.instance = cls.__getInstance
        return cls.__instance


class ModelSingleTone(SingletonInstane):
    def __init__(self):
        self.lgb_model = []

    def set_lgb_model(self):
        models = []
        for n in range(5):
            model_dir = os.path.join(BASE_DIR, "model")
            lgb_model = joblib.load(model_dir + "/lgb_kfold_%d.pkl" % (n))
            models.append(lgb_model)

        self.lgb_model = models

    def get_lgb_model(self):
        return self.lgb_model
    
    def get_crop_production(self, crop_id:int, area:float):
        y_column = ["output"]
        crop_id = [crop_id]
        area = [area]
        X_test = pd.DataFrame(
            list(zip(crop_id, area)),
            columns=["crop_id", "area"],
        )

        n_split = 5

        pred = 0

        pred = np.zeros(len(X_test))
        models = self.get_lgb_model()

        for lgb_model in models:
            pred += np.exp(lgb_model.predict(X_test))  # kfold 평균값 산출

        pred = pred / n_split

        return round(pred[0], 5)
