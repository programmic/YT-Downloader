from app import app

print("\033c", end="")

if __name__ == "__main__":
    """
    Entry point to start the Flask application.
    """
    app.run(debug=True)
