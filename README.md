# Birk
Birk is a birthmark categorization web application written in FastAPI and React Native. It provides \
a quick way for its users to check whether the birthmark is benign or malicious, based on a taken picture.\
The additional technologies used are Tensorflow, Swagger and a CSS framework Tailwind.

## Creators
Marek Kopania

## Local Setup
To run the backend FastApi applicaiton follow these steps from the backend root folder:
1. `python3 -m venv .venv`
2. `source .venv/bin/activate` for MacOS
3. `pip install -r requirements.txt`
4. `cd app`
5. `uvicorn main:app --host 0.0.0.0 --port 8000 --reload`

To run the frontend application you need android or ios simulator installed and path updated.\
Then you need to run the following commands from the frontend root folder:
1. `npm install`
2. `npx expo start`
3. Choose ios or android simulator or scan the QR code on your phone to run it on the device.

## Model results

![Figure_1](https://github.com/user-attachments/assets/51c25539-1514-4eb9-b92a-bffe0e7f7665)
![Figure_2](https://github.com/user-attachments/assets/60788e1d-f2b5-401d-b41b-6ec0350e6787)

## Application screenshots

![Simulator Screenshot - iPhone 16 Pro - 2025-06-24 at 18 52 12](https://github.com/user-attachments/assets/c6c296b3-8465-4c10-a62d-2b0dcc6117aa)
![Simulator Screenshot - iPhone 16 Pro - 2025-06-24 at 18 52 21](https://github.com/user-attachments/assets/3a5c5685-0dce-4f04-a762-a3c6db1eb348)
![Simulator Screenshot - iPhone 16 Pro - 2025-06-24 at 18 52 36](https://github.com/user-attachments/assets/395411a1-caae-4e26-95cb-d0d987cad5ba)
![Simulator Screenshot - iPhone 16 Pro - 2025-06-24 at 18 52 44](https://github.com/user-attachments/assets/30aa9676-da81-4383-8e6f-c9e5c98ca189)
![Simulator Screenshot - iPhone 16 Pro - 2025-06-24 at 18 53 00](https://github.com/user-attachments/assets/009bce8b-19ba-4674-8ccb-9a25b351b22f)
![Simulator Screenshot - iPhone 16 Pro - 2025-06-24 at 18 53 06](https://github.com/user-attachments/assets/0d4534d4-eb92-422c-97f9-7e2ccfc0649a)
![Simulator Screenshot - iPhone 16 Pro - 2025-06-24 at 18 53 40](https://github.com/user-attachments/assets/21df9d43-c8d0-4ba5-8851-7e84ba76e82d)
![Simulator Screenshot - iPhone 16 Pro - 2025-06-24 at 18 53 50](https://github.com/user-attachments/assets/5f674d66-b795-4d43-9596-dbc796728b3e)
![Simulator Screenshot - iPhone 16 Pro - 2025-06-24 at 18 54 00](https://github.com/user-attachments/assets/a38abf86-c0dd-4d43-91e1-f7fb56d1f6e1)
![Simulator Screenshot - iPhone 16 Pro - 2025-06-24 at 18 54 13](https://github.com/user-attachments/assets/bf5d0add-4dab-4067-964a-50c07da6605d)
![Simulator Screenshot - iPhone 16 Pro - 2025-06-24 at 18 55 10](https://github.com/user-attachments/assets/56db0bb2-ff11-493c-815e-b2845398369c)

