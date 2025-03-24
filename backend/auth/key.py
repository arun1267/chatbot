import secrets

def generate_secret_key():
    # Generate a secure random key with 32 bytes (256 bits)
    secret_key = secrets.token_hex(32)
    print("\nGenerated Secret Key:")
    print("-" * 50)
    print(secret_key)
    print("-" * 50)
    print("\nCopy this key and replace the JWT_SECRET_KEY in your .env file")
    return secret_key

if __name__ == "__main__":
    generate_secret_key() 