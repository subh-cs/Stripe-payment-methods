# Stripe Payment Method API
This is a Node.js + Express application that provides a set of RESTful APIs for managing a user's payment methods using the Stripe payment platform. The app is built with TypeScript, and uses Prisma as an ORM and Postgres as the database.

## Dependencies
- "@prisma/client": "^4.9.0"
- "@types/express": "^4.17.17"
- "@types/node": "^18.11.19"
- "bcrypt": "^5.1.0"
- "dotenv": "^16.0.3"
- "express": "^4.18.2"
- "jsonwebtoken": "^9.0.0"
- "nodemon": "^2.0.20"
- "prisma": "^4.9.0"
- "stripe": "^11.9.1"
- "ts-node": "^10.9.1"
- "typescript": "^4.9.5"

## API Routes
| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | / | Dummy response |
| POST | /register | Register a new user |
| POST | /login | Login a user |
| POST | /add-payment-method | Add a new payment method for a user (requires authentication) |
| GET | /get-payment-method | Get the payment method for a user (requires authentication) |
| PATCH | /update-payment-method | Update the payment method for a user (requires authentication) |
| DELETE | /delete-payment-method | Delete the payment method for a user (requires authentication) |

## Running the Application Locally
1. Clone the repository: `git clone https://github.com/<your-username>/stripe-payment-method-api.git`
2. Navigate to the cloned directory: `cd stripe-payment-method-api`
3. Install the dependencies: `npm install`
4. Create a `.env` file and set the following environment variables:
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `JWT_SECRET_KEY`: A secret key for generating JSON web tokens
   - `PRISMA_ENDPOINT`: The endpoint for your Prisma API
   - `PRISMA_SECRET`: The secret for your Prisma API
5. Start the development server: `npm run dev`
6. The API will be available at `http://localhost:3000`

## Note
Make sure to replace the dummy response function with a valid response in the `dummyResponse` route.
