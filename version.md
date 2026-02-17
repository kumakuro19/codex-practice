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

### 6. 天気ダッシュボード機能を追加
- 現在天気のテーマ切り替えに加えて、数値情報を表示するUIを追加
  - 気温
  - 体感温度
  - 風速
  - 観測時刻
- Open-Meteo API の取得項目を拡張
  - `temperature_2m`
  - `apparent_temperature`
  - `wind_speed_10m`
  - `time`
  - `timezone=auto`
- APIレスポンスを使ってダッシュボード表示を更新する処理を実装
- モバイルでも崩れないよう、ダッシュボードをレスポンシブ対応
- 開発用 `frontend` と公開用 `docs` の両方に同じ変更を反映

## 追加・更新対象ファイル
- `frontend/index.html`
- `frontend/styles.css`
- `frontend/app.js`
- `docs/index.html`
- `docs/styles.css`
- `docs/app.js`

### 7. 天気データ未表示の修正
- Open-Meteo の `current` クエリから不正な指定を削除して取得失敗を解消
  - 修正前: `...wind_speed_10m,time`
  - 修正後: `...wind_speed_10m`
- 観測時刻の表示を安定化
  - `current.time`（`YYYY-MM-DDTHH:mm`）を安全に文字列整形して表示
  - 取得できた `timezone` も併記
- 開発用 `frontend` と公開用 `docs` の両方に同じ修正を反映

## 修正対象ファイル
- `frontend/app.js`
- `docs/app.js`

### 8. 天気表示項目と背景色ロジックを再設計
- 天気ダッシュボードの表示項目を3つに整理
  - 気温
  - 湿度
  - 風速
- Open-Meteo の取得項目を要件に合わせて変更
  - 追加: `relative_humidity_2m`
  - 削除: `apparent_temperature`
- 背景色を気象データ連動に変更
  - 気温（0-40）で色相を調整
  - 湿度（0-100）で彩度を調整
  - 風速は表示のみで背景調整には未使用
- 既存の天気区分（Sunny/Cloudy/Rainy/Snowy/Night）は明るさ補正として併用
- 開発用 `frontend` と公開用 `docs` の両方に反映

## 追加・更新対象ファイル
- `frontend/index.html`
- `frontend/styles.css`
- `frontend/app.js`
- `docs/index.html`
- `docs/styles.css`
- `docs/app.js`

### 9. 習慣トラッカー（別ページ）を追加
- LPから遷移できる習慣トラッカーページを追加
  - `index.html` に「習慣トラッカーへ」リンクを設置
  - `tracker.html` を新規作成
- 初期チェック項目（7件）を実装
  - 1.5L飲んだ
  - 朝食を食べた
  - 10分以上ストレッチした
  - 20分以上歩いた
  - 間食を1回以内にした
  - 就寝前30分はスマホを見なかった
  - 0時までに就寝した
- `localStorage` に日付単位で保存・復元する処理を実装
  - 保存キー: `habit_tracker_v1`
  - 再読み込み後も当日のチェック状態を復元
- 達成率表示を追加
  - `達成率: n/7 (xx%)`
  - プログレスバーで可視化
- 開発用 `frontend` と公開用 `docs` の両方に同内容を反映

## 追加・更新対象ファイル
- `frontend/index.html`
- `frontend/styles.css`
- `frontend/tracker.html`
- `frontend/tracker.js`
- `docs/index.html`
- `docs/styles.css`
- `docs/tracker.html`
- `docs/tracker.js`

### 10. LP再訪時の位置情報再確認を抑制
- 天気取得用の座標キャッシュを追加
  - 保存キー: `weather_coords_cache_v1`
  - 有効期限: 24時間
- キャッシュがある場合は `getCurrentPosition()` を呼ばず、保存済み座標で天気を取得
- キャッシュがない初回のみ位置情報取得を実行し、取得成功時に座標を保存
- 開発用 `frontend` と公開用 `docs` の両方に反映

## 修正対象ファイル
- `frontend/app.js`
- `docs/app.js`
