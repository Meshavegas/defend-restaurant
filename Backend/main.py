from app import api
import uvicorn

App = api.app


if __name__ == '__main__':
    uvicorn.run("main:App", host="127.0.0.1", port=8000, reload=True)