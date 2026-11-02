.PHONY: help install up down dev build start migration-generate migration-run migration-revert seed reset-db test

help:
	@echo "make install             - npm install"
	@echo "make up                  - Postgresをdocker composeで起動"
	@echo "make down                - Postgresコンテナを停止"
	@echo "make dev                 - 開発サーバー起動(ホットリロード)"
	@echo "make build               - ビルド"
	@echo "make start               - ビルド済みアプリを起動"
	@echo "make migration-generate name=XxxYyy - エンティティの差分からマイグレーション生成"
	@echo "make migration-run       - 未適用のマイグレーションを実行"
	@echo "make migration-revert    - 直前のマイグレーションを取り消す"
	@echo "make seed                - テストデータを投入"
	@echo "make reset-db            - DBを初期化し直してmigration-run + seedまで実行"
	@echo "make test                - テスト実行"

install:
	npm install

up:
	docker compose up -d

down:
	docker compose down

dev: up
	npm run start:dev

build:
	npm run build

start: build
	npm run start:prod

migration-generate:
	npm run migration:generate -- src/migrations/$(name)

migration-run:
	npm run migration:run

migration-revert:
	npm run migration:revert

seed:
	npm run seed

reset-db: down
	docker compose down -v
	$(MAKE) up
	sleep 3
	$(MAKE) migration-run
	$(MAKE) seed

test:
	npm run test
