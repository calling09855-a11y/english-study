// ============================================================
// 音声再生（Web Speech API）
// ============================================================
// Safari対応: 音声一覧を事前にキャッシュ（非同期読み込み対策）
var cachedVoices = [];
function loadVoices() {
    cachedVoices = window.speechSynthesis.getVoices();
}
if (window.speechSynthesis) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
}

function speak(text, btn) {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    utterance.pitch = 1;

    // Safari対応: 英語の音声を明示的に設定
    var voices = cachedVoices.length ? cachedVoices : window.speechSynthesis.getVoices();
    var enVoice = null;
    for (var i = 0; i < voices.length; i++) {
        if (voices[i].lang && voices[i].lang.indexOf('en') === 0) {
            enVoice = voices[i];
            if (voices[i].lang === 'en-US') break;
        }
    }
    if (enVoice) utterance.voice = enVoice;

    if (btn) {
        btn.classList.add('playing');
        utterance.onend = function() { btn.classList.remove('playing'); };
        utterance.onerror = function() { btn.classList.remove('playing'); };
    }

    // Safari対応: 長い音声が途中で止まるバグの回避
    window.speechSynthesis.speak(utterance);
}

// スピーカーボタンHTMLを生成するヘルパー
function S(text) {
    var escaped = text.replace(/'/g, "\\'").replace(/"/g, '&quot;');
    return '<button class="speak-btn" onclick="speak(\'' + escaped + '\', this)" title="発音を聞く">&#128264;</button>';
}

// ============================================================
// レッスンデータ定義
// ============================================================
const lessonStructure = [
    { type: 'stage', label: '全学年共通レベル', desc: '正しい5文型の知識を身に付けて初めて、「生きた英語」になります。' },
    { type: 'lesson', id: 1, title: '英語の語順 SV文型' },
    { type: 'lesson', id: 2, title: '英語の語順 SVC文型' },
    { type: 'lesson', id: 3, title: '英語の語順 SVO文型' },
    { type: 'lesson', id: 4, title: '形容詞と副詞' },
    { type: 'lesson', id: 5, title: '英語の語順 SVOO文型' },
    { type: 'lesson', id: 6, title: '英語の語順 SVOC文型' },
    { type: 'comm', id: 1, title: 'Communication Stage 1' },

    { type: 'stage', label: '中学1年レベル', desc: 'ここを120%マスターしなければ次に進めません。' },
    { type: 'lesson', id: 7, title: '主語と動詞' },
    { type: 'lesson', id: 8, title: '名詞と代名詞' },
    { type: 'lesson', id: 9, title: '否定文と疑問文' },
    { type: 'lesson', id: 10, title: '過去形' },
    { type: 'lesson', id: 11, title: '冠詞と名詞' },
    { type: 'lesson', id: 12, title: '進行形' },
    { type: 'comm', id: 2, title: 'Communication Stage 2' },

    { type: 'stage', label: '中学1・2年レベル', desc: '中学1年レベルで学んだ内容を安定させるとともに、新しい文法を吸収するための体力を作ります。' },
    { type: 'lesson', id: 13, title: '未来の表現' },
    { type: 'lesson', id: 14, title: '助動詞' },
    { type: 'lesson', id: 15, title: '疑問詞を使った疑問文' },
    { type: 'lesson', id: 16, title: '前置詞と名詞' },
    { type: 'comm', id: 3, title: 'Communication Stage 3' },

    { type: 'stage', label: '中学2年レベル', desc: '前半で学んだ内容を応用レベルに引き上げながら、より新しい表現方法を身に付けます。' },
    { type: 'lesson', id: 17, title: '不定詞' },
    { type: 'lesson', id: 18, title: '動名詞と不定詞' },
    { type: 'lesson', id: 19, title: '接続詞' },
    { type: 'lesson', id: 20, title: '比較の表現その1 比較級と最上級' },
    { type: 'lesson', id: 21, title: '比較の表現その2 比較のいろいろ' },
    { type: 'lesson', id: 22, title: '受け身の表現' },
    { type: 'lesson', id: 23, title: '重要表現いろいろ' },
    { type: 'comm', id: 4, title: 'Communication Stage 4' },

    { type: 'stage', label: '中学3年レベル', desc: '表現の可能性が一気に広がります。複雑な英文を適切に解釈するために必要なスキルの総まとめを行ないます。' },
    { type: 'lesson', id: 24, title: '現在完了形その1 完了と結果' },
    { type: 'lesson', id: 25, title: '現在完了形その2 継続と経験' },
    { type: 'lesson', id: 26, title: '現在分詞と過去分詞' },
    { type: 'lesson', id: 27, title: '関係代名詞その1 主格と目的格' },
    { type: 'lesson', id: 28, title: '関係代名詞その2 所有格' },
    { type: 'lesson', id: 29, title: '英文解釈のコツ' },
    { type: 'comm', id: 5, title: 'Communication Stage 5' },
    { type: 'test', title: '全レッスン修了テスト' }
];

// ============================================================
// レッスンコンテンツ（HTMLテンプレート）
// ============================================================
const lessonContent = {};

// ----- Lesson 01: SV文型 -----
lessonContent[1] = `
<div class="lesson-header">
    <span class="lesson-tag">Stage 1 ─ 全学年共通レベル</span>
    <h2>Lesson 01：英語の語順 SV文型</h2>
    <p>英語の最もシンプルな文の形「主語＋動詞」を学びます</p>
</div>

<div class="card">
    <h2>日本語と英語の語順の違い</h2>
    <p>日本語は「〜が　〜する」、英語も「主語 → 動詞」の順番です。<br>SV文型は <strong>最もシンプルな英語の文</strong> で、主語（Subject）と動詞（Verb）だけで成り立ちます。</p>

    <div class="comparison-box">
        <div class="jp-order">
            <h4>🇯🇵 日本語</h4>
            <p style="font-size:1.2rem"><strong>私は</strong>　<strong>走る</strong>。</p>
            <p style="color:#718096">（主語 → 動詞）</p>
        </div>
        <div class="en-order">
            <h4>🇺🇸 英語</h4>
            <p style="font-size:1.2rem"><strong>I</strong> <strong>run</strong>.</p>
            <p style="color:#718096">（Subject → Verb）</p>
        </div>
    </div>

    <div class="point-box">
        SV文型では、日本語と英語の語順は同じ「主語→動詞」です。英語の中で一番わかりやすい文型です！
    </div>
</div>

<div class="card">
    <h2>SV文型とは？</h2>
    <p><strong>S</strong> = Subject（主語：〜は、〜が）<br>
    <strong>V</strong> = Verb（動詞：〜する）</p>

    <div class="word-order">
        <div class="word-block subject">S（主語）</div>
        <div class="word-block arrow">→</div>
        <div class="word-block verb">V（動詞）</div>
    </div>

    <p>動詞だけで意味が完結する文です。「何を？」「誰に？」がなくても文が成り立ちます。</p>
</div>

<div class="card">
    <h2>SV文型の例文</h2>
    <table>
        <tr><th>英語</th><th>主語(S)</th><th>動詞(V)</th><th>意味</th></tr>
        <tr><td>I run.</td><td>I</td><td>run</td><td>私は走る。</td></tr>
        <tr><td>She sings.</td><td>She</td><td>sings</td><td>彼女は歌う。</td></tr>
        <tr><td>Birds fly.</td><td>Birds</td><td>fly</td><td>鳥は飛ぶ。</td></tr>
        <tr><td>He smiled.</td><td>He</td><td>smiled</td><td>彼は微笑んだ。</td></tr>
        <tr><td>The baby cried.</td><td>The baby</td><td>cried</td><td>赤ちゃんが泣いた。</td></tr>
        <tr><td>We laughed.</td><td>We</td><td>laughed</td><td>私たちは笑った。</td></tr>
        <tr><td>Time flies.</td><td>Time</td><td>flies</td><td>時間が飛ぶ（光陰矢のごとし）。</td></tr>
    </table>

    <div class="point-box">
        主語が he / she / it や単数の名詞のとき、動詞に <strong>s</strong> がつきます（例：sing → sing<strong>s</strong>）。これを「三単現の s」と言います。
    </div>
</div>

<div class="card">
    <h2>SV文型でよく使う動詞</h2>
    <table>
        <tr><th>動詞</th><th>意味</th><th>例文</th></tr>
        <tr><td>run</td><td>走る</td><td>I run every morning.</td></tr>
        <tr><td>walk</td><td>歩く</td><td>She walks to school.</td></tr>
        <tr><td>sing</td><td>歌う</td><td>He sings well.</td></tr>
        <tr><td>cry</td><td>泣く</td><td>The baby cried.</td></tr>
        <tr><td>laugh</td><td>笑う</td><td>They laughed.</td></tr>
        <tr><td>sleep</td><td>眠る</td><td>I sleep at ten.</td></tr>
        <tr><td>swim</td><td>泳ぐ</td><td>Fish swim.</td></tr>
        <tr><td>work</td><td>働く</td><td>She works hard.</td></tr>
        <tr><td>live</td><td>住む・生きる</td><td>I live in Tokyo.</td></tr>
        <tr><td>come</td><td>来る</td><td>Spring came.</td></tr>
    </table>

    <div class="point-box">
        "I live in Tokyo." のように、SV文型の後ろに場所や時間の情報（副詞句）がつくことがよくあります。これらは文型には含みませんが、詳しい情報を追加する役割です。
    </div>
</div>

<div class="card">
    <h2>練習問題</h2>
    <p>次の日本語をSV文型の英語にしてみましょう。</p>

    <div class="exercise">
        <p>Q1. 私は走る。</p>
        <input type="text" id="ex1-1" placeholder="英語で書いてみましょう">
        <button onclick="checkExercise('ex1-1', ['I run.', 'I run'])">答え合わせ</button>
        <div class="feedback" id="ex1-1-fb"></div>
    </div>

    <div class="exercise">
        <p>Q2. 彼女は歌う。</p>
        <input type="text" id="ex1-2" placeholder="英語で書いてみましょう">
        <button onclick="checkExercise('ex1-2', ['She sings.', 'She sings'])">答え合わせ</button>
        <div class="feedback" id="ex1-2-fb"></div>
    </div>

    <div class="exercise">
        <p>Q3. 鳥は飛ぶ。</p>
        <input type="text" id="ex1-3" placeholder="英語で書いてみましょう">
        <button onclick="checkExercise('ex1-3', ['Birds fly.', 'Birds fly', 'A bird flies.'])">答え合わせ</button>
        <div class="feedback" id="ex1-3-fb"></div>
    </div>

    <div class="exercise">
        <p>Q4. 私たちは笑った。</p>
        <input type="text" id="ex1-4" placeholder="英語で書いてみましょう">
        <button onclick="checkExercise('ex1-4', ['We laughed.', 'We laughed'])">答え合わせ</button>
        <div class="feedback" id="ex1-4-fb"></div>
    </div>
</div>

<div class="card">
    <h2>まとめ</h2>
    <ul style="padding-left:20px;">
        <li><strong>SV文型</strong> ＝ 主語（S）＋ 動詞（V）だけで文が完成する</li>
        <li>英語で最もシンプルな文の形</li>
        <li>動詞だけで意味が完結する（「何を」が不要）</li>
        <li>主語が三人称単数のとき、動詞に <strong>s</strong> をつける</li>
    </ul>
</div>
`;

// ----- Lesson 02: SVC文型 -----
lessonContent[2] = `
<div class="lesson-header">
    <span class="lesson-tag">Stage 1 ─ 全学年共通レベル</span>
    <h2>Lesson 02：英語の語順 SVC文型</h2>
    <p>「〜は…です」を表すSVC文型を学びます</p>
</div>

<div class="card">
    <h2>SVC文型とは？</h2>
    <p><strong>S</strong> = Subject（主語）<br>
    <strong>V</strong> = Verb（動詞）<br>
    <strong>C</strong> = Complement（補語：主語を説明する言葉）</p>

    <div class="word-order">
        <div class="word-block subject">S（主語）</div>
        <div class="word-block arrow">→</div>
        <div class="word-block verb">V（動詞）</div>
        <div class="word-block arrow">→</div>
        <div class="word-block complement">C（補語）</div>
    </div>

    <p>SVC文型の最大のポイント：<strong>S = C</strong>（主語 ＝ 補語）の関係が成り立つ！</p>

    <div class="example-box">
        <div class="en">I am happy.</div>
        <div class="ja">私は幸せです。 → 「I（私）= happy（幸せ）」が成り立つ！</div>
    </div>
</div>

<div class="card">
    <h2>SV文型との違い</h2>
    <div class="comparison-box">
        <div class="jp-order">
            <h4>SV文型</h4>
            <p style="font-size:1.1rem"><strong>I run.</strong>（私は走る）</p>
            <p style="color:#718096">動詞だけで文が完結</p>
        </div>
        <div class="en-order">
            <h4>SVC文型</h4>
            <p style="font-size:1.1rem"><strong>I am happy.</strong>（私は幸せです）</p>
            <p style="color:#718096">補語（C）が主語を説明する</p>
        </div>
    </div>

    <div class="point-box">
        SV文型は「何をするか」、SVC文型は「何であるか・どんな状態か」を表します。
    </div>
</div>

<div class="card">
    <h2>SVC文型で使う動詞</h2>
    <p>SVC文型で使う動詞は限られています。最も重要なのは <strong>be動詞</strong> です。</p>

    <h3>① be動詞（am / is / are）</h3>
    <table>
        <tr><th>主語</th><th>be動詞</th><th>例文</th><th>意味</th></tr>
        <tr><td>I</td><td>am</td><td>I am a student.</td><td>私は学生です。</td></tr>
        <tr><td>You</td><td>are</td><td>You are kind.</td><td>あなたは優しいです。</td></tr>
        <tr><td>He / She / It</td><td>is</td><td>She is beautiful.</td><td>彼女は美しいです。</td></tr>
        <tr><td>We / They</td><td>are</td><td>They are happy.</td><td>彼らは幸せです。</td></tr>
    </table>

    <h3>② be動詞以外のSVC動詞</h3>
    <table>
        <tr><th>動詞</th><th>意味</th><th>例文</th><th>日本語</th></tr>
        <tr><td>look</td><td>〜に見える</td><td>You look tired.</td><td>あなたは疲れて見える。</td></tr>
        <tr><td>sound</td><td>〜に聞こえる</td><td>That sounds good.</td><td>それはいいね。</td></tr>
        <tr><td>feel</td><td>〜と感じる</td><td>I feel sick.</td><td>気分が悪い。</td></tr>
        <tr><td>become</td><td>〜になる</td><td>He became famous.</td><td>彼は有名になった。</td></tr>
        <tr><td>get</td><td>〜になる</td><td>It got dark.</td><td>暗くなった。</td></tr>
        <tr><td>taste</td><td>〜の味がする</td><td>This tastes great.</td><td>これは美味しい。</td></tr>
        <tr><td>smell</td><td>〜の匂いがする</td><td>It smells nice.</td><td>いい匂いがする。</td></tr>
    </table>

    <div class="point-box">
        「S = C」が成り立つかチェック！例：You = tired（あなた＝疲れている）→ OK！だからSVC文型です。
    </div>
</div>

<div class="card">
    <h2>補語（C）になれるもの</h2>
    <p>補語には <strong>名詞</strong> か <strong>形容詞</strong> が入ります。</p>

    <h3>名詞が補語になる場合</h3>
    <div class="example-box">
        <div class="en">I am <strong>a teacher</strong>.</div>
        <div class="ja">私は先生です。（I = a teacher）</div>
    </div>
    <div class="example-box">
        <div class="en">She is <strong>my friend</strong>.</div>
        <div class="ja">彼女は私の友達です。（She = my friend）</div>
    </div>

    <h3>形容詞が補語になる場合</h3>
    <div class="example-box">
        <div class="en">He is <strong>tall</strong>.</div>
        <div class="ja">彼は背が高い。（He = tall）</div>
    </div>
    <div class="example-box">
        <div class="en">The food is <strong>delicious</strong>.</div>
        <div class="ja">その食べ物はおいしい。（The food = delicious）</div>
    </div>
</div>

<div class="card">
    <h2>練習問題</h2>
    <p>次の日本語をSVC文型の英語にしてみましょう。</p>

    <div class="exercise">
        <p>Q1. 私は幸せです。</p>
        <input type="text" id="ex2-1" placeholder="英語で書いてみましょう">
        <button onclick="checkExercise('ex2-1', ['I am happy.', 'I am happy'])">答え合わせ</button>
        <div class="feedback" id="ex2-1-fb"></div>
    </div>

    <div class="exercise">
        <p>Q2. 彼は先生です。</p>
        <input type="text" id="ex2-2" placeholder="英語で書いてみましょう">
        <button onclick="checkExercise('ex2-2', ['He is a teacher.', 'He is a teacher'])">答え合わせ</button>
        <div class="feedback" id="ex2-2-fb"></div>
    </div>

    <div class="exercise">
        <p>Q3. あなたは疲れて見える。</p>
        <input type="text" id="ex2-3" placeholder="英語で書いてみましょう">
        <button onclick="checkExercise('ex2-3', ['You look tired.', 'You look tired'])">答え合わせ</button>
        <div class="feedback" id="ex2-3-fb"></div>
    </div>

    <div class="exercise">
        <p>Q4. それはいいですね。（〜に聞こえる を使って）</p>
        <input type="text" id="ex2-4" placeholder="英語で書いてみましょう">
        <button onclick="checkExercise('ex2-4', ['That sounds good.', 'That sounds good', 'That sounds great.', 'That sounds great', 'That sounds nice.'])">答え合わせ</button>
        <div class="feedback" id="ex2-4-fb"></div>
    </div>
</div>

<div class="card">
    <h2>まとめ</h2>
    <ul style="padding-left:20px;">
        <li><strong>SVC文型</strong> ＝ 主語（S）＋ 動詞（V）＋ 補語（C）</li>
        <li>最大のポイント：<strong>S = C</strong> の関係が成り立つ</li>
        <li>「何であるか」「どんな状態か」を表す</li>
        <li>be動詞（am/is/are）が最も代表的</li>
        <li>look, sound, feel, become なども SVC文型で使える</li>
        <li>補語になれるのは「名詞」と「形容詞」</li>
    </ul>
</div>
`;

// ----- Lesson 03: SVO文型 -----
lessonContent[3] = `
<div class="lesson-header">
    <span class="lesson-tag">Stage 1 ─ 全学年共通レベル</span>
    <h2>Lesson 03：英語の語順 SVO文型</h2>
    <p>「〜は…を〜する」英語で最もよく使う文型を学びます</p>
</div>

<div class="card">
    <h2>SVO文型とは？</h2>
    <p><strong>S</strong> = Subject（主語）<br>
    <strong>V</strong> = Verb（動詞）<br>
    <strong>O</strong> = Object（目的語：動作の対象「〜を」「〜に」）</p>

    <div class="word-order">
        <div class="word-block subject">S（主語）</div>
        <div class="word-block arrow">→</div>
        <div class="word-block verb">V（動詞）</div>
        <div class="word-block arrow">→</div>
        <div class="word-block object">O（目的語）</div>
    </div>

    <div class="comparison-box">
        <div class="jp-order">
            <h4>🇯🇵 日本語</h4>
            <p style="font-size:1.1rem"><strong>私は</strong>　<strong>英語を</strong>　<strong>勉強する</strong>。</p>
            <p style="color:#718096">主語 → 目的語 → 動詞（SOV）</p>
        </div>
        <div class="en-order">
            <h4>🇺🇸 英語</h4>
            <p style="font-size:1.1rem"><strong>I</strong> <strong>study</strong> <strong>English</strong>.</p>
            <p style="color:#718096">主語 → 動詞 → 目的語（SVO）</p>
        </div>
    </div>

    <div class="warn-box">
        日本語は「SOV」（主語→目的語→動詞）ですが、英語は「SVO」（主語→動詞→目的語）です。<strong>語順が違う</strong>ので注意！
    </div>
</div>

<div class="card">
    <h2>SVCとSVOの見分け方</h2>
    <p><strong>S = O が成り立つ？</strong>で判断します。</p>

    <div class="example-box">
        <div class="en">I am <strong>a student</strong>. → I = a student ✅ → SVC</div>
        <div class="ja">私は学生です。</div>
    </div>
    <div class="example-box">
        <div class="en">I like <strong>music</strong>. → I = music ❌ → SVO</div>
        <div class="ja">私は音楽が好きです。（私≠音楽）</div>
    </div>

    <div class="point-box">
        S = C なら SVC、S ≠ O なら SVO と判断しましょう！
    </div>
</div>

<div class="card">
    <h2>SVO文型の例文</h2>
    <table>
        <tr><th>英語</th><th>S</th><th>V</th><th>O</th><th>意味</th></tr>
        <tr><td>I like cats.</td><td>I</td><td>like</td><td>cats</td><td>私は猫が好きです。</td></tr>
        <tr><td>She plays tennis.</td><td>She</td><td>plays</td><td>tennis</td><td>彼女はテニスをする。</td></tr>
        <tr><td>He eats breakfast.</td><td>He</td><td>eats</td><td>breakfast</td><td>彼は朝食を食べる。</td></tr>
        <tr><td>We study English.</td><td>We</td><td>study</td><td>English</td><td>私たちは英語を勉強する。</td></tr>
        <tr><td>They have a dog.</td><td>They</td><td>have</td><td>a dog</td><td>彼らは犬を飼っている。</td></tr>
        <tr><td>I know him.</td><td>I</td><td>know</td><td>him</td><td>私は彼を知っている。</td></tr>
    </table>
</div>

<div class="card">
    <h2>SVO文型でよく使う動詞</h2>
    <table>
        <tr><th>動詞</th><th>意味</th><th>例文</th></tr>
        <tr><td>like</td><td>〜が好き</td><td>I like coffee.</td></tr>
        <tr><td>have</td><td>〜を持っている</td><td>She has a pen.</td></tr>
        <tr><td>eat</td><td>〜を食べる</td><td>We eat lunch.</td></tr>
        <tr><td>drink</td><td>〜を飲む</td><td>He drinks water.</td></tr>
        <tr><td>play</td><td>〜をする・演奏する</td><td>I play the piano.</td></tr>
        <tr><td>study</td><td>〜を勉強する</td><td>They study math.</td></tr>
        <tr><td>read</td><td>〜を読む</td><td>She reads books.</td></tr>
        <tr><td>watch</td><td>〜を見る</td><td>I watch TV.</td></tr>
        <tr><td>know</td><td>〜を知っている</td><td>He knows the answer.</td></tr>
        <tr><td>want</td><td>〜が欲しい</td><td>I want a new bag.</td></tr>
    </table>
</div>

<div class="card">
    <h2>練習問題</h2>
    <div class="exercise">
        <p>Q1. 私は音楽が好きです。</p>
        <input type="text" id="ex3-1" placeholder="英語で書いてみましょう">
        <button onclick="checkExercise('ex3-1', ['I like music.', 'I like music'])">答え合わせ</button>
        <div class="feedback" id="ex3-1-fb"></div>
    </div>
    <div class="exercise">
        <p>Q2. 彼女は本を読む。</p>
        <input type="text" id="ex3-2" placeholder="英語で書いてみましょう">
        <button onclick="checkExercise('ex3-2', ['She reads books.', 'She reads books', 'She reads a book.', 'She reads a book'])">答え合わせ</button>
        <div class="feedback" id="ex3-2-fb"></div>
    </div>
    <div class="exercise">
        <p>Q3. 私たちは英語を勉強する。</p>
        <input type="text" id="ex3-3" placeholder="英語で書いてみましょう">
        <button onclick="checkExercise('ex3-3', ['We study English.', 'We study English'])">答え合わせ</button>
        <div class="feedback" id="ex3-3-fb"></div>
    </div>
    <div class="exercise">
        <p>Q4. 彼はテレビを見る。</p>
        <input type="text" id="ex3-4" placeholder="英語で書いてみましょう">
        <button onclick="checkExercise('ex3-4', ['He watches TV.', 'He watches TV'])">答え合わせ</button>
        <div class="feedback" id="ex3-4-fb"></div>
    </div>
</div>

<div class="card">
    <h2>まとめ</h2>
    <ul style="padding-left:20px;">
        <li><strong>SVO文型</strong> ＝ 主語（S）＋ 動詞（V）＋ 目的語（O）</li>
        <li>日本語は SOV、英語は SVO → <strong>語順が違う</strong></li>
        <li>目的語（O）＝ 動作の対象（「〜を」「〜が」にあたるもの）</li>
        <li>S ≠ O が成り立つ → SVO文型と判断</li>
        <li>英語で <strong>最もよく使う文型</strong></li>
    </ul>
</div>
`;

// ----- Lesson 04: 形容詞と副詞 -----
lessonContent[4] = `
<div class="lesson-header">
    <span class="lesson-tag">Stage 1 ─ 全学年共通レベル</span>
    <h2>Lesson 04：形容詞と副詞</h2>
    <p>名詞を修飾する形容詞と、動詞・形容詞を修飾する副詞を学びます</p>
</div>

<div class="card">
    <h2>形容詞とは？</h2>
    <p>形容詞は <strong>名詞を説明する言葉</strong> です。「どんな〜？」に答えます。</p>
    <p>形容詞の使い方は2つあります：</p>

    <h3>① 名詞の前に置く（限定用法）</h3>
    <div class="example-box">
        <div class="en">a <strong>big</strong> dog</div>
        <div class="ja">大きい犬</div>
    </div>
    <div class="example-box">
        <div class="en">a <strong>beautiful</strong> flower</div>
        <div class="ja">美しい花</div>
    </div>

    <h3>② 補語（C）として使う（叙述用法）= SVC文型</h3>
    <div class="example-box">
        <div class="en">The dog is <strong>big</strong>.</div>
        <div class="ja">その犬は大きい。</div>
    </div>
    <div class="example-box">
        <div class="en">The flower is <strong>beautiful</strong>.</div>
        <div class="ja">その花は美しい。</div>
    </div>
</div>

<div class="card">
    <h2>よく使う形容詞</h2>
    <table>
        <tr><th>形容詞</th><th>意味</th><th>反対語</th><th>意味</th></tr>
        <tr><td>big</td><td>大きい</td><td>small</td><td>小さい</td></tr>
        <tr><td>long</td><td>長い</td><td>short</td><td>短い</td></tr>
        <tr><td>hot</td><td>暑い・熱い</td><td>cold</td><td>寒い・冷たい</td></tr>
        <tr><td>new</td><td>新しい</td><td>old</td><td>古い</td></tr>
        <tr><td>good</td><td>良い</td><td>bad</td><td>悪い</td></tr>
        <tr><td>happy</td><td>幸せな</td><td>sad</td><td>悲しい</td></tr>
        <tr><td>easy</td><td>簡単な</td><td>difficult</td><td>難しい</td></tr>
        <tr><td>fast</td><td>速い</td><td>slow</td><td>遅い</td></tr>
    </table>
</div>

<div class="card">
    <h2>副詞とは？</h2>
    <p>副詞は <strong>動詞・形容詞・他の副詞を説明する言葉</strong> です。「どのように？」に答えます。</p>

    <h3>動詞を修飾する副詞</h3>
    <div class="example-box">
        <div class="en">She runs <strong>fast</strong>.</div>
        <div class="ja">彼女は速く走る。（runを修飾）</div>
    </div>
    <div class="example-box">
        <div class="en">He speaks English <strong>well</strong>.</div>
        <div class="ja">彼は英語を上手に話す。（speaksを修飾）</div>
    </div>

    <h3>形容詞を修飾する副詞</h3>
    <div class="example-box">
        <div class="en">She is <strong>very</strong> kind.</div>
        <div class="ja">彼女はとても優しい。（kindを修飾）</div>
    </div>

    <div class="point-box">
        多くの副詞は形容詞に <strong>-ly</strong> をつけて作ります。slow → slow<strong>ly</strong>、quick → quick<strong>ly</strong>
    </div>
</div>

<div class="card">
    <h2>形容詞と副詞の違い</h2>
    <table>
        <tr><th></th><th>形容詞</th><th>副詞</th></tr>
        <tr><td>何を説明？</td><td>名詞</td><td>動詞・形容詞・副詞</td></tr>
        <tr><td>例</td><td>a <strong>slow</strong> car（遅い車）</td><td>He drives <strong>slowly</strong>.（ゆっくり運転する）</td></tr>
        <tr><td>例</td><td>a <strong>happy</strong> girl（幸せな女の子）</td><td>She smiled <strong>happily</strong>.（幸せそうに微笑んだ）</td></tr>
    </table>

    <div class="warn-box">
        形容詞と副詞を間違えやすいので注意！「名詞を説明 → 形容詞」「動詞を説明 → 副詞」と覚えましょう。
    </div>
</div>

<div class="card">
    <h2>練習問題</h2>
    <div class="exercise">
        <p>Q1. 「彼女は美しい。」を英語にしましょう。</p>
        <input type="text" id="ex4-1" placeholder="英語で書いてみましょう">
        <button onclick="checkExercise('ex4-1', ['She is beautiful.', 'She is beautiful'])">答え合わせ</button>
        <div class="feedback" id="ex4-1-fb"></div>
    </div>
    <div class="exercise">
        <p>Q2. 「彼は速く走る。」を英語にしましょう。</p>
        <input type="text" id="ex4-2" placeholder="英語で書いてみましょう">
        <button onclick="checkExercise('ex4-2', ['He runs fast.', 'He runs fast'])">答え合わせ</button>
        <div class="feedback" id="ex4-2-fb"></div>
    </div>
    <div class="exercise">
        <p>Q3. 次の（ ）内は形容詞？副詞？「She is (very) kind.」</p>
        <input type="text" id="ex4-3" placeholder="形容詞 or 副詞">
        <button onclick="checkExercise('ex4-3', ['副詞'])">答え合わせ</button>
        <div class="feedback" id="ex4-3-fb"></div>
    </div>
</div>

<div class="card">
    <h2>まとめ</h2>
    <ul style="padding-left:20px;">
        <li><strong>形容詞</strong>：名詞を説明する。名詞の前 or 補語（C）に置く</li>
        <li><strong>副詞</strong>：動詞・形容詞・副詞を説明する</li>
        <li>形容詞 + <strong>ly</strong> → 副詞になる（例：slow → slowly）</li>
        <li>副詞は文型の要素（S, V, O, C）には含まれない</li>
    </ul>
</div>
`;

// ----- Lesson 05: SVOO文型 -----
lessonContent[5] = `
<div class="lesson-header">
    <span class="lesson-tag">Stage 1 ─ 全学年共通レベル</span>
    <h2>Lesson 05：英語の語順 SVOO文型</h2>
    <p>「〜に…を〜する」目的語が2つある文型を学びます</p>
</div>

<div class="card">
    <h2>SVOO文型とは？</h2>
    <p><strong>S</strong> = Subject（主語）<br>
    <strong>V</strong> = Verb（動詞）<br>
    <strong>O1</strong> = 間接目的語（〜に ← 人）<br>
    <strong>O2</strong> = 直接目的語（〜を ← もの）</p>

    <div class="word-order">
        <div class="word-block subject">S</div>
        <div class="word-block arrow">→</div>
        <div class="word-block verb">V</div>
        <div class="word-block arrow">→</div>
        <div class="word-block object">O1（人に）</div>
        <div class="word-block arrow">→</div>
        <div class="word-block object">O2（ものを）</div>
    </div>

    <div class="example-box">
        <div class="en">I gave <strong>her</strong> <strong>a present</strong>.</div>
        <div class="ja">私は彼女にプレゼントをあげた。（her=人に、a present=ものを）</div>
    </div>

    <div class="point-box">
        SVOO文型は「<strong>人に</strong> + <strong>ものを</strong>」の順番！日本語とは語順が逆になることに注意。
    </div>
</div>

<div class="card">
    <h2>SVOO文型の例文</h2>
    <table>
        <tr><th>英語</th><th>S</th><th>V</th><th>O1（人）</th><th>O2（もの）</th><th>意味</th></tr>
        <tr><td>I gave him a book.</td><td>I</td><td>gave</td><td>him</td><td>a book</td><td>私は彼に本をあげた。</td></tr>
        <tr><td>She told me the story.</td><td>She</td><td>told</td><td>me</td><td>the story</td><td>彼女は私にその話をした。</td></tr>
        <tr><td>He showed us a picture.</td><td>He</td><td>showed</td><td>us</td><td>a picture</td><td>彼は私たちに写真を見せた。</td></tr>
        <tr><td>I bought her flowers.</td><td>I</td><td>bought</td><td>her</td><td>flowers</td><td>私は彼女に花を買った。</td></tr>
        <tr><td>She taught me English.</td><td>She</td><td>taught</td><td>me</td><td>English</td><td>彼女は私に英語を教えた。</td></tr>
    </table>
</div>

<div class="card">
    <h2>SVOO文型でよく使う動詞</h2>
    <table>
        <tr><th>動詞</th><th>意味</th><th>例文</th></tr>
        <tr><td>give</td><td>〜に…をあげる</td><td>Give me water.</td></tr>
        <tr><td>tell</td><td>〜に…を伝える</td><td>Tell me the truth.</td></tr>
        <tr><td>show</td><td>〜に…を見せる</td><td>Show me your ticket.</td></tr>
        <tr><td>teach</td><td>〜に…を教える</td><td>She teaches us math.</td></tr>
        <tr><td>buy</td><td>〜に…を買う</td><td>I bought him a gift.</td></tr>
        <tr><td>send</td><td>〜に…を送る</td><td>Send me an email.</td></tr>
        <tr><td>make</td><td>〜に…を作る</td><td>She made me lunch.</td></tr>
        <tr><td>ask</td><td>〜に…をたずねる</td><td>Ask him the question.</td></tr>
    </table>
</div>

<div class="card">
    <h2>書き換え：to / for を使った形</h2>
    <p>SVOO は「SVO + to/for 人」に書き換えられます。</p>
    <div class="example-box">
        <div class="en">I gave <strong>her</strong> a present. = I gave a present <strong>to her</strong>.</div>
        <div class="ja">（どちらも「彼女にプレゼントをあげた」）</div>
    </div>
    <div class="example-box">
        <div class="en">I bought <strong>her</strong> flowers. = I bought flowers <strong>for her</strong>.</div>
        <div class="ja">（どちらも「彼女に花を買った」）</div>
    </div>

    <div class="point-box">
        give, tell, show, teach, send → <strong>to</strong> を使う<br>
        buy, make, cook, get → <strong>for</strong> を使う
    </div>
</div>

<div class="card">
    <h2>練習問題</h2>
    <div class="exercise">
        <p>Q1. 私は彼に本をあげた。</p>
        <input type="text" id="ex5-1" placeholder="英語で書いてみましょう">
        <button onclick="checkExercise('ex5-1', ['I gave him a book.', 'I gave him a book'])">答え合わせ</button>
        <div class="feedback" id="ex5-1-fb"></div>
    </div>
    <div class="exercise">
        <p>Q2. 彼女は私に英語を教えた。</p>
        <input type="text" id="ex5-2" placeholder="英語で書いてみましょう">
        <button onclick="checkExercise('ex5-2', ['She taught me English.', 'She taught me English'])">答え合わせ</button>
        <div class="feedback" id="ex5-2-fb"></div>
    </div>
    <div class="exercise">
        <p>Q3. 私にお水をください。</p>
        <input type="text" id="ex5-3" placeholder="英語で書いてみましょう">
        <button onclick="checkExercise('ex5-3', ['Give me water.', 'Give me water', 'Give me water, please.', 'Please give me water.'])">答え合わせ</button>
        <div class="feedback" id="ex5-3-fb"></div>
    </div>
</div>

<div class="card">
    <h2>まとめ</h2>
    <ul style="padding-left:20px;">
        <li><strong>SVOO文型</strong> ＝ S + V + O1（人に）+ O2（ものを）</li>
        <li>「人に」→「ものを」の順番で並べる</li>
        <li>SVO + to/for で書き換えできる</li>
        <li>give/tell/show → to、buy/make → for</li>
    </ul>
</div>
`;

// ----- Lesson 06: SVOC文型 -----
lessonContent[6] = `
<div class="lesson-header">
    <span class="lesson-tag">Stage 1 ─ 全学年共通レベル</span>
    <h2>Lesson 06：英語の語順 SVOC文型</h2>
    <p>「〜を…にする／と呼ぶ」目的語を説明する補語がある文型</p>
</div>

<div class="card">
    <h2>SVOC文型とは？</h2>
    <p><strong>S</strong> = Subject（主語）<br>
    <strong>V</strong> = Verb（動詞）<br>
    <strong>O</strong> = Object（目的語）<br>
    <strong>C</strong> = Complement（補語：目的語を説明する）</p>

    <div class="word-order">
        <div class="word-block subject">S</div>
        <div class="word-block arrow">→</div>
        <div class="word-block verb">V</div>
        <div class="word-block arrow">→</div>
        <div class="word-block object">O</div>
        <div class="word-block arrow">→</div>
        <div class="word-block complement">C</div>
    </div>

    <p>SVOC文型のポイント：<strong>O = C</strong>（目的語 ＝ 補語）の関係が成り立つ！</p>

    <div class="example-box">
        <div class="en">We call him <strong>Ken</strong>.</div>
        <div class="ja">私たちは彼をケンと呼ぶ。→ him = Ken が成り立つ！</div>
    </div>

    <div class="point-box">
        SVC文型では S = C でしたが、SVOC文型では <strong>O = C</strong> です。ここが見分けポイント！
    </div>
</div>

<div class="card">
    <h2>SVOOとSVOCの見分け方</h2>
    <div class="comparison-box">
        <div class="jp-order">
            <h4>SVOO文型</h4>
            <p><strong>I gave her a book.</strong></p>
            <p style="color:#718096">her ≠ a book → O1とO2は別のもの</p>
        </div>
        <div class="en-order">
            <h4>SVOC文型</h4>
            <p><strong>We call him Ken.</strong></p>
            <p style="color:#718096">him = Ken → O = C が成り立つ</p>
        </div>
    </div>
</div>

<div class="card">
    <h2>SVOC文型の例文</h2>
    <table>
        <tr><th>英語</th><th>V</th><th>O</th><th>C</th><th>意味</th></tr>
        <tr><td>We call him Ken.</td><td>call</td><td>him</td><td>Ken</td><td>私たちは彼をケンと呼ぶ。</td></tr>
        <tr><td>She named the cat Tama.</td><td>named</td><td>the cat</td><td>Tama</td><td>彼女はその猫をタマと名づけた。</td></tr>
        <tr><td>The news made me happy.</td><td>made</td><td>me</td><td>happy</td><td>そのニュースは私を幸せにした。</td></tr>
        <tr><td>I found the book interesting.</td><td>found</td><td>the book</td><td>interesting</td><td>私はその本を面白いと思った。</td></tr>
        <tr><td>Keep the door open.</td><td>Keep</td><td>the door</td><td>open</td><td>ドアを開けておいて。</td></tr>
    </table>
</div>

<div class="card">
    <h2>SVOC文型でよく使う動詞</h2>
    <table>
        <tr><th>動詞</th><th>意味</th><th>例文</th></tr>
        <tr><td>call</td><td>〜を…と呼ぶ</td><td>Call me Taro.</td></tr>
        <tr><td>name</td><td>〜を…と名づける</td><td>They named her Hana.</td></tr>
        <tr><td>make</td><td>〜を…にする</td><td>Music makes me happy.</td></tr>
        <tr><td>find</td><td>〜を…だとわかる</td><td>I find it difficult.</td></tr>
        <tr><td>keep</td><td>〜を…のままにする</td><td>Keep your room clean.</td></tr>
        <tr><td>leave</td><td>〜を…のままにする</td><td>Leave me alone.</td></tr>
    </table>
</div>

<div class="card">
    <h2>5文型の総まとめ</h2>
    <table>
        <tr><th>文型</th><th>構造</th><th>ポイント</th><th>例文</th></tr>
        <tr><td>SV</td><td>S + V</td><td>動詞だけで完結</td><td>I run.</td></tr>
        <tr><td>SVC</td><td>S + V + C</td><td>S = C</td><td>I am happy.</td></tr>
        <tr><td>SVO</td><td>S + V + O</td><td>S ≠ O</td><td>I like music.</td></tr>
        <tr><td>SVOO</td><td>S + V + O1 + O2</td><td>人に＋ものを</td><td>I gave her a book.</td></tr>
        <tr><td>SVOC</td><td>S + V + O + C</td><td>O = C</td><td>We call him Ken.</td></tr>
    </table>

    <div class="point-box">
        すべての英文は、この5つの文型のどれかに当てはまります。文型を理解すれば、英語の構造が見えてきます！
    </div>
</div>

<div class="card">
    <h2>練習問題</h2>
    <div class="exercise">
        <p>Q1. 私たちは彼をケンと呼ぶ。</p>
        <input type="text" id="ex6-1" placeholder="英語で書いてみましょう">
        <button onclick="checkExercise('ex6-1', ['We call him Ken.', 'We call him Ken'])">答え合わせ</button>
        <div class="feedback" id="ex6-1-fb"></div>
    </div>
    <div class="exercise">
        <p>Q2. その音楽は私を幸せにする。</p>
        <input type="text" id="ex6-2" placeholder="英語で書いてみましょう">
        <button onclick="checkExercise('ex6-2', ['The music makes me happy.', 'The music makes me happy', 'Music makes me happy.', 'Music makes me happy'])">答え合わせ</button>
        <div class="feedback" id="ex6-2-fb"></div>
    </div>
    <div class="exercise">
        <p>Q3. 次の文はどの文型？「She gave me a pen.」</p>
        <input type="text" id="ex6-3" placeholder="SV / SVC / SVO / SVOO / SVOC">
        <button onclick="checkExercise('ex6-3', ['SVOO'])">答え合わせ</button>
        <div class="feedback" id="ex6-3-fb"></div>
    </div>
    <div class="exercise">
        <p>Q4. 次の文はどの文型？「The news made her sad.」</p>
        <input type="text" id="ex6-4" placeholder="SV / SVC / SVO / SVOO / SVOC">
        <button onclick="checkExercise('ex6-4', ['SVOC'])">答え合わせ</button>
        <div class="feedback" id="ex6-4-fb"></div>
    </div>
</div>

<div class="card">
    <h2>まとめ</h2>
    <ul style="padding-left:20px;">
        <li><strong>SVOC文型</strong> ＝ S + V + O + C（O = C が成り立つ）</li>
        <li>SVOOとの見分け：O1≠O2ならSVOO、O=CならSVOC</li>
        <li>call, name, make, find, keep がSVOC動詞の代表</li>
        <li>これで <strong>5文型すべて完了！</strong> この基礎が今後の学習の土台になります</li>
    </ul>
</div>
`;

// ----- Lesson 07: 主語と動詞 -----
lessonContent[7] = `
<div class="lesson-header">
    <span class="lesson-tag">Stage 2 ─ 中学1年レベル</span>
    <h2>Lesson 07：主語と動詞</h2>
    <p>英語の文の核となる「主語」と「動詞」を深く理解しよう</p>
</div>

<div class="card">
    <h2>主語（Subject）とは？</h2>
    <p>主語は「<strong>誰が</strong>」「<strong>何が</strong>」にあたる言葉です。英語の文には必ず主語が必要です。</p>

    <h3>主語になれるもの</h3>
    <table>
        <tr><th>種類</th><th>例</th><th>例文</th></tr>
        <tr><td>代名詞</td><td>I, you, he, she, it, we, they</td><td>I like music.</td></tr>
        <tr><td>名詞</td><td>Tom, the dog, my mother</td><td>Tom plays soccer.</td></tr>
        <tr><td>名詞句</td><td>the tall boy, my best friend</td><td>My best friend lives in Osaka.</td></tr>
    </table>

    <div class="point-box">
        日本語では主語を省略できますが（「行くよ」）、英語では<strong>主語を省略できません</strong>（必ず "I go." のように主語が必要）。
    </div>
</div>

<div class="card">
    <h2>動詞（Verb）とは？</h2>
    <p>動詞は「<strong>〜する</strong>」「<strong>〜である</strong>」を表す言葉です。英語の動詞は大きく2種類あります。</p>

    <div class="comparison-box">
        <div class="jp-order">
            <h4>be動詞</h4>
            <p>am / is / are</p>
            <p style="color:#718096">「〜です」「〜にいる」</p>
            <p><strong>I am a student.</strong></p>
        </div>
        <div class="en-order">
            <h4>一般動詞</h4>
            <p>play / eat / run / like など</p>
            <p style="color:#718096">「〜する」</p>
            <p><strong>I play tennis.</strong></p>
        </div>
    </div>

    <div class="warn-box">
        be動詞と一般動詞は<strong>1つの文の中で同時に使えません</strong>。<br>
        ✕ I am play tennis. → ○ I play tennis.
    </div>
</div>

<div class="card">
    <h2>主語と動詞の一致</h2>
    <p>主語によって動詞の形が変わります。特に重要なのが<strong>三単現の s</strong> です。</p>

    <table>
        <tr><th>主語</th><th>be動詞</th><th>一般動詞</th></tr>
        <tr><td>I</td><td>am</td><td>play</td></tr>
        <tr><td>You</td><td>are</td><td>play</td></tr>
        <tr><td>He / She / It</td><td>is</td><td>play<strong>s</strong></td></tr>
        <tr><td>We / They</td><td>are</td><td>play</td></tr>
    </table>

    <h3>三単現の s のつけ方</h3>
    <table>
        <tr><th>ルール</th><th>例</th></tr>
        <tr><td>ふつうは s をつける</td><td>play → plays, run → runs</td></tr>
        <tr><td>s, x, sh, ch, o で終わる → es</td><td>watch → watches, go → goes</td></tr>
        <tr><td>子音 + y → y を i に変えて es</td><td>study → studies, cry → cries</td></tr>
        <tr><td>have は特別</td><td>have → has</td></tr>
    </table>
</div>

<div class="card">
    <h2>練習問題</h2>
    <div class="exercise">
        <p>Q1. 次の（ ）に適切なbe動詞を入れましょう。「She ( ) a nurse.」</p>
        <input type="text" id="ex7-1" placeholder="am / is / are">
        <button onclick="checkExercise('ex7-1', ['is'])">答え合わせ</button>
        <div class="feedback" id="ex7-1-fb"></div>
    </div>
    <div class="exercise">
        <p>Q2. 正しい形にしましょう。「He (play) soccer every day.」</p>
        <input type="text" id="ex7-2" placeholder="動詞を正しい形で">
        <button onclick="checkExercise('ex7-2', ['plays'])">答え合わせ</button>
        <div class="feedback" id="ex7-2-fb"></div>
    </div>
    <div class="exercise">
        <p>Q3. 正しい形にしましょう。「She (study) English.」</p>
        <input type="text" id="ex7-3" placeholder="動詞を正しい形で">
        <button onclick="checkExercise('ex7-3', ['studies'])">答え合わせ</button>
        <div class="feedback" id="ex7-3-fb"></div>
    </div>
    <div class="exercise">
        <p>Q4. 正しい形にしましょう。「He (have) a car.」</p>
        <input type="text" id="ex7-4" placeholder="動詞を正しい形で">
        <button onclick="checkExercise('ex7-4', ['has'])">答え合わせ</button>
        <div class="feedback" id="ex7-4-fb"></div>
    </div>
</div>

<div class="card">
    <h2>まとめ</h2>
    <ul style="padding-left:20px;">
        <li>英語の文には必ず<strong>主語</strong>と<strong>動詞</strong>が必要</li>
        <li>動詞は<strong>be動詞</strong>と<strong>一般動詞</strong>の2種類</li>
        <li>be動詞と一般動詞は同じ文で同時に使えない</li>
        <li>he/she/itが主語のとき、一般動詞に<strong>s</strong>をつける（三単現の s）</li>
    </ul>
</div>
`;

// ----- Lesson 08: 名詞と代名詞 -----
lessonContent[8] = `
<div class="lesson-header">
    <span class="lesson-tag">Stage 2 ─ 中学1年レベル</span>
    <h2>Lesson 08：名詞と代名詞</h2>
    <p>名詞の種類と、名詞の代わりに使う代名詞を学びます</p>
</div>

<div class="card">
    <h2>名詞（Noun）とは？</h2>
    <p>人・もの・場所・概念などの名前を表す言葉です。</p>

    <table>
        <tr><th>種類</th><th>例</th></tr>
        <tr><td>数えられる名詞（可算名詞）</td><td>book, dog, apple, car</td></tr>
        <tr><td>数えられない名詞（不可算名詞）</td><td>water, music, money, information</td></tr>
    </table>

    <h3>複数形の作り方</h3>
    <table>
        <tr><th>ルール</th><th>例</th></tr>
        <tr><td>ふつうは s をつける</td><td>cat → cats, book → books</td></tr>
        <tr><td>s, x, sh, ch で終わる → es</td><td>box → boxes, dish → dishes</td></tr>
        <tr><td>子音 + y → ies</td><td>city → cities, baby → babies</td></tr>
        <tr><td>f/fe → ves</td><td>knife → knives, life → lives</td></tr>
        <tr><td>不規則変化</td><td>man → men, child → children, foot → feet</td></tr>
    </table>
</div>

<div class="card">
    <h2>代名詞（Pronoun）</h2>
    <p>名詞の代わりに使う言葉です。同じ名詞の繰り返しを避けます。</p>

    <table>
        <tr><th></th><th>主格<br>〜は</th><th>所有格<br>〜の</th><th>目的格<br>〜を/に</th><th>所有代名詞<br>〜のもの</th></tr>
        <tr><td>私</td><td><strong>I</strong></td><td>my</td><td>me</td><td>mine</td></tr>
        <tr><td>あなた</td><td><strong>you</strong></td><td>your</td><td>you</td><td>yours</td></tr>
        <tr><td>彼</td><td><strong>he</strong></td><td>his</td><td>him</td><td>his</td></tr>
        <tr><td>彼女</td><td><strong>she</strong></td><td>her</td><td>her</td><td>hers</td></tr>
        <tr><td>それ</td><td><strong>it</strong></td><td>its</td><td>it</td><td>-</td></tr>
        <tr><td>私たち</td><td><strong>we</strong></td><td>our</td><td>us</td><td>ours</td></tr>
        <tr><td>彼ら</td><td><strong>they</strong></td><td>their</td><td>them</td><td>theirs</td></tr>
    </table>

    <div class="example-box">
        <div class="en">This is <strong>my</strong> book. It is <strong>mine</strong>.</div>
        <div class="ja">これは私の本です。それは私のものです。</div>
    </div>

    <div class="example-box">
        <div class="en">I know <strong>him</strong>. <strong>His</strong> name is Tom.</div>
        <div class="ja">私は彼を知っています。彼の名前はトムです。</div>
    </div>
</div>

<div class="card">
    <h2>練習問題</h2>
    <div class="exercise">
        <p>Q1. 「私は彼を知っている。」の「彼を」は英語で？</p>
        <input type="text" id="ex8-1" placeholder="代名詞を入力">
        <button onclick="checkExercise('ex8-1', ['him'])">答え合わせ</button>
        <div class="feedback" id="ex8-1-fb"></div>
    </div>
    <div class="exercise">
        <p>Q2. 「これは彼女の本です。」→ This is ( ) book.</p>
        <input type="text" id="ex8-2" placeholder="代名詞を入力">
        <button onclick="checkExercise('ex8-2', ['her'])">答え合わせ</button>
        <div class="feedback" id="ex8-2-fb"></div>
    </div>
    <div class="exercise">
        <p>Q3. child の複数形は？</p>
        <input type="text" id="ex8-3" placeholder="複数形を入力">
        <button onclick="checkExercise('ex8-3', ['children'])">答え合わせ</button>
        <div class="feedback" id="ex8-3-fb"></div>
    </div>
</div>

<div class="card">
    <h2>まとめ</h2>
    <ul style="padding-left:20px;">
        <li>名詞には<strong>数えられる名詞</strong>と<strong>数えられない名詞</strong>がある</li>
        <li>数えられる名詞が2つ以上のとき<strong>複数形</strong>にする</li>
        <li>代名詞は<strong>主格・所有格・目的格・所有代名詞</strong>の4つの形がある</li>
        <li>文中での役割によって使い分ける</li>
    </ul>
</div>
`;

// ----- Lesson 09: 否定文と疑問文 -----
lessonContent[9] = `
<div class="lesson-header">
    <span class="lesson-tag">Stage 2 ─ 中学1年レベル</span>
    <h2>Lesson 09：否定文と疑問文</h2>
    <p>「〜ではない」「〜ですか？」の作り方を学びます</p>
</div>

<div class="card">
    <h2>be動詞の否定文と疑問文</h2>

    <h3>否定文：be動詞の後に not をつける</h3>
    <div class="example-box">
        <div class="en">I <strong>am not</strong> tired.</div>
        <div class="ja">私は疲れていません。</div>
    </div>
    <div class="example-box">
        <div class="en">She <strong>is not</strong> (isn't) a student.</div>
        <div class="ja">彼女は学生ではありません。</div>
    </div>

    <h3>疑問文：be動詞を主語の前に出す</h3>
    <div class="example-box">
        <div class="en"><strong>Are</strong> you hungry? ─ Yes, I am. / No, I am not.</div>
        <div class="ja">お腹がすいていますか？ ─ はい / いいえ</div>
    </div>
    <div class="example-box">
        <div class="en"><strong>Is</strong> he a teacher? ─ Yes, he is. / No, he isn't.</div>
        <div class="ja">彼は先生ですか？ ─ はい / いいえ</div>
    </div>
</div>

<div class="card">
    <h2>一般動詞の否定文と疑問文</h2>

    <h3>否定文：do not (don't) / does not (doesn't) + 動詞の原形</h3>
    <div class="example-box">
        <div class="en">I <strong>don't</strong> like natto.</div>
        <div class="ja">私は納豆が好きではありません。</div>
    </div>
    <div class="example-box">
        <div class="en">He <strong>doesn't</strong> play soccer.</div>
        <div class="ja">彼はサッカーをしません。（doesn't の後は原形 play）</div>
    </div>

    <h3>疑問文：Do / Does を文の先頭に + 動詞の原形</h3>
    <div class="example-box">
        <div class="en"><strong>Do</strong> you like sushi? ─ Yes, I do. / No, I don't.</div>
        <div class="ja">寿司は好きですか？ ─ はい / いいえ</div>
    </div>
    <div class="example-box">
        <div class="en"><strong>Does</strong> she speak English? ─ Yes, she does. / No, she doesn't.</div>
        <div class="ja">彼女は英語を話しますか？ ─ はい / いいえ</div>
    </div>

    <div class="warn-box">
        doesn't / Does を使ったら、動詞は<strong>必ず原形</strong>に戻す！<br>
        ✕ Does she speaks English? → ○ Does she speak English?
    </div>
</div>

<div class="card">
    <h2>まとめ表</h2>
    <table>
        <tr><th></th><th>否定文</th><th>疑問文</th></tr>
        <tr><td>be動詞</td><td>be動詞 + <strong>not</strong></td><td><strong>be動詞</strong> + 主語 〜?</td></tr>
        <tr><td>一般動詞</td><td>主語 + <strong>don't/doesn't</strong> + 原形</td><td><strong>Do/Does</strong> + 主語 + 原形 〜?</td></tr>
    </table>
</div>

<div class="card">
    <h2>練習問題</h2>
    <div class="exercise">
        <p>Q1. 否定文にしましょう。「I am happy.」</p>
        <input type="text" id="ex9-1" placeholder="否定文を入力">
        <button onclick="checkExercise('ex9-1', ['I am not happy.', 'I am not happy'])">答え合わせ</button>
        <div class="feedback" id="ex9-1-fb"></div>
    </div>
    <div class="exercise">
        <p>Q2. 否定文にしましょう。「She likes cats.」</p>
        <input type="text" id="ex9-2" placeholder="否定文を入力">
        <button onclick="checkExercise('ex9-2', ['She doesn\\'t like cats.', 'She does not like cats.', 'She doesn\\'t like cats', 'She does not like cats'])">答え合わせ</button>
        <div class="feedback" id="ex9-2-fb"></div>
    </div>
    <div class="exercise">
        <p>Q3. 疑問文にしましょう。「You play tennis.」</p>
        <input type="text" id="ex9-3" placeholder="疑問文を入力">
        <button onclick="checkExercise('ex9-3', ['Do you play tennis?', 'Do you play tennis'])">答え合わせ</button>
        <div class="feedback" id="ex9-3-fb"></div>
    </div>
</div>
`;

// ----- Lesson 10: 過去形 -----
lessonContent[10] = `
<div class="lesson-header">
    <span class="lesson-tag">Stage 2 ─ 中学1年レベル</span>
    <h2>Lesson 10：過去形</h2>
    <p>「〜した」「〜だった」過去のことを表す文を学びます</p>
</div>

<div class="card">
    <h2>be動詞の過去形</h2>
    <table>
        <tr><th>現在形</th><th>過去形</th><th>例文</th></tr>
        <tr><td>am / is</td><td><strong>was</strong></td><td>I was tired yesterday.</td></tr>
        <tr><td>are</td><td><strong>were</strong></td><td>They were happy.</td></tr>
    </table>

    <div class="example-box">
        <div class="en">She <strong>was</strong> a student last year.</div>
        <div class="ja">彼女は去年学生でした。</div>
    </div>
</div>

<div class="card">
    <h2>一般動詞の過去形（規則変化）</h2>
    <p>動詞の原形に <strong>-ed</strong> をつけます。</p>

    <table>
        <tr><th>ルール</th><th>例</th></tr>
        <tr><td>ふつうは ed をつける</td><td>play → play<strong>ed</strong>, walk → walk<strong>ed</strong></td></tr>
        <tr><td>e で終わる → d だけ</td><td>like → like<strong>d</strong>, use → use<strong>d</strong></td></tr>
        <tr><td>子音 + y → ied</td><td>study → stud<strong>ied</strong>, cry → cr<strong>ied</strong></td></tr>
        <tr><td>短母音 + 子音 → 子音を重ねて ed</td><td>stop → sto<strong>pped</strong></td></tr>
    </table>
</div>

<div class="card">
    <h2>一般動詞の過去形（不規則変化）</h2>
    <p>よく使う不規則動詞は暗記しましょう！</p>

    <table>
        <tr><th>原形</th><th>過去形</th><th>意味</th></tr>
        <tr><td>go</td><td><strong>went</strong></td><td>行く</td></tr>
        <tr><td>come</td><td><strong>came</strong></td><td>来る</td></tr>
        <tr><td>eat</td><td><strong>ate</strong></td><td>食べる</td></tr>
        <tr><td>drink</td><td><strong>drank</strong></td><td>飲む</td></tr>
        <tr><td>have</td><td><strong>had</strong></td><td>持つ</td></tr>
        <tr><td>make</td><td><strong>made</strong></td><td>作る</td></tr>
        <tr><td>get</td><td><strong>got</strong></td><td>得る</td></tr>
        <tr><td>see</td><td><strong>saw</strong></td><td>見る</td></tr>
        <tr><td>take</td><td><strong>took</strong></td><td>取る</td></tr>
        <tr><td>give</td><td><strong>gave</strong></td><td>あげる</td></tr>
        <tr><td>say</td><td><strong>said</strong></td><td>言う</td></tr>
        <tr><td>think</td><td><strong>thought</strong></td><td>思う</td></tr>
        <tr><td>know</td><td><strong>knew</strong></td><td>知る</td></tr>
        <tr><td>write</td><td><strong>wrote</strong></td><td>書く</td></tr>
        <tr><td>read</td><td><strong>read</strong></td><td>読む（発音が変わる）</td></tr>
    </table>
</div>

<div class="card">
    <h2>過去形の否定文・疑問文</h2>
    <table>
        <tr><th></th><th>否定文</th><th>疑問文</th></tr>
        <tr><td>be動詞</td><td>was/were + <strong>not</strong></td><td><strong>Was/Were</strong> + 主語?</td></tr>
        <tr><td>一般動詞</td><td>主語 + <strong>didn't</strong> + 原形</td><td><strong>Did</strong> + 主語 + 原形?</td></tr>
    </table>

    <div class="example-box">
        <div class="en">I <strong>didn't</strong> go to school yesterday.</div>
        <div class="ja">私は昨日学校に行きませんでした。</div>
    </div>
    <div class="example-box">
        <div class="en"><strong>Did</strong> you eat lunch? ─ Yes, I did.</div>
        <div class="ja">昼食を食べましたか？ ─ はい、食べました。</div>
    </div>
</div>

<div class="card">
    <h2>練習問題</h2>
    <div class="exercise">
        <p>Q1. go の過去形は？</p>
        <input type="text" id="ex10-1" placeholder="過去形を入力">
        <button onclick="checkExercise('ex10-1', ['went'])">答え合わせ</button>
        <div class="feedback" id="ex10-1-fb"></div>
    </div>
    <div class="exercise">
        <p>Q2. 「私は昨日サッカーをした。」を英語に。</p>
        <input type="text" id="ex10-2" placeholder="英語で入力">
        <button onclick="checkExercise('ex10-2', ['I played soccer yesterday.', 'I played soccer yesterday'])">答え合わせ</button>
        <div class="feedback" id="ex10-2-fb"></div>
    </div>
    <div class="exercise">
        <p>Q3. 疑問文にしましょう。「She went to Tokyo.」</p>
        <input type="text" id="ex10-3" placeholder="疑問文を入力">
        <button onclick="checkExercise('ex10-3', ['Did she go to Tokyo?', 'Did she go to Tokyo'])">答え合わせ</button>
        <div class="feedback" id="ex10-3-fb"></div>
    </div>
</div>
`;

// ----- Lesson 11: 冠詞と名詞 -----
lessonContent[11] = `
<div class="lesson-header">
    <span class="lesson-tag">Stage 2 ─ 中学1年レベル</span>
    <h2>Lesson 11：冠詞と名詞</h2>
    <p>a / an / the の使い分けを学びます</p>
</div>

<div class="card">
    <h2>冠詞とは？</h2>
    <p>名詞の前につく <strong>a / an / the</strong> を冠詞と言います。日本語にはない仕組みなので、しっかり覚えましょう。</p>

    <table>
        <tr><th>冠詞</th><th>名前</th><th>使い方</th></tr>
        <tr><td><strong>a</strong></td><td>不定冠詞</td><td>「ひとつの」（子音の音で始まる語の前）</td></tr>
        <tr><td><strong>an</strong></td><td>不定冠詞</td><td>「ひとつの」（母音の音で始まる語の前）</td></tr>
        <tr><td><strong>the</strong></td><td>定冠詞</td><td>「その」（特定のもの）</td></tr>
    </table>

    <h3>a と an の使い分け</h3>
    <div class="example-box">
        <div class="en"><strong>a</strong> book, <strong>a</strong> cat, <strong>a</strong> university</div>
        <div class="ja">（子音の音で始まる → a）※university は /j/ の音で始まる</div>
    </div>
    <div class="example-box">
        <div class="en"><strong>an</strong> apple, <strong>an</strong> egg, <strong>an</strong> hour</div>
        <div class="ja">（母音の音で始まる → an）※hour は h が読まれない</div>
    </div>

    <div class="point-box">
        スペルではなく<strong>発音</strong>で判断します！
    </div>
</div>

<div class="card">
    <h2>the を使う場面</h2>
    <table>
        <tr><th>場面</th><th>例</th></tr>
        <tr><td>前に出てきたもの</td><td>I have a dog. <strong>The</strong> dog is cute.</td></tr>
        <tr><td>世界にひとつしかないもの</td><td><strong>the</strong> sun, <strong>the</strong> moon</td></tr>
        <tr><td>お互いにわかっているもの</td><td>Open <strong>the</strong> door.（その部屋のドア）</td></tr>
    </table>
</div>

<div class="card">
    <h2>冠詞をつけない場合</h2>
    <table>
        <tr><th>場面</th><th>例</th></tr>
        <tr><td>数えられない名詞</td><td>I drink <strong>water</strong>. I like <strong>music</strong>.</td></tr>
        <tr><td>複数形で一般的な話</td><td>I like <strong>dogs</strong>.（犬全般が好き）</td></tr>
        <tr><td>スポーツ・教科・食事</td><td>play <strong>tennis</strong>, study <strong>math</strong>, eat <strong>lunch</strong></td></tr>
    </table>
</div>

<div class="card">
    <h2>練習問題</h2>
    <div class="exercise">
        <p>Q1. ( ) apple ← a か an か？</p>
        <input type="text" id="ex11-1" placeholder="a / an">
        <button onclick="checkExercise('ex11-1', ['an'])">答え合わせ</button>
        <div class="feedback" id="ex11-1-fb"></div>
    </div>
    <div class="exercise">
        <p>Q2. ( ) university ← a か an か？</p>
        <input type="text" id="ex11-2" placeholder="a / an">
        <button onclick="checkExercise('ex11-2', ['a'])">答え合わせ</button>
        <div class="feedback" id="ex11-2-fb"></div>
    </div>
    <div class="exercise">
        <p>Q3. 「I have a cat. ( ) cat is black.」の（ ）に入るのは？</p>
        <input type="text" id="ex11-3" placeholder="冠詞を入力">
        <button onclick="checkExercise('ex11-3', ['The', 'the'])">答え合わせ</button>
        <div class="feedback" id="ex11-3-fb"></div>
    </div>
</div>
`;

// ----- Lesson 12: 進行形 -----
lessonContent[12] = `
<div class="lesson-header">
    <span class="lesson-tag">Stage 2 ─ 中学1年レベル</span>
    <h2>Lesson 12：進行形</h2>
    <p>「〜している」今まさにしている動作を表す形を学びます</p>
</div>

<div class="card">
    <h2>現在進行形</h2>
    <p>「今〜しているところです」を表します。</p>

    <div class="word-order">
        <div class="word-block subject">主語</div>
        <div class="word-block arrow">→</div>
        <div class="word-block verb">am/is/are</div>
        <div class="word-block arrow">→</div>
        <div class="word-block complement">動詞ing</div>
    </div>

    <div class="example-box">
        <div class="en">I <strong>am studying</strong> English now.</div>
        <div class="ja">私は今英語を勉強しています。</div>
    </div>
    <div class="example-box">
        <div class="en">She <strong>is cooking</strong> dinner.</div>
        <div class="ja">彼女は夕食を作っています。</div>
    </div>
    <div class="example-box">
        <div class="en">They <strong>are playing</strong> soccer.</div>
        <div class="ja">彼らはサッカーをしています。</div>
    </div>
</div>

<div class="card">
    <h2>ing のつけ方</h2>
    <table>
        <tr><th>ルール</th><th>例</th></tr>
        <tr><td>ふつうは ing をつける</td><td>play → play<strong>ing</strong>, eat → eat<strong>ing</strong></td></tr>
        <tr><td>e で終わる → e をとって ing</td><td>make → mak<strong>ing</strong>, write → writ<strong>ing</strong></td></tr>
        <tr><td>短母音 + 子音 → 子音を重ねて ing</td><td>run → ru<strong>nning</strong>, swim → swi<strong>mming</strong></td></tr>
        <tr><td>ie で終わる → ie を y に変えて ing</td><td>die → d<strong>ying</strong>, lie → l<strong>ying</strong></td></tr>
    </table>
</div>

<div class="card">
    <h2>過去進行形</h2>
    <p>「（あのとき）〜していた」を表します。be動詞を過去形にするだけ！</p>

    <div class="example-box">
        <div class="en">I <strong>was watching</strong> TV at that time.</div>
        <div class="ja">私はそのときテレビを見ていました。</div>
    </div>
</div>

<div class="card">
    <h2>進行形の否定文・疑問文</h2>
    <p>be動詞の文なので、be動詞のルールに従います。</p>

    <div class="example-box">
        <div class="en">I <strong>am not</strong> sleeping.（否定文）</div>
        <div class="ja">私は眠っていません。</div>
    </div>
    <div class="example-box">
        <div class="en"><strong>Are</strong> you studying?（疑問文）─ Yes, I am.</div>
        <div class="ja">勉強していますか？─ はい、しています。</div>
    </div>
</div>

<div class="card">
    <h2>練習問題</h2>
    <div class="exercise">
        <p>Q1. 「彼女は今本を読んでいます。」を英語に。</p>
        <input type="text" id="ex12-1" placeholder="英語で入力">
        <button onclick="checkExercise('ex12-1', ['She is reading a book now.', 'She is reading a book now'])">答え合わせ</button>
        <div class="feedback" id="ex12-1-fb"></div>
    </div>
    <div class="exercise">
        <p>Q2. run の ing形は？</p>
        <input type="text" id="ex12-2" placeholder="ing形を入力">
        <button onclick="checkExercise('ex12-2', ['running'])">答え合わせ</button>
        <div class="feedback" id="ex12-2-fb"></div>
    </div>
    <div class="exercise">
        <p>Q3. make の ing形は？</p>
        <input type="text" id="ex12-3" placeholder="ing形を入力">
        <button onclick="checkExercise('ex12-3', ['making'])">答え合わせ</button>
        <div class="feedback" id="ex12-3-fb"></div>
    </div>
</div>

<div class="card">
    <h2>まとめ</h2>
    <ul style="padding-left:20px;">
        <li><strong>現在進行形</strong> = am/is/are + 動詞ing（今〜しているところ）</li>
        <li><strong>過去進行形</strong> = was/were + 動詞ing（あのとき〜していた）</li>
        <li>否定文・疑問文は<strong>be動詞のルール</strong>に従う</li>
        <li>ing のつけ方のルールに注意（e を取る・子音を重ねる等）</li>
    </ul>
</div>
`;

// ----- Lesson 13: 未来の表現 -----
lessonContent[13] = `
<div class="lesson-header">
    <span class="lesson-tag">Stage 3 ─ 中学1・2年レベル</span>
    <h2>Lesson 13：未来の表現</h2>
    <p>「〜するつもり」「〜するだろう」未来のことを表す2つの方法を学びます</p>
</div>

<div class="card">
    <h2>will を使った未来</h2>
    <p>「〜するだろう」「〜するつもり」（その場で決めた意志・予測）</p>

    <div class="word-order">
        <div class="word-block subject">主語</div>
        <div class="word-block arrow">→</div>
        <div class="word-block verb">will</div>
        <div class="word-block arrow">→</div>
        <div class="word-block object">動詞の原形</div>
    </div>

    <div class="example-box">
        <div class="en">I <strong>will</strong> help you.</div>
        <div class="ja">手伝いますよ。（その場の意志）</div>
    </div>
    <div class="example-box">
        <div class="en">It <strong>will</strong> rain tomorrow.</div>
        <div class="ja">明日は雨が降るでしょう。（予測）</div>
    </div>

    <p><strong>否定文：</strong>will not (won't) + 原形<br>
    <strong>疑問文：</strong>Will + 主語 + 原形?</p>

    <div class="example-box">
        <div class="en">I <strong>won't</strong> be late.</div>
        <div class="ja">遅れません。</div>
    </div>
    <div class="example-box">
        <div class="en"><strong>Will</strong> you come to the party? ─ Yes, I will.</div>
        <div class="ja">パーティーに来ますか？─ はい、行きます。</div>
    </div>
</div>

<div class="card">
    <h2>be going to を使った未来</h2>
    <p>「〜する予定だ」（前から決めていた計画）</p>

    <div class="word-order">
        <div class="word-block subject">主語</div>
        <div class="word-block arrow">→</div>
        <div class="word-block verb">am/is/are going to</div>
        <div class="word-block arrow">→</div>
        <div class="word-block object">動詞の原形</div>
    </div>

    <div class="example-box">
        <div class="en">I <strong>am going to</strong> visit Kyoto next week.</div>
        <div class="ja">来週京都を訪れる予定です。（計画）</div>
    </div>

    <div class="point-box">
        <strong>will</strong> = その場の判断・予測<br>
        <strong>be going to</strong> = 前から決めていた計画<br>
        実際の会話ではどちらを使ってもOKな場面が多いです。
    </div>
</div>

<div class="card" id="exercises-13"></div>
`;

// ----- Lesson 14: 助動詞 -----
lessonContent[14] = `
<div class="lesson-header">
    <span class="lesson-tag">Stage 3 ─ 中学1・2年レベル</span>
    <h2>Lesson 14：助動詞</h2>
    <p>can, must, may, should など、動詞に意味を追加する言葉を学びます</p>
</div>

<div class="card">
    <h2>助動詞とは？</h2>
    <p>動詞の前に置いて、「できる」「しなければならない」などの意味を追加します。</p>
    <p>助動詞の後は<strong>必ず動詞の原形</strong>！</p>

    <table>
        <tr><th>助動詞</th><th>意味</th><th>例文</th></tr>
        <tr><td><strong>can</strong></td><td>〜できる</td><td>I can swim.</td></tr>
        <tr><td><strong>must</strong></td><td>〜しなければならない</td><td>You must study.</td></tr>
        <tr><td><strong>may</strong></td><td>〜してもよい / 〜かもしれない</td><td>May I sit here?</td></tr>
        <tr><td><strong>should</strong></td><td>〜すべきだ</td><td>You should rest.</td></tr>
        <tr><td><strong>will</strong></td><td>〜するだろう / 〜するつもり</td><td>I will go.</td></tr>
        <tr><td><strong>have to</strong></td><td>〜しなければならない</td><td>I have to go now.</td></tr>
    </table>
</div>

<div class="card">
    <h2>can（〜できる）</h2>
    <div class="example-box">
        <div class="en">She <strong>can</strong> speak three languages.</div>
        <div class="ja">彼女は3つの言語を話せる。</div>
    </div>
    <p><strong>否定：</strong>cannot (can't) + 原形<br>
    <strong>疑問：</strong>Can + 主語 + 原形?</p>
    <div class="example-box">
        <div class="en"><strong>Can</strong> you help me? ─ Sure, I can.</div>
        <div class="ja">手伝ってもらえますか？─ もちろん。</div>
    </div>
</div>

<div class="card">
    <h2>must と have to の違い</h2>
    <div class="comparison-box">
        <div class="jp-order">
            <h4>must</h4>
            <p>話し手の主観的な義務</p>
            <p><strong>You must study.</strong></p>
            <p style="color:#718096">（私は）勉強しなきゃと思う</p>
        </div>
        <div class="en-order">
            <h4>have to</h4>
            <p>外部の事情による義務</p>
            <p><strong>I have to go now.</strong></p>
            <p style="color:#718096">（事情があって）行かなきゃ</p>
        </div>
    </div>

    <div class="warn-box">
        否定形の意味が全然違う！<br>
        <strong>must not</strong> = 〜してはいけない（禁止）<br>
        <strong>don't have to</strong> = 〜しなくてもよい（不必要）
    </div>
</div>

<div class="card" id="exercises-14"></div>
`;

// ----- Lesson 15: 疑問詞を使った疑問文 -----
lessonContent[15] = `
<div class="lesson-header">
    <span class="lesson-tag">Stage 3 ─ 中学1・2年レベル</span>
    <h2>Lesson 15：疑問詞を使った疑問文</h2>
    <p>What, Who, Where, When, Why, How を使った質問を学びます</p>
</div>

<div class="card">
    <h2>疑問詞一覧</h2>
    <table>
        <tr><th>疑問詞</th><th>意味</th><th>例文</th></tr>
        <tr><td><strong>What</strong></td><td>何</td><td>What is this?（これは何？）</td></tr>
        <tr><td><strong>Who</strong></td><td>誰</td><td>Who is she?（彼女は誰？）</td></tr>
        <tr><td><strong>Where</strong></td><td>どこ</td><td>Where do you live?（どこに住んでいる？）</td></tr>
        <tr><td><strong>When</strong></td><td>いつ</td><td>When is your birthday?（誕生日はいつ？）</td></tr>
        <tr><td><strong>Why</strong></td><td>なぜ</td><td>Why are you sad?（なぜ悲しいの？）</td></tr>
        <tr><td><strong>How</strong></td><td>どのように</td><td>How are you?（元気ですか？）</td></tr>
        <tr><td><strong>Which</strong></td><td>どちら</td><td>Which do you like?（どちらが好き？）</td></tr>
        <tr><td><strong>Whose</strong></td><td>誰の</td><td>Whose bag is this?（これは誰のカバン？）</td></tr>
    </table>
</div>

<div class="card">
    <h2>疑問詞の語順</h2>
    <div class="word-order">
        <div class="word-block subject">疑問詞</div>
        <div class="word-block arrow">→</div>
        <div class="word-block verb">疑問文の語順</div>
    </div>

    <div class="example-box">
        <div class="en"><strong>What</strong> do you want?</div>
        <div class="ja">何が欲しいですか？</div>
    </div>
    <div class="example-box">
        <div class="en"><strong>Where</strong> did you go yesterday?</div>
        <div class="ja">昨日どこに行きましたか？</div>
    </div>

    <h3>How + 形容詞/副詞</h3>
    <table>
        <tr><th>表現</th><th>意味</th><th>例文</th></tr>
        <tr><td>How many</td><td>いくつ</td><td>How many books do you have?</td></tr>
        <tr><td>How much</td><td>いくら</td><td>How much is this?</td></tr>
        <tr><td>How old</td><td>何歳</td><td>How old are you?</td></tr>
        <tr><td>How long</td><td>どのくらい（時間・長さ）</td><td>How long does it take?</td></tr>
        <tr><td>How often</td><td>どのくらいの頻度で</td><td>How often do you exercise?</td></tr>
    </table>
</div>

<div class="card">
    <h2>練習問題</h2>
    <div class="exercise">
        <p>Q1. 「あなたの名前は何ですか？」を英語に。</p>
        <input type="text" id="ex15-1" placeholder="英語で入力">
        <button onclick="checkExercise('ex15-1', ['What is your name?', 'What is your name'])">答え合わせ</button>
        <div class="feedback" id="ex15-1-fb"></div>
    </div>
    <div class="exercise">
        <p>Q2. 「あなたは何歳ですか？」を英語に。</p>
        <input type="text" id="ex15-2" placeholder="英語で入力">
        <button onclick="checkExercise('ex15-2', ['How old are you?', 'How old are you'])">答え合わせ</button>
        <div class="feedback" id="ex15-2-fb"></div>
    </div>
    <div class="exercise">
        <p>Q3. 「なぜあなたは英語を勉強しているのですか？」を英語に。</p>
        <input type="text" id="ex15-3" placeholder="英語で入力">
        <button onclick="checkExercise('ex15-3', ['Why do you study English?', 'Why do you study English', 'Why are you studying English?'])">答え合わせ</button>
        <div class="feedback" id="ex15-3-fb"></div>
    </div>
</div>
`;

// ----- Lesson 16: 前置詞と名詞 -----
lessonContent[16] = `
<div class="lesson-header">
    <span class="lesson-tag">Stage 3 ─ 中学1・2年レベル</span>
    <h2>Lesson 16：前置詞と名詞</h2>
    <p>in, on, at, to, for など、名詞の前に置く言葉を学びます</p>
</div>

<div class="card">
    <h2>場所を表す前置詞</h2>
    <table>
        <tr><th>前置詞</th><th>イメージ</th><th>例</th></tr>
        <tr><td><strong>in</strong></td><td>〜の中に</td><td>in the room, in Japan, in the box</td></tr>
        <tr><td><strong>on</strong></td><td>〜の上に（接触）</td><td>on the table, on the wall</td></tr>
        <tr><td><strong>at</strong></td><td>〜の地点に</td><td>at the station, at home, at school</td></tr>
        <tr><td><strong>under</strong></td><td>〜の下に</td><td>under the desk</td></tr>
        <tr><td><strong>near</strong></td><td>〜の近くに</td><td>near the park</td></tr>
        <tr><td><strong>between</strong></td><td>〜の間に</td><td>between A and B</td></tr>
        <tr><td><strong>by</strong></td><td>〜のそばに</td><td>by the window</td></tr>
    </table>
</div>

<div class="card">
    <h2>時を表す前置詞</h2>
    <table>
        <tr><th>前置詞</th><th>使う場面</th><th>例</th></tr>
        <tr><td><strong>at</strong></td><td>時刻</td><td>at 7 o'clock, at noon, at night</td></tr>
        <tr><td><strong>on</strong></td><td>曜日・日付</td><td>on Monday, on March 5th</td></tr>
        <tr><td><strong>in</strong></td><td>月・年・季節・午前午後</td><td>in March, in 2024, in summer, in the morning</td></tr>
    </table>

    <div class="point-box">
        時の前置詞は「<strong>at（点）→ on（日）→ in（広い期間）</strong>」と覚えよう！小さいものから大きいものへ。
    </div>
</div>

<div class="card">
    <h2>その他の重要な前置詞</h2>
    <table>
        <tr><th>前置詞</th><th>意味</th><th>例文</th></tr>
        <tr><td><strong>to</strong></td><td>〜へ（方向）</td><td>I go to school.</td></tr>
        <tr><td><strong>from</strong></td><td>〜から</td><td>I am from Japan.</td></tr>
        <tr><td><strong>for</strong></td><td>〜のために / 〜の間</td><td>This is for you. / for two hours</td></tr>
        <tr><td><strong>with</strong></td><td>〜と一緒に</td><td>I play with my friends.</td></tr>
        <tr><td><strong>about</strong></td><td>〜について</td><td>Tell me about it.</td></tr>
        <tr><td><strong>of</strong></td><td>〜の</td><td>a cup of tea</td></tr>
    </table>
</div>

<div class="card">
    <h2>練習問題</h2>
    <div class="exercise">
        <p>Q1. 「私は7時に起きる。」→ I get up ( ) 7 o'clock.</p>
        <input type="text" id="ex16-1" placeholder="前置詞を入力">
        <button onclick="checkExercise('ex16-1', ['at'])">答え合わせ</button>
        <div class="feedback" id="ex16-1-fb"></div>
    </div>
    <div class="exercise">
        <p>Q2. 「月曜日に」→ ( ) Monday</p>
        <input type="text" id="ex16-2" placeholder="前置詞を入力">
        <button onclick="checkExercise('ex16-2', ['on', 'On'])">答え合わせ</button>
        <div class="feedback" id="ex16-2-fb"></div>
    </div>
    <div class="exercise">
        <p>Q3. 「3月に」→ ( ) March</p>
        <input type="text" id="ex16-3" placeholder="前置詞を入力">
        <button onclick="checkExercise('ex16-3', ['in', 'In'])">答え合わせ</button>
        <div class="feedback" id="ex16-3-fb"></div>
    </div>
</div>
`;

// ----- Lesson 17: 不定詞 -----
lessonContent[17] = `
<div class="lesson-header">
    <span class="lesson-tag">Stage 4 ─ 中学2年レベル</span>
    <h2>Lesson 17：不定詞</h2>
    <p>to + 動詞の原形 で「〜すること」「〜するために」を表します</p>
</div>

<div class="card">
    <h2>不定詞の3つの用法</h2>
    <table>
        <tr><th>用法</th><th>意味</th><th>例文</th></tr>
        <tr><td><strong>名詞的用法</strong></td><td>〜すること</td><td>I like <strong>to read</strong> books.</td></tr>
        <tr><td><strong>副詞的用法</strong></td><td>〜するために</td><td>I went to the library <strong>to study</strong>.</td></tr>
        <tr><td><strong>形容詞的用法</strong></td><td>〜するための</td><td>I want something <strong>to drink</strong>.</td></tr>
    </table>
</div>

<div class="card">
    <h2>名詞的用法（〜すること）</h2>
    <div class="example-box">
        <div class="en"><strong>To study</strong> English is important.</div>
        <div class="ja">英語を勉強することは大切です。</div>
    </div>
    <div class="example-box">
        <div class="en">I want <strong>to be</strong> a doctor.</div>
        <div class="ja">私は医者になりたいです。</div>
    </div>
</div>

<div class="card">
    <h2>副詞的用法（〜するために）</h2>
    <div class="example-box">
        <div class="en">She went to the store <strong>to buy</strong> milk.</div>
        <div class="ja">彼女は牛乳を買うためにお店に行った。</div>
    </div>
    <div class="example-box">
        <div class="en">I'm happy <strong>to hear</strong> that.（感情の原因）</div>
        <div class="ja">それを聞いて嬉しいです。</div>
    </div>
</div>

<div class="card">
    <h2>形容詞的用法（〜するための）</h2>
    <div class="example-box">
        <div class="en">I have a lot of homework <strong>to do</strong>.</div>
        <div class="ja">私にはやるべき宿題がたくさんある。</div>
    </div>
    <div class="example-box">
        <div class="en">I need something <strong>to eat</strong>.</div>
        <div class="ja">何か食べるものが必要です。</div>
    </div>
</div>

<div class="card" id="exercises-17"></div>
`;

// ----- Lesson 18: 動名詞と不定詞 -----
lessonContent[18] = `
<div class="lesson-header">
    <span class="lesson-tag">Stage 4 ─ 中学2年レベル</span>
    <h2>Lesson 18：動名詞と不定詞</h2>
    <p>動詞ing と to+動詞 の使い分けを学びます</p>
</div>

<div class="card">
    <h2>動名詞とは？</h2>
    <p>動詞に <strong>-ing</strong> をつけて「〜すること」という名詞の働きをさせます。</p>
    <div class="example-box">
        <div class="en"><strong>Swimming</strong> is fun.</div>
        <div class="ja">泳ぐことは楽しい。</div>
    </div>
    <div class="example-box">
        <div class="en">I enjoy <strong>playing</strong> tennis.</div>
        <div class="ja">テニスをすることを楽しむ。</div>
    </div>
</div>

<div class="card">
    <h2>動名詞のみをとる動詞・不定詞のみをとる動詞</h2>
    <table>
        <tr><th>動名詞のみ（-ing）</th><th>不定詞のみ（to）</th><th>どちらもOK</th></tr>
        <tr><td>enjoy（楽しむ）</td><td>want（欲しい）</td><td>like（好き）</td></tr>
        <tr><td>finish（終える）</td><td>hope（望む）</td><td>start（始める）</td></tr>
        <tr><td>stop（やめる）</td><td>decide（決める）</td><td>begin（始める）</td></tr>
        <tr><td>mind（気にする）</td><td>wish（願う）</td><td>love（愛する）</td></tr>
        <tr><td>practice（練習する）</td><td>plan（計画する）</td><td>hate（嫌う）</td></tr>
    </table>

    <div class="warn-box">
        ✕ I enjoy <strong>to play</strong> tennis.<br>
        ○ I enjoy <strong>playing</strong> tennis.<br>
        ✕ I want <strong>playing</strong> tennis.<br>
        ○ I want <strong>to play</strong> tennis.
    </div>
</div>

<div class="card" id="exercises-18"></div>
`;

// ----- Lesson 19: 接続詞 -----
lessonContent[19] = `
<div class="lesson-header">
    <span class="lesson-tag">Stage 4 ─ 中学2年レベル</span>
    <h2>Lesson 19：接続詞</h2>
    <p>文と文をつなぐ言葉を学びます</p>
</div>

<div class="card">
    <h2>等位接続詞（対等につなぐ）</h2>
    <table>
        <tr><th>接続詞</th><th>意味</th><th>例文</th></tr>
        <tr><td><strong>and</strong></td><td>〜と、そして</td><td>I like cats <strong>and</strong> dogs.</td></tr>
        <tr><td><strong>but</strong></td><td>しかし</td><td>I'm tired, <strong>but</strong> I'm happy.</td></tr>
        <tr><td><strong>or</strong></td><td>または</td><td>Coffee <strong>or</strong> tea?</td></tr>
        <tr><td><strong>so</strong></td><td>だから</td><td>It was cold, <strong>so</strong> I wore a coat.</td></tr>
    </table>
</div>

<div class="card">
    <h2>従位接続詞（文に文をつなぐ）</h2>
    <table>
        <tr><th>接続詞</th><th>意味</th><th>例文</th></tr>
        <tr><td><strong>when</strong></td><td>〜のとき</td><td><strong>When</strong> I was young, I liked soccer.</td></tr>
        <tr><td><strong>if</strong></td><td>もし〜なら</td><td><strong>If</strong> it rains, I will stay home.</td></tr>
        <tr><td><strong>because</strong></td><td>〜なので</td><td>I stayed home <strong>because</strong> I was sick.</td></tr>
        <tr><td><strong>before</strong></td><td>〜の前に</td><td>Wash your hands <strong>before</strong> you eat.</td></tr>
        <tr><td><strong>after</strong></td><td>〜の後に</td><td><strong>After</strong> I ate dinner, I watched TV.</td></tr>
        <tr><td><strong>while</strong></td><td>〜の間</td><td><strong>While</strong> I was sleeping, he called.</td></tr>
        <tr><td><strong>that</strong></td><td>〜ということ</td><td>I think <strong>that</strong> he is kind.</td></tr>
    </table>

    <div class="point-box">
        接続詞の節が文の最初に来るときは、<strong>カンマ（,）</strong>をつけます。<br>
        When I was young<strong>,</strong> I liked soccer.
    </div>
</div>

<div class="card" id="exercises-19"></div>
`;

// ----- Lesson 20: 比較級と最上級 -----
lessonContent[20] = `
<div class="lesson-header">
    <span class="lesson-tag">Stage 4 ─ 中学2年レベル</span>
    <h2>Lesson 20：比較の表現その1 比較級と最上級</h2>
    <p>「〜より…」「最も〜」を表す比較表現を学びます</p>
</div>

<div class="card">
    <h2>比較級（〜より…だ）</h2>
    <p>2つのものを比べるとき、形容詞/副詞に <strong>-er</strong> をつけるか <strong>more</strong> をつけます。</p>
    <div class="example-box">
        <div class="en">He is <strong>taller than</strong> me.</div>
        <div class="ja">彼は私より背が高い。</div>
    </div>
    <div class="example-box">
        <div class="en">English is <strong>more difficult than</strong> math.</div>
        <div class="ja">英語は数学より難しい。</div>
    </div>
</div>

<div class="card">
    <h2>最上級（最も〜だ）</h2>
    <p>3つ以上の中で一番のとき、<strong>-est</strong> か <strong>most</strong> をつけ、前に <strong>the</strong> をつけます。</p>
    <div class="example-box">
        <div class="en">She is <strong>the tallest</strong> in the class.</div>
        <div class="ja">彼女はクラスで一番背が高い。</div>
    </div>
    <div class="example-box">
        <div class="en">This is <strong>the most beautiful</strong> park in the city.</div>
        <div class="ja">これは市内で最も美しい公園です。</div>
    </div>
</div>

<div class="card">
    <h2>変化のルール</h2>
    <table>
        <tr><th>タイプ</th><th>原級</th><th>比較級</th><th>最上級</th></tr>
        <tr><td>短い語（1音節）</td><td>tall</td><td>tall<strong>er</strong></td><td>tall<strong>est</strong></td></tr>
        <tr><td>eで終わる</td><td>large</td><td>larg<strong>er</strong></td><td>larg<strong>est</strong></td></tr>
        <tr><td>子音+y</td><td>easy</td><td>eas<strong>ier</strong></td><td>eas<strong>iest</strong></td></tr>
        <tr><td>長い語（2音節以上）</td><td>beautiful</td><td><strong>more</strong> beautiful</td><td><strong>most</strong> beautiful</td></tr>
        <tr><td>不規則</td><td>good / well</td><td><strong>better</strong></td><td><strong>best</strong></td></tr>
        <tr><td>不規則</td><td>bad</td><td><strong>worse</strong></td><td><strong>worst</strong></td></tr>
        <tr><td>不規則</td><td>many / much</td><td><strong>more</strong></td><td><strong>most</strong></td></tr>
    </table>
</div>

<div class="card" id="exercises-20"></div>
`;

// ----- Lesson 21: 比較のいろいろ -----
lessonContent[21] = `
<div class="lesson-header">
    <span class="lesson-tag">Stage 4 ─ 中学2年レベル</span>
    <h2>Lesson 21：比較の表現その2 比較のいろいろ</h2>
    <p>as...as、like/different from など比較の応用表現を学びます</p>
</div>

<div class="card">
    <h2>as ... as（同じくらい〜）</h2>
    <div class="example-box">
        <div class="en">She is <strong>as tall as</strong> her mother.</div>
        <div class="ja">彼女は母親と同じくらいの背の高さです。</div>
    </div>
    <div class="example-box">
        <div class="en">He doesn't run <strong>as fast as</strong> Tom.（否定 = 〜ほど…ない）</div>
        <div class="ja">彼はトムほど速く走らない。</div>
    </div>
</div>

<div class="card">
    <h2>比較を使った重要表現</h2>
    <table>
        <tr><th>表現</th><th>意味</th><th>例文</th></tr>
        <tr><td>like A better than B</td><td>BよりAの方が好き</td><td>I like summer better than winter.</td></tr>
        <tr><td>like A the best</td><td>Aが一番好き</td><td>I like English the best.</td></tr>
        <tr><td>one of the + 最上級 + 複数名詞</td><td>最も〜なもののひとつ</td><td>Tokyo is one of the biggest cities in the world.</td></tr>
    </table>
</div>

<div class="card" id="exercises-21"></div>
`;

// ----- Lesson 22: 受け身の表現 -----
lessonContent[22] = `
<div class="lesson-header">
    <span class="lesson-tag">Stage 4 ─ 中学2年レベル</span>
    <h2>Lesson 22：受け身の表現</h2>
    <p>「〜される」受動態の文を学びます</p>
</div>

<div class="card">
    <h2>受動態の形</h2>
    <div class="word-order">
        <div class="word-block subject">主語</div>
        <div class="word-block arrow">→</div>
        <div class="word-block verb">be動詞</div>
        <div class="word-block arrow">→</div>
        <div class="word-block complement">過去分詞</div>
    </div>

    <div class="comparison-box">
        <div class="jp-order">
            <h4>能動態</h4>
            <p><strong>Tom wrote</strong> this book.</p>
            <p style="color:#718096">トムがこの本を書いた。</p>
        </div>
        <div class="en-order">
            <h4>受動態</h4>
            <p>This book <strong>was written</strong> by Tom.</p>
            <p style="color:#718096">この本はトムによって書かれた。</p>
        </div>
    </div>
</div>

<div class="card">
    <h2>受動態の例文</h2>
    <table>
        <tr><th>英語</th><th>意味</th></tr>
        <tr><td>English <strong>is spoken</strong> in many countries.</td><td>英語は多くの国で話されている。</td></tr>
        <tr><td>This temple <strong>was built</strong> in 1300.</td><td>この寺は1300年に建てられた。</td></tr>
        <tr><td>The window <strong>was broken</strong> by the boy.</td><td>窓はその少年によって割られた。</td></tr>
        <tr><td>These cars <strong>are made</strong> in Japan.</td><td>これらの車は日本で作られている。</td></tr>
    </table>

    <div class="point-box">
        「誰によって」を言いたいときは <strong>by + 人</strong> をつけます。言わなくてもOK。
    </div>
</div>

<div class="card" id="exercises-22"></div>
`;

// ----- Lesson 23: 重要表現いろいろ -----
lessonContent[23] = `
<div class="lesson-header">
    <span class="lesson-tag">Stage 4 ─ 中学2年レベル</span>
    <h2>Lesson 23：重要表現いろいろ</h2>
    <p>知っておくと便利な重要構文をまとめて学びます</p>
</div>

<div class="card">
    <h2>There is / There are（〜がある・いる）</h2>
    <div class="example-box">
        <div class="en"><strong>There is</strong> a cat on the table.</div>
        <div class="ja">テーブルの上に猫がいます。（単数）</div>
    </div>
    <div class="example-box">
        <div class="en"><strong>There are</strong> three books on the desk.</div>
        <div class="ja">机の上に本が3冊あります。（複数）</div>
    </div>
</div>

<div class="card">
    <h2>It is ... to ~（〜することは…だ）</h2>
    <div class="example-box">
        <div class="en"><strong>It is</strong> important <strong>to study</strong> English.</div>
        <div class="ja">英語を勉強することは大切です。</div>
    </div>
    <div class="example-box">
        <div class="en"><strong>It is</strong> fun <strong>to play</strong> with friends.</div>
        <div class="ja">友達と遊ぶことは楽しいです。</div>
    </div>

    <div class="point-box">
        It = 仮の主語。本当の主語は to 以下の部分です。
    </div>
</div>

<div class="card">
    <h2>look / sound / feel + 形容詞</h2>
    <table>
        <tr><th>表現</th><th>意味</th><th>例文</th></tr>
        <tr><td>look + 形容詞</td><td>〜に見える</td><td>You look happy.</td></tr>
        <tr><td>sound + 形容詞</td><td>〜に聞こえる</td><td>That sounds great!</td></tr>
        <tr><td>feel + 形容詞</td><td>〜と感じる</td><td>I feel tired.</td></tr>
        <tr><td>taste + 形容詞</td><td>〜の味がする</td><td>This tastes good.</td></tr>
        <tr><td>smell + 形容詞</td><td>〜の匂いがする</td><td>It smells nice.</td></tr>
    </table>
</div>

<div class="card">
    <h2>too ... to ~（〜すぎて…できない）</h2>
    <div class="example-box">
        <div class="en">I am <strong>too tired to</strong> study.</div>
        <div class="ja">疲れすぎて勉強できない。</div>
    </div>
    <div class="example-box">
        <div class="en">This question is <strong>too difficult to</strong> answer.</div>
        <div class="ja">この問題は難しすぎて答えられない。</div>
    </div>
</div>

<div class="card" id="exercises-23"></div>
`;

// ----- Lesson 24: 現在完了形その1 完了と結果 -----
lessonContent[24] = `
<div class="lesson-header">
    <span class="lesson-tag">Stage 5 ─ 中学3年レベル</span>
    <h2>Lesson 24：現在完了形その1 完了と結果</h2>
    <p>have + 過去分詞 で「〜したところだ」「〜してしまった」を表します</p>
</div>

<div class="card">
    <h2>現在完了形の形</h2>
    <div class="word-order">
        <div class="word-block subject">主語</div>
        <div class="word-block arrow">→</div>
        <div class="word-block verb">have/has</div>
        <div class="word-block arrow">→</div>
        <div class="word-block complement">過去分詞</div>
    </div>

    <div class="example-box">
        <div class="en">I <strong>have finished</strong> my homework.</div>
        <div class="ja">私は宿題を終えたところです。（完了）</div>
    </div>
    <div class="example-box">
        <div class="en">She <strong>has lost</strong> her key.</div>
        <div class="ja">彼女は鍵をなくしてしまった。（結果：今も見つかっていない）</div>
    </div>
</div>

<div class="card">
    <h2>完了・結果でよく使う語</h2>
    <table>
        <tr><th>語句</th><th>意味</th><th>例文</th></tr>
        <tr><td><strong>just</strong></td><td>ちょうど</td><td>I have <strong>just</strong> arrived.</td></tr>
        <tr><td><strong>already</strong></td><td>もう・すでに</td><td>I have <strong>already</strong> eaten lunch.</td></tr>
        <tr><td><strong>yet</strong></td><td>まだ（否定）/ もう（疑問）</td><td>I haven't finished <strong>yet</strong>. / Have you done it <strong>yet</strong>?</td></tr>
    </table>
</div>

<div class="card">
    <h2>過去形との違い</h2>
    <div class="comparison-box">
        <div class="jp-order">
            <h4>過去形</h4>
            <p><strong>I lost my key.</strong></p>
            <p style="color:#718096">鍵をなくした（過去の事実のみ）</p>
        </div>
        <div class="en-order">
            <h4>現在完了形</h4>
            <p><strong>I have lost my key.</strong></p>
            <p style="color:#718096">鍵をなくした（今も見つかっていない）</p>
        </div>
    </div>
</div>

<div class="card" id="exercises-24"></div>
`;

// ----- Lesson 25: 現在完了形その2 継続と経験 -----
lessonContent[25] = `
<div class="lesson-header">
    <span class="lesson-tag">Stage 5 ─ 中学3年レベル</span>
    <h2>Lesson 25：現在完了形その2 継続と経験</h2>
    <p>「ずっと〜している」「〜したことがある」を表します</p>
</div>

<div class="card">
    <h2>継続（ずっと〜している）</h2>
    <div class="example-box">
        <div class="en">I <strong>have lived</strong> in Tokyo <strong>for</strong> ten years.</div>
        <div class="ja">私は10年間東京に住んでいます。</div>
    </div>
    <div class="example-box">
        <div class="en">She <strong>has been</strong> sick <strong>since</strong> yesterday.</div>
        <div class="ja">彼女は昨日からずっと病気です。</div>
    </div>

    <div class="point-box">
        <strong>for</strong> = 期間（for two years = 2年間）<br>
        <strong>since</strong> = 起点（since 2020 = 2020年から）
    </div>
</div>

<div class="card">
    <h2>経験（〜したことがある）</h2>
    <div class="example-box">
        <div class="en">I <strong>have been</strong> to Kyoto <strong>twice</strong>.</div>
        <div class="ja">私は京都に2回行ったことがある。</div>
    </div>
    <div class="example-box">
        <div class="en">She <strong>has never eaten</strong> sushi.</div>
        <div class="ja">彼女は一度も寿司を食べたことがない。</div>
    </div>

    <table>
        <tr><th>よく使う語</th><th>意味</th></tr>
        <tr><td>ever</td><td>今までに（疑問文で）</td></tr>
        <tr><td>never</td><td>一度も〜ない</td></tr>
        <tr><td>once</td><td>1回</td></tr>
        <tr><td>twice</td><td>2回</td></tr>
        <tr><td>three times</td><td>3回</td></tr>
    </table>
</div>

<div class="card" id="exercises-25"></div>
`;

// ----- Lesson 26: 現在分詞と過去分詞 -----
lessonContent[26] = `
<div class="lesson-header">
    <span class="lesson-tag">Stage 5 ─ 中学3年レベル</span>
    <h2>Lesson 26：現在分詞と過去分詞</h2>
    <p>名詞を修飾する分詞の使い方を学びます</p>
</div>

<div class="card">
    <h2>分詞の形容詞的用法</h2>
    <table>
        <tr><th></th><th>形</th><th>意味</th><th>例</th></tr>
        <tr><td>現在分詞</td><td>動詞<strong>ing</strong></td><td>〜している（能動）</td><td>a <strong>sleeping</strong> baby（眠っている赤ちゃん）</td></tr>
        <tr><td>過去分詞</td><td>動詞<strong>ed</strong>/不規則</td><td>〜された（受動）</td><td>a <strong>broken</strong> window（壊された窓）</td></tr>
    </table>
</div>

<div class="card">
    <h2>前から修飾 vs 後ろから修飾</h2>
    <p>分詞が<strong>1語だけ</strong>のとき → 名詞の前<br>
    分詞に<strong>他の語がつく</strong>とき → 名詞の後ろ</p>

    <div class="example-box">
        <div class="en">a <strong>running</strong> boy（走っている少年）← 1語 = 前</div>
        <div class="ja"></div>
    </div>
    <div class="example-box">
        <div class="en">the boy <strong>running in the park</strong>（公園で走っている少年）← 句 = 後ろ</div>
        <div class="ja"></div>
    </div>
</div>

<div class="card">
    <h2>感情を表す分詞</h2>
    <table>
        <tr><th>現在分詞（〜させる）</th><th>過去分詞（〜した気持ち）</th></tr>
        <tr><td><strong>exciting</strong>（ワクワクさせる）</td><td><strong>excited</strong>（ワクワクした）</td></tr>
        <tr><td><strong>interesting</strong>（面白い）</td><td><strong>interested</strong>（興味がある）</td></tr>
        <tr><td><strong>surprising</strong>（驚かせる）</td><td><strong>surprised</strong>（驚いた）</td></tr>
        <tr><td><strong>boring</strong>（退屈させる）</td><td><strong>bored</strong>（退屈した）</td></tr>
        <tr><td><strong>tiring</strong>（疲れさせる）</td><td><strong>tired</strong>（疲れた）</td></tr>
    </table>

    <div class="example-box">
        <div class="en">The game was <strong>exciting</strong>. I was <strong>excited</strong>.</div>
        <div class="ja">その試合はワクワクするものだった。私はワクワクした。</div>
    </div>
</div>

<div class="card" id="exercises-26"></div>
`;

// ----- Lesson 27: 関係代名詞その1 主格と目的格 -----
lessonContent[27] = `
<div class="lesson-header">
    <span class="lesson-tag">Stage 5 ─ 中学3年レベル</span>
    <h2>Lesson 27：関係代名詞その1 主格と目的格</h2>
    <p>2つの文を1つにつなぐ関係代名詞 who, which, that を学びます</p>
</div>

<div class="card">
    <h2>関係代名詞とは？</h2>
    <p>2つの文を1つにまとめて、名詞をくわしく説明する働きをします。</p>

    <div class="example-box">
        <div class="en">I have a friend. + He lives in America.</div>
        <div class="ja">↓ who でつなぐ</div>
    </div>
    <div class="example-box">
        <div class="en">I have a friend <strong>who lives in America</strong>.</div>
        <div class="ja">私にはアメリカに住んでいる友達がいる。</div>
    </div>

    <table>
        <tr><th></th><th>人</th><th>もの・動物</th></tr>
        <tr><td>主格</td><td><strong>who</strong></td><td><strong>which</strong></td></tr>
        <tr><td>目的格</td><td><strong>who(m)</strong></td><td><strong>which</strong></td></tr>
        <tr><td>両方OK</td><td colspan="2"><strong>that</strong></td></tr>
    </table>
</div>

<div class="card">
    <h2>主格の関係代名詞</h2>
    <p>関係代名詞が後ろの文の<strong>主語</strong>の役割をする場合</p>
    <div class="example-box">
        <div class="en">The man <strong>who</strong> is standing there is my father.</div>
        <div class="ja">あそこに立っている男性は私の父です。</div>
    </div>
    <div class="example-box">
        <div class="en">This is the book <strong>which</strong> made me happy.</div>
        <div class="ja">これは私を幸せにしてくれた本です。</div>
    </div>
</div>

<div class="card">
    <h2>目的格の関係代名詞</h2>
    <p>関係代名詞が後ろの文の<strong>目的語</strong>の役割をする場合（省略可能！）</p>
    <div class="example-box">
        <div class="en">The movie <strong>(which/that)</strong> I watched yesterday was good.</div>
        <div class="ja">昨日見た映画はよかった。（which/that は省略可）</div>
    </div>
</div>

<div class="card" id="exercises-27"></div>
`;

// ----- Lesson 28: 関係代名詞その2 所有格 -----
lessonContent[28] = `
<div class="lesson-header">
    <span class="lesson-tag">Stage 5 ─ 中学3年レベル</span>
    <h2>Lesson 28：関係代名詞その2 所有格</h2>
    <p>whose を使った関係代名詞を学びます</p>
</div>

<div class="card">
    <h2>whose（〜の）</h2>
    <p><strong>whose</strong> は「〜の」という所有の関係を表す関係代名詞です。人にもものにも使えます。</p>

    <div class="example-box">
        <div class="en">I know the boy <strong>whose</strong> father is a doctor.</div>
        <div class="ja">私はお父さんが医者である少年を知っている。</div>
    </div>
    <div class="example-box">
        <div class="en">This is the house <strong>whose</strong> roof is red.</div>
        <div class="ja">これは屋根が赤い家です。</div>
    </div>

    <div class="point-box">
        whose の後ろには<strong>必ず名詞</strong>が来ます。whose + 名詞 で「〜の（名詞）」という意味になります。
    </div>
</div>

<div class="card">
    <h2>関係代名詞の総まとめ</h2>
    <table>
        <tr><th>格</th><th>人</th><th>もの</th><th>両方</th></tr>
        <tr><td>主格（〜が）</td><td>who</td><td>which</td><td>that</td></tr>
        <tr><td>目的格（〜を）</td><td>who(m)</td><td>which</td><td>that（省略可）</td></tr>
        <tr><td>所有格（〜の）</td><td colspan="3">whose</td></tr>
    </table>
</div>

<div class="card" id="exercises-28"></div>
`;

// ----- Lesson 29: 英文解釈のコツ -----
lessonContent[29] = `
<div class="lesson-header">
    <span class="lesson-tag">Stage 5 ─ 中学3年レベル</span>
    <h2>Lesson 29：英文解釈のコツ</h2>
    <p>長い英文を正確に読み解くためのテクニックを学びます</p>
</div>

<div class="card">
    <h2>英文解釈の5つのステップ</h2>

    <div class="step" style="display:flex;gap:18px;margin:18px 0;align-items:flex-start;">
        <div class="step-number" style="background:#667eea;color:white;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;flex-shrink:0;">1</div>
        <div>
            <h4 style="color:#667eea;margin-bottom:4px;">主語（S）と動詞（V）を見つける</h4>
            <p>どんなに長い文でも、まず S と V を特定する。これが文の骨格です。</p>
        </div>
    </div>
    <div class="step" style="display:flex;gap:18px;margin:18px 0;align-items:flex-start;">
        <div class="step-number" style="background:#667eea;color:white;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;flex-shrink:0;">2</div>
        <div>
            <h4 style="color:#667eea;margin-bottom:4px;">文型を判断する</h4>
            <p>SV? SVC? SVO? SVOO? SVOC? 5文型のどれかを見極める。</p>
        </div>
    </div>
    <div class="step" style="display:flex;gap:18px;margin:18px 0;align-items:flex-start;">
        <div class="step-number" style="background:#667eea;color:white;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;flex-shrink:0;">3</div>
        <div>
            <h4 style="color:#667eea;margin-bottom:4px;">修飾語句をカッコでくくる</h4>
            <p>前置詞句、関係代名詞節、分詞句などの修飾部分を（ ）でくくって分ける。</p>
        </div>
    </div>
    <div class="step" style="display:flex;gap:18px;margin:18px 0;align-items:flex-start;">
        <div class="step-number" style="background:#667eea;color:white;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;flex-shrink:0;">4</div>
        <div>
            <h4 style="color:#667eea;margin-bottom:4px;">前から順に意味をとる</h4>
            <p>英語の語順のまま、前から意味の塊ごとに訳していく。</p>
        </div>
    </div>
    <div class="step" style="display:flex;gap:18px;margin:18px 0;align-items:flex-start;">
        <div class="step-number" style="background:#667eea;color:white;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;flex-shrink:0;">5</div>
        <div>
            <h4 style="color:#667eea;margin-bottom:4px;">自然な日本語に整える</h4>
            <p>最後に日本語として自然な訳に仕上げる。</p>
        </div>
    </div>
</div>

<div class="card">
    <h2>実践例</h2>
    <div class="example-box">
        <div class="en">The book <strong>[which I bought (at the store) (last week)]</strong> was very interesting.</div>
        <div class="ja">
            S = The book / V = was / C = very interesting<br>
            which I bought = 私が買った（関係代名詞）<br>
            at the store = お店で / last week = 先週<br>
            <strong>→ 先週お店で私が買った本はとても面白かった。</strong>
        </div>
    </div>
</div>

<div class="card" id="exercises-29"></div>

<div class="card">
    <h2>全レッスン完了！</h2>
    <p>ここまで学んできた文法知識があれば、基本的な英文の読み書きができるようになっています。</p>
    <ul style="padding-left:20px;">
        <li>5文型（SV, SVC, SVO, SVOO, SVOC）</li>
        <li>時制（現在・過去・未来・進行形・現在完了形）</li>
        <li>助動詞・不定詞・動名詞</li>
        <li>比較・受動態・関係代名詞</li>
    </ul>
    <div class="point-box">
        あとは実際に英語を読む・聞く・話す・書く練習を重ねるだけです。この教材を何度も復習して、知識を定着させましょう！
    </div>
</div>
`;

// ============================================================
// 未作成レッスンのプレースホルダー生成
// ============================================================
function getPlaceholder(id, title, stageLabel) {
    var num = String(id).padStart(2, '0');
    return '<div class="lesson-header">' +
        '<span class="lesson-tag">' + stageLabel + '</span>' +
        '<h2>Lesson ' + num + '：' + title + '</h2>' +
        '<p>このレッスンは準備中です</p>' +
        '</div>' +
        '<div class="card">' +
        '<h2>準備中</h2>' +
        '<p>このレッスンのコンテンツは現在作成中です。<br>完成までしばらくお待ちください。</p>' +
        '<p style="margin-top:15px;">先に前のレッスンを復習しておきましょう！</p>' +
        '</div>';
}

// Communication Stage コンテンツ
var commContent = {};

commContent[1] = '<div class="lesson-header"><span class="lesson-tag">Communication Stage 1</span><h2>Communication Stage 1</h2><p>5文型の総復習 ─ Lesson 01〜06</p></div>' +
'<div class="card"><h2>5文型 確認クイズ</h2><p>次の文はどの文型か答えましょう。</p>' +
'<div class="exercise"><p>Q1. I run every morning.</p><input type="text" id="cs1-1" placeholder="SV / SVC / SVO / SVOO / SVOC"><button onclick="checkExercise(\'cs1-1\', [\'SV\'])">答え合わせ</button><div class="feedback" id="cs1-1-fb"></div></div>' +
'<div class="exercise"><p>Q2. She is beautiful.</p><input type="text" id="cs1-2" placeholder="SV / SVC / SVO / SVOO / SVOC"><button onclick="checkExercise(\'cs1-2\', [\'SVC\'])">答え合わせ</button><div class="feedback" id="cs1-2-fb"></div></div>' +
'<div class="exercise"><p>Q3. I like music.</p><input type="text" id="cs1-3" placeholder="SV / SVC / SVO / SVOO / SVOC"><button onclick="checkExercise(\'cs1-3\', [\'SVO\'])">答え合わせ</button><div class="feedback" id="cs1-3-fb"></div></div>' +
'<div class="exercise"><p>Q4. She gave me a book.</p><input type="text" id="cs1-4" placeholder="SV / SVC / SVO / SVOO / SVOC"><button onclick="checkExercise(\'cs1-4\', [\'SVOO\'])">答え合わせ</button><div class="feedback" id="cs1-4-fb"></div></div>' +
'<div class="exercise"><p>Q5. We call him Ken.</p><input type="text" id="cs1-5" placeholder="SV / SVC / SVO / SVOO / SVOC"><button onclick="checkExercise(\'cs1-5\', [\'SVOC\'])">答え合わせ</button><div class="feedback" id="cs1-5-fb"></div></div>' +
'<div class="exercise"><p>Q6. That sounds great.</p><input type="text" id="cs1-6" placeholder="SV / SVC / SVO / SVOO / SVOC"><button onclick="checkExercise(\'cs1-6\', [\'SVC\'])">答え合わせ</button><div class="feedback" id="cs1-6-fb"></div></div>' +
'</div>';

commContent[2] = '<div class="lesson-header"><span class="lesson-tag">Communication Stage 2</span><h2>Communication Stage 2</h2><p>中学1年レベルの総復習 ─ Lesson 07〜12</p></div>' +
'<div class="card"><h2>総合練習問題</h2>' +
'<div class="exercise"><p>Q1. She ( ) a teacher. ← 適切なbe動詞は？</p><input type="text" id="cs2-1" placeholder="be動詞を入力"><button onclick="checkExercise(\'cs2-1\', [\'is\'])">答え合わせ</button><div class="feedback" id="cs2-1-fb"></div></div>' +
'<div class="exercise"><p>Q2. child の複数形は？</p><input type="text" id="cs2-2" placeholder="複数形を入力"><button onclick="checkExercise(\'cs2-2\', [\'children\'])">答え合わせ</button><div class="feedback" id="cs2-2-fb"></div></div>' +
'<div class="exercise"><p>Q3. He (go) to school yesterday. ← 過去形は？</p><input type="text" id="cs2-3" placeholder="過去形を入力"><button onclick="checkExercise(\'cs2-3\', [\'went\'])">答え合わせ</button><div class="feedback" id="cs2-3-fb"></div></div>' +
'<div class="exercise"><p>Q4. ( ) apple ← a / an どちら？</p><input type="text" id="cs2-4" placeholder="a / an"><button onclick="checkExercise(\'cs2-4\', [\'an\'])">答え合わせ</button><div class="feedback" id="cs2-4-fb"></div></div>' +
'<div class="exercise"><p>Q5. swim の ing形は？</p><input type="text" id="cs2-5" placeholder="ing形を入力"><button onclick="checkExercise(\'cs2-5\', [\'swimming\'])">答え合わせ</button><div class="feedback" id="cs2-5-fb"></div></div>' +
'</div>';

commContent[3] = '<div class="lesson-header"><span class="lesson-tag">Communication Stage 3</span><h2>Communication Stage 3</h2><p>中学1・2年レベルの総復習 ─ Lesson 13〜16</p></div>' +
'<div class="card"><h2>総合練習問題</h2>' +
'<div class="exercise"><p>Q1. 「私は明日サッカーをするつもりです。」を will で英語に。</p><input type="text" id="cs3-1" placeholder="英語で入力"><button onclick="checkExercise(\'cs3-1\', [\'I will play soccer tomorrow.\', \'I will play soccer tomorrow\'])">答え合わせ</button><div class="feedback" id="cs3-1-fb"></div></div>' +
'<div class="exercise"><p>Q2. 「彼女は泳ぐことができる。」を英語に。</p><input type="text" id="cs3-2" placeholder="英語で入力"><button onclick="checkExercise(\'cs3-2\', [\'She can swim.\', \'She can swim\'])">答え合わせ</button><div class="feedback" id="cs3-2-fb"></div></div>' +
'<div class="exercise"><p>Q3. 「3月に」を英語で → ( ) March</p><input type="text" id="cs3-3" placeholder="前置詞を入力"><button onclick="checkExercise(\'cs3-3\', [\'in\', \'In\'])">答え合わせ</button><div class="feedback" id="cs3-3-fb"></div></div>' +
'</div>';

commContent[4] = '<div class="lesson-header"><span class="lesson-tag">Communication Stage 4</span><h2>Communication Stage 4</h2><p>中学2年レベルの総復習 ─ Lesson 17〜23</p></div>' +
'<div class="card"><h2>総合練習問題</h2>' +
'<div class="exercise"><p>Q1. 「私は料理を楽しむ。」を英語に。（enjoy を使って）</p><input type="text" id="cs4-1" placeholder="英語で入力"><button onclick="checkExercise(\'cs4-1\', [\'I enjoy cooking.\', \'I enjoy cooking\'])">答え合わせ</button><div class="feedback" id="cs4-1-fb"></div></div>' +
'<div class="exercise"><p>Q2. 「彼は私より背が高い。」を英語に。</p><input type="text" id="cs4-2" placeholder="英語で入力"><button onclick="checkExercise(\'cs4-2\', [\'He is taller than me.\', \'He is taller than me\', \'He is taller than I.\'])">答え合わせ</button><div class="feedback" id="cs4-2-fb"></div></div>' +
'<div class="exercise"><p>Q3. 受動態にしましょう。「Many people speak English.」</p><input type="text" id="cs4-3" placeholder="英語で入力"><button onclick="checkExercise(\'cs4-3\', [\'English is spoken by many people.\', \'English is spoken by many people\'])">答え合わせ</button><div class="feedback" id="cs4-3-fb"></div></div>' +
'</div>';

commContent[5] = '<div class="lesson-header"><span class="lesson-tag">Communication Stage 5</span><h2>Communication Stage 5</h2><p>中学3年レベルの総復習 ─ Lesson 24〜29</p></div>' +
'<div class="card"><h2>総合練習問題</h2>' +
'<div class="exercise"><p>Q1. 「私はもう昼食を食べました。」を現在完了形で英語に。</p><input type="text" id="cs5-1" placeholder="英語で入力"><button onclick="checkExercise(\'cs5-1\', [\'I have already eaten lunch.\', \'I have already eaten lunch\', \'I have already had lunch.\'])">答え合わせ</button><div class="feedback" id="cs5-1-fb"></div></div>' +
'<div class="exercise"><p>Q2. excited と exciting ─「その試合はワクワクするものだった」はどっち？</p><input type="text" id="cs5-2" placeholder="excited / exciting"><button onclick="checkExercise(\'cs5-2\', [\'exciting\'])">答え合わせ</button><div class="feedback" id="cs5-2-fb"></div></div>' +
'<div class="exercise"><p>Q3. 2つの文をつなぎましょう。「I know the man. He speaks French.」</p><input type="text" id="cs5-3" placeholder="英語で入力"><button onclick="checkExercise(\'cs5-3\', [\'I know the man who speaks French.\', \'I know the man that speaks French.\'])">答え合わせ</button><div class="feedback" id="cs5-3-fb"></div></div>' +
'</div>';

function getCommPlaceholder(id) {
    return '<div class="lesson-header">' +
        '<span class="lesson-tag">Communication Stage ' + id + '</span>' +
        '<h2>Communication Stage ' + id + '</h2>' +
        '<p>ここまでの復習と実践練習</p>' +
        '</div>' +
        '<div class="card">' +
        '<h2>準備中</h2>' +
        '<p>このステージのコンテンツは現在作成中です。</p>' +
        '</div>';
}

function getTestPlaceholder() {
    return '<div class="lesson-header">' +
        '<span class="lesson-tag">Proficiency Test</span>' +
        '<h2>全レッスン修了テスト</h2>' +
        '<p>全29レッスンの総合テスト</p>' +
        '</div>' +
        '<div class="card">' +
        '<h2>準備中</h2>' +
        '<p>すべてのレッスンを完了してからチャレンジしましょう！</p>' +
        '</div>';
}

// ============================================================
// サイドバー・レッスン表示ロジック
// ============================================================
var currentLessonKey = 'lesson-1';

function buildSidebar() {
    var container = document.getElementById('lesson-list-container');
    var html = '';
    var currentStage = '';

    lessonStructure.forEach(function(item) {
        if (item.type === 'stage') {
            html += '<div class="stage-label">' + item.label + '</div>';
            currentStage = item.label;
            return;
        }

        var key, label;
        if (item.type === 'lesson') {
            key = 'lesson-' + item.id;
            label = '<span style="opacity:0.7;margin-right:4px;">' + String(item.id).padStart(2, '0') + '</span> ' + item.title;
        } else if (item.type === 'comm') {
            key = 'comm-' + item.id;
            label = item.title;
        } else {
            key = 'test';
            label = '修了テスト';
        }

        var activeClass = (key === currentLessonKey) ? ' active' : '';
        html += '<ul class="lesson-list"><li><button class="' + activeClass + '" onclick="showLesson(\'' + key + '\')">' + label + '</button></li></ul>';
    });

    container.innerHTML = html;
}

function showLesson(key) {
    currentLessonKey = key;
    var contentEl = document.getElementById('lesson-content');
    var stageLabel = '全学年共通レベル';

    var foundStage = '';
    for (var i = 0; i < lessonStructure.length; i++) {
        var item = lessonStructure[i];
        if (item.type === 'stage') foundStage = item.label;
        var itemKey = item.type === 'lesson' ? 'lesson-' + item.id
            : item.type === 'comm' ? 'comm-' + item.id
            : item.type === 'test' ? 'test' : null;
        if (itemKey === key) { stageLabel = foundStage; break; }
    }

    if (key.startsWith('lesson-')) {
        var id = parseInt(key.split('-')[1]);
        if (lessonContent[id]) {
            contentEl.innerHTML = lessonContent[id] + buildLessonNav(key);
        } else {
            var found = lessonStructure.find(function(i) { return i.type === 'lesson' && i.id === id; });
            var title = found ? found.title : '';
            contentEl.innerHTML = getPlaceholder(id, title, stageLabel) + buildLessonNav(key);
        }
    } else if (key.startsWith('comm-')) {
        var cid = parseInt(key.split('-')[1]);
        if (commContent[cid]) {
            contentEl.innerHTML = commContent[cid] + buildLessonNav(key);
        } else {
            contentEl.innerHTML = getCommPlaceholder(cid) + buildLessonNav(key);
        }
    } else if (key === 'test') {
        contentEl.innerHTML = getTestPlaceholder() + buildLessonNav(key);
    }

    // サイドバーの active 更新
    var btns = document.querySelectorAll('.lesson-list button');
    btns.forEach(function(b) { b.classList.remove('active'); });
    btns.forEach(function(b) {
        var oc = b.getAttribute('onclick');
        if (oc && oc.indexOf(key) !== -1) b.classList.add('active');
    });

    // ランダム練習問題の挿入
    if (key.startsWith('lesson-')) {
        var lessonId = parseInt(key.split('-')[1]);
        injectRandomExercises(lessonId);
    }

    // 音声ボタン自動挿入
    addSpeakButtons();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 英語テキストを検出して音声ボタンを自動付与
function addSpeakButtons() {
    var content = document.getElementById('lesson-content');
    if (!content) return;

    // 1. example-box の .en 要素に音声ボタンを追加
    content.querySelectorAll('.example-box .en').forEach(function(el) {
        if (el.querySelector('.speak-btn')) return;
        var text = el.textContent.replace(/[→✅❌]/g, '').trim();
        // 英語部分だけ抽出（矢印以降の説明を除く）
        var enMatch = text.match(/^[A-Za-z].*?[.!?]/);
        var speakText = enMatch ? enMatch[0] : text.split('→')[0].trim();
        if (speakText && /[a-zA-Z]/.test(speakText)) {
            var btn = document.createElement('button');
            btn.className = 'speak-btn';
            btn.innerHTML = '&#128264;';
            btn.title = '発音を聞く';
            btn.onclick = function() { speak(speakText, btn); };
            el.appendChild(btn);
        }
    });

    // 2. テーブルの英語セル（最初の列）に音声ボタンを追加
    content.querySelectorAll('.card table').forEach(function(table) {
        var rows = table.querySelectorAll('tr');
        rows.forEach(function(row) {
            var firstTd = row.querySelector('td:first-child');
            if (!firstTd) return;
            if (firstTd.querySelector('.speak-btn')) return;
            var text = firstTd.textContent.trim();
            // 英語が含まれているか判定
            if (/[a-zA-Z]{2,}/.test(text) && !/^(SV|SVOO|SVOC|SVC|SVO)$/.test(text)) {
                var btn = document.createElement('button');
                btn.className = 'speak-btn';
                btn.innerHTML = '&#128264;';
                btn.title = '発音を聞く';
                btn.onclick = function() { speak(text, btn); };
                firstTd.appendChild(btn);
            }
        });

        // 例文列（3列目以降）にも音声ボタン追加
        rows.forEach(function(row) {
            var cells = row.querySelectorAll('td');
            cells.forEach(function(td, idx) {
                if (idx === 0) return; // 最初の列はすでに処理済み
                if (td.querySelector('.speak-btn')) return;
                var text = td.textContent.trim();
                // 英文（ピリオド/疑問符で終わる or 大文字始まり+スペース+英単語）を判定
                if (/^[A-Z][a-zA-Z].*[.!?]$/.test(text) || /^[A-Z][a-z]+ [a-z]/.test(text)) {
                    var btn = document.createElement('button');
                    btn.className = 'speak-btn';
                    btn.innerHTML = '&#128264;';
                    btn.title = '発音を聞く';
                    btn.onclick = function() { speak(text, btn); };
                    td.appendChild(btn);
                }
            });
        });
    });

    // 3. comparison-box の英語部分（en-order と jp-order 両方）
    content.querySelectorAll('.en-order p strong, .en-order p, .jp-order p strong, .jp-order p').forEach(function(el) {
        if (el.querySelector('.speak-btn')) return;
        if (el.tagName === 'P' && el.querySelector('strong')) return;
        var text = el.textContent.trim();
        if (/^[A-Z].*[.!?]$/.test(text) && text.length > 3) {
            var btn = document.createElement('button');
            btn.className = 'speak-btn';
            btn.innerHTML = '&#128264;';
            btn.title = '発音を聞く';
            btn.onclick = function() { speak(text, btn); };
            el.appendChild(btn);
        }
    });

    // 4. warn-box 内の英文（正誤比較文）
    content.querySelectorAll('.warn-box').forEach(function(box) {
        if (box.querySelector('.speak-btn')) return;
        var html = box.innerHTML;
        var lines = html.split(/<br\s*\/?>/i);
        var newHtml = '';
        lines.forEach(function(line) {
            var tmp = document.createElement('div');
            tmp.innerHTML = line;
            var text = tmp.textContent.trim();
            // ○ or ✕ で始まる英文行を検出
            var enMatch = text.match(/[○✕×]\s*(.+)/);
            if (enMatch) {
                var enText = enMatch[1].replace(/\s+/g, ' ').trim();
                if (/[a-zA-Z]{2,}/.test(enText)) {
                    newHtml += line + ' <button class="speak-btn" onclick="speak(\'' + enText.replace(/'/g, "\\'") + '\', this)" title="発音を聞く">&#128264;</button><br>';
                    return;
                }
            }
            newHtml += line + '<br>';
        });
        box.innerHTML = newHtml.replace(/<br>$/, '');
    });

    // 5. point-box 内の英文
    content.querySelectorAll('.point-box').forEach(function(box) {
        if (box.querySelector('.speak-btn')) return;
        var text = box.textContent;
        // 英文（大文字始まりでピリオド等で終わる）を含む場合のみ
        var matches = text.match(/[A-Z][a-zA-Z\s',]+[.!?]/g);
        if (matches) {
            matches.forEach(function(enText) {
                enText = enText.trim();
                if (enText.length > 5 && /[a-z]/.test(enText)) {
                    var escaped = enText.replace(/'/g, "\\'");
                    var btnHtml = '<button class="speak-btn" onclick="speak(\'' + escaped + '\', this)" title="発音を聞く">&#128264;</button>';
                    box.innerHTML = box.innerHTML.replace(enText, enText + ' ' + btnHtml);
                }
            });
        }
    });
}

function buildLessonNav(currentKey) {
    var keys = [];
    lessonStructure.forEach(function(item) {
        if (item.type === 'lesson') keys.push('lesson-' + item.id);
        else if (item.type === 'comm') keys.push('comm-' + item.id);
        else if (item.type === 'test') keys.push('test');
    });

    var idx = keys.indexOf(currentKey);
    var prevBtn = (idx > 0)
        ? '<button onclick="showLesson(\'' + keys[idx - 1] + '\')">&#8592; 前のレッスン</button>'
        : '';
    var nextBtn = (idx < keys.length - 1)
        ? '<button onclick="showLesson(\'' + keys[idx + 1] + '\')">次のレッスン &#8594;</button>'
        : '';

    return '<div class="lesson-nav-bottom">' + prevBtn + nextBtn + '</div>';
}

// ============================================================
// セクション切り替え
// ============================================================
function showSection(sectionId, btn) {
    document.querySelectorAll('.section').forEach(function(s) { s.classList.remove('active'); });
    document.querySelectorAll('#main-nav button').forEach(function(b) { b.classList.remove('active'); });
    document.getElementById(sectionId).classList.add('active');
    btn.classList.add('active');
    // リファレンスセクションにも音声ボタン追加
    if (sectionId === 'reference') {
        addSpeakButtonsToRef();
    }
}

function addSpeakButtonsToRef() {
    var ref = document.getElementById('reference');
    if (!ref) return;
    ref.querySelectorAll('table td:first-child').forEach(function(td) {
        if (td.querySelector('.speak-btn')) return;
        var text = td.textContent.trim();
        if (/[a-zA-Z]{2,}/.test(text)) {
            var btn = document.createElement('button');
            btn.className = 'speak-btn';
            btn.innerHTML = '&#128264;';
            btn.title = '発音を聞く';
            btn.onclick = function() { speak(text, btn); };
            td.appendChild(btn);
        }
    });
}

// ============================================================
// 練習問題バンク（ランダム出題）
// ============================================================
function shuffleArray(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
}

function generateExercises(lessonId, count) {
    var bank = exerciseBank[lessonId];
    if (!bank || bank.length === 0) return '';
    var selected = shuffleArray(bank).slice(0, count || 3);
    var html = '<h2>練習問題</h2><p>次の日本語を英語にしてみましょう。（ページを更新すると問題が変わります）</p>';
    selected.forEach(function(ex, idx) {
        var qNum = idx + 1;
        var exId = 'exr-' + lessonId + '-' + qNum;
        html += '<div class="exercise">';
        html += '<p>Q' + qNum + '. ' + ex.q + '</p>';
        html += '<input type="text" id="' + exId + '" placeholder="英語で入力">';
        html += ' <button onclick="checkExercise(\'' + exId + '\', JSON.parse(this.dataset.ans))" data-ans=\'' + JSON.stringify(ex.answers).replace(/'/g, '&#x27;') + '\'>答え合わせ</button>';
        html += '<div class="feedback" id="' + exId + '-fb"></div>';
        html += '</div>';
    });
    return html;
}

function injectRandomExercises(lessonId) {
    var el = document.getElementById('exercises-' + lessonId);
    if (!el || !exerciseBank[lessonId]) return;
    el.innerHTML = generateExercises(lessonId, 3);
}

var exerciseBank = {
    13: [
        { q: '「明日は晴れるだろう。」を英語に。（will を使って）', answers: ['It will be sunny tomorrow.', 'It will be sunny tomorrow'] },
        { q: '「私は来年日本に行く予定です。」を英語に。（be going to を使って）', answers: ['I am going to go to Japan next year.', 'I am going to visit Japan next year.', "I'm going to go to Japan next year."] },
        { q: '「彼女はパーティーに来るでしょう。」を英語に。（will を使って）', answers: ['She will come to the party.', 'She will come to the party'] },
        { q: '「私たちは明日サッカーをする予定です。」を英語に。（be going to を使って）', answers: ['We are going to play soccer tomorrow.', "We're going to play soccer tomorrow."] },
        { q: '「彼は将来先生になるだろう。」を英語に。（will を使って）', answers: ['He will be a teacher in the future.', 'He will become a teacher in the future.', 'He will be a teacher.'] },
        { q: '「彼らは京都を訪れる予定です。」を英語に。（be going to を使って）', answers: ['They are going to visit Kyoto.', "They're going to visit Kyoto."] },
        { q: '「明日雨が降るだろう。」を英語に。（will を使って）', answers: ['It will rain tomorrow.', 'It will rain tomorrow'] },
        { q: '「私は今夜料理をする予定です。」を英語に。（be going to を使って）', answers: ['I am going to cook tonight.', "I'm going to cook tonight."] }
    ],
    14: [
        { q: '「私はピアノを弾ける。」を英語に。', answers: ['I can play the piano.', 'I can play the piano', 'I can play piano.'] },
        { q: '「あなたはもっと寝るべきです。」を英語に。', answers: ['You should sleep more.', 'You should sleep more'] },
        { q: '「私はここで泳いでもいいですか？」を英語に。', answers: ['May I swim here?', 'Can I swim here?'] },
        { q: '「あなたは宿題をしなければならない。」を英語に。', answers: ['You must do your homework.', 'You have to do your homework.'] },
        { q: '「彼女は英語を話すことができる。」を英語に。', answers: ['She can speak English.', 'She can speak English'] },
        { q: '「窓を開けてもいいですか？」を英語に。', answers: ['May I open the window?', 'Can I open the window?'] },
        { q: '「あなたはもっと水を飲むべきです。」を英語に。', answers: ['You should drink more water.', 'You should drink more water'] }
    ],
    17: [
        { q: '「私は英語を話すことが好きです。」を英語に。', answers: ['I like to speak English.', 'I like to speak English'] },
        { q: '「彼は友達に会うために東京に行った。」を英語に。', answers: ['He went to Tokyo to see his friend.', 'He went to Tokyo to meet his friend.'] },
        { q: '「何か飲むものがほしい。」を英語に。', answers: ['I want something to drink.', 'I want something to drink'] },
        { q: '「彼女はケーキを作ることが好きです。」を英語に。', answers: ['She likes to make cakes.', 'She likes to bake cakes.', 'She likes to make a cake.'] },
        { q: '「私は本を読むために図書館に行った。」を英語に。', answers: ['I went to the library to read books.', 'I went to the library to read a book.'] },
        { q: '「彼は医者になりたい。」を英語に。', answers: ['He wants to be a doctor.', 'He wants to become a doctor.'] },
        { q: '「何か食べるものはありますか？」を英語に。', answers: ['Is there something to eat?', 'Do you have something to eat?'] }
    ],
    18: [
        { q: '「私は料理をすることを楽しむ。」を英語に。', answers: ['I enjoy cooking.', 'I enjoy cooking'] },
        { q: '「私は医者になりたい。」を英語に。', answers: ['I want to be a doctor.', 'I want to be a doctor', 'I want to become a doctor.'] },
        { q: '「彼は走ることをやめた。」を英語に。', answers: ['He stopped running.', 'He stopped running'] },
        { q: '「雨が降り始めた。」を英語に。', answers: ['It started raining.', 'It started to rain.', 'It began raining.', 'It began to rain.'] },
        { q: '「私は音楽を聞くことが好きです。」を英語に。（enjoy を使って）', answers: ['I enjoy listening to music.', 'I enjoy listening to music'] },
        { q: '「彼女はピアノを弾くことを練習した。」を英語に。', answers: ['She practiced playing the piano.', 'She practiced playing piano.'] },
        { q: '「私は泳ぐのが終わった。」を英語に。', answers: ['I finished swimming.', 'I finished swimming'] }
    ],
    19: [
        { q: '「もし明日晴れたら、サッカーをしよう。」を英語に。', answers: ["If it is sunny tomorrow, let's play soccer.", "If it's sunny tomorrow, let's play soccer."] },
        { q: '「私は彼が優しいと思う。」を英語に。', answers: ['I think that he is kind.', 'I think he is kind.', 'I think that he is kind'] },
        { q: '「私が家に着いたとき、雨が降っていた。」を英語に。', answers: ['When I got home, it was raining.', 'It was raining when I got home.'] },
        { q: '「彼女は疲れていたので、早く寝た。」を英語に。', answers: ['She went to bed early because she was tired.', 'Because she was tired, she went to bed early.'] },
        { q: '「もし時間があれば、映画を見よう。」を英語に。', answers: ["If you have time, let's watch a movie.", "If we have time, let's watch a movie."] },
        { q: '「私は彼が正しいと知っている。」を英語に。', answers: ['I know that he is right.', 'I know he is right.'] },
        { q: '「彼はお腹が空いていたが、何も食べなかった。」を英語に。', answers: ['He was hungry, but he did not eat anything.', "He was hungry, but he didn't eat anything."] }
    ],
    20: [
        { q: '「私は彼より年上です。」を英語に。', answers: ['I am older than him.', 'I am older than him', 'I am older than he is.'] },
        { q: '「good の比較級は？」', answers: ['better'] },
        { q: '「この本はあの本より面白い。」を英語に。', answers: ['This book is more interesting than that book.', 'This book is more interesting than that one.'] },
        { q: '「彼女はクラスで一番背が高い。」を英語に。', answers: ['She is the tallest in the class.', 'She is the tallest in her class.'] },
        { q: '「bad の最上級は？」', answers: ['worst'] },
        { q: '「東京は大阪より大きい。」を英語に。', answers: ['Tokyo is bigger than Osaka.', 'Tokyo is larger than Osaka.'] },
        { q: '「富士山は日本で一番高い山です。」を英語に。', answers: ['Mt. Fuji is the highest mountain in Japan.', 'Mount Fuji is the highest mountain in Japan.', 'Mt. Fuji is the tallest mountain in Japan.'] }
    ],
    21: [
        { q: '「私のカバンはあなたのと同じくらい大きい。」を英語に。', answers: ['My bag is as big as yours.', 'My bag is as large as yours.'] },
        { q: '「彼は兄ほど背が高くない。」を英語に。', answers: ['He is not as tall as his brother.', "He isn't as tall as his brother."] },
        { q: '「どちらが好きですか、犬と猫では？」を英語に。', answers: ['Which do you like better, dogs or cats?', 'Which do you like more, dogs or cats?'] },
        { q: '「数学は英語よりずっと難しい。」を英語に。', answers: ['Math is much harder than English.', 'Math is much more difficult than English.'] },
        { q: '「彼女は私と同じくらい速く走れる。」を英語に。', answers: ['She can run as fast as me.', 'She can run as fast as I can.'] },
        { q: '「3つの中でどれが一番好きですか？」を英語に。', answers: ['Which do you like the best of the three?', 'Which do you like best of the three?'] }
    ],
    22: [
        { q: '「この本は多くの人に読まれている。」を英語に。', answers: ['This book is read by many people.', 'This book is read by many people'] },
        { q: '「英語は世界中で話されている。」を英語に。', answers: ['English is spoken all over the world.', 'English is spoken around the world.'] },
        { q: '「この歌は彼女によって歌われた。」を英語に。', answers: ['This song was sung by her.', 'This song was sung by her'] },
        { q: '「その手紙は昨日書かれた。」を英語に。', answers: ['The letter was written yesterday.', 'That letter was written yesterday.'] },
        { q: '「この車は日本で作られた。」を英語に。', answers: ['This car was made in Japan.', 'This car was made in Japan'] },
        { q: '「フランス語はカナダで話されている。」を英語に。', answers: ['French is spoken in Canada.', 'French is spoken in Canada'] }
    ],
    23: [
        { q: '「彼にまた会えることを楽しみにしています。」を英語に。', answers: ['I am looking forward to seeing him again.', "I'm looking forward to seeing him again."] },
        { q: '「あなたの意見に賛成です。」を英語に。', answers: ['I agree with you.', 'I agree with your opinion.'] },
        { q: '「彼女は犬の世話をしている。」を英語に。', answers: ['She takes care of the dog.', 'She takes care of her dog.', 'She is taking care of the dog.'] },
        { q: '「私たちはその知らせに驚いた。」を英語に。', answers: ['We were surprised at the news.', 'We were surprised by the news.'] },
        { q: '「彼は数学が得意です。」を英語に。', answers: ['He is good at math.', 'He is good at mathematics.'] },
        { q: '「私はその映画に興味がある。」を英語に。', answers: ['I am interested in the movie.', "I'm interested in that movie.", 'I am interested in that movie.'] }
    ],
    24: [
        { q: '「私はちょうど宿題を終えたところです。」を英語に。', answers: ['I have just finished my homework.', "I've just finished my homework."] },
        { q: '「彼はもうその本を読んでしまった。」を英語に。', answers: ['He has already read the book.', 'He has already read that book.'] },
        { q: '「あなたはもう昼食を食べましたか？」を英語に。', answers: ['Have you eaten lunch yet?', 'Have you had lunch yet?'] },
        { q: '「私はまだ宿題を終えていない。」を英語に。', answers: ['I have not finished my homework yet.', "I haven't finished my homework yet."] },
        { q: '「電車はもう出発してしまった。」を英語に。', answers: ['The train has already left.', 'The train has already departed.'] },
        { q: '「彼女はちょうど家に帰ってきたところです。」を英語に。', answers: ['She has just come home.', 'She has just gotten home.', "She's just come home."] }
    ],
    25: [
        { q: '「私は3年間日本に住んでいる。」を英語に。', answers: ['I have lived in Japan for three years.', "I've lived in Japan for three years.", 'I have lived in Japan for 3 years.'] },
        { q: '「彼女は2回パリに行ったことがある。」を英語に。', answers: ['She has been to Paris twice.', 'She has visited Paris twice.'] },
        { q: '「あなたは今までに寿司を食べたことがありますか？」を英語に。', answers: ['Have you ever eaten sushi?', 'Have you ever had sushi?', 'Have you ever tried sushi?'] },
        { q: '「私は一度もスキーをしたことがない。」を英語に。', answers: ['I have never skied.', 'I have never been skiing.'] },
        { q: '「彼は子供の頃からここに住んでいる。」を英語に。', answers: ['He has lived here since he was a child.', "He's lived here since he was a child.", 'He has lived here since childhood.'] },
        { q: '「あなたはどのくらい英語を勉強していますか？」を英語に。', answers: ['How long have you studied English?', 'How long have you been studying English?'] }
    ],
    26: [
        { q: '「走っている少年は私の弟です。」を英語に。', answers: ['The running boy is my brother.', 'The boy running is my brother.', 'The boy who is running is my brother.'] },
        { q: '「壊れた窓を見てください。」を英語に。', answers: ['Look at the broken window.', 'Please look at the broken window.'] },
        { q: '「あそこで歌っている女の子を知っていますか？」を英語に。', answers: ['Do you know the girl singing over there?', 'Do you know the girl who is singing over there?'] },
        { q: '「これは日本で作られたカメラです。」を英語に。', answers: ['This is a camera made in Japan.', 'This is a camera which was made in Japan.'] },
        { q: '「泳いでいる犬はかわいい。」を英語に。', answers: ['The swimming dog is cute.', 'The dog swimming is cute.', 'The dog that is swimming is cute.'] },
        { q: '「英語で書かれた本を読みたい。」を英語に。', answers: ['I want to read a book written in English.', 'I want to read books written in English.'] }
    ],
    27: [
        { q: '「私にはロンドンに住んでいる友達がいる。」を英語に。', answers: ['I have a friend who lives in London.', 'I have a friend that lives in London.'] },
        { q: '「これは彼が書いた本です。」を英語に。', answers: ['This is the book which he wrote.', 'This is the book that he wrote.', 'This is the book he wrote.'] },
        { q: '「ピアノを弾いている女の子は私の姉です。」を英語に。', answers: ['The girl who is playing the piano is my sister.', 'The girl that is playing the piano is my sister.'] },
        { q: '「私が昨日買ったカバンは赤い。」を英語に。', answers: ['The bag which I bought yesterday is red.', 'The bag that I bought yesterday is red.', 'The bag I bought yesterday is red.'] },
        { q: '「英語を話す人はたくさんいる。」を英語に。', answers: ['There are many people who speak English.', 'There are many people that speak English.'] },
        { q: '「私が昨日会った男の人は先生です。」を英語に。', answers: ['The man who I met yesterday is a teacher.', 'The man that I met yesterday is a teacher.', 'The man I met yesterday is a teacher.'] }
    ],
    28: [
        { q: '「お父さんが医者である女の子を知っています。」を英語に。', answers: ['I know the girl whose father is a doctor.', 'I know a girl whose father is a doctor.'] },
        { q: '「屋根が赤い家は私のです。」を英語に。', answers: ['The house whose roof is red is mine.', 'The house the roof of which is red is mine.'] },
        { q: '「お母さんが先生である男の子はトムです。」を英語に。', answers: ['The boy whose mother is a teacher is Tom.'] },
        { q: '「私には名前が有名な友達がいる。」を英語に。', answers: ['I have a friend whose name is famous.'] },
        { q: '「窓が壊れている家を見た。」を英語に。', answers: ['I saw a house whose window was broken.', 'I saw the house whose window was broken.'] },
        { q: '「著者が日本人であるその本は面白い。」を英語に。', answers: ['The book whose author is Japanese is interesting.'] }
    ],
    29: [
        { q: '「私は彼女がどこに住んでいるか知っている。」を英語に。', answers: ['I know where she lives.', 'I know where she lives'] },
        { q: '「彼が何を言ったか教えてください。」を英語に。', answers: ['Please tell me what he said.', 'Tell me what he said.'] },
        { q: '「あなたはいつ日本に来たか覚えていますか？」を英語に。', answers: ['Do you remember when you came to Japan?'] },
        { q: '「It is important to study hard. を日本語に訳してください。」', answers: ['一生懸命勉強することは大切です。', '一生懸命勉強することは重要です。', '熱心に勉強することは大切です。'] },
        { q: '「彼がなぜ怒っているのかわからない。」を英語に。', answers: ["I don't know why he is angry.", 'I do not know why he is angry.'] },
        { q: '「あの建物がいつ建てられたか知っていますか？」を英語に。', answers: ['Do you know when that building was built?'] }
    ]
};

// ============================================================
// 練習問題チェック
// ============================================================
function checkExercise(inputId, answers) {
    const input = document.getElementById(inputId);
    const fb = document.getElementById(inputId + '-fb');
    const userAnswer = input.value.trim().replace(/\s+/g, ' ');

    const normalizedAnswers = answers.map(a => a.toLowerCase().replace(/\s+/g, ' '));
    const isCorrect = normalizedAnswers.includes(userAnswer.toLowerCase());

    fb.style.display = 'block';
    if (isCorrect) {
        fb.textContent = '✅ 正解！すばらしい！';
        fb.style.background = '#c6f6d5';
        fb.style.color = '#276749';
    } else {
        fb.textContent = '❌ 惜しい！正解は「' + answers[0] + '」です。';
        fb.style.background = '#fed7d7';
        fb.style.color = '#9b2c2c';
    }
}

// ============================================================
// 発音チェック機能（Web Speech API - SpeechRecognition）
// ============================================================
var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var pronunRecognition = null;
var convRecognition = null;
var micPermissionGranted = false;

// Safari対応: SpeechRecognition開始前にマイク権限を事前取得する
function ensureMicPermission() {
    return new Promise(function(resolve, reject) {
        if (micPermissionGranted) { resolve(); return; }
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            resolve(); // getUserMedia非対応でも認識を試みる
            return;
        }
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function(stream) {
                // 権限取得成功、ストリームを停止
                stream.getTracks().forEach(function(track) { track.stop(); });
                micPermissionGranted = true;
                resolve();
            })
            .catch(function(err) {
                reject(err);
            });
    });
}

// Safari対応: SpeechRecognitionインスタンスを安全に開始する
function startRecognitionSafely(recognition, resultDiv, statusEl) {
    try {
        recognition.start();
    } catch (e) {
        // Safari: 既に開始している場合などのエラーをキャッチ
        if (statusEl) statusEl.textContent = 'エラーが発生しました。もう一度お試しください。';
        if (resultDiv) {
            resultDiv.className = 'speech-result wrong';
            resultDiv.innerHTML = '音声認識を開始できませんでした。<br>ブラウザの設定でマイクを許可してください。';
        }
        return false;
    }
    return true;
}

// 発音チェック用フレーズデータ
var pronunData = {
    greetings: [
        { en: 'Hello, how are you?', ja: 'こんにちは、お元気ですか？' },
        { en: 'Good morning!', ja: 'おはようございます！' },
        { en: 'Nice to meet you.', ja: 'はじめまして。' },
        { en: 'My name is Taro.', ja: '私の名前はタロウです。' },
        { en: 'See you later!', ja: 'またあとで！' }
    ],
    daily: [
        { en: 'What time is it?', ja: '何時ですか？' },
        { en: 'I am hungry.', ja: 'お腹がすきました。' },
        { en: 'It is sunny today.', ja: '今日は晴れです。' },
        { en: 'I like music.', ja: '私は音楽が好きです。' },
        { en: 'Can you help me?', ja: '手伝ってもらえますか？' }
    ],
    travel: [
        { en: 'Where is the station?', ja: '駅はどこですか？' },
        { en: 'How much is this?', ja: 'これはいくらですか？' },
        { en: 'I need a taxi.', ja: 'タクシーが必要です。' },
        { en: 'One ticket, please.', ja: 'チケットを1枚ください。' },
        { en: 'Is this seat taken?', ja: 'この席は空いていますか？' }
    ],
    shopping: [
        { en: 'I am looking for a shirt.', ja: 'シャツを探しています。' },
        { en: 'Do you have a smaller size?', ja: 'もっと小さいサイズはありますか？' },
        { en: 'I will take this one.', ja: 'これにします。' },
        { en: 'Can I pay by card?', ja: 'カードで払えますか？' },
        { en: 'Where is the fitting room?', ja: '試着室はどこですか？' }
    ],
    grammar: [
        { en: 'She runs every morning.', ja: '彼女は毎朝走ります。（SV文型）' },
        { en: 'He is a student.', ja: '彼は学生です。（SVC文型）' },
        { en: 'I play tennis.', ja: '私はテニスをします。（SVO文型）' },
        { en: 'She gave me a book.', ja: '彼女は私に本をくれました。（SVOO文型）' },
        { en: 'We call him Ken.', ja: '私たちは彼をケンと呼びます。（SVOC文型）' }
    ]
};
var pronunIndex = 0;
var pronunCategory = 'greetings';
var isPronunRecording = false;

function loadPronunCategory() {
    pronunCategory = document.getElementById('pronun-category').value;
    pronunIndex = 0;
    showPronunSentence();
}

function showPronunSentence() {
    var data = pronunData[pronunCategory];
    if (!data || !data[pronunIndex]) return;
    document.getElementById('pronun-target-en').textContent = data[pronunIndex].en;
    document.getElementById('pronun-target-ja').textContent = data[pronunIndex].ja;
    document.getElementById('pronun-counter').textContent = (pronunIndex + 1) + ' / ' + data.length;
    document.getElementById('pronun-result').className = 'speech-result';
    document.getElementById('pronun-result').innerHTML = '';
    document.getElementById('mic-status-pronun').textContent = 'マイクボタンを押して発音してください';
}

function nextPronunSentence() {
    var data = pronunData[pronunCategory];
    if (pronunIndex < data.length - 1) { pronunIndex++; showPronunSentence(); }
}

function prevPronunSentence() {
    if (pronunIndex > 0) { pronunIndex--; showPronunSentence(); }
}

function togglePronunRecording() {
    if (!SpeechRecognition) {
        alert('お使いのブラウザは音声認識に対応していません。\nChrome、Edge、または Safari をお使いください。');
        return;
    }
    var btn = document.getElementById('mic-btn-pronun');
    if (isPronunRecording) {
        isPronunRecording = false;
        btn.classList.remove('recording');
        btn.classList.add('idle');
        if (pronunRecognition) pronunRecognition.stop();
        return;
    }

    // Safari対応: マイク権限を事前取得してから認識を開始
    var statusEl = document.getElementById('mic-status-pronun');
    var resultDiv = document.getElementById('pronun-result');
    statusEl.textContent = 'マイクを準備中...';

    ensureMicPermission().then(function() {
        isPronunRecording = true;
        btn.classList.remove('idle');
        btn.classList.add('recording');
        statusEl.textContent = '聞き取り中...話してください';
        resultDiv.className = 'speech-result listening';
        resultDiv.innerHTML = '&#127911; 聞き取り中...';

        pronunRecognition = new SpeechRecognition();
        pronunRecognition.lang = 'en-US';
        pronunRecognition.interimResults = false;
        pronunRecognition.maxAlternatives = 1;
        pronunRecognition.continuous = false;

        var gotResult = false;

        pronunRecognition.onresult = function(event) {
            gotResult = true;
            var spoken = event.results[0][0].transcript;
            var confidence = event.results[0][0].confidence;
            var target = document.getElementById('pronun-target-en').textContent;
            evaluatePronunciation(spoken, target, confidence, resultDiv);
        };
        pronunRecognition.onerror = function(event) {
            isPronunRecording = false;
            btn.classList.remove('recording');
            btn.classList.add('idle');
            statusEl.textContent = 'エラーが発生しました。もう一度お試しください。';
            resultDiv.className = 'speech-result wrong';
            if (event.error === 'not-allowed') {
                resultDiv.innerHTML = 'マイクの使用が許可されていません。<br>ブラウザの設定でマイクを許可してください。';
            } else if (event.error === 'service-not-allowed') {
                resultDiv.innerHTML = '<strong>Safariで音声認識が許可されていません。</strong><br>' +
                    '以下の手順で有効にしてください：<br>' +
                    '① Safari メニュー →「設定」→「Webサイト」→「マイク」<br>' +
                    '② このサイトを「許可」に変更<br>' +
                    '③ ページを再読み込みしてください<br><br>' +
                    '<span style="font-size:0.85rem; color:#718096;">※ うまくいかない場合は Chrome ブラウザをお試しください。</span>';
                statusEl.textContent = 'Safariの設定を確認してください。';
            } else if (event.error === 'no-speech') {
                resultDiv.innerHTML = '音声が検出されませんでした。もう一度お試しください。';
            } else if (event.error === 'aborted') {
                resultDiv.innerHTML = '音声認識が中断されました。もう一度お試しください。';
            } else {
                resultDiv.innerHTML = 'エラー: ' + event.error;
            }
        };
        pronunRecognition.onend = function() {
            isPronunRecording = false;
            btn.classList.remove('recording');
            btn.classList.add('idle');
            if (!gotResult && resultDiv.className.indexOf('listening') !== -1) {
                statusEl.textContent = '音声が検出されませんでした。もう一度お試しください。';
                resultDiv.className = 'speech-result wrong';
                resultDiv.innerHTML = '音声が検出されませんでした。<br>マイクが有効か確認してください。';
            }
        };

        startRecognitionSafely(pronunRecognition, resultDiv, statusEl);
    }).catch(function() {
        statusEl.textContent = 'マイクの使用が許可されていません。';
        resultDiv.className = 'speech-result wrong';
        resultDiv.innerHTML = 'マイクの使用が許可されていません。<br>ブラウザの設定でマイクを許可してください。';
    });
}

function evaluatePronunciation(spoken, target, confidence, resultDiv) {
    var normalSpoken = spoken.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
    var normalTarget = target.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();

    var similarity = calcSimilarity(normalSpoken, normalTarget);
    var score = Math.round(similarity * 100);

    var scoreClass, scoreLabel, emoji;
    if (score >= 85) { scoreClass = 'great'; scoreLabel = 'すばらしい！'; emoji = '&#127881;'; }
    else if (score >= 60) { scoreClass = 'good'; scoreLabel = 'いい感じ！'; emoji = '&#128079;'; }
    else { scoreClass = 'retry'; scoreLabel = 'もう一度挑戦！'; emoji = '&#128170;'; }

    var html = '<div class="your-text">' + emoji + ' あなたの発音: "' + spoken + '"</div>';
    html += '<div class="expected">お手本: "' + target + '"</div>';
    html += '<div class="speech-score ' + scoreClass + '">スコア: ' + score + '点 - ' + scoreLabel + '</div>';
    resultDiv.className = 'speech-result ' + (score >= 60 ? 'correct' : 'wrong');
    resultDiv.innerHTML = html;
    document.getElementById('mic-status-pronun').textContent = 'もう一度チャレンジするか、次の文に進みましょう！';
}

function calcSimilarity(a, b) {
    if (a === b) return 1;
    var wordsA = a.split(' ');
    var wordsB = b.split(' ');
    var matchCount = 0;
    for (var i = 0; i < wordsB.length; i++) {
        for (var j = 0; j < wordsA.length; j++) {
            if (wordsA[j] === wordsB[i]) { matchCount++; wordsA.splice(j, 1); break; }
        }
    }
    return matchCount / Math.max(wordsB.length, 1);
}

// ============================================================
// 定型会話練習
// ============================================================
var convScenarios = {
    greeting: {
        title: '自己紹介・あいさつ',
        lines: [
            { speaker: 'bot', en: 'Hello! My name is Emily. Nice to meet you.', ja: 'こんにちは！私の名前はエミリーです。はじめまして。' },
            { speaker: 'user', en: 'Nice to meet you too. My name is Taro.', ja: 'こちらこそはじめまして。私の名前はタロウです。', hint: 'Nice to meet you too. My name is ○○.' },
            { speaker: 'bot', en: 'Where are you from, Taro?', ja: 'タロウさん、出身はどちらですか？' },
            { speaker: 'user', en: 'I am from Japan.', ja: '日本出身です。', hint: 'I am from Japan.' },
            { speaker: 'bot', en: 'Oh, nice! How are you today?', ja: 'いいですね！今日の調子はどうですか？' },
            { speaker: 'user', en: 'I am fine, thank you. And you?', ja: '元気です、ありがとう。あなたは？', hint: 'I am fine, thank you. And you?' },
            { speaker: 'bot', en: 'I am great, thanks! It was nice talking to you.', ja: 'すごく元気です！お話しできてよかったです。' },
            { speaker: 'user', en: 'It was nice talking to you too. Goodbye!', ja: 'こちらこそ。さようなら！', hint: 'It was nice talking to you too. Goodbye!' }
        ]
    },
    restaurant: {
        title: 'レストランで注文',
        lines: [
            { speaker: 'bot', en: 'Welcome! How many people?', ja: 'いらっしゃいませ！何名様ですか？' },
            { speaker: 'user', en: 'Two, please.', ja: '2人です。', hint: 'Two, please.' },
            { speaker: 'bot', en: 'Right this way. Here is the menu.', ja: 'こちらへどうぞ。メニューです。' },
            { speaker: 'user', en: 'Thank you.', ja: 'ありがとうございます。', hint: 'Thank you.' },
            { speaker: 'bot', en: 'Are you ready to order?', ja: 'ご注文はお決まりですか？' },
            { speaker: 'user', en: 'Yes. I will have the pasta, please.', ja: 'はい。パスタをお願いします。', hint: 'Yes. I will have the pasta, please.' },
            { speaker: 'bot', en: 'Anything to drink?', ja: 'お飲み物はいかがですか？' },
            { speaker: 'user', en: 'Water, please.', ja: 'お水をお願いします。', hint: 'Water, please.' },
            { speaker: 'bot', en: 'Sure. Your order will be ready soon.', ja: 'かしこまりました。少々お待ちください。' },
            { speaker: 'user', en: 'Can I have the check, please?', ja: 'お会計をお願いします。', hint: 'Can I have the check, please?' }
        ]
    },
    shopping: {
        title: '買い物',
        lines: [
            { speaker: 'bot', en: 'Hi! Can I help you?', ja: 'こんにちは！何かお探しですか？' },
            { speaker: 'user', en: 'Yes, I am looking for a T-shirt.', ja: 'はい、Tシャツを探しています。', hint: 'Yes, I am looking for a T-shirt.' },
            { speaker: 'bot', en: 'What size do you need?', ja: 'サイズはどちらですか？' },
            { speaker: 'user', en: 'Medium, please.', ja: 'Mサイズでお願いします。', hint: 'Medium, please.' },
            { speaker: 'bot', en: 'How about this one?', ja: 'こちらはいかがですか？' },
            { speaker: 'user', en: 'How much is it?', ja: 'いくらですか？', hint: 'How much is it?' },
            { speaker: 'bot', en: 'It is twenty dollars.', ja: '20ドルです。' },
            { speaker: 'user', en: 'I will take it. Can I pay by card?', ja: 'これにします。カードで払えますか？', hint: 'I will take it. Can I pay by card?' },
            { speaker: 'bot', en: 'Of course! Here you go.', ja: 'もちろんです！どうぞ。' },
            { speaker: 'user', en: 'Thank you very much!', ja: 'どうもありがとうございます！', hint: 'Thank you very much!' }
        ]
    },
    directions: {
        title: '道を聞く',
        lines: [
            { speaker: 'user', en: 'Excuse me, can you help me?', ja: 'すみません、助けてもらえますか？', hint: 'Excuse me, can you help me?' },
            { speaker: 'bot', en: 'Sure! What do you need?', ja: 'もちろん！どうしましたか？' },
            { speaker: 'user', en: 'Where is the nearest station?', ja: '最寄りの駅はどこですか？', hint: 'Where is the nearest station?' },
            { speaker: 'bot', en: 'Go straight and turn left at the corner.', ja: 'まっすぐ行って角を左に曲がってください。' },
            { speaker: 'user', en: 'How far is it?', ja: 'どのくらい遠いですか？', hint: 'How far is it?' },
            { speaker: 'bot', en: 'About five minutes on foot.', ja: '歩いて約5分です。' },
            { speaker: 'user', en: 'Thank you so much!', ja: 'ありがとうございます！', hint: 'Thank you so much!' },
            { speaker: 'bot', en: 'You are welcome!', ja: 'どういたしまして！' }
        ]
    },
    hotel: {
        title: 'ホテルのチェックイン',
        lines: [
            { speaker: 'bot', en: 'Good evening. Welcome to Grand Hotel.', ja: 'こんばんは。グランドホテルへようこそ。' },
            { speaker: 'user', en: 'Hello. I have a reservation.', ja: 'こんばんは。予約しています。', hint: 'Hello. I have a reservation.' },
            { speaker: 'bot', en: 'May I have your name, please?', ja: 'お名前をいただけますか？' },
            { speaker: 'user', en: 'My name is Taro Tanaka.', ja: '田中タロウです。', hint: 'My name is ○○.' },
            { speaker: 'bot', en: 'Yes, I found your reservation. Two nights, correct?', ja: 'はい、ご予約確認できました。2泊ですね？' },
            { speaker: 'user', en: 'Yes, that is correct.', ja: 'はい、そうです。', hint: 'Yes, that is correct.' },
            { speaker: 'bot', en: 'Here is your room key. Room 305. The elevator is on the right.', ja: 'お部屋の鍵です。305号室。エレベーターは右手にあります。' },
            { speaker: 'user', en: 'Thank you. What time is breakfast?', ja: 'ありがとうございます。朝食は何時ですか？', hint: 'Thank you. What time is breakfast?' },
            { speaker: 'bot', en: 'Breakfast is from 7 to 10 in the morning.', ja: '朝食は朝7時から10時までです。' },
            { speaker: 'user', en: 'Great, thank you very much!', ja: 'わかりました、ありがとうございます！', hint: 'Great, thank you very much!' }
        ]
    }
};

var convCurrentScenario = 'greeting';
var convCurrentLine = 0;
var isConvRecording = false;

function loadConversation() {
    convCurrentScenario = document.getElementById('conv-scenario').value;
    convCurrentLine = 0;
    document.getElementById('conv-messages').innerHTML = '';
    document.getElementById('conv-result').className = 'speech-result';
    document.getElementById('conv-result').innerHTML = '';
    document.getElementById('conv-hint').textContent = '';
    advanceConversation();
}

function advanceConversation() {
    var scenario = convScenarios[convCurrentScenario];
    if (!scenario || convCurrentLine >= scenario.lines.length) {
        var msgDiv = document.getElementById('conv-messages');
        msgDiv.innerHTML += '<div style="text-align:center; padding:15px; color:#276749; font-weight:bold; font-size:1.1rem;">&#127881; 会話完了！おつかれさまでした！</div>';
        document.getElementById('conv-hint').textContent = '「最初からやり直す」ボタンで再チャレンジできます。';
        msgDiv.scrollTop = msgDiv.scrollHeight;
        return;
    }
    var line = scenario.lines[convCurrentLine];
    if (line.speaker === 'bot') {
        addChatBubble('bot', line.en, line.ja);
        convCurrentLine++;
        // 次がuserの行ならヒントを表示
        if (convCurrentLine < scenario.lines.length && scenario.lines[convCurrentLine].speaker === 'user') {
            var userLine = scenario.lines[convCurrentLine];
            document.getElementById('conv-hint').textContent = '&#128161; ヒント: 「' + userLine.hint + '」（' + userLine.ja + '）';
        }
        // 連続でbotの行がある場合は次も表示
        if (convCurrentLine < scenario.lines.length && scenario.lines[convCurrentLine].speaker === 'bot') {
            setTimeout(function() { advanceConversation(); }, 1200);
        }
    } else {
        // userの番
        document.getElementById('conv-hint').innerHTML = '&#128161; あなたの番です！「' + line.hint + '」<br>（' + line.ja + '）';
    }
}

function addChatBubble(role, en, ja) {
    var msgDiv = document.getElementById('conv-messages');
    var label = role === 'bot' ? '相手' : 'あなた';
    var bubble = document.createElement('div');
    bubble.className = 'chat-bubble ' + role;
    bubble.innerHTML = '<div class="speaker-label">' + label + '</div><strong>' + en + '</strong><br><span style="font-size:0.85rem; opacity:0.8;">' + ja + '</span>';
    msgDiv.appendChild(bubble);
    msgDiv.scrollTop = msgDiv.scrollHeight;
}

function playConvLine() {
    var scenario = convScenarios[convCurrentScenario];
    // 最新のbotの行を再生
    for (var i = convCurrentLine - 1; i >= 0; i--) {
        if (scenario.lines[i].speaker === 'bot') {
            speak(scenario.lines[i].en, document.getElementById('conv-listen-btn'));
            return;
        }
    }
}

function toggleConvRecording() {
    if (!SpeechRecognition) {
        alert('お使いのブラウザは音声認識に対応していません。\nChrome、Edge、または Safari をお使いください。');
        return;
    }
    var scenario = convScenarios[convCurrentScenario];
    if (!scenario || convCurrentLine >= scenario.lines.length) return;
    var line = scenario.lines[convCurrentLine];
    if (line.speaker !== 'user') return;

    var btn = document.getElementById('conv-mic-btn');
    if (isConvRecording) {
        isConvRecording = false;
        btn.classList.remove('recording');
        btn.classList.add('idle');
        if (convRecognition) convRecognition.stop();
        return;
    }

    // Safari対応: マイク権限を事前取得してから認識を開始
    var resultDiv = document.getElementById('conv-result');

    ensureMicPermission().then(function() {
        isConvRecording = true;
        btn.classList.remove('idle');
        btn.classList.add('recording');
        resultDiv.className = 'speech-result listening';
        resultDiv.innerHTML = '&#127911; 聞き取り中...';

        convRecognition = new SpeechRecognition();
        convRecognition.lang = 'en-US';
        convRecognition.interimResults = false;
        convRecognition.maxAlternatives = 1;
        convRecognition.continuous = false;

        var gotResult = false;

        convRecognition.onresult = function(event) {
            gotResult = true;
            var spoken = event.results[0][0].transcript;
            var target = line.en;
            var normalSpoken = spoken.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
            var normalTarget = target.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
            var similarity = calcSimilarity(normalSpoken, normalTarget);
            var score = Math.round(similarity * 100);

            if (score >= 50) {
                resultDiv.className = 'speech-result correct';
                resultDiv.innerHTML = '&#9989; "' + spoken + '" - ';
                if (score >= 85) { resultDiv.innerHTML += '完璧です！'; }
                else { resultDiv.innerHTML += 'OKです！（スコア: ' + score + '点）'; }
                addChatBubble('user', line.en, line.ja);
                convCurrentLine++;
                document.getElementById('conv-hint').textContent = '';
                setTimeout(function() {
                    resultDiv.className = 'speech-result';
                    resultDiv.innerHTML = '';
                    advanceConversation();
                }, 1500);
            } else {
                resultDiv.className = 'speech-result wrong';
                resultDiv.innerHTML = '&#128260; "' + spoken + '"<br>もう一度「' + line.hint + '」と言ってみましょう！（スコア: ' + score + '点）';
            }
        };
        convRecognition.onerror = function(event) {
            isConvRecording = false;
            btn.classList.remove('recording');
            btn.classList.add('idle');
            resultDiv.className = 'speech-result wrong';
            if (event.error === 'not-allowed') {
                resultDiv.innerHTML = 'マイクの使用が許可されていません。<br>ブラウザの設定でマイクを許可してください。';
            } else if (event.error === 'service-not-allowed') {
                resultDiv.innerHTML = '<strong>Safariで音声認識が許可されていません。</strong><br>' +
                    '以下の手順で有効にしてください：<br>' +
                    '① Safari メニュー →「設定」→「Webサイト」→「マイク」<br>' +
                    '② このサイトを「許可」に変更<br>' +
                    '③ ページを再読み込みしてください<br><br>' +
                    '<span style="font-size:0.85rem; color:#718096;">※ うまくいかない場合は Chrome ブラウザをお試しください。</span>';
            } else if (event.error === 'no-speech') {
                resultDiv.innerHTML = '音声が検出されませんでした。もう一度お試しください。';
            } else if (event.error === 'aborted') {
                resultDiv.innerHTML = '音声認識が中断されました。もう一度お試しください。';
            } else {
                resultDiv.innerHTML = 'エラー: ' + event.error;
            }
        };
        convRecognition.onend = function() {
            isConvRecording = false;
            btn.classList.remove('recording');
            btn.classList.add('idle');
            if (!gotResult && resultDiv.className.indexOf('listening') !== -1) {
                resultDiv.className = 'speech-result wrong';
                resultDiv.innerHTML = '音声が検出されませんでした。<br>マイクが有効か確認してください。';
            }
        };

        startRecognitionSafely(convRecognition, resultDiv, null);
    }).catch(function() {
        resultDiv.className = 'speech-result wrong';
        resultDiv.innerHTML = 'マイクの使用が許可されていません。<br>ブラウザの設定でマイクを許可してください。';
    });
}

function skipConvLine() {
    var scenario = convScenarios[convCurrentScenario];
    if (!scenario || convCurrentLine >= scenario.lines.length) return;
    var line = scenario.lines[convCurrentLine];
    if (line.speaker === 'user') {
        addChatBubble('user', line.en, line.ja);
        convCurrentLine++;
        document.getElementById('conv-hint').textContent = '';
        document.getElementById('conv-result').className = 'speech-result';
        document.getElementById('conv-result').innerHTML = '';
        advanceConversation();
    }
}

function resetConversation() {
    loadConversation();
}

// ============================================================
// 初期化
// ============================================================
buildSidebar();
showLesson('lesson-1');
// 会話練習の初期ロード
loadConversation();
