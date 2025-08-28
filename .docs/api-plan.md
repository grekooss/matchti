````markdown
# REST API Plan

## 1. Resources

- **User Profiles (`profiles`, `auth.users`)**: Represents user account information.
  - Corresponds to `profiles` table and Supabase `auth.users`.
- **Sports (`sports`)**: Represents types of sports and their properties.
  - Corresponds to `sports` table.
- **Facilities (`facilities`)**: Represents sports venues/pitches.
  - Corresponds to `facilities` table.
- **Facility Photos (`facility_photos`)**: Represents photos associated with facilities.
  - Corresponds to `facility_photos` table.
- **Reservations (`reservations`)**: Represents bookings made by users for facilities.
  - Corresponds to `reservations` table.
- **Reservation Participants (`reservation_participants`)**: Represents users who have joined a reservation.
  - Corresponds to `reservation_participants` table.
- **Push Tokens (`push_tokens`)**: Represents device tokens for push notifications.
  - Corresponds to `push_tokens` table.

## 2. Endpoints

### 2.3. Sports (`/sports`)

- **GET `/sports`**
  - Description: List all sports or filter by parent sport.
  - Query Params:
    - `parent_sport_id` (integer, optional): Filter by parent sport ID to get subcategories. If not provided, or `parent_sport_id=null`, returns top-level sports.
  - Response:
    ```json
    [
      {
        "id": 1,
        "parent_sport_id": null,
        "name": "Football",
        "created_at": "timestampz",
        "updated_at": "timestampz"
      }
    ]
    ```
  - Success: `200 OK`
  - Error: `400 Bad Request`
- **GET `/sports/{sport_id}`**
  - Description: Get details of a specific sport.
  - Response: Single sport object (as above).
  - Success: `200 OK`
  - Error: `404 Not Found`

### 2.4. Facilities (`/facilities`)

- **GET `/facilities`**
  - Description: List facilities, supports geo-queries and filtering.
  - Query Params:
    - `sport_ids` (string, optional, comma-separated integers e.g., "1,2"): Filter by facilities supporting specific sports.
    - `latitude` (float, optional): User's current latitude.
    - `longitude` (float, optional): User's current longitude.
    - `radius_km` (float, optional): Search radius in kilometers (requires latitude, longitude).
    - `bounds` (string, optional, comma-separated "north,east,south,west"): Filter by map viewport bounds.
    - `limit` (integer, optional, default: 20): Pagination limit.
    - `offset` (integer, optional, default: 0): Pagination offset.
  - Response:
    ```json
    {
      "items": [
        {
          "id": "uuid-facility-1",
          "osm_id": 12345,
          "name": "Orlik przy Szkole Podstawowej nr 5",
          "location": {
            "type": "Point",
            "coordinates": [19.944981, 50.064651]
          }, // GeoJSON Point
          "surface_type": "GRASS_ARTIFICIAL",
          "addr_city": "Kraków",
          "addr_street": "Ulica Testowa",
          "addr_housenumber": "10",
          // Basic info for map pop-up
          "main_photo_url": "https://example.com/photo.jpg", // Derived, potentially from facility_photos
          "supported_sports": [
            // Derived from facility_sports
            { "id": 1, "name": "Football" },
            { "id": 2, "name": "Basketball" }
          ]
        }
      ],
      "total": 100,
      "limit": 20,
      "offset": 0
    }
    ```
  - Success: `200 OK`
  - Error: `400 Bad Request` (Invalid query parameters)
- **GET `/facilities/{facility_id}`**
  - Description: Get detailed information about a specific facility.
  - Response:
    ```json
    {
      "id": "uuid-facility-1",
      "osm_id": 12345,
      "name": "Orlik przy Szkole Podstawowej nr 5",
      "location": { "type": "Point", "coordinates": [19.944981, 50.064651] },
      // way_geometry can be omitted for client if large and not used directly
      "surface_type": "GRASS_ARTIFICIAL",
      "addr_city": "Kraków",
      "addr_housenumber": "10",
      "addr_street": "Ulica Testowa",
      "amenity": "community_centre",
      "leisure": "pitch",
      "sport_osm_tags": "soccer;basketball", // Raw OSM sport tag
      "operator": "Urząd Miasta",
      "website": "http://example.com",
      "phone": "123456789",
      "opening_hours": "Mo-Fr 08:00-22:00",
      "fee": "no",
      "lit": "yes",
      "access": "permissive",
      "description": "Ogólnodostępne boisko wielofunkcyjne.",
      "created_at": "timestampz",
      "updated_at": "timestampz",
      "photos": [
        // from facility_photos
        {
          "id": "uuid-photo-1",
          "url": "https://example.com/photo1.jpg",
          "caption": "Main view",
          "sort_order": 0
        }
      ],
      "supported_sports_details": [
        // from facility_sports joined with sports
        {
          "id": 1,
          "name": "Football",
          
          
          "duration_step_minutes": 15
        }
      ]
    }
    ```
  - Success: `200 OK`
  - Error: `404 Not Found`
- **GET `/facilities/{facility_id}/availability`**
  - Description: Get busy (reserved) slots for a facility within a date range for a specific sport. Only slots that are already booked (busy) are returned. All other times are considered available by default.
  - Query Params:
    - `sport_id` (integer, required): The sport for which availability is checked (impacts slot duration).
    - `start_date` (string, required, format: YYYY-MM-DD): Start date for availability check.
    - `end_date` (string, required, format: YYYY-MM-DD): End date for availability check.
  - Response:
    ```json
    {
      "facility_id": "uuid-facility-1",
      "sport_id": 1,
      "requested_start_date": "2024-07-01",
      "requested_end_date": "2024-07-01",
      "busy_slots": [
        {
          "start_time": "2024-07-01T09:00:00Z",
          "end_time": "2024-07-01T10:00:00Z"
        },
        {
          "start_time": "2024-07-01T14:00:00Z",
          "end_time": "2024-07-01T15:30:00Z"
        }
        // ... kolejne zajęte sloty w podanym zakresie
      ]
    }
    ```
  - Success: `200 OK`
  - Error: `400 Bad Request` (Missing params, invalid date format), `404 Not Found` (Facility or Sport not found)

### 2.5. Facility Photos (`/facilities/{facility_id}/photos`)

Primarily for read, as PRD suggests photos are externally managed.

- **GET `/facilities/{facility_id}/photos`**
  - Description: List photos for a specific facility.
  - Query Params:
    - `limit` (integer, optional, default: 10)
    - `offset` (integer, optional, default: 0)
  - Response:
    ```json
    {
      "items": [
        {
          "id": "uuid-photo-1",
          "storage_path": "facility_photos/uuid-facility-1/image1.jpg", // For reference, client uses URL
          "url": "https://<supabase_url>/storage/v1/object/public/facility-photos/uuid-facility-1/image1.jpg",
          "sort_order": 0,
          "caption": "Main entrance",
          "created_at": "timestampz"
        }
      ],
      "total": 5,
      "limit": 10,
      "offset": 0
    }
    ```
  - Success: `200 OK`
  - Error: `404 Not Found` (Facility not found)

### 2.6. Reservations (`/reservations`)

- **POST `/reservations`**
  - Description: Create a new reservation. Requires authentication.
  - Request Body:
    ```json
    {
      "facility_id": "uuid-facility-1",
      "sport_id": 1,
      "start_time": "2024-07-01T10:00:00Z", // ISO 8601
      "end_time": "2024-07-01T11:30:00Z" // ISO 8601
    }
    ```
  - Response:
    ```json
    {
      "id": "uuid-reservation-1",
      "facility_id": "uuid-facility-1",
      "sport_id": 1,
      "organizer_id": "uuid-user-1",
      "start_time": "2024-07-01T10:00:00Z",
      "end_time": "2024-07-01T11:30:00Z",
      "status": "CONFIRMED",
      "invitation_token": "unique_secure_token",
      "created_at": "timestampz",
      "updated_at": "timestampz",
      "facility_details": {
        // Optional, for immediate display
        "name": "Orlik przy Szkole Podstawowej nr 5",
        "address_line": "Ulica Testowa 10, Kraków"
      },
      "sport_details": {
        // Optional
        "name": "Football"
      }
    }
    ```
  - Success: `201 Created`
  - Error:
    - `400 Bad Request` (Invalid input, e.g., end_time <= start_time, duration mismatch with sport rules)
    - `401 Unauthorized`
    - `403 Forbidden` (e.g., booking too far in advance - `check_booking_horizon`)
    - `404 Not Found` (Facility or Sport not found)
    - `409 Conflict` (Slot already booked - `prevent_overlapping_reservations`)
    - `422 Unprocessable Entity` (Validation errors)
- **GET `/me/reservations`**
  - Description: List reservations for the authenticated user (as organizer or participant).
  - Query Params:
    - `filter` (string, optional, `upcoming` | `past` | `all`, default: `upcoming`): Filter reservations.
    - `limit` (integer, optional, default: 10)
    - `offset` (integer, optional, default: 0)
  - Response:
    ```json
    {
      "items": [
        // Array of reservation objects similar to POST /reservations response,
        // potentially with participant list summary.
        {
          "id": "uuid-reservation-1",
          "facility_id": "uuid-facility-1",
          "facility_name": "Orlik ...", // Denormalized for list view
          "facility_main_photo_url": "...",
          "sport_id": 1,
          "sport_name": "Football", // Denormalized
          "organizer_id": "uuid-user-1",
          "start_time": "2024-07-01T10:00:00Z",
          "end_time": "2024-07-01T11:30:00Z",
          "status": "CONFIRMED",
          "invitation_token": "unique_secure_token",
          // "participants_count": 3, // Example additional info
          "is_organizer": true // boolean, true if current user is the organizer
        }
      ],
      "total": 5,
      "limit": 10,
      "offset": 0
    }
    ```
  - Success: `200 OK`
  - Error: `401 Unauthorized`
- **GET `/reservations/{reservation_id}`**
  - Description: Get details of a specific reservation. User must be organizer or participant.
  - Response:
    ```json
    {
      "id": "uuid-reservation-1",
      "facility_id": "uuid-facility-1",
      "sport_id": 1,
      "organizer_id": "uuid-user-1",
      "organizer_display_name": "John Doe",
      "start_time": "2024-07-01T10:00:00Z",
      "end_time": "2024-07-01T11:30:00Z",
      "status": "CONFIRMED",
      "invitation_token": "unique_secure_token",
      "created_at": "timestampz",
      "updated_at": "timestampz",
      "facility_details": {
        /* ... */
      },
      "sport_details": {
        /* ... */
      },
      "participants": [
        {
          "user_id": "uuid-user-1",
          "display_name": "John Doe",
          "avatar_url": "...",
          "joined_at": "timestampz"
        },
        {
          "user_id": "uuid-user-2",
          "display_name": "Jane Smith",
          "avatar_url": "...",
          "joined_at": "timestampz"
        }
      ]
    }
    ```
  - Success: `200 OK`
  - Error: `401 Unauthorized`, `403 Forbidden` (Not part of the reservation), `404 Not Found`
- **PATCH `/reservations/{reservation_id}/cancel`**
  - Description: Cancel a reservation. Only organizer can cancel.
  - Request Body: Empty.
  - Response: Updated reservation object with `status: "CANCELLED"`.
  - Success: `200 OK`
  - Error: `401 Unauthorized`, `403 Forbidden` (Not organizer, or reservation already started/past), `404 Not Found`, `409 Conflict` (e.g. already cancelled)
- **GET `/reservations/by-token/{invitation_token}`** (Publicly accessible to get info before joining)
  - Description: Get reservation details using an invitation token.
  - Response: Similar to `GET /reservations/{reservation_id}` but might omit sensitive data if user not yet joined/logged in. It should provide enough info for a user to decide to join.
    ```json
    {
      "id": "uuid-reservation-1", // To be used for joining
      "facility_name": "Orlik...",
      "facility_address": "...",
      "sport_name": "Football",
      "start_time": "2024-07-01T10:00:00Z",
      "end_time": "2024-07-01T11:30:00Z",
      "organizer_display_name": "John D.", // Could be partial for privacy
      "participants_count": 2,
      "requires_login_to_join": true // Hint for client
    }
    ```
  - Success: `200 OK`
  - Error: `404 Not Found` (Invalid token)
- **POST `/reservations/{reservation_id}/join`**
  - Description: Authenticated user joins a reservation (after possibly viewing it via token).
  - Request Body: Empty (user identified by auth token).
  - Response: Updated reservation participant list or success message.
    ```json
    {
      "message": "Successfully joined the reservation.",
      "participant": {
        "user_id": "uuid-user-new",
        "display_name": "New User",
        "joined_at": "timestampz"
      }
    }
    ```
  - Success: `200 OK` or `201 Created` (if a participant record is created)
  - Error: `401 Unauthorized`, `403 Forbidden` (e.g. reservation full, or already joined), `404 Not Found` (Reservation not found), `409 Conflict` (Already a participant)
- **DELETE `/reservations/{reservation_id}/participants/me`**
  - Description: Authenticated user leaves a reservation they had joined.
  - Response: Empty.
  - Success: `204 No Content`
  - Error: `401 Unauthorized`, `403 Forbidden` (Cannot leave if organizer, or not a participant), `404 Not Found`
  - Note: Organizer cannot leave; they must cancel the reservation.

### 2.8. Tasks (Internal/Scheduled)

These are typically not exposed publicly but called by cron jobs (e.g., `pg_cron` calling a Supabase Edge Function).

- **POST `/tasks/send-reservation-reminders`**
  - Description: Internal endpoint to trigger sending 2-hour reservation reminders.
  - Request Body: (May require a secret key for invocation)
  - Response: `{ "status": "success", "reminders_sent": 15 }`
  - Success: `200 OK`
  - Error: `401 Unauthorized` (If not properly secured), `500 Internal Server Error`

## 4. Walidacja i logika biznesowa (Validation and Business Logic)

- **Payload Validation**:
  - Incoming request bodies (JSON) will be validated in Supabase Edge Functions using a library like Zod.
  - This ensures type correctness, presence of required fields, and basic format constraints before hitting database constraints.
  - Errors result in `400 Bad Request` or `422 Unprocessable Entity` with descriptive messages.
- **Database Constraints**:
  - The API relies on database-level constraints (e.g., `CHECK` constraints, `UNIQUE` constraints, `FOREIGN KEY` constraints, `ENUM` types) as a final layer of data integrity.
    - `sports` table: duration logic (`min_duration_minutes > 0`, step divisibility).
    - `reservations` table: `end_time > start_time`, `start_time` within 1 month horizon, no overlapping confirmed reservations.
    - `surface_type_enum`, `reservation_status_enum`: ensure valid values.
  - Errors from these constraints will be caught and translated into appropriate HTTP error responses (e.g., `409 Conflict`).
- **Business Logic Implementation**:
  - **Facility Availability (`GET /facilities/{facility_id}/availability`)**: Edge Function calculates available slots based on `reservations` for the facility, `sports` table (usunięto reguły czasu trwania, nie dotyczy), and potentially facility opening hours (if data is available).
  - **Reservation Creation (`POST /reservations`)**: Edge Function handles:
    1.  Validacja dotyczy tylko poprawności zakresu czasu rezerwacji, bez reguł sportu.
    2.  Checking `check_booking_horizon`.
    3.  Relying on DB's `prevent_overlapping_reservations` constraint.
    4.  Generating a unique `invitation_token`.
  - **Reservation Cancellation (`PATCH /reservations/{reservation_id}/cancel`)**: Edge Function verifies user is organizer, updates status to `CANCELLED`, and triggers FR-030 (notification to participants).
  - **Joining a Reservation (`POST /reservations/{reservation_id}/join`)**: Edge Function adds user to `reservation_participants` and triggers FR-028 (notification to existing participants).
  - **Invitation Link Handling**:
    - `GET /reservations/by-token/{invitation_token}`: Publicly fetches minimal reservation details.
    - Frontend uses this info; if user decides to join, they authenticate (if needed) then call `POST /reservations/{reservation_id}/join`.
  - **Push Notifications (FR-028, FR-029, FR-030)**: Logic for sending notifications resides in Edge Functions, triggered by relevant actions (join, cancellation) or scheduled tasks (reminders). These functions will interact with push notification services (FCM/APNS).
  - **Filtering Facilities (`GET /facilities`)**: Uses PostGIS for geo-queries (`idx_facilities_location`) and standard SQL for other filters (e.g., `sport_ids` via join with `facility_sports`).
  - **Booking Horizon (`reservations.check_booking_horizon`)**: Validated during `POST /reservations`.
  - **Duration Rules (`sports` table constraints)**: Validated during `POST /reservations` against the chosen `sport_id`.
````
