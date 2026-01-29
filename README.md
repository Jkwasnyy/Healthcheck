# Instrukcja uruchomienia projektu - Healthcheck

Projekt składa się z dwóch części:
1. **Backend**: API napisane w Pythonie (FastAPI) z modelem uczenia maszynowego (Random Forest).
2. **Frontend**: Aplikacja webowa (React/Vite).

## Wymagania wstępne
Upewnij się, że masz zainstalowane:
* [Python](https://www.python.org/downloads/) (wersja 3.8 lub nowsza)
* [Node.js](https://nodejs.org/) (do obsługi frontendu)

---

## 1. Uruchomienie Backendu (API)

### Krok 1: Przygotowanie plików
Upewnij się, że w folderze z plikiem `main.py` znajdują się również:
* `database.py` (moduł bazy danych importowany w kodzie)
* `diabetes.csv` (zbiór danych wymagany do wytrenowania modelu przy starcie)
* `requirements.txt`

### Krok 2: Tworzenie wirtualnego środowiska (zalecane)
Otwórz terminal w folderze backendu i wykonaj komendy:

**Windows:**
```bash
python -m venv venv
.\venv\Scripts\activate
```

**macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Krok 3: Instalacja zależności
Zainstaluj biblioteki z pliku requirements.txt:
```bash
pip install -r requirements.txt
```

### Krok 4: Uruchomienie serwera
Uruchom serwer developerski:
```bash
uvicorn main:app --reload
```
Po uruchomieniu:
* API będzie dostępne pod adresem: http://127.0.0.1:8000
* Dokumentacja Swagger UI: http://127.0.0.1:8000/docs

## 2. Uruchomienie Frontendu

### Krok 1: Instalacja zależności
Otwórz nowy terminal, przejdź do folderu z frontendem i wykonaj:
```bash
npm install
```

### Krok 2: Start aplikacji
Uruchom aplikację w trybie deweloperskim:
```bash
npm run dev
```
Po uruchomieniu:
* Aplikacja powinna być dostępna pod adresem: http://localhost:5173