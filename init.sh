#!/bin/bash

#docker-composer up -d 

docker-compose up -d mysql 
docker-compose up -d zabbix-server
docker-compose up -d zabbix-agent
docker-compose up -d zabbix-frontend
docker-compose up nodejs-app

ansible-playbook updateZabbixHost.yaml

# Ferramenta de testes de stress
sudo apt-get install apache2-utils -y
ab -n 100 -c 5  -k 'http://localhost:8080/report'