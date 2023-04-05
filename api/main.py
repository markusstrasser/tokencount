from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import tiktoken
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

encoding = tiktoken.get_encoding("cl100k_base")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/count_tokens")
async def count_tokens(text: str = Form(...)):
    tokens = encoding.encode(text)
    token_count = len(tokens)
    byte_strings = [encoding.decode_single_token_bytes(token) for token in tokens]
    token_strings = [x.decode('utf-8') for x in byte_strings]
    return {"token_count": token_count, "token_strings": token_strings }

# Your routes go here

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)