# Python: 計算・ロジック担当
from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
from datetime import datetime

app = Flask(__name__)
CORS(app)

DB_PATH = 'backend/study.db'


# ── DB初期化 ──────────────────────────────────────────
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS progress (
            lesson_id   INTEGER PRIMARY KEY,
            completed   INTEGER DEFAULT 0,
            score       INTEGER DEFAULT 0,
            last_accessed TEXT
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS vocab (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            lesson_id   INTEGER,
            english     TEXT NOT NULL,
            japanese    TEXT NOT NULL,
            created_at  TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()


# ── 進捗管理 API ──────────────────────────────────────
# GET  /api/progress          → 全レッスンの進捗一覧
# GET  /api/progress/<id>     → 特定レッスンの進捗
# POST /api/progress/<id>     → 進捗を更新 { completed, score }

@app.route('/api/progress', methods=['GET'])
def get_all_progress():
    conn = get_db()
    rows = conn.execute('SELECT * FROM progress').fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route('/api/progress/<int:lesson_id>', methods=['GET'])
def get_progress(lesson_id):
    conn = get_db()
    row = conn.execute(
        'SELECT * FROM progress WHERE lesson_id = ?', (lesson_id,)
    ).fetchone()
    conn.close()
    if row is None:
        return jsonify({'lesson_id': lesson_id, 'completed': 0, 'score': 0, 'last_accessed': None})
    return jsonify(dict(row))


@app.route('/api/progress/<int:lesson_id>', methods=['POST'])
def update_progress(lesson_id):
    data = request.get_json()
    completed = int(data.get('completed', 0))
    score = int(data.get('score', 0))
    now = datetime.now().isoformat()

    conn = get_db()
    conn.execute('''
        INSERT INTO progress (lesson_id, completed, score, last_accessed)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(lesson_id) DO UPDATE SET
            completed = excluded.completed,
            score = excluded.score,
            last_accessed = excluded.last_accessed
    ''', (lesson_id, completed, score, now))
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok', 'lesson_id': lesson_id})


# ── 単語帳 API ────────────────────────────────────────
# GET    /api/vocab              → 全単語一覧
# GET    /api/vocab?lesson=<id>  → レッスン指定で絞り込み
# POST   /api/vocab              → 単語を追加 { lesson_id, english, japanese }
# DELETE /api/vocab/<id>         → 単語を削除

@app.route('/api/vocab', methods=['GET'])
def get_vocab():
    lesson_id = request.args.get('lesson')
    conn = get_db()
    if lesson_id:
        rows = conn.execute(
            'SELECT * FROM vocab WHERE lesson_id = ? ORDER BY id', (lesson_id,)
        ).fetchall()
    else:
        rows = conn.execute('SELECT * FROM vocab ORDER BY id').fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route('/api/vocab', methods=['POST'])
def add_vocab():
    data = request.get_json()
    lesson_id = data.get('lesson_id')
    english   = data.get('english', '').strip()
    japanese  = data.get('japanese', '').strip()

    if not english or not japanese:
        return jsonify({'error': 'english と japanese は必須です'}), 400

    conn = get_db()
    cur = conn.execute(
        'INSERT INTO vocab (lesson_id, english, japanese) VALUES (?, ?, ?)',
        (lesson_id, english, japanese)
    )
    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return jsonify({'status': 'ok', 'id': new_id}), 201


@app.route('/api/vocab/<int:vocab_id>', methods=['DELETE'])
def delete_vocab(vocab_id):
    conn = get_db()
    conn.execute('DELETE FROM vocab WHERE id = ?', (vocab_id,))
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok', 'id': vocab_id})


# ── 起動 ──────────────────────────────────────────────
if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)
