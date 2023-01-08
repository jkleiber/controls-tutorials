FROM python:3.8.2

RUN python -m pip install uvicorn flask pipenv
#fastapi

COPY ./ /app
WORKDIR /app
EXPOSE 5000

RUN export FLASK_APP=main.py
RUN pipenv update

EXPOSE 443

ENTRYPOINT [ "pipenv" ]

# CMD ["app.main:app", "--host", "0.0.0.0", "--port", "5000" ]
CMD ["run", "python", "main.py"]

# Run uvicorn
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5000"]
# CMD ["python", "-u", "main.py"]

# Doesn't work
# CMD ["flask", "run"]

# Runs but doesn't serve anything
# CMD tail -f /dev/null

#uvicorn example:app --port 5000 --ssl-keyfile=./key.pem --ssl-certfile=./cert.pem
