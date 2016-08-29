
var isLoading = false;

$('body').on('mousewheel', function(){

    var windowHeight = window.innerHeight;
    var scrollTop = $('body').scrollTop();
    var maxOffset = $('body').height()-windowHeight;

    console.log('Max offset: ',maxOffset);
    console.log('Current scroll: ',scrollTop);

    if(scrollTop >= maxOffset && !isLoading){

        pageNum++;

        $.get('/api/posts?page='+pageNum, function(res){

            console.log(res);
            isLoading = false;
            $('.load-indicator').fadeOut();

            renderPosts(res);

        });

        isLoading = true;
        $('.load-indicator').hide().fadeIn();

    }

});

function renderPosts(posts){

    $.each(posts, function(i, post){

        var $postContainer = $('<div>', {class:'post-container'});
        var $postTitle = $('<h1>', {class:'post-title', text:post.title + '/'+post.id});
        var $postContent = $('<div>', {class:'post-content', text:post.body});
        var $postLink = $('<a>', {href:'/article/'+post.id, text:'Read more...'});
        var $hr = $('<hr/>');

        $postContainer.append($postTitle, $postContent, $postLink, $hr);

        $('.posts-container').append($postContainer);

    });

}












