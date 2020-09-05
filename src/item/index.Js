const $ = {
    OF: {
        BOOK: (props) => {
            const { title, weight, isbn, pages, author, publisher, releaseDate } = props;
            return (obj) => ({...obj, ...props })
        },
        POLE: (props) => {

        }
    }
}