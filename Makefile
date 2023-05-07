deploy:
	@anchor-indexer deploy aurory-expeditions

create:
	@anchor-indexer create aurory-expeditions mainnet

remove:
	@anchor-indexer remove aurory-expeditions

codegen:
	@anchor-indexer codegen

build:
	@$(MAKE) codegen
	@anchor-indexer build

.PHONY: deploy create remove codegen build