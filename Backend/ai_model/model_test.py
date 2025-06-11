from PIL import Image
import os
import time
import shutil
import pathlib
import itertools
from PIL import Image
import kagglehub
import seaborn as sns
sns.set_style('darkgrid')
from tensorflow import keras
import tensorflow as tf
from tensorflow.keras.optimizers import Adamax

# Ignore Warnings
import warnings
warnings.filterwarnings("ignore")

path = kagglehub.dataset_download("fanconic/skin-cancer-malignant-vs-benign")

loaded_model = tf.keras.models.load_model('Skin Cancer.h5', compile=False)
loaded_model.compile(Adamax(learning_rate= 0.001), loss= 'categorical_crossentropy', metrics= ['accuracy'])

image_path = path + '/test/benign/1023.jpg'
image = Image.open(image_path)
# Preprocess the image
img = image.resize((224, 224))
img_array = tf.keras.preprocessing.image.img_to_array(img)
img_array = tf.expand_dims(img_array, 0)
# Make predictions
predictions = loaded_model.predict(img_array)
class_labels = ['Benign', 'Malignant']
score = tf.nn.softmax(predictions[0])
print(f"{class_labels[tf.argmax(score)]}")

# converter = tf.lite.TFLiteConverter.from_keras_model(loaded_model)
# tflite_model = converter.convert()
#
# print("model converted")
#
# # Save the model.
# with open('Brain.tflite', 'wb') as f:
#     f.write(tflite_model)


# Load the TFLite model
model_path = 'Brain.tflite'
interpreter = tf.lite.Interpreter(model_path=model_path)
interpreter.allocate_tensors()

# Get input and output tensors
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# Set the input tensor
interpreter.set_tensor(input_details[0]['index'], img_array)

# Run inference
interpreter.invoke()

# Get the output
predictions = loaded_model.predict(img_array)
class_labels = ['Benign', 'Malignant']
score = tf.nn.softmax(predictions[0])
print(f"{class_labels[tf.argmax(score)]}")