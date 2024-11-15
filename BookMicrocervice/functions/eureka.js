import {Eureka} from "eureka-js-client";

export const eureka = () => {
    const client = new Eureka({
        instance: {
            instanceId: `book-microservice:${Math.random().toString(36).substr(2, 16)}`,
            app: 'BOOK-MICROCERVICE',
            hostName: 'book-microservice',
            ipAddr: 'book-microservice',
            port: {
                '$': 3000,
                '@enabled': 'true',
            },
            vipAddress: 'BOOK-MICROCERVICE',
            homePageUrl: 'http://localhost:3000/books',
            statusPageUrl: 'http://localhost:3000/books/status',
            // getAllBooks: 'http://localhost:3000/books',
            getOneBook: 'http://book-microservice:3000/books/element/:id',
            availability: 'http://book-microservice:3000/books/checkAvailability/:id',
            changeStatus: 'http://book-microservice:3000/books/changeStatus/:id',
            dataCenterInfo: {
                '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
                name: 'MyOwn',
            },
        },
        eureka: {
            host: 'eureka-server',
            port: 8008,
            servicePath: '/eureka/apps/'
        }

    });

    client.start(error => {
        console.log('Eureka client started with error:', error);
    });
}