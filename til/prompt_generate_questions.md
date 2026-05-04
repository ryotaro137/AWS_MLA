# AWS MLA-C01 新問題生成プロンプト

以下のプロンプトを Claude / ChatGPT 等に入力して、MLA-C01形式の模擬問題を生成してください。

---

## プロンプト本文

```
あなたはAWS認定 Machine Learning Engineer - Associate (MLA-C01) の試験問題作成の専門家です。
以下の【問題形式】【出題トピック】【制約条件】に従い、本番試験と同等の難易度の新しい模擬問題を日本語で10問作成してください。

---

## 【問題形式】

各問題は以下の構成とすること。

1. **シナリオ記述**: 企業・MLエンジニアが直面している具体的な状況を2〜5文で説明する。
2. **要件の明示**: 「〜する必要があります」「〜してはいけません」のように制約・要件を箇条書きまたは文中で明示する。
3. **問い**: 「これらの要件を満たすソリューションはどれですか」「MLエンジニアは何をすべきですか」など。
4. **選択肢**: A〜D の4択（または「2つ選択」「3つ選択」の多選択形式を1〜2問含める）
5. **正解と解説**: 問題の直後に `### 正解` セクションで正解記号と、なぜ他の選択肢が誤りかも含めた100〜200字の解説を付ける。

---

## 【出題トピックと頻出AWSサービス】

以下のトピックからバランスよく出題すること（1トピックに偏らないこと）。

### データ収集・取り込み
- Amazon Kinesis Data Streams / Firehose（ストリーミング取り込み、レイテンシ要件）
- AWS IoT SiteWise（IoTデバイスからのテレメトリ収集）
- Amazon S3（ストレージクラス、パーティショニング、暗号化 SSE-KMS）
- AWS Glue / Glue DataBrew（ETL、データクレンジング、正規化）

### データ前処理・特徴量エンジニアリング
- Amazon SageMaker Data Wrangler（データ変換、品質確認、バイアス検出）
- Amazon SageMaker Clarify（統計的バイアス、説明可能性）
- Amazon SageMaker Feature Store（オンラインストア vs オフラインストア、レコード取り込み手順）
- クラス不均衡の対処（SMOTE、オーバーサンプリング、SageMaker内蔵手法）
- 次元削減（PCA、特徴量選択）

### モデル開発・トレーニング
- Amazon SageMaker Training（Script Mode、BYO Container、PyTorch/TensorFlow移行）
- Amazon SageMaker Experiments（実験管理、実行履歴）
- Amazon SageMaker Debugger（消失勾配、過学習、GPUボトルネック検出）
- Amazon SageMaker Autopilot（AutoML、最小開発工数）
- Amazon SageMaker JumpStart（オープンソースLLMのデプロイ）
- ディープラーニングのファインチューニング（事前学習済みモデル再利用）
- Amazon Forecast（時系列予測、季節性・相関の組み込み）
- Amazon Personalize（協調フィルタリング、レコメンデーション）

### モデルデプロイ・推論
- SageMaker リアルタイムエンドポイント（Auto Scaling、コールドスタート禁止）
- SageMaker サーバーレス推論（間欠的トラフィック、コスト最適化）
- SageMaker 非同期推論（大ペイロード、長時間処理）
- SageMaker バッチ変換（定期バッチ、コスト最適化）
- SageMaker Inference Recommender（インスタンスタイプ推奨）
- SageMaker Model Registry（モデルバージョン管理、承認ワークフロー）
- AWS CloudFormation（SageMakerリソースの IaC 宣言）

### MLOps・モニタリング
- Amazon SageMaker Pipelines（MLワークフロー自動化、DAG可視化）
- SageMaker Model Monitor（データ品質・モデルドリフト検出、アラート設定）
- Amazon EventBridge（S3イベント → SageMaker Pipeline 自動起動）
- AWS Step Functions（複数ステップの複雑なMLワークフロー）

### セキュリティ・アクセス制御
- VPCエンドポイント（SageMaker / S3 / Bedrock へのプライベートアクセス）
- IAMロール集中管理（ノートブックインスタンスへの権限付与の一元化）
- SageMaker Studio の署名付きURL悪用対策
- S3 データの暗号化（SSE-KMS、KMSキーポリシー）
- Amazon Redshift Dynamic Data Masking（PII匿名化、ソースデータ変更なし）

### 生成AI・基盤モデル
- Amazon Bedrock（RAG、ガードレール、VPCからのプライベートアクセス）
- Amazon Q Business（競合他社名のブロック、カスタムガードレール）
- Knowledge Base for Amazon Bedrock（社内文書のRAG構築）

### 分析・可視化
- Amazon QuickSight 異常検出（Severity・Direction パラメータの挙動）
- Amazon Athena（S3上のCSVへのクエリ、パーティション活用）
- Amazon EMR（大規模バッチ処理、インスタンス購入オプション: Spot/On-Demand/Reserved）

---

## 【選択肢に含める「誤り」パターン（ひっかけ）】

以下のひっかけを各問題の誤り選択肢に組み込むこと。

- **過剰設計**: 要件を満たすが運用オーバーヘッドが高い（例: Lambda + カスタムコード vs EventBridge直結）
- **サービス誤用**: 機能的に近いが要件を満たさないサービス（例: Kinesis Data Analytics の代わりに Lambda ポーリング）
- **コスト非効率**: 機能は正しいが高コスト（例: リアルタイムエンドポイント vs サーバーレス推論）
- **制約違反**: 要件の一部を満たさない（例: オフラインストアのみ参照 → リアルタイム推論に不可）
- **手順の誤り**: 正しいサービスだが操作順序・設定が間違い

---

## 【問題に含める「要件の言い回し」（バリエーションを使うこと）】

- 最小限の運用オーバーヘッドで
- 最もコスト効率よく
- 最小限の実装作業で
- 最小限の開発工数で
- 最小限の運用労力で
- これらの要件を満たすには、どのステップの組み合わせが適切ですか（N つ選択）

---

## 【出力形式の例】

## 問題1

ある企業がAmazon SageMakerを使用して不正検出モデルをトレーニングしています。
トレーニングデータには正常取引99%・不正取引1%のクラス不均衡があります。
企業は不正取引をできるだけ見逃さないことを最優先としています。
このモデルの性能を評価するために最適なメトリクスはどれですか。

A. 精度（Accuracy）
B. 適合率（Precision）
C. 再現率（Recall）
D. 特異度（Specificity）

### 正解
**C. 再現率（Recall）**

不正取引の見逃し（偽陰性）を最小化することが目的のため、Recallが最適。
Accuracyはクラス不均衡時に多数派クラスに引きずられ偽の高値を示す。
Precisionは偽陽性を最小化するメトリクスであり、今回の目的と合わない。
Specificityは正常取引の正しい識別率であり不正検出の優先指標ではない。

---

上記の形式で10問作成してください。
各問題は異なるトピックから出題し、難易度は本番試験（MLA-C01）相当にすること。
```

---

## 使い方のヒント

- **トピックを絞りたい場合**: プロンプト末尾に「セキュリティとVPCに関する問題のみ5問作成してください」のように追記する。
- **難易度を上げたい場合**: 「2つのAWSサービスを組み合わせる構成問題を多めに含めてください」と追記する。
- **間違えやすい問題を追加したい場合**: `til/Udemy_practice.md` の問題番号を引用して「問題31のようなクラス不均衡×データソース統合の複合問題をさらに3問追加してください」と指示する。
