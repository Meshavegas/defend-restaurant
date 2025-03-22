from app import api
import uvicorn

App = api.app


if __name__ == '__main__':
    uvicorn.run("main:App", host="0.0.0.0", port=8000, reload=True)