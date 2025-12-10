.PHONY: prod dev down logs clean build-all ssl-setup deploy help

GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
RESET  := $(shell tput -Txterm sgr0)

help:
	@echo '${GREEN}Tiny RTC Chat - Docker Management${RESET}'
	@echo ''
	@echo 'Usage:'
	@echo '  ${YELLOW}make${RESET} ${GREEN}<target>${RESET}'
	@echo ''
	@echo 'Targets:'
	@echo '  ${GREEN}prod${RESET}        Start production environment (with nginx proxy)'
	@echo '  ${GREEN}dev${RESET}         Start development environment'
	@echo '  ${GREEN}down${RESET}        Stop all containers'
	@echo '  ${GREEN}logs${RESET}        View logs'
	@echo '  ${GREEN}clean${RESET}       Stop and remove all containers, volumes, networks'
	@echo '  ${GREEN}build-all${RESET}   Build all containers'
	@echo '  ${GREEN}ssl-setup${RESET}   Generate self-signed SSL certificates'
	@echo '  ${GREEN}deploy${RESET}      Full deployment process'
	@echo '  ${GREEN}help${RESET}        Show this help'

prod:
	@echo "${GREEN}Starting production environment...${RESET}"
	docker-compose up -d nginx-proxy frontend-prod backend-prod
	@echo "${GREEN}Production environment started!${RESET}"
	@echo "Frontend: http://localhost:80"
	@echo "Backend API: http://localhost:80/api/health"

dev:
	@echo "${GREEN}Starting development environment...${RESET}"
	docker-compose up frontend-dev backend-dev

down:
	@echo "${YELLOW}Stopping all services...${RESET}"
	docker-compose down

logs:
	docker-compose logs -f

clean:
	@echo "${YELLOW}Cleaning up...${RESET}"
	docker-compose down -v
	docker system prune -f
	@echo "${GREEN}Cleanup completed!${RESET}"

build-all:
	@echo "${GREEN}Building all containers...${RESET}"
	docker-compose build

ssl-setup:
	@echo "${GREEN}Generating self-signed SSL certificates...${RESET}"
	mkdir -p ssl
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout ssl/gloeend.space.key \
		-out ssl/gloeend.space.crt \
		-subj "/C=RU/ST=Moscow/L=Moscow/O=TinyRTC/CN=gloeend.space"
	@echo "${GREEN}SSL certificates generated in ssl/ directory${RESET}"

deploy:
	@echo "${GREEN}Deploying Tiny RTC Chat...${RESET}"
	@echo "${YELLOW}1. Stopping existing containers...${RESET}"
	docker-compose down
	@echo "${YELLOW}2. Building new containers...${RESET}"
	docker-compose build
	@echo "${YELLOW}3. Starting production environment...${RESET}"
	docker-compose up -d
	@echo "${GREEN}Deployment complete!${RESET}"
	@echo "Frontend: http://localhost:80"
	@echo "Backend API: http://localhost:80/api/health"