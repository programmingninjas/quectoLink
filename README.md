# QuectoLink - Scalable and Distributed URL Shortener Service
![quectoLink](https://github.com/user-attachments/assets/6b400836-9274-4cb9-b219-07b34358b8bb)
QuectoLink is a scalable and distributed URL shortener service that allows users to shorten long URLs into more manageable and shareable links. The name "Quecto" is derived from the term for the smallest unit in the metric system, reflecting the service's ability to efficiently shorten URLs.

## Features

- Shorten long URLs into concise and manageable links.
- Scalable architecture to handle large volumes of URL shortening requests.
- Distributed system for high availability and fault tolerance.
- Utilizes MERN stack (MongoDB, Express.js, React.js, Node.js) for web application development.
- Integration with Redis for caching and performance optimization.
- Utilizes ZooKeeper for distributed coordination and consensus.
- Nginx used for load balancing to distribute incoming traffic across multiple servers.
- **Kubernetes integration** for scaling and managing the containerized application in a production environment.
- Containerized with Docker for easy deployment and scalability.
- Implemented GitHub Actions for automatic deployment to virtual machines upon code changes, ensuring continuous integration and delivery.

## Technologies Used

- **MERN Stack:** MongoDB, Express.js, React.js, Node.js - for web application development.
- **Redis:** In-memory data structure store used for caching frequently accessed data.
- **ZooKeeper:** Distributed coordination service for maintaining configuration information, naming, and providing distributed synchronization.
- **Nginx:** High-performance web server and reverse proxy for load balancing.
- **Kubernetes:** Used for managing and scaling containerized services in production environments.
- **Docker:** Containerization platform for packaging the application and its dependencies into standardized units for deployment.
- **GitHub Actions:** Automated workflow tool integrated with GitHub repository for continuous integration and deployment, ensuring seamless deployment to virtual machines upon code changes.

## Getting Started

To quickly set up and run QuectoLink, you can use Docker Compose to start all necessary services in containers.

### Prerequisites

- Docker and Docker Compose installed on your machine.
- Kubernetes cluster for production deployment (optional).

### Local Setup (Using Docker Compose)

1. Clone this repository:

    ```bash
    git clone https://github.com/programmingninjas/quectolink.git
    ```

2. Navigate to the project directory:

    ```bash
    cd quectolink
    ```

3. Update the `Environment Variables` in docker compose file:

   ```bash
    environment:
      - MONGO_URI=mongodb://mongo:27017/your_db_name
      - PORT=5000
      - JWT_SECRET=your_jwt_secret
   ```

5. Build Docker images and start containers for all services:

    ```bash
    docker compose up --build
    ```

6. Access the application by visiting `http://localhost:3000` in your web browser.

### Kubernetes Deployment (Optional)

For a production-level deployment, you can deploy the containerized services to a Kubernetes cluster. The cluster will manage scaling, fault tolerance, and high availability.

## References

1. [System Design for URL Shortening](https://systemdesign.one/url-shortening-system-design)
2. [How URL Shorteners Work](https://youtu.be/JQDHz72OA3c?si=flg2FZ2JtMkwP6TW)
