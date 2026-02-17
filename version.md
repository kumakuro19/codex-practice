# version

## 追加内容一覧

### 1. LPの基本構成を整備
- `frontend/index.html` を見出し・説明・ボタン・補足のシンプルLP構成に整理
- `frontend/styles.css` と `frontend/app.js` を分離して参照
- 旧 `main.js` 参照を `app.js` に置き換え

### 2. 機能紹介セクションを追加
- 「機能紹介」セクションを `section` 要素で追加
- 3つのカードを `ul > li > article` のセマンティック構造で実装
- デスクトップは3列、スマホは1列になるレスポンシブレイアウトを追加

### 3. 天気連動テーマを追加
- 現在天気表示要素 `#weatherState` をLPに追加
- `navigator.geolocation.getCurrentPosition()` で現在地を取得
- 位置情報が取れない場合は東京座標（35.6762, 139.6503）へフォールバック
- Open-Meteo の current weather から天気を判定し、以下のテーマクラスを `body` に付け替え
  - `theme-sunny`
  - `theme-cloudy`
  - `theme-rainy`
  - `theme-snowy`
  - `theme-night`
- `frontend/styles.css` に各テーマの背景グラデーションを追加

## 対象ファイル
- `frontend/index.html`
- `frontend/styles.css`
- `frontend/app.js`

### 4. GitHub Pages公開用のdocs配置を追加
- `frontend` 配下の公開対象ファイルを `docs` に複製（`docs/index.html`, `docs/styles.css`, `docs/app.js`）
- `docs/index.html` の参照パスを GitHub Pages 用に明示的な相対パスへ修正
  - `href="./styles.css"`
  - `src="./app.js"`
- `frontend` は開発用としてそのまま保持

## 追加対象ファイル（GitHub Pages用）
- `docs/index.html`
- `docs/styles.css`
- `docs/app.js`

### 5. docs/index.html の文字化け修復
- `docs/index.html` の日本語文字化けを修正
- `frontend/index.html` の正しい本文をベースに `docs/index.html` を再生成
- 文字コードを UTF-8（BOM付き）で保存し、`<meta charset="UTF-8">` と整合
- GitHub Pages 用の相対パス指定は維持
  - `href="./styles.css"`
  - `src="./app.js"`
