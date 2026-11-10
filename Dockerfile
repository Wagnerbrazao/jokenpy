FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY *.py *.js *.html ./
RUN useradd -u 10001 -M aluno
USER aluno
ENV JOKENPY_PUBLICO=1 PYTHONDONTWRITEBYTECODE=1
EXPOSE 8080
CMD ["python", "-m", "uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8080"]
