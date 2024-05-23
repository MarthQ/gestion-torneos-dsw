```docker
docker run
--name oki-dsw
-v [docker-volumes_directory HERE!]
-e MYSQL_ROOT_HOST='%'
-e MYSQL_ALLOW_EMPTY_PASSWORD="yes"
-e MYSQL_PASSWORD="dsw"
-e MYSQL_USER="dsw"
-e MYSQL_DATABASE='okiDSW'
-p 3306:3306
-d percona/percona-server
```
