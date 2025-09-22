import google.generativeai as genai
from google.generativeai.generative_models import GenerativeModel

model = GenerativeModel("gemini-1.5-flash-latest")
response = model.generate_content("Write a poem about the sea.")
print(response.text)