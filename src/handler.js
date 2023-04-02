const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const { name, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const bookId = nanoid(16);
    const year = new Date().getTime.year;
    const insertedAt = new Date().toISOString;
    const updatedAt = insertedAt;

    const failInsertName = name.length < 1;
    const isSuccess = bookId.length > 0;
    const failPageCount = readPage > pageCount;
    
    if(failInsertName){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        });
        
        response.code(400);
        return response;
    }
    
    if(failPageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });
        
        response.code(400);
        return response;
    }
    
    if(isSuccess){
        if(pageCount === readPage){
            const finished = true;
            const newBook = {
                name, author, summary, publisher, pageCount, readPage, reading, bookId, year, insertedAt, updatedAt, finished,
            };
        
            books.push(newBook);
        } else {
            const finished = false;
            const newBook = {
                name, author, summary, publisher, pageCount, readPage, reading, bookId, year, insertedAt, updatedAt, finished,
            };
        
            books.push(newBook);
        }
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId : bookId
            }
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllBookHandler = () => ({
    status: 'success',
    data: {
        // id : books[0].bookId,
        // name : books[0].name,
        // publisher : books[0].publisher,
        books,
    },
});

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((n) => n.bookId === bookId)[0];

    if(book !== undefined){
        const response = h.response({
            status : 'success',
            data: {
                book
            },
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    });
    response.code(404);
    return response;

};

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
    const updatedAt = new Date().toISOString;

    const index = books.findIndex((book) => book.bookId === bookId);
    const failNameEmpty = name.length < 1;

    if (index !== -1 ){
        if(failNameEmpty){
            const response = h.response({
                status : 'fail',
                message : 'Gagal memperbaruai buku. Mohon isi nama buku'
            });
            response.code(400);
            return response;
        }

        if (pageCount < readPage){
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
            });
            response.code(400);
            return response;
        }

        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt
        };

        const response = h.response({
            status : 'success',
            message : 'Buku berhasil diperbaharui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((book) => book.bookId === bookId);

    if (index !== -1 ){
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = { addBookHandler, getAllBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };