import {Eureka} from "eureka-js-client";

export const eureka = () => {
    const client = new Eureka({
        instance: {
            instanceId: `books:${Math.random().toString(36).substr(2, 16)}`,
            app: 'books',
            hostName: 'localhost',
            ipAddr: '127.0.0.1',
            port: {
                '$': 3000,
                '@enabled': 'true',
            },
            vipAddress: 'books',
            homePageUrl: 'http://localhost:3000/',
            statusPageUrl: 'http://localhost:3000/status',
            getAllBooks: 'http://localhost:3000/books',
            // getOneBook: 'http://localhost:3000/books/:id',
            availability: 'http://localhost:3000/books/checkAvailability/:id',
            changeStatus: 'http://localhost:3000/books/changeStatus/:id',
            dataCenterInfo: {
                '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
                name: 'MyOwn',
            },
        },
        eureka: {
            host: 'localhost',
            port: 8008,
            servicePath: '/eureka/apps/'
        }

    });

    client.start(error => {
        console.log('Eureka client started with error:', error);
    });
}