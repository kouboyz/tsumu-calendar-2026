# MY SUMMER CALENDAR 2026

2026年7月18日〜8月31日の予定と達成状況を、スマートフォンで楽しく管理する週間カレンダーです。React、TypeScript、Tailwind CSS、dnd-kit で構築し、データはブラウザの `localStorage` に保存します。

## 開発

Node.js 24 以降を使用します。

```bash
npm install
npm run dev
```

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバーを起動 |
| `npm test` | テストを実行 |
| `npm run lint` | 静的解析を実行 |
| `npm run build` | 型検査と本番ビルド |
| `npm run preview` | 本番ビルドをローカル表示 |

## 使い方

- 教科カードをタップし、宿題マスターから取り組む項目と日付を順番に選びます。
- 教科別・全体の進捗は、配置したカード数ではなく全172件の宿題項目を母数として計算します。
- 教科カードを日付へドラッグした場合は、その日へ配置する宿題だけを選びます。
- カレンダー内のカードは別の日へドラッグして移動できます。
- ミッションカードをタップすると「⭐ 終わった」「💦 終わらなかった」を記録できます。
- 記録は利用中のブラウザだけに保存され、端末間では同期されません。

## 画像

表示中のメイン画像は `src/assets/girls2/hero.webp` にあります。提供元や利用許諾を確認した画像だけを使用してください。画像を差し替える場合は同じファイル名を使うとコード変更は不要です。`logo.webp` は現在表示していませんが、将来の再利用用に残しています。

- メイン画像: WebP、横幅 1080px 程度、横長表示に耐える構図

元画像を置いた `g2/` ディレクトリは実行時に参照しないため、削除してもアプリに影響しません。

## GitHub Pages

`.github/workflows/deploy-pages.yml` が `main` ブランチへの push 時にテストとビルドを行い、GitHub Pagesへ公開します。リポジトリの **Settings → Pages → Build and deployment** で Source を **GitHub Actions** に設定してください。

公開先は `https://<ユーザー名>.github.io/tsumu-calendar-2026/` を想定しています。リポジトリ名を変更する場合は `vite.config.ts` の `base` も更新してください。
