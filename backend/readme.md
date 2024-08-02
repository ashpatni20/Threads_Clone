# Threads Backend Clone ---------

## All user Routes -> /api/v1/users
userRoutes.post("/signup");
userRoutes.post("/login");
userRoutes.post("/update");
userRoutes.get("/logout");
userRoutes.get("/getProfile");

## All posts Routes -> /api/v1/posts
postRoutes.get("/allPosts");
postRoutes.post("/removePost");
postRoutes.post("/likePost");
postRoutes.post("/unlikePost");
postRoutes.post("/commentPost");

http://localhost:8080/api/v1/users/

How follow and un-follow working  
user 1 -> follower 0 following 1  
user 2 -> follower 1 following 0  

follow -> user 1 logged in and follow user 2  

### ROUTES ->

/signup -> Public route -> basic need  
{  
"userName": "John Doe",  
"email": "john.doe@example.com",  
"password": "12345678"  
}  <br/>  

/login -> Public route -> basic need 
{    
"email": "john.doe@example.com",  
"password": "12345678"  
}  
<b>If the user login successfully it get JWT which get as a response save in the header and then go inside</b>
<br/>  
/update -> req.body data what to be updated  
<br/> 
logout -> If the user is login and verified the it get logout  
<br/> 
/createpost -> {  
    type 1 -> Title and description <b>Needed</b>  
    type 2 -> All upper with a image  
}   
<br/> 
/profilePosts -> req.query.id ie ~ profilePosts?id=someId -> This give the user all posts used for profile view stuff  
<br>
allPosts -> http://localhost:8080/api/v1/users/allPosts?page=2&limit=3  <br> 
Give all posts till now with pagination and limit  

removePost -> Delete post from DB, Cloudinary, User Post[]
