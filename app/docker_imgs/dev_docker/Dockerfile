FROM python:3.8.10

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