# E-Commerce Web Application

A full-stack e-commerce web application built with React, Node.js, Express, and MySQL.

## Features

### User Features:
- User registration and authentication (JWT)
- Browse and search products
- Product categories and filters
- Product details view
- Shopping cart functionality
- Checkout process
- Order history
- User profile management

### Admin Features:
- Product management (add, update, delete)
- Order management
- User management

## Tech Stack

### Frontend:
- React.js
- React Router for navigation
- Redux Toolkit for state management
- Axios for API requests
- CSS for styling

### Backend:
- Node.js
- Express.js
- MySQL database
- Sequelize ORM
- JWT for authentication
- Bcrypt for password hashing

## Project Structure

```
e-commerce/
├── backend/               # Node.js backend
│   ├── config/            # Database and app configuration
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Custom middleware
│   ├── models/            # Sequelize models
│   ├── routes/            # API routes
│   └── server.js          # Entry point
│
├── frontend/              # React frontend
│   ├── public/            # Static files
│   └── src/
│       ├── assets/        # Images, CSS, etc.
│       ├── components/    # Reusable components
│       ├── pages/         # Page components
│       ├── redux/         # Redux state management
│       ├── services/      # API service calls
│       └── App.js         # Main app component
```

## Database Schema

- **Users**: Stores user information (id, name, email, password, etc.)
- **Products**: Stores product details (id, name, price, description, stock, image URL)
- **Orders**: Stores order information (order_id, user_id, order_status, order_date)
- **OrderItems**: Links products to orders (order_item_id, order_id, product_id, quantity, price)
- **Cart**: Manages user's shopping cart (user_id, product_id, quantity)

# Comprehensive Setup Guide for Beginners

This guide provides detailed steps to set up both the backend and frontend components of the E-Commerce application.

## Prerequisites

Before starting, ensure you have the following installed:

1. **Node.js and npm** (v14+ recommended)
   - Download and install from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node -v` and `npm -v`

2. **MySQL** (v8+ recommended)
   - Download and install from [mysql.com](https://dev.mysql.com/downloads/)
   - Remember your root password during installation
   - Alternatively, use MySQL Workbench for GUI management

3. **Git** (optional but recommended)
   - Download and install from [git-scm.com](https://git-scm.com/downloads)

4. **Code Editor**
   - Visual Studio Code recommended: [code.visualstudio.com](https://code.visualstudio.com/)

## Backend Setup

### Step 1: Clone the Repository (if not done already)

```bash
git clone <repository-url>
cd e-commerce
```

If you don't have Git, download the ZIP file from the repository and extract it.

### Step 2: Create MySQL Database

1. Open MySQL command line or MySQL Workbench
2. Login with your credentials:
   ```sql
   mysql -u root -p
   ```
3. Create a new database:
   ```sql
   CREATE DATABASE ecommerce_db;
   ```
4. Verify the database was created:
   ```sql
   SHOW DATABASES;
   ```

### Step 3: Configure Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend root:
   ```
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=yourpassword
   DB_NAME=ecommerce_db

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=30d
   ```
   
   Replace `yourpassword` with your MySQL password and create a strong `JWT_SECRET`.

4. Modify database configuration if needed:
   - Open `backend/config/db.config.js`
   - Update with your database details

### Step 4: Initialize the Database

1. Set up database tables:
   ```bash
   npm run db:setup
   ```
   
   If this command isn't available, you can manually run:
   ```bash
   npx sequelize-cli db:migrate
   ```

2. (Optional) Seed the database with sample data:
   ```bash
   npm run db:seed
   ```
   
   Or manually:
   ```bash
   npx sequelize-cli db:seed:all
   ```

### Step 5: Start the Backend Server

```bash
npm run dev
```

This will start the backend server, typically at http://localhost:5000.

Verify it's working by visiting http://localhost:5000/api/health or similar endpoint in your browser.

## Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
cd ../frontend
```

### Step 2: Install Frontend Dependencies

```bash
npm install
```

This might take a few minutes as it installs all the required packages.

### Step 3: Configure Frontend

1. Create a `.env` file in the frontend root:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

2. If you're using a different port for the backend, update it in the `.env` file.

### Step 4: Start the Frontend Development Server

```bash
npm start
```

This will start the React development server, typically at http://localhost:3000.

Your browser should automatically open the application. If not, visit http://localhost:3000 manually.

## Testing the Application

1. **Register a new user**:
   - Visit the registration page
   - Fill in the required information
   - Submit the form to create a new account

2. **Browse products**:
   - Navigate to the products page
   - Filter by categories
   - Search for specific products

3. **Add items to cart**:
   - View a product
   - Set quantity
   - Add to cart

4. **Complete checkout**:
   - Go to cart
   - Proceed to checkout
   - Enter shipping information
   - Enter payment details (simulated)
   - Place order

## Troubleshooting Common Issues

### Backend Issues

1. **Database Connection Errors**:
   - Verify MySQL is running
   - Check database credentials in `.env`
   - Ensure the database exists
   
2. **Port Already In Use**:
   - Change the port in `.env` file
   - Check if another application is using port 5000

3. **Missing Dependencies**:
   - Run `npm install` again
   - Check for error messages during installation

### Frontend Issues

1. **API Connection Errors**:
   - Ensure backend is running
   - Check API URL in frontend `.env` file
   - Look for CORS errors in browser console

2. **Rendering Issues**:
   - Clear browser cache
   - Check browser console for JavaScript errors
   - Try a different browser

3. **Build Errors**:
   - Update Node.js to a newer version
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## Deployment Tips (For Production)

### Backend Deployment

1. **Set production environment**:
   ```
   NODE_ENV=production
   ```

2. **Secure your API**:
   - Use HTTPS
   - Implement rate limiting
   - Set secure headers

3. **Database considerations**:
   - Use a production database service
   - Set up regular backups
   - Use connection pooling

### Frontend Deployment

1. **Build the production version**:
   ```bash
   npm run build
   ```

2. **Host the static files**:
   - Use services like Netlify, Vercel, or AWS S3
   - Set up proper cache headers
   - Configure your DNS correctly

## Additional Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express Documentation](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Sequelize Documentation](https://sequelize.org/)

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/:id` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/user` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (admin)
- `GET /api/orders` - Get all orders (admin)

## License

This project is for educational purposes. 