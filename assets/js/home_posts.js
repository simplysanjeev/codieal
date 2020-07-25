{
    // method for noty notification
    let notyNotification = function(type, message){
        new Noty({
            theme: 'relax',
            text: message,
            type: type,
            layout: 'topRight',
            timeout: 1500
        }).show(); 
    }
    //method to create a post
    let createPost = function(){
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function(event){
            event.preventDefault();
            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    $('#post-textarea').val('');
                    let newPost = newPostDOM(data.data.post);
                    $('#posts-list-container > ul').prepend(newPost);
                    notyNotification('success', data.message);
                    deletePost($(' .delete-post-button', newPost));
                    createComment($(' .add-comment-button', newPost));
                },
                error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }

    // method to create comment
    let createComment = function(addCommentButton){
        addCommentButton.click(function(event){
            event.preventDefault();
            // console.log("Well We are here to add Comment To Your Awesome Post");
            let commentForm = addCommentButton.parent();
            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: commentForm.serialize(),
                success: function(data){
                    commentForm.find("input[type=text]").val('');
                    let commetListContainer = commentForm.parent();
                    let newComment = newCommentDOM(data.data.comment);
                    $(' .post-comments-list > ul', commetListContainer).prepend(newComment);
                    notyNotification('success', data.message);
                    deleteComment($(' .delete-comment-button', newComment));
                },
                error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }
    // method to delete comment
    let deleteComment = function(deleteLink){
        $(deleteLink).click(function(event){
            event.preventDefault();
            // console.log('Well Do You Really Want to delete This Comment');
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();
                    notyNotification('success', data.message);
                },
                error: function(error){
                    console.log(error.responseText);
                }
            });
        })
    }

    // mthod to add comment in DOM
    let newCommentDOM = function(comment){
        // console.log(comment);
        return $(`<li id="comment-${ comment._id }">
                    <p>
                        <small>
                            <a href="/comments/destroy/${ comment._id }" class="delete-comment-button">X</a>
                        </small>
                        ${ comment.content }
                        <br>
                        <small>
                            ${ comment.user_name }
                        </small>
                    </p>
                 </li>`);
    }

    // method to create a post in DOM
    let newPostDOM = function(post){
        return $(`<li id="post-${post._id}">
        <p>
            <small>
                <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
            </small>
            ${ post.content }
            <small>
            ${ post.user_name }
            </small>
        </p>
        <div class="post-comments">
                <form action="/comments/create" method="POST">
                    <input type="text" name="content" placeholder="Type Here to add comment..." required>
                    <input type="hidden" name="post" value="${ post._id }">
                    <input type="submit" value="Add Comment" class="add-comment-button">
                </form>
            <div class="post-comments-list">
                <ul id="post-comments-${ post._id }">
                </ul>
            </div>
        </div>                    
    </li>`);
    }

    //method to delete post
    let deletePost = function(deleteLink){
        // console.log('delete post called');
        $(deleteLink).click(function(event){
            event.preventDefault();
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    notyNotification('success', data.message);
                },
                error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }
    
    
    let intialize = function(){
        createPost();
        let deletePostButtonList = $('.delete-post-button');
        let addCommentButtonList = $('.add-comment-button');
        let deleteCommentButtonList = $('.delete-comment-button');
        for(deletePostButton of deletePostButtonList){
            deletePost($(deletePostButton));
        }
        for(addCommentButton of addCommentButtonList){
            createComment($(addCommentButton));
        }
        for(deleteCommentButton of deleteCommentButtonList){
            deleteComment($(deleteCommentButton));
        }
    }

    intialize();
}