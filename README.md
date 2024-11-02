# Book-Share
This will be a platform where users will rent different books from each other.

## How to run new app?

docker-compose -f docker-compose.yml up --build  This command run docker-compose.yml file that dockerize gateway, service-discovery and my 2 microcervices with their DB.

## New Diagram:

![diagram](https://github.com/user-attachments/assets/3213bdcc-9957-4cba-90b6-15749572b7af)

## My new technologies

In my project, I’ll implement a robust microservices architecture that ensures high availability, reliability, and efficient data management. To maintain Service High Availability, I’ll use load balancers and failover strategies, along with a Circuit Breaker to prevent overloading and quickly detect failing services. For caching, Consistent Hashing will ensure balanced data distribution, and Cache High Availability will provide redundancy so data access remains fast and uninterrupted. To handle complex, distributed processes, I’ll rely on Two-Phase Commits for transactional consistency and Long-Running Saga Transactions for complex workflows. Database Replication with Failover will add redundancy, allowing the system to switch seamlessly to a backup in case of database issues. I’ll use the ELK Stack (Elasticsearch, Logstash, and Kibana) for centralized logging and analysis, making it easy to detect performance bottlenecks or errors. Finally, a Data Warehouse will store historical data, enabling detailed analysis for insights and decision-making. Together, these technologies create a resilient, scalable infrastructure capable of supporting high-performance applications.

## Why Microservice Architecture is a good fit for my Book-Share Platform?

1. **Complexity and Modularity**: Microservices allow you to break down the application into smaller, independent services that can be developed, deployed, and maintained separately. For example, you can have microservices for user authentication, book listings, payments, reviews, and recommendation systems.

2. **Scalability**: Support many users at once. Microservices allow each part of your app (e.g., the search engine or recommendation system) to be scaled independently based on demand, without affecting other services.

3. **Easier Maintenance and Updates**: With microservices, updates can be deployed to individual services without requiring a full system-wide deployment, reducing downtime and minimizing the risk of introducing bugs into the entire system.

4. **Fault Isolation**: Microservices help with fault isolation. If one part of the app fails (e.g., the payment gateway), the rest of the system remains operational. This increases the overall resilience of your app.

## Real-World Examples of Microservices Usage

1. **Netflix**:
    - Netflix uses microservices to handle different aspects of streaming, recommendations, user preferences, and billing. Your app could similarly modularize different processes, such as tracking available books, handling payments, and matching users with potential rentals.

2. **Etsy**:
    - Etsy uses microservices to update features (such as product listings and seller tools) without affecting other areas of the platform.

## Service Boundaries:

![image](https://github.com/user-attachments/assets/4422b1fc-4c1f-420e-b6f4-be2ccfa1b6d2)


- User Microservice:

  Works with users actions like Sign in and Sign up. Manage user roles and preferences.


- Book Microservice:

  Works with all information about books (Creating, Updating, Deleting and Showing).

## Technology Stack and Communication Patterns:
* Programing and Frameworks: Java, Node.js, Express, Spring Boot, Eureka
* Database Management: Postgresql, Intellij Idea
* Security: JWT, Hash function
* Containerization: Docker Compose
* Cache: Redis
* Testing : JUnit
* Other: Postman
- **For Asynchronous Programming: WebSockets**
- **For Synchronous Programming: REST and gRPC**

## Design Data Management:
#### User Entity
```json
{
  "id": 1,
  "nickname": "andyly",
  "password": "password",
  "email": "test@gmail.com",
  "type": "userType"
}
```

#### Book Entity
```json
{
  "id": 1,
  "title": "Title",
  "description": "Description",
  "author": "Author",
  "owner": "OwnerID",
  "price": 99.99,
  "category": ["Fantasy", "Drama"]
}
```

# API Endpoints
## User Management Microservice Endpoints

- `POST /api/users/register`: Register a new user.  
  Request
```json
{
  "nickname": "andyly",
  "password": "password",
  "email": "test@gmail.com",
  "type": "userType"
}
```
Response
```json
{
 "token": "token"
}
```

- `POST /api/users/login`: Authenticate a user.  
  Request
```json
{
  "email": "test@gmail.com",
  "password": "password"
}
```
Response
```json
{
 "token": "token"
}
```

## Books Microservice Endpoints
- `GET /api/books`: Get all books.  

Response
```json
[
  {
    "id": 1,
    "title": "Title",
    "description": "Description",
    "author": "Author",
    "owner": "OwnerID",
    "price": 99.99,
    "category": ["Fantasy", "Drama"]
  }
]
```
- `GET /api/books/{id}`: Get one book with this id.  

Response
```json
  {
    "id": 1,
    "title": "Title",
    "description": "Description",
    "author": "Author",
    "owner": "OwnerID",
    "price": 99.99,
    "category": ["Fantasy", "Drama"]
  }
```
- `POST /api/books`: Create a new book entity.  
  Request
```json
{
  "id": 1,
  "title": "Title",
  "description": "Description",
  "author": "Author",
  "owner": "OwnerID",
  "price": 99.99,
  "category": ["Fantasy", "Drama"]
}
```
Response
```json
{
 "status": 200
}
```
- `PUT /api/books/{id}`: Update book that have this id.  
  Request
```json
{
  "id": 1,
  "title": "Title",
  "description": "Description",
  "author": "Author",
  "owner": "OwnerID",
  "price": 99.99,
  "category": ["Fantasy", "Drama"]
}
```
Response
```json
{
 "status": 200
}
```

- `DELETE /api/books/{id}`: Delete book that have this id  

Response
```json
{
  "status": 200
}
```

- `GET /api/books/user/{userId}`: Get all books posted by a specific user

Response
```json
[
  {
    "id": 1,
    "title": "Title",
    "description": "Description",
    "author": "Author",
    "owner": "OwnerID",
    "price": 99.99,
    "category": ["Fantasy", "Drama"]
  }
]
```

- ```GET api/books/{category}```

  Response:
```json
[
  {
    "id": 1,
    "title": "Title",
    "description": "Description",
    "author": "Author",
    "owner": "OwnerID",
    "price": 99.99,
    "category": ["Fantasy", "Drama"]
  }
]
```

- ```Websocket api/books/{categoryId}```

  Response:
```json
{
"notification": "Message"
}
```


## Deployment and Scaling:
Fot this step I choose Docker. Docker helps developers build, share, run, and verify applications anywhere — without tedious environment configuration or management. Deployment and scaling are important because they make sure an app is available and works well for users. Deployment gets the app up and running, while scaling makes sure it can handle more users as it grows, keeping everything fast and reliable. Docker Compose is a tool for defining and running multi-container Docker applications. It allows you to manage multiple Docker containers as a single application by using a YAML file to define the services, networks, and volumes your app will need. With a single command (docker-compose up), Docker Compose can build images, create and start containers, and configure the networking between them.
