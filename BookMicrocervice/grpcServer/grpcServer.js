import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { create, getAll, getOne, remove, update, checkAvailability, changeStatus } from '../controllers/bookController.js';


const PROTO_PATH = path.resolve('book.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const bookProto = grpc.loadPackageDefinition(packageDefinition).book;

const BookService = {
    CreateBook: async (call, callback) => {
        const req = { body: call.request };
        const res = {
            json: (data) => callback(null, {
                id: data._id,
                title: data.title,
                author: data.author,
                description: data.description,
                price: data.price,
                owner: data.owner,
                state: data.state,
                category: data.category,
            }),
            status: () => ({ json: (data) => callback({ code: grpc.status.INTERNAL, message: data.message }) })
        };
        await create(req, res);
    },

    GetBook: async (call, callback) => {
        const req = { params: { id: call.request.id } };
        const res = {
            json: (data) => callback(null, { ...data }),
            status: () => ({ json: (data) => callback({ code: grpc.status.NOT_FOUND, message: data.message }) })
        };
        await getOne(req, res);
    },

    GetAllBooks: async (_, callback) => {
        const req = {};
        const res = {
            json: (data) => callback(null, { books: data }),
            status: () => ({ json: (data) => callback({ code: grpc.status.INTERNAL, message: data.message }) })
        };
        await getAll(req, res);
    },

    UpdateBook: async (call, callback) => {
        const req = { params: { id: call.request.id }, body: call.request };
        const res = {
            json: (data) => callback(null, { success: data.success, message: 'Book updated successfully' }),
            status: () => ({ json: (data) => callback({ code: grpc.status.NOT_FOUND, message: data.message }) })
        };
        await update(req, res);
    },

    DeleteBook: async (call, callback) => {
        const req = { params: { id: call.request.id } };
        const res = {
            json: () => callback(null, { success: true, message: 'Book deleted successfully' }),
            status: () => ({ json: (data) => callback({ code: grpc.status.NOT_FOUND, message: data.message }) })
        };
        await remove(req, res);
    },

    CheckAvailability: async (call, callback) => {
        const req = { params: { id: call.request.id } };
        const res = {
            json: (data) => callback(null, { isAvailable: data.state === 'available', message: data.message }),
            status: () => ({ json: (data) => callback({ code: grpc.status.NOT_FOUND, message: data.message }) })
        };
        await checkAvailability(req, res);
    },

    ChangeStatus: async (call, callback) => {
        const req = { params: { id: call.request.id } };
        const res = {
            json: () => callback(null, { success: true, message: 'Status changed successfully' }),
            status: () => ({ json: (data) => callback({ code: grpc.status.NOT_FOUND, message: data.message }) })
        };
        await changeStatus(req, res);
    },
};

export const grpcServer = () => {
    const server = new grpc.Server();
    server.addService(bookProto.BookService.service, BookService);
    server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), () => {
        console.log('gRPC server running at http://127.0.0.1:50051');
        server.start();
    });
}

