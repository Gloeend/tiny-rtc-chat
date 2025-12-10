.PHONY: prod dev down logs clean build-all ssl-setup deploy help

GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
RESET  := $(shell tput -Txterm sgr0)

help:
	@echo '${GREEN}Tiny RTC Chat - Docker Management${RESET}'
	@echo 'Usage: make <target>'
	@echo 'Targets: prod, dev, down, logs, clean, build-all, ssl-setup, deploy'

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
	docker compose build

ssl-setup:
	@echo "${GREEN}Generating self-signed SSL...${RESET}"
	mkdir -p ../ssl
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout ../ssl/gloeend.space.key \
		-out ../ssl/gloeend.space.crt \
		-subj "/C=RU/ST=Moscow/L=Moscow/O=TinyRTC/CN=gloeend.space"
	@echo "${GREEN}SSL ready in ssl/ directory${RESET}"
