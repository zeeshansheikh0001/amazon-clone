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

## Getting Started

### Prerequisites
- Node.js and npm
- MySQL

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd e-commerce
   ```

2. Set up the backend:
   ```
   cd backend
   npm install
   ```

3. Configure database:
   - Create a MySQL database
   - Update the database configuration in `backend/config/db.config.js`

4. Run the backend:
   ```
   npm run dev
   ```

5. Set up the frontend:
   ```
   cd ../frontend
   npm install
   ```

6. Run the frontend:
   ```
   npm start
   ```

7. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

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