$(document).ready(function() {

    var url = 'http://127.0.0.1:8080/find/';

    var displayBooks = function(bookArr) {
        $('#results').html('');
        var code = '<div class=\'book-display\'>';
        var tmp;
        bookArr.forEach(function(element) {
            tmp = '';

            if (!element.img) {
                tmp = code + '<span class=\'empty-thumb\' id=\'' + element.id + '\'><i class=\'fa fa-book\'></i></span>';
            } else {
                tmp = code + '<img class=\'thumb\' id=\'' + element.id + '\' src=\'' + element.img + '\' alt=\'' + element.title + ' cover\'>';
            }

            tmp += '<b>' + element.title + '</b><br>';
            tmp += element.author + '<br>';
            tmp += 'Published: ' + element.date + '<br><br>';

            if (element.description.length > 200) {
                var d = element.description.slice(0,190);
                d += '...';
            } else {
                var d = element.description;
            }

            tmp += d;
            tmp += '</div>';

            $('#results').append(tmp);
        });
    };

    $('#getbook').click(function(){

        var search = $('#bookinfo').val();
        search = search.replace(/ /g,'+');
        search = search.match(/[\w\+]/g);
        search = search.join('');

        $.getJSON(url,{'q': encodeURI(search)},function(result) {
            var books = [];
            var obj = JSON.parse(result);
            console.log(JSON.stringify(obj.items));

            if (obj.items.length > 0) {
                obj.items.forEach(function(element) {
                    books.push({
                        "id": element.id,
                        "title": element.volumeInfo.title || 'n/a',
                        "author": (element.volumeInfo.authors) ? element.volumeInfo.authors.join(', ') : 'n/a',
                        "publisher": element.volumeInfo.publisher || 'n/a',
                        "date": element.volumeInfo.publishedDate || 'n/a',
                        "description": element.volumeInfo.description || '',
                        "img": (element.volumeInfo.imageLinks) ? element.volumeInfo.imageLinks.thumbnail : undefined,
                        "lang": element.volumeInfo.language || 'n/a'
                    });
                });
            }
            console.log(books.length);
            displayBooks(books);
        });

    });

});
