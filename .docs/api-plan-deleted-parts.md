### 2.1. Authentication

Authentication is primarily handled by Supabase Auth. The client will use `supabase-js` for signup, login, logout, password reset initiation, and session management. The following are conceptual endpoints if proxied or for clarity; direct Supabase client calls are preferred.

- **POST `/auth/signup`**
  - Description: User registration with email/password.
  - Request Body: `{ "email": "user@example.com", "password": "securepassword123", "options": { "data": { "display_name": "Initial Name" } } }`
  - Response: Supabase Auth user session object.
  - Success: `200 OK` (Supabase handles specifics)
  - Error: `400 Bad Request`, `422 Unprocessable Entity` (Supabase specifics)
- **POST `/auth/login/password`**
  - Description: User login with email/password.
  - Request Body: `{ "email": "user@example.com", "password": "securepassword123" }`
  - Response: Supabase Auth user session object.
  - Success: `200 OK`
  - Error: `400 Bad Request` (Invalid credentials)
- **POST `/auth/login/oauth`** (Conceptual - handled by Supabase client provider methods)
  - Description: User login/signup with OAuth providers (Google, Apple).
  - Request Params: `provider=google|apple`
  - Response: Redirects to OAuth provider / Supabase session.
- **POST `/auth/logout`**
  - Description: User logout.
  - Response: Empty.
  - Success: `204 No Content`
  - Error: `401 Unauthorized`
- **POST `/auth/password-recovery`**
  - Description: Initiate password recovery for email-based accounts.
  - Request Body: `{ "email": "user@example.com" }`
  - Response: Empty.
  - Success: `204 No Content` (Indicates email sent, if user exists)
  - Error: (Usually no error to prevent user enumeration)
- **PATCH `/auth/user`**
  - Description: Update authenticated user's attributes (e.g., password).
  - Request Body: `{ "password": "newsecurepassword123" }` (or other updatable Supabase auth user fields)
  - Response: Supabase Auth user object.
  - Success: `200 OK`
  - Error: `400 Bad Request`, `401 Unauthorized`

### 2.2. User Profiles (`/me`)

Authenticated user's own profile.

- **GET `/me/profile`**
  - Description: Retrieve the authenticated user's profile.
  - Response:
    ```json
    {
      "id": "uuid",
      "display_name": "John Doe",
      "avatar_url": "https://example.com/avatar.png",
      "created_at": "timestampz",
      "updated_at": "timestampz"
    }
    ```
  - Success: `200 OK`
  - Error: `401 Unauthorized`, `404 Not Found` (Profile not created yet, though unlikely if auto-created)
- **PATCH `/me/profile`**
  - Description: Update the authenticated user's profile.
  - Request Body:
    ```json
    {
      "display_name": "Johnny Doe" // Optional
      // "avatar_url" might be handled via direct storage upload + updating path here
    }
    ```
  - Response: Updated profile object (as above).
  - Success: `200 OK`
  - Error: `400 Bad Request`, `401 Unauthorized`, `422 Unprocessable Entity`

### 2.7. Push Tokens (`/me/push-tokens`)

- **POST `/me/push-tokens`**
  - Description: Register or update a device push token for the authenticated user.
  - Request Body:
    ```json
    {
      "token": "device_push_notification_token_string",
      "device_info": { "os": "ios", "version": "15.5" } // Optional
    }
    ```
  - Response:
    ```json
    {
      "id": "uuid-push-token-1",
      "user_id": "uuid-user-1",
      "token": "device_push_notification_token_string", // Potentially masked or not returned
      "created_at": "timestampz",
      "updated_at": "timestampz"
    }
    ```
  - Success: `201 Created` (if new) or `200 OK` (if updated existing by unique token)
  - Error: `400 Bad Request`, `401 Unauthorized`, `409 Conflict` (if trying to create with non-unique aspects not covered by upsert logic)
- **DELETE `/me/push-tokens/{token_value}`**
  - Description: Remove a specific push token for the authenticated user.
  - Path Parameter: `token_value` (the actual push token string, URL encoded).
  - Response: Empty.
  - Success: `204 No Content`
  - Error: `401 Unauthorized`, `404 Not Found` (Token not registered for this user)

## 3. Uwierzytelnianie i autoryzacja (Authentication and Authorization)

- **Authentication**:
  - Handled by Supabase Auth.
  - Clients (React Native app) will use the `supabase-js` library to manage authentication flows (signup, login with email/password, OAuth with Google/Apple, logout, password recovery).
  - JWTs issued by Supabase Auth will be sent in the `Authorization: Bearer <token>` header for all protected endpoints.
  - Supabase Edge Functions will validate these JWTs.
- **Authorization**:
  - Primarily enforced by PostgreSQL Row Level Security (RLS) policies defined in the database schema.
    - E.g., users can only see/edit their own profiles, organizers can manage their reservations, participants can view reservations they are part of.
  - Supabase Edge Functions will respect RLS when using the Supabase client in user context. For operations requiring elevated privileges or complex logic not expressible purely in RLS, Edge Functions will use the service role client and implement custom authorization checks based on the authenticated user's ID and role/context.
    - Example: Ensuring only an organizer can cancel a reservation (`PATCH /reservations/{reservation_id}/cancel`).
    - Example: Validating business rules before creating a reservation (`POST /reservations`).
