FROM python:3.12-slim
WORKDIR /app
RUN pip install --no-cache-dir pywebpush==2.0.3 tzdata
COPY avisos.py .
RUN useradd -u 10002 -M avisos && mkdir /dados && chown avisos /dados
USER avisos
ENV DADOS=/dados PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
EXPOSE 8090
CMD ["python", "avisos.py"]
