const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const { name, author, summary, publisher, pageCount, readPage, reading, year } = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date();
    const updatedAt = insertedAt;

    const isSuccess = id.length > 0;
    const failPageCount = readPage > pageCount;

    if(name === undefined){
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
                id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
            };
        
            books.push(newBook);
        } else {
            const finished = false;
            const newBook = {
                id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
            };
        
            books.push(newBook);
        }
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId : id
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

const getAllBooksHandler = (request, h) => ({
    status: 'success',
    data: {
      books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
       })),
    },
  });

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((n) => n.id === bookId)[0];

    if(book !== undefined){
        // const response = h.response({
        //     status : 'success',
        //     data: {
        //         book : books.map((book) => ({
        //             id: book.id,
        //             name: book.name,
        //             year: book.year,
        //             author: book.author,
        //             summary: book.summary,
        //             publisher: book.publisher,
        //             pageCount: book.pageCount,
        //             readPage: book.readPage,
        //             finished: book.finished,
        //             reading: book.reading,
        //             insertedAt: book.insertedAt,
        //             updatedAt: book.updatedAt
        //          })),
        //       },
        // });

        const response = h.response({
            status: 'success',
            data: {
                book : {
                    id: book.id,
                    name: book.name,
                    year: book.year,
                    author: book.author,
                    summary: book.summary,
                    publisher: book.publisher,
                    pageCount: book.pageCount,
                    readPage: book.readPage,
                    finished: book.finished,
                    reading: book.reading,
                    insertedAt: book.insertedAt,
                    updatedAt: book.updatedAt
                }
            }
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
    const updatedAt = new Date();

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1 ){
        if(name === undefined){
            const response = h.response({
                status : 'fail',
                message : 'Gagal memperbarui buku. Mohon isi nama buku'
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
            message : 'Buku berhasil diperbarui',
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
    const index = books.findIndex((book) => book.id === bookId);
    const book = books.filter((n) => n.id === bookId)[0];

    // if (index !== -1 ){
        
    // }

    if(book === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    } else {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }
};

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };