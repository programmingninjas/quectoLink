# QuectoLink - Scalable and Distributed URL Shortener Service

QuectoLink is a scalable and distributed URL shortener service that allows users to shorten long URLs into more manageable and shareable links. The name "Quecto" is derived from the term for the smallest unit in metric system, reflecting the service's ability to efficiently shorten URLs.

## Features

- Shorten long URLs into concise and manageable links.
- Scalable architecture to handle large volumes of URL shortening requests.
- Distributed system for high availability and fault tolerance.
- Utilizes MERN stack (MongoDB, Express.js, React.js, Node.js) for web application development.
- Integration with Redis for caching and performance optimization.
- Utilizes ZooKeeper for distributed coordination and consensus.
- Nginx used for load balancing to distribute incoming traffic across multiple servers.
- Containerized with Docker for easy deployment and scalability.

## Technologies Used

- **MERN Stack:** MongoDB, Express.js, React.js, Node.js - for web application development.
- **Redis:** In-memory data structure store used for caching frequently accessed data.
- **ZooKeeper:** Distributed coordination service for maintaining configuration information, naming, and providing distributed synchronization.
- **Nginx:** High-performance web server and reverse proxy for load balancing.
- **Docker:** Containerization platform for packaging the application and its dependencies into standardized units for deployment.

## Getting Started

To quickly set up and run QuectoLink, you can use Docker Compose to start all necessary services in containers.

1. Clone this repository:

```bash
git clone https://github.com/programmingninjas/quectolink.git
```


2. Navigate to the project directory:

```bash
cd quectolink
```
3. Build Docker images and start containers for all services:
```bash
docker-compose up --build
```
4. Access the application by visiting `http://localhost:3000` in your web browser.

This approach streamlines the setup process by utilizing Docker Compose to handle the dependencies and configurations required to run QuectoLink.
