## Blog

Simple Blog created with Nodejs, Express & MongoDB.

### Demo : [Blog](https://mountain-screeching-tea.glitch.me/)

### Quick Start

To get this project up and running locally on your computer:

1. Clone this repository

   ```bash
   git clone git@github.com:Mvlprem/blog.git
   ```

2. Install the required packages in the root of your clone of this repo

   ```bash
   npm install
   ```

3. Run the server, using the below command

   ```bash
   npm run devstart
   ```

4. Open a browser to <http://localhost:3000/> to open the blog site.

> **Note:** The library uses a MongoDB database hosted on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). You should use a different database for your own code.

```js
// .env
SECRET = 'your_secret_for_session'
MONGODB_URI = 'insert_your_database_url_here'
```
