# Portfolio: Node Backend

This repo is being developed in chunks of spare time. All the code is manually written using documentation, with only a few instances of Copilot Code Completion because I didn’t disable it before starting. However, **nothing was built using vibe coding or prompt requests**, aiming to create a true representation of my manual work and knowledge.

# Technologies in use

 - Stack: Typescript, Node, Express, Cors, Joi.
 - Documentation: swagger-jsdoc, swagger-ui-express.
 - Database: MongoDb - Faker-js.
 - Testing: Jest, Supertest.
 - Virtualization: Docker.

# How to Run it: docker-compose.yml
1. Make sure Docker Desktop is installed.
2. Have Docker open and running.
3. Use your terminal to navigate to your repo’s folder.
4. excute command: `git clone https://github.com/Monedita/portfolioBackend.git`.
5. go inside of created folder: `cd portfolioBackend`.
6. excute command: `docker compose up -d`.
7. In your browser, navigate to: `http://localhost:3000/api-docs`.
8. When finished, in the terminal execute the command: `docker compose down`.
