import sqlite3
import json
import hashlib
from pathlib import Path

# path to database
BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "database.db"


def get_connection():
    return sqlite3.connect(DB_PATH)


# -------------------------
# INIT DATABASE
# -------------------------
def init_db():
    conn = get_connection()
    cur = conn.cursor()

    # patients table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        first_name TEXT,
        last_name TEXT,
        age INTEGER
    )
    """)

    # health results table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS health_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER,
        result_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(id)
    )
    """)

    conn.commit()
    conn.close()


# initialize database at import
init_db()


# -------------------------
# HELPERS
# -------------------------
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


# -------------------------
# AUTH
# -------------------------
def register_patient(email, password, first_name, last_name, age):
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            """
            INSERT INTO patients (email, password, first_name, last_name, age)
            VALUES (?, ?, ?, ?, ?)
            """,
            (email, hash_password(password), first_name, last_name, age)
        )
        conn.commit()
        return {"status": "ok", "message": "User registered"}
    except sqlite3.IntegrityError:
        return {"status": "error", "message": "Email already exists"}
    finally:
        conn.close()


def login_patient(email, password):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT id, password FROM patients WHERE email = ?
        """,
        (email,)
    )
    row = cur.fetchone()
    conn.close()

    if not row:
        return {"status": "error", "message": "User not found"}

    user_id, stored_password = row

    if stored_password != hash_password(password):
        return {"status": "error", "message": "Invalid password"}

    return {
        "status": "ok",
        "message": "Login successful",
        "patient_id": user_id
    }


# -------------------------
# PATIENT INFO
# -------------------------
def get_patient_info(patient_id: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT id, email, first_name, last_name, age
        FROM patients WHERE id = ?
        """,
        (patient_id,)
    )
    row = cur.fetchone()
    conn.close()

    if not row:
        return {"status": "error", "message": "Patient not found"}

    return {
        "id": row[0],
        "email": row[1],
        "first_name": row[2],
        "last_name": row[3],
        "age": row[4]
    }


# -------------------------
# RESULTS
# -------------------------
def save_health_result(patient_id: int, result_data: dict):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        INSERT INTO health_results (patient_id, result_json)
        VALUES (?, ?)
        """,
        (patient_id, json.dumps(result_data))
    )

    conn.commit()
    conn.close()

    return {"status": "ok", "message": "Result saved"}


def get_patient_results(patient_id: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT result_json, created_at
        FROM health_results
        WHERE patient_id = ?
        ORDER BY created_at DESC
        """,
        (patient_id,)
    )

    rows = cur.fetchall()
    conn.close()

    return [
        {
            "result": json.loads(row[0]),
            "created_at": row[1]
        }
        for row in rows
    ]
