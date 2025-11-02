import api from 'api/api';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const CommentForm = ({ session, id, product }) => {
  useEffect(() => {
    const credentials = localStorage.getItem('userData');
    if (credentials) {
      try {
        const parsedCredentials = JSON.parse(credentials);
        setUserId(parsedCredentials.id);
        setUserName(parsedCredentials?.name);
      } catch (error) {
        console.log(error);
      }
    } else {
    }
  }, []);

  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCommentSent, setIsCommentSent] = useState(false);
  const [replies, setReplies] = useState({});
  // console.log('replies', replies);
  const handleCommentSubmit = (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const body = {
        comment,

        id,
        product,
        userId,
        userName,
      };
      console.log(body);
      api.post('/comment', body);
      getAllComments();
      // Send the comment to the server

      setTimeout(() => {
        setLoading(false);
        setIsCommentSent(true);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllComments = async () => {
    try {
      const response = await api.get(`/comment/${id}`);
      const { comments } = response.data;

      setComments(comments);

      // Flatten responses from each comment
      const allReplies = comments.reduce((acc, comment) => {
        if (comment.responses) {
          return acc.concat(comment.responses);
        }
        return acc;
      }, []);

      setReplies(allReplies);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    getAllComments();
  }, []);

  const commentfilter = () => {
    // Filter comments based on the condition
    return comments.filter((comment) => {
      // Show comments where active is true or userId matches comment.userId
      return comment.published || userId === comment.userId;
    });
  };

  //console.log('comments', commentfilter());
  return (
    <div
      dir="rtl"
      className=" rounded-lg w-full mx-4 my-4 p-4  text-center border">
      <form onSubmit={handleCommentSubmit}>
        <textarea
          //disabled
          className="w-full h-40 rounded-md border border-gray-300 w-full "
          rows="4"
          cols="50"
          placeholder="سوال خود را بپرسید"
          value={comment}
          onChange={(e) => setComment(e.target.value)}></textarea>

        <br />

        <span className="text-green-500 mx-4 my-5"></span>
      </form>

      {commentfilter().length > 0 ? (
        commentfilter().map((filteredComment, index) => (
          <div key={index} className="mx-8">
            <article
              className={`p-6 mb-3 text-base  border-t border-gray-200 dark:border-gray-700 dark:bg-gray-900 ${
                filteredComment.published
                  ? 'bg-white'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}>
              <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold mx-2">
                    {filteredComment.userName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <time
                      pubdate
                      dateTime="2022-03-12"
                      title="March 12th, 2022">
                      {new Intl.DateTimeFormat('fa-IR', {
                        dateStyle: 'full',
                      }).format(new Date(filteredComment.date))}
                    </time>
                  </p>
                  {!filteredComment.published && (
                    <p className="inline-flex items-center mr-3 text-sm text-gray-400 dark:text-white font-semibold mx-2">
                      نظر شما در انتظار تایید است
                    </p>
                  )}
                </div>
              </footer>
              <p className="text-gray-500 dark:text-gray-400">
                {filteredComment.comment}
              </p>

              {/* Display replies */}
              {filteredComment.responses &&
                filteredComment.responses.map((reply, replyIndex) => (
                  <div
                    key={replyIndex}
                    className="mx-8 mt-3 rounded rounded-lg">
                    <article
                      className={`p-6 mb-3 text-base  border-t border-gray-200 dark:border-gray-700 dark:bg-gray-900 ${
                        reply.published
                          ? 'bg-white'
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}>
                      <footer className="flex justify-between items-center mb-2">
                        <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold mx-2">
                          {reply.adminName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <time
                            pubdate
                            dateTime="2022-03-12"
                            title="March 12th, 2022">
                            {new Intl.DateTimeFormat('fa-IR', {
                              dateStyle: 'full',
                            }).format(new Date(reply.date))}
                          </time>
                        </p>
                      </footer>
                      <p className="text-gray-500 dark:text-gray-400">
                        {reply.response}
                      </p>
                      {reply.published ? (
                        <div className="published-comment-ui">
                          {/* Additional elements for published replies */}
                        </div>
                      ) : (
                        <div className="unpublished-comment-ui">
                          {/* Additional elements for unpublished replies */}
                        </div>
                      )}
                    </article>
                  </div>
                ))}
            </article>
          </div>
        ))
      ) : (
        <p>هیچ سوالی ثبت نشده است</p>
      )}
    </div>
  );
};

export default CommentForm;
