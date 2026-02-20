// JavaScript: 表現・通信担当 — バックエンドAPIとのブリッジ

// ★ Renderデプロイ後、PROD_API をRenderのURLに変更してください
const PROD_API  = 'https://english-study-api.onrender.com/api';
const LOCAL_API = 'http://localhost:5000/api';

const API_BASE = (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
) ? LOCAL_API : PROD_API;


// ── 進捗管理 ──────────────────────────────────────────

// 全レッスンの進捗を取得
async function fetchAllProgress() {
    const res = await fetch(`${API_BASE}/progress`);
    return res.json();
}

// 特定レッスンの進捗を取得
async function fetchProgress(lessonId) {
    const res = await fetch(`${API_BASE}/progress/${lessonId}`);
    return res.json();
}

// 進捗を更新（レッスン完了・スコア保存）
async function updateProgress(lessonId, completed, score) {
    const res = await fetch(`${API_BASE}/progress/${lessonId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed, score })
    });
    return res.json();
}


// ── 単語帳 ────────────────────────────────────────────

// 単語一覧を取得（lessonId省略で全件）
async function fetchVocab(lessonId = null) {
    const url = lessonId
        ? `${API_BASE}/vocab?lesson=${lessonId}`
        : `${API_BASE}/vocab`;
    const res = await fetch(url);
    return res.json();
}

// 単語を追加
async function addVocab(lessonId, english, japanese) {
    const res = await fetch(`${API_BASE}/vocab`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lesson_id: lessonId, english, japanese })
    });
    return res.json();
}

// 単語を削除
async function deleteVocab(vocabId) {
    const res = await fetch(`${API_BASE}/vocab/${vocabId}`, {
        method: 'DELETE'
    });
    return res.json();
}


// ── UI連携（script.jsから呼ぶ） ────────────────────────

// レッスン完了時に呼ぶ（script.js側でフックする）
async function onLessonComplete(lessonId, score) {
    const result = await updateProgress(lessonId, true, score);
    console.log(`Lesson ${lessonId} 完了 score:${score}`, result);
    refreshProgressUI(lessonId);
}

// 進捗バッジをレッスンカードに反映（表現担当）
async function refreshProgressUI(lessonId) {
    const progress = await fetchProgress(lessonId);
    const card = document.querySelector(`[data-lesson="${lessonId}"]`);
    if (!card) return;

    let badge = card.querySelector('.progress-badge');
    if (!badge) {
        badge = document.createElement('span');
        badge.className = 'progress-badge';
        card.appendChild(badge);
    }
    badge.textContent = progress.completed
        ? `✓ ${progress.score}点`
        : '未完了';
    badge.style.cssText = progress.completed
        ? 'color:#fff;background:#4caf50;padding:2px 8px;border-radius:12px;font-size:0.75em;'
        : 'color:#999;font-size:0.75em;';
}

// 単語帳モーダルを描画（表現担当）
async function renderVocabModal(lessonId) {
    const words = await fetchVocab(lessonId);

    const rows = words.length
        ? words.map(w => `
            <tr>
              <td>${w.english}</td>
              <td>${w.japanese}</td>
              <td><button onclick="deleteVocab(${w.id}).then(()=>renderVocabModal(${lessonId}))">🗑</button></td>
            </tr>`).join('')
        : '<tr><td colspan="3" style="text-align:center;color:#999">まだ単語がありません</td></tr>';

    const html = `
        <div id="vocab-modal" style="position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:9999">
          <div style="background:#fff;border-radius:12px;padding:24px;width:90%;max-width:480px;max-height:80vh;overflow-y:auto">
            <h3 style="margin:0 0 16px">単語帳 — Lesson ${lessonId}</h3>
            <table style="width:100%;border-collapse:collapse">
              <thead><tr style="border-bottom:2px solid #eee">
                <th style="text-align:left;padding:6px">英語</th>
                <th style="text-align:left;padding:6px">日本語</th>
                <th></th>
              </tr></thead>
              <tbody>${rows}</tbody>
            </table>
            <div style="margin-top:16px;display:flex;gap:8px">
              <input id="vocab-en" placeholder="English" style="flex:1;padding:8px;border:1px solid #ddd;border-radius:6px">
              <input id="vocab-ja" placeholder="日本語" style="flex:1;padding:8px;border:1px solid #ddd;border-radius:6px">
              <button onclick="
                addVocab(${lessonId}, document.getElementById('vocab-en').value, document.getElementById('vocab-ja').value)
                .then(()=>renderVocabModal(${lessonId}))
              " style="padding:8px 12px;background:#667eea;color:#fff;border:none;border-radius:6px;cursor:pointer">追加</button>
            </div>
            <button onclick="document.getElementById('vocab-modal').remove()"
              style="margin-top:12px;width:100%;padding:8px;background:#eee;border:none;border-radius:6px;cursor:pointer">閉じる</button>
          </div>
        </div>`;

    document.getElementById('vocab-modal')?.remove();
    document.body.insertAdjacentHTML('beforeend', html);
}
