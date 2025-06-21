from io import BytesIO
import tensorflow as tf
from tensorflow.keras.optimizers import Adamax
from base.get_db import get_db
from sqlalchemy.orm import Session
from fastapi import Depends, UploadFile, HTTPException, Response
from birthmarks.models.birthmark import Birthmark
from users.models.user import User
from PIL import Image
import os
from azure.core.exceptions import ResourceExistsError
from azure.storage.blob import BlobServiceClient, ContainerClient, BlobType
from core.config_loader import settings


def get_birthmarks_by_user_id(current_user: User, db: Session = Depends(get_db)):
    return db.query(Birthmark).filter(Birthmark.user_id == current_user.id)

async def create_birthmark(file: UploadFile, fileName: str, current_user: User, db: Session = Depends(get_db)):
    try:
        image = Image.open(file.file).convert('RGB')
        img = image.resize((224, 224))
        img_array = tf.keras.preprocessing.image.img_to_array(img)
        img_array = tf.expand_dims(img_array, 0)
        # Load the TFLite models
        print(os.getcwd())
        loaded_model = tf.keras.models.load_model('ai_model/model/Model.h5', compile=False)
        loaded_model.compile(Adamax(learning_rate=0.001), loss='categorical_crossentropy', metrics=['accuracy'])
        # Make predictions
        predictions = loaded_model.predict(img_array)
        class_labels = ['Benign', 'Malignant']
        score = tf.nn.softmax(predictions[0])
        print(f"{class_labels[tf.argmax(score)]}")
        prediction = class_labels[tf.argmax(score)]
        birthmark_db = Birthmark()
        birthmark_db.user_id = current_user.id
        birthmark_db.picture = fileName
        birthmark_db.diagnosis = prediction
        await upload_to_azure(file, str("birthmarks/" + birthmark_db.id), "birk")
        db.add(birthmark_db)
        db.commit()
        db.refresh(birthmark_db)
        return birthmark_db
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
def get_image_birthmark(id: int, db: Session = Depends(get_db)):
    birthmark = db.query(Birthmark).filter(Birthmark.id == id).first()
    if birthmark is None:
        raise HTTPException(status_code=404, detail="Birthmark not found")
    return birthmark.picture

def delete_birthmark(id: int, db: Session = Depends(get_db)):
    birk = db.query(Birthmark).filter(Birthmark.id == id).first()
    if birk is None:
        raise HTTPException(status_code=404, detail="Birthmark not found")
    delete_from_azure(str(id), "birk")
    db.query(Birthmark).filter(Birthmark.id == id).delete()
    db.commit()

    return "Deleted"

async def upload_to_azure(file: UploadFile, path: str, container_name: str):
    conn_str = settings.AZURE
    blob_service_client = BlobServiceClient.from_connection_string(conn_str)
    try:
        container_client = blob_service_client.create_container(name=container_name)
    except ResourceExistsError:
        print('A container with this name already exists')
    try:
        file_bytes = await file.read()  # Read the file content as bytes
        container_client = blob_service_client.get_container_client(container=container_name)
        with BytesIO(file_bytes) as byte_stream:
            return container_client.upload_blob(name=path, data=byte_stream, overwrite=True)
    except Exception:
        raise HTTPException(status_code=500, detail='Something went wrong uploading file to Azure')


def read_from_azure(path: str, container_name: str):
    connect_str = settings.AZURE

    blob_service_client = BlobServiceClient.from_connection_string(connect_str)
    blob_client = blob_service_client.get_blob_client(container=container_name, blob=path)
    download_stream = blob_client.download_blob()
    content = download_stream.readall()  # Returns the blob content as bytes
    return Response(content, media_type="image/*")

def delete_from_azure(path: str, container_name: str):
    conn_str = settings.AZURE
    blob_service_client = BlobServiceClient.from_connection_string(conn_str)
    blob_client = blob_service_client.get_blob_client(container=container_name, blob=path)
    blob_client.delete_blob()