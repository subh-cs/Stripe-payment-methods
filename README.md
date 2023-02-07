# Stripe Payment Method API Application
### This is a Node.js + Express application that provides a set of RESTful APIs for managing a user's payment methods using the Stripe payment platform. The app is built with TypeScript, and uses Prisma as an ORM and Postgres as the database.

## Preview Video
[Click here](https://www.loom.com/share/5cdef53fce4f42ed0) (Watch it on 1.5x for better experience)

## API Routes
| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | / | Dummy response |
| POST | /register | Register a new user |
| POST | /login | Login a user |
| GET | /get-payment-method | Get the list of payment methods for a user (requires authentication) |
| GET | /get-payment-method?id=${id} | Get a single payment method by payment method id (requires authentication) |
| POST | /add-payment-method | Add a new payment method for a user (requires authentication) |
| PATCH | /update-payment-method?id=${id} | Update the payment method for a user (requires authentication) |
| DELETE | /delete-payment-method?id=${id} | Delete the payment method for a user (requires authentication) |

## Running the Application Locally
1. Clone the repository: `https://github.com/subh-cs/Stripe-payment-methods.git`
2. Navigate to the cloned directory: `cd Stripe-payment-methods`
3. Install the dependencies: `npm install`
4. envoirment variables are already there, no need to set
5. Start the development server: `npm run dev`
6. The API will be available at `http://localhost:3000`

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
