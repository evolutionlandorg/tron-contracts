# tron-contracts
Evolution Land contracts on TRON network

# Local provate testnet
https://github.com/tronprotocol/docker-tron-quickstart

For docker mirror config:

https://www.jianshu.com/p/9fce6e583669

After install docker:

```
docker pull trontools/quickstart:1.2.5
```

```
MacBookPro:gitlab.com denny$ docker run -it   -p 9090:9090 -p 8090:8090 -p 8091:8091 -p 8092:8092 --rm --name tron   trontools/quickstart:1.2.5
```

deployed contracts on shasta testnet:

script/auto_generated_address_shasta.json.js


copy contract deploy log to contract_log_shasta.txt and use

```
node script/generate_address_shasta.js
```

to generete the above config