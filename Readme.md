# Subgraph Setup

This guide provides step-by-step instructions on how to create and deploy the subgraph using the Anchor Indexer. This subgrpah indexes the [Aurory Expeditions program](https://github.com/Aurory-Game/aurorians-on-expedition) deployed at [EXpwP3pqPzA4arF8i89w7smtvxHzyYETmCpPspLPrR7J](https://solscan.io/account/EXpwP3pqPzA4arF8i89w7smtvxHzyYETmCpPspLPrR7J).

## Prerequisites

Before you begin, ensure that you have installed [Anchor Indexer CLI](https://docs.anchor-indexer.com/en/developing/setup-cli/) on your system.

## Steps

1. **Create the Subgraph**

    Run the following command in your terminal to create a new subgraph:

    ```bash
    anchor-indexer create [my-subgraph-name]
    ```

    Replace `[my-subgraph-name]` with the name of your subgraph.

2. **Deploy the Subgraph**

    Once you have successfully created the subgraph, deploy it using the following command:

    ```bash
    anchor-indexer deploy [my-subgraph-name] mainnet
    ```

    Replace `[my-subgraph-name]` with the name of your subgraph.

3. **Access the Subgraph**

    You can now access your subgraph at:

    ```
    https://www.anchor-indexer.com/subgraphs/[my-github-handle]/[my-subgraph-name]?pending=true
    ```

    Replace `[my-github-handle]` with your GitHub username and `[my-subgraph-name]` with the name of your subgraph.

## Support

If you encounter any issues during the setup process, please refer to the [official Anchor Indexer CLI documentation](https://docs.anchor-indexer.com/en/developing/setup-cli/) or submit an issue on this GitHub repository or reach out on [Discord](https://discord.gg/ujxjsznD).


## License

MIT