# Threada Clone App API Documentation

**Base URL:** `https://threadsclone-enfs.onrender.com`

## User Routes

### Signup
- **URL:** `/signup`
- **Method:** `POST`
- **Description:** Registers a new user.
- **Request Body:** `{ "username": "string", "email": "string", "password": "string" }`
- **Response:** `{ "message": "User registered successfully", "user": { "id": "string", "username": "string", "email": "string" } }`

### Login
- **URL:** `/login`
- **Method:** `POST`
- **Description:** Logs in an existing user.
- **Request Body:** `{ "email": "string", "password": "string" }`
- **Response:** `{ "message": "User logged in successfully", "token": "string" }`

### Logout
- **URL:** `/logout`
- **Method:** `GET`
- **Description:** Logs out the current user.
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ "message": "User logged out successfully" }`

### Update User
- **URL:** `/update`
- **Method:** `POST`
- **Description:** Updates user profile information.
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:** Form-data with `avatar` file and other user fields.
- **Response:** `{ "message": "User updated successfully", "user": { "id": "string", "username": "string", "email": "string", "avatar": "string" } }`

### Get Profile
- **URL:** `/getProfile`
- **Method:** `GET`
- **Description:** Fetches the profile information of the current user.
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ "user": { "id": "string", "username": "string", "email": "string", "avatar": "string" } }`

### Follow User
- **URL:** `/follow`
- **Method:** `GET`
- **Description:** Follows another user.
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ "message": "User followed successfully" }`

### Unfollow User
- **URL:** `/unFollow`
- **Method:** `GET`
- **Description:** Unfollows another user.
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ "message": "User unfollowed successfully" }`

## Post Routes

### Create Post
- **URL:** `/createPost`
- **Method:** `POST`
- **Description:** Creates a new post.
- **Request Body:** Form-data with `avatar` file and other post fields.
- **Response:** `{ "message": "Post created successfully", "post": { "id": "string", "content": "string", "avatar": "string", "createdAt": "string" } }`

### Get All Posts
- **URL:** `/allPosts`
- **Method:** `GET`
- **Description:** Retrieves all posts.
- **Response:** `{ "posts": [{ "id": "string", "content": "string", "avatar": "string", "createdAt": "string" }, ...] }`

### Remove Post
- **URL:** `/removePost`
- **Method:** `POST`
- **Description:** Removes a post.
- **Request Body:** `{ "postId": "string" }`
- **Response:** `{ "message": "Post removed successfully" }`

### Like Post
- **URL:** `/likePost`
- **Method:** `POST`
- **Description:** Likes a post.
- **Request Body:** `{ "postId": "string" }`
- **Response:** `{ "message": "Post liked successfully" }`

### Unlike Post
- **URL:** `/unlikePost`
- **Method:** `POST`
- **Description:** Unlikes a post.
- **Request Body:** `{ "postId": "string" }`
- **Response:** `{ "message": "Post unliked successfully" }`

### Comment Post
- **URL:** `/commentPost`
- **Method:** `POST`
- **Description:** Adds a comment to a post.
- **Request Body:** `{ "postId": "string", "comment": "string" }`
- **Response:** `{ "message": "Comment added successfully", "comment": { "id": "string", "postId": "string", "comment": "string", "createdAt": "string" } }`

## Middleware

### Auth Middleware
- **Description:** Middleware to protect routes that require authentication.
- **Usage:** Add `authMiddleware` to any route that requires user authentication.
  
### Upload File Middleware
- **Description:** Middleware to handle file uploads.
- **Usage:** Use `upload.single('avatar')` to handle single file uploads.