# codex-practice

Python(Flask) と HTML/JS を使った最小構成のプロジェクトです。

## ディレクトリ構成

```
.
├── backend/
│   ├── app.py
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── main.js
│   └── styles.css
├── docs/
├── src/
├── tests/
└── README.md
```

## セットアップ

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
```

## 起動方法

```powershell
python backend/app.py
```

ブラウザで `http://127.0.0.1:5000` を開くと、フロント画面が表示されます。  
`/api/health` エンドポイントで Python 側のAPI動作確認ができます。

## 次にやること（任意）

- `tests/` に API テスト（`pytest`）を追加
- `src/` に業務ロジックを分離
- フロントエンドをビルド構成（Vite など）に拡張
