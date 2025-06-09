from bcrypt import hashpw, gensalt, checkpw

def get_password_hash(password: str) -> str:
    return hashpw(password.encode("utf-8"), gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except:
        return False