.PHONY: prod dev down logs clean build-all deploy quick-deploy restart help

GREEN  := $(shell tput -Txterm setaf 2 2>/dev/null || echo "")
YELLOW := $(shell tput -Txterm setaf 3 2>/dev/null || echo "")
RESET  := $(shell tput -Txterm sgr0 2>/dev/null || echo "")

help:
	@echo '${GREEN}Tiny RTC Chat - Docker Management${RESET}'
	@echo 'Usage: make <target>'
	@echo ''
	@echo 'Production:'
	@echo '  prod         - Start production environment'
	@echo '  deploy       - Pull, rebuild and restart (full deploy)'
	@echo '  quick-deploy - Pull and restart (no rebuild)'
	@echo '  restart      - Restart production containers'
	@echo ''
	@echo 'Development:'
	@echo '  dev          - Start development environment'
	@echo ''
	@echo 'Utility:'
	@echo '  down         - Stop all services'
	@echo '  logs         - Follow container logs'
	@echo '  clean        - Stop and remove volumes'
	@echo '  build-all    - Build all containers'

prod:
	@echo "${GREEN}Starting production environment...${RESET}"
	docker compose up -d nginx-proxy frontend-prod backend-prod
	@echo "${GREEN}Production started!${RESET}"

dev:
	@echo "${GREEN}Starting development environment...${RESET}"
	docker compose up frontend-dev backend-dev

down:
	@echo "${YELLOW}Stopping all services...${RESET}"
	docker compose down

logs:
	docker compose logs -f

clean:
	@echo "${YELLOW}Cleaning up...${RESET}"
	docker compose down -v
	docker system prune -f
	@echo "${GREEN}Cleanup done!${RESET}"

build-all:
	@echo "${GREEN}Building all containers...${RESET}"
	docker compose build --no-cache

deploy:
	@echo "${GREEN}=== Full Deploy ===${RESET}"
	@echo "${YELLOW}Pulling latest changes...${RESET}"
	cd .. && git pull
	@echo "${YELLOW}Building containers...${RESET}"
	$(MAKE) build-all
	@echo "${YELLOW}Restarting services...${RESET}"
	$(MAKE) down
	$(MAKE) prod
	@echo "${GREEN}=== Deploy complete! ===${RESET}"

quick-deploy:
	@echo "${GREEN}=== Quick Deploy ===${RESET}"
	@echo "${YELLOW}Pulling latest changes...${RESET}"
	cd .. && git pull
	@echo "${YELLOW}Restarting services...${RESET}"
	$(MAKE) down
	$(MAKE) prod
	@echo "${GREEN}=== Quick deploy complete! ===${RESET}"

restart:
	@echo "${YELLOW}Restarting production...${RESET}"
	docker compose restart nginx-proxy frontend-prod backend-prod
	@echo "${GREEN}Restarted!${RESET}"
