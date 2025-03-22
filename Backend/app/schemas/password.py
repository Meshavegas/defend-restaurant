from pydantic import BaseModel

class PasswordBase(BaseModel):
    password_: str

class PasswordCreate(PasswordBase):
    pass

class Password(PasswordBase):
    #id_Client: int
    id: int

    class Config:
        #orm_mode = True
        from_attributes = True
