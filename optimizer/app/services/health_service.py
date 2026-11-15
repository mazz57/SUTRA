from app.core import config


def get_health_report() -> dict:
    import ortools
    import networkx

    return {
        "status": "ok",
        "service": {
            "name": config.settings.app_name,
            "version": config.settings.version,
            "python": "3.11",
        },
        "libraries": {
            "ortools": ortools.__version__,
            "networkx": networkx.__version__,
        },
    }
