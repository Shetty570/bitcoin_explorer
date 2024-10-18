#!/bin/sh

# Use envsubst to substitute environment variables in the bitcoin.conf template
envsubst < /etc/bitcoin/bitcoin.conf.template > /etc/bitcoin/bitcoin.conf

# Start Bitcoin Core with the generated configuration file and updated datadir
exec bitcoind -conf=/etc/bitcoin/bitcoin.conf -datadir=/bitcoin/data
