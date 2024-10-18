# Use the official Bitcoin Core image from Docker Hub
FROM ruimarinho/bitcoin-core:latest

# Install envsubst by installing the gettext-base package
RUN apt-get update && apt-get install -y gettext-base && rm -rf /var/lib/apt/lists/*

# Create necessary directories
RUN mkdir -p /etc/bitcoin
RUN mkdir -p /bitcoin/data

# Copy the bitcoin.conf template
COPY bitcoin.conf.template /etc/bitcoin/bitcoin.conf.template

# Copy the entrypoint script
COPY entrypoint.sh /entrypoint.sh

# Make the entrypoint script executable
RUN chmod +x /entrypoint.sh

# Expose the necessary ports for Bitcoin Core (RPC, P2P)
EXPOSE 8332 8333

# Use the entrypoint script to start Bitcoin Core
ENTRYPOINT ["/entrypoint.sh"]
