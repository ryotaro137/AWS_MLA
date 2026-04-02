# MLA-C01 副業AWS案件 需要スキル領域

MLA-C01 (Machine Learning Engineer - Associate) は、機械学習モデルの開発、データエンジニアリング、デプロイや保守にフォーカスした内容です。副業のAWS案件においても、これらの「MLOps」や「データパイプライン」「生成AI活用」の文脈での需要が急速に高まっています。以下に需要の高い主要なスキル領域と、現場での実務ポイントをまとめます。

## 1. MLOps / MLパイプライン構築
- **需要度**: ★★★★★
- **主要サービス**: Amazon SageMaker (エンドポイント、Model Monitor), AWS CodePipeline, AWS Lambda
- **案件例**:
  - オンプレミスやローカルで検証済みの推論コードをSageMakerエンドポイント化してAPI化する案件。
  - Jupyter Notebookでの実験環境から、CodePipeline等を用いたCI/CDパイプラインへと移行し、モデルの継続的デプロイを実現する案件。
- **実務のポイント**: 「モデル推論」のサービングだけでなく、監視(Model Monitor)と再学習のアラート設計まで含められると単価が大幅に上がる。

## 2. 生成AI活用 (RAG / プロンプトエンジニアリング)
- **需要度**: ★★★★★
- **主要サービス**: Amazon Bedrock, Knowledge Bases for Amazon Bedrock, Amazon OpenSearch Service, AWS Lambda
- **案件例**:
  - 社内ドキュメントを検索・要約するRAG (Retrieval-Augmented Generation) システムのPOC/本番構築。
  - 既存のチャットボットシステムにBedrockを用いた高度な応答機能を追加する案件。
- **実務のポイント**: LLMをそのまま使うだけでなく、セキュアに社内データと連携させるためのアーキテクチャ設計（VPC/IAM等との組み合わせ）が求められる。

## 3. データ基盤・データパイプライン
- **需要度**: ★★★★☆
- **主要サービス**: Amazon S3, AWS Glue, Amazon Kinesis, Amazon Athena
- **案件例**:
  - Kinesis等を用いたリアルタイムデータストリーミングによるログ収集基盤の構築。
  - S3上の非構造化データをAWS Glueで変換(ETL)・カタログ化し、AthenaやQuickSightで可視化できるように整備する案件。
- **実務のポイント**: 「コスト」と「スケーラビリティ」のトレードオフへの理解が必須。Glueジョブの最適化（パーテイショニングやParquet形式への変換など）による課金削減は顧客満足に直結する。

## 4. バッチ推論・イベント駆動イベント処理
- **需要度**: ★★★★☆
- **主要サービス**: Amazon EventBridge, AWS Step Functions, AWS Batch, Amazon ECS/EKS
- **案件例**:
  - 定期的にS3にアップロードされる大量の画像を、EventBridgeトリガーのECS/Batchジョブで推論（予測）し、結果をDynamoDBに保存する日次パイプラインの構築。
  - 複雑なデータ処理ワークフローをStep Functionsでオーケストレーションする案件。
- **実務のポイント**: 単一のLambdaで処理しきれない時間やリソースの制約に対し、AWS BatchやStep Functions(分散マップなど)を適材適所で設計することが重要。

## 5. セキュリティとインフラ管理
- **需要度**: ★★★☆☆
- **主要サービス**: AWS IAM, Amazon VPC, Amazon CloudWatch, AWS KMS
- **案件例**:
  - 既存のS3データレイクやSageMakerリソースに対して、最小権限のIAMポリシーやKMSによる暗号化を徹底する監査・修正案件。
  - モデルの学習データを安全に隔離するためのセキュアなVPC設計（VPC Endpoint、PrivateLink等）。
- **実務のポイント**: 機械学習案件では「データそのものの機密性」が高いため、MLタスク単体よりもIAM/KMS/VPCといった基礎的なセキュリティ知識が意外と高く評価される。
