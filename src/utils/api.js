const api = (() => {
  const BASE_URL = "https://public-api.delcom.org/api/v1";
  async function _fetchWithAuth(url, options = {}) {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
  }
  function putAccessToken(token) {
    localStorage.setItem("accessToken", token);
  }
  function getAccessToken() {
    return localStorage.getItem("accessToken");
  }
  // API Auth => https://public-api.delcom.org/docs/1.0/api-auth
  async function postAuthRegister({ name, email, password }) {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const responseJson = await response.json();
    const { success, message } = responseJson;
    if (success !== true) {
      throw new Error(message);
    }
    return message;
  }
  async function postAuthLogin({ email, password }) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const responseJson = await response.json();
    const { success, message } = responseJson;
    if (success !== true) {
      throw new Error(message);
    }
    const {
      data: { token },
    } = responseJson;
    return token;
  }
  // API Users => https://public-api.delcom.org/docs/1.0/api-users
  async function getMe() {
    const response = await _fetchWithAuth(`${BASE_URL}/users/me`);
    const responseJson = await response.json();
    const { success, message } = responseJson;
    if (success !== true) {
      throw new Error(message);
    }
    const {
      data: { user },
    } = responseJson;
    return user;
  }
  async function postChangePhotoProfile({ photoFile }) {
    const formData = new FormData();
    formData.append("photo", photoFile);
    const response = await _fetchWithAuth(`${BASE_URL}/users/photo`, {
      method: "POST",
      body: formData,
    });
    const responseJson = await response.json();
    const { success, message } = responseJson;
    if (success !== true) {
      throw new Error(message);
    }
    return message;
  }
  // API Todos => https://public-api.delcom.org/docs/1.0/api-todos
  // Add Post
  async function postAddPost({ coverFile, description }) {
    const formData = new FormData();
    formData.append("cover", coverFile);
    formData.append("description", description);

    const response = await _fetchWithAuth(`${BASE_URL}/posts`, {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: formData,
    });
    const responseJson = await response.json();
    const { success, message } = responseJson;
    if (success !== true) {
      throw new Error(message);
    }
    return responseJson.data.post_id;
  }

  // Change Cover Post
  async function postChangeCoverPost({ id, coverFile }) {
    const formData = new FormData();
    formData.append("cover", coverFile);

    const response = await _fetchWithAuth(`${BASE_URL}/posts/${id}/cover`, {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: formData,
    });
    const responseJson = await response.json();
    const { success, message } = responseJson;
    if (success !== true) {
      throw new Error(message);
    }
    return message;
  }

  // Update Post
  async function putUpdatePost({ id, description }) {
    const response = await _fetchWithAuth(`${BASE_URL}/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ description }),
    });
    const responseJson = await response.json();
    const { success, message } = responseJson;
    if (success !== true) {
      throw new Error(message);
    }
    return message;
  }

  // All Posts
  async function getAllPosts(isMe = 1) {
    const response = await _fetchWithAuth(`${BASE_URL}/posts?is_me=${isMe}`);
    const responseJson = await response.json();
    const { success, message } = responseJson;
    if (success !== true) {
      throw new Error(message);
    }
    return responseJson.data.posts;
  }

  // Detail Post
  async function getDetailPost(id) {
    const response = await _fetchWithAuth(`${BASE_URL}/posts/${id}`);
    const responseJson = await response.json();
    const { success, message } = responseJson;
    if (success !== true) {
      throw new Error(message);
    }
    return responseJson.data.post;
  }

  // Delete Post
  async function deletePost(id) {
    const response = await _fetchWithAuth(`${BASE_URL}/posts/${id}`, {
      method: "DELETE",
    });
    const responseJson = await response.json();
    const { success, message } = responseJson;
    if (success !== true) {
      throw new Error(message);
    }
    return message;
  }

  // Add Like
  async function postAddLike({ id, like }) {
    const response = await _fetchWithAuth(`${BASE_URL}/posts/${id}/likes`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ like }),
    });
    const responseJson = await response.json();
    const { success, message } = responseJson;
    if (success !== true) {
      throw new Error(message);
    }
    return message;
  }

  // Add Comment
  async function postAddComment({ id, comment }) {
    const response = await _fetchWithAuth(`${BASE_URL}/posts/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ comment }),
    });
    const responseJson = await response.json();
    const { success, message } = responseJson;
    if (success !== true) {
      throw new Error(message);
    }
    return message;
  }

  // Delete Comment
  async function deleteComment({ id }) {
    const response = await _fetchWithAuth(`${BASE_URL}/posts/${id}/comments`, {
      method: "DELETE",
    });
    const responseJson = await response.json();
    const { success, message } = responseJson;
    if (success !== true) {
      throw new Error(message);
    }
    return message;
  }

  return {
    putAccessToken,
    getAccessToken,
    postAddPost,
    postChangeCoverPost,
    putUpdatePost,
    getAllPosts,
    getDetailPost,
    deletePost,
    postAddLike,
    postAddComment,
    deleteComment,
  };
})();

export default api;
