# Backup Guide for Hyperledger Fabric Network 

This guide provides step-by-step instructions to back up your Hyperledger Fabric network, ensuring you can restore it in case of failures or data loss.

## Prerequisites

- **Access to All Components**: Ensure you have administrative access to all nodes and components in your Fabric network.
- **Sufficient Storage**: Verify that you have adequate storage space to store the backup files.
- **Downtime Planning**: Plan for network downtime during the backup process to maintain data consistency.

## Components to Back Up

1. **Channel Artifacts**: Configuration files and genesis block.
2. **Ledger Data**: Blockchain data stored on each peer.
3. **Certificates and MSP (Membership Service Provider) Materials**: Cryptographic materials for identity management.
4. **State Database**: World state database (e.g., CouchDB or LevelDB).
5. **Orderer Data**: Data related to the ordering service.

## Backup Steps

```
mkdir backup
cd backup
```

### 1. Channel Artifacts

- **Location**: Typically stored in the `channel-artifacts/` directory.
- **Files to Back Up**:
  - `genesis.block`: The genesis block of the channel.
  - Channel configuration transaction files (e.g., `mychannel.tx`).

**Backup Command**:
```bash
 sudo cp -aR ~/<Your-Project-Location>/channel-artifacts/ .
 sudo cp -aR ~/<Your-Project-Location>/system-genesis-block/ .
 sudo cp -aR ~/<Your-Project-Location>/organizations/  .
```

### 2. Ledger Data
```
mkdir orderer peer0.org1 peer0.org2

docker cp peer0.org1.example.com:/var/hyperledger/production/ peer0.org1/
docker cp peer0.org2.example.com:/var/hyperledger/production/ peer0.org2/
docker cp orderer.example.com:/var/hyperledger/production/orderer/ .

```

Suppose you want to copy your backup file from a remote host to your localhost. You may face issues as some files have secure root access.

```
sudo find . -type f -exec chmod 644 {} \;
sudo find . -type d -exec chmod 755 {} \;
```

**Backup Command**:
```
scp -i ../<FILE>.pem -r ubuntu@<ipAddress>:<location>/backup/ .
```

```
chmod 774 organizations/ccp-* organizations/fabric-ca/registerEnroll.sh organizations/cryptogen/*
```

## Restoration Steps

To restore your Hyperledger Fabric network from backups:

1. **Stop All Network Components**: Ensure all peers, orderers, and related services are halted.
2. **Restore Files**: Copy the backup files to their original locations on each node.
3. **Start the Network**: Restart all components in the correct order (e.g., CAs, orderers, peers).

**Restoration Command Example**:

Copy your backup content to your hyperledger fabric network directory.

```bash
cd <network-location>/
sudo cp -Ra <backup location>/backup/* .
```

**For orderer volumes replace**
```
orderer.example.com:/var/hyperledger/production/orderer
```
with

```
../orderer/:/var/hyperledger/production/orderer
```

**For peer1 volumes replace**
```
peer0.org1.example.com:/var/hyperledger/production
```
with
```
.../peer0.org1/:/var/hyperledger
```



Of course, if you have more than one peer, you will bind volumes for all peers. In my case, I have two peers

**For peer2 replace**
```
peer0.org2.example.com:/var/hyperledger/production
```
with
```
.../peer0.org2/:/var/hyperledger
```


**Now you are ready to start the fabric network.**
```
./network.sh up -ca -s couchdb
```


link:- https://medium.com/coinmonks/how-to-take-a-backup-for-your-hyperledger-fabric-network-d42f1a4eb6d0
