import os


class Settings:
    app_name: str = "sutra-optimizer"
    version: str = "1.0.0"
    host: str = os.getenv("OPTIMIZER_HOST", "127.0.0.1")
    port: int = int(os.getenv("OPTIMIZER_PORT", "8000"))


settings = Settings()
