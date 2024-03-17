// [{
//     id: string | number,
//     title: string,
//     author: string,
//     year: number,
//     isComplete: boolean,
// }];

const bookShelf = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'bookShelf-app';

function generateId(){
    return +new Date();
}

function generateBookObject(){
    return{
        id,
        title,
        author,
        year,
        isComplete
    }
}

function findBook(bookId){
    for(const bookItem of bookShelf){
        if(bookItem.id === bookId){
            return bookItem;
        }
    }
    return null;
}

function findIndexBook(bookId){
    for(const index in bookShelf){
        if(bookShelf[index].id === bookId){
            return index;
        }
    }
    return -1;
}

function isStorageExist(){
    if(typeof(Storage) == undefined){
        alert('Sepertinya Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData(){
    if(isStorageExist()){
        const parsed = JSON.stringify(bookShelf);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage(){
    const lookUpData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(lookUpData);

    if(data !== null){
        for(const book of data){
            bookShelf.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeNewListBook(){
    const {id, title, author, year, isComplete} = bookObject;

    const bookTitle = document.createElement('h2');
    bookTitle.innerText = title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = author;

    const bookYear = document.createElement('p');
    bookYear.innerText = year;

    const elementContainer = document.createElement('div');
    elementContainer.classList.add('inner');
    elementContainer.append(bookTitle, bookAuthor, bookYear);

    const container = document.createElement('div');
    container.classList.add('item');
    container.append(elementContainer);
    container.setAttribute('id', `book-${id}`);

    if(isComplete){
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');
        undoButton.addEventListener('click', function(){
            undoBookFromComplete();
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
        trashButton.addEventListener('click', function(){
            deleteBookFromBookShelf();
        });
    }
    else{
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');
        checkButton.addEventListener('click', function(){
            addBooktoComplete();
        });
        container.append(checkButton);
    }
    return container;
}

function addBook(){
    const titleOfBook = document.getElementById('inputBookTitle').value;
    const authorOfBook = document.getElementById('inputBookAuthor').value;
    const yearOfBook = document.getElementById('inputBookYear').value;

    const getID = generateId();
    const completedBook = document.getElementById('inputBookIsComplete').checked;
    if(completedBook){
        const objectBook = generateBookObject(getID, titleOfBook, authorOfBook, yearOfBook, true);
        bookShelf.push(objectBook);
    }else {
        const objectBook = generateBookObject(getID, titleOfBook, authorOfBook, yearOfBook, false);
        bookShelf.push(objectBook);
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addBooktoComplete(bookId){
    const bookTarget = findBook(bookId);
    
    if(bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function deleteBookFromBookShelf(bookId){
    const bookTarget = findIndexBook(bookId);

    if(bookTarget === -1) return;

    bookShelf.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromComplete(bookId){
    const bookTarget = findBook(bookId);

    if(bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('inputBook');

    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addBook();
    });

    if(isStorageExist()){
        loadDataFromStorage();
    }
});

document.addEventListener(SAVED_EVENT, () => {
    console.log('buku berhasil disimpan');
});

document.addEventListener(RENDER_EVENT, () => {
    const unCompletedList = document.getElementById('unCompleteBookShelfList');
    const completeList = document.getElementById('completeBookShelfList');

    unCompletedList.innerHTML='';
    completeList.innerHTML='';

    for(const bookItem of bookShelf){
        const bookElement = makeNewListBook(bookItem);
        if(bookItem.isComplete){
            completeList.append(bookElement);
        }else {
            unCompletedList.append(bookElement);
        }
    }
});