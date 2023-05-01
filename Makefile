deploy:
	@anchor-indexer deploy aurory-aoe

create:
	@anchor-indexer create aurory-aoe mainnet

remove:
	@anchor-indexer remove aurory-aoe

codegen:
	@anchor-indexer codegen

build:
	@$(MAKE) codegen
	@anchor-indexer build

.PHONY: deploy create remove codegen build