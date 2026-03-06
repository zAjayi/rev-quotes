# Delivery Management Module Integration Guide

This guide contains the API endpoint documentation and a prepared prompt for a Frontend AI software engineer (using React).

## Prompt for Frontend AI Agent

**Role:** You are an expert Frontend Software Engineer AI Agent focusing on building modern, responsive React applications.

**Context:** The backend for RevQuotes has just been updated with a new Delivery Management Module.

**Task:** I need you to build out the frontend components and integrations to support the new Delivery Management Module. We need capabilities for Admin dashboard management and a Rider/Driver dashboard UI. All APIs return data in standard JSON format, typically nested inside a `data` key, and require a JWT token in the `Authorization: Bearer <token>` header.

**Requirements:**
1. **Admin Delivery Management View**
   - Provide a paginated list of deliveries.
   - Filter controls: by Status (pending, scheduled, assigned, out_for_delivery, delivered, failed, returned, cancelled), Date, and Driver ID.
   - Detailed view showing Delivery Info, Address, Customer Details, and Tracking History.
   - Action buttons: Update Status, Assign a Driver.

2. **Admin Driver Management View**
   - List all drivers and their active status.
   - A modal/form to Create a new Driver (`name`, `phone`, `vehicle_type`).
   - View assigned deliveries for a selected driver.

3. **Rider / Driver Dashboard UI**
   - A simplified mobile-first interface for the rider.
   - Show their currently assigned deliveries.
   - Interactive buttons on each delivery card:
     - "Start Delivery" (updates status to Out For Delivery)
     - "Mark as Delivered"
     - "Report Issue" (opens a prompt to enter notes)

4. **Background / Live Map Infrastructure**
   - Implement a background service or hook using `navigator.geolocation` that, when a rider marks a delivery as "started", pings the backend every 30 seconds with the rider's current latitude and longitude.

---

## API Documentation Reference

Base URL: `{API_URL}/api/v1`
Auth: All endpoints require `Authorization: Bearer <token>`

### Core Delivery Management APIs (`/deliveries`)

- **POST `/deliveries`**
  - Payload: `{ "quote_id": "uuid", "customer_name": "string", "customer_phone": "string", "delivery_address": "string", "city": "string", "state": "string" }`
  - Response: `{ "message": "Delivery created successfully", "delivery_id": "uuid", "tracking_code": "string", "status": "pending" }`

- **GET `/deliveries`**
  - Optional Query Params: `?status=string` | `?driver_id=uuid` | `?date=YYYY-MM-DD`
  - Response: `{ "data": [{...Delivery}] }`

- **GET `/deliveries/:id`**
  - Response: `{ "data": {...Delivery} }`

- **PATCH `/deliveries/:id/status`**
  - Payload: `{ "status": "string", "notes": "string" }`
  - Response: `{ "message": "Status updated successfully" }`

- **POST `/deliveries/:id/assign-driver`**
  - Payload: `{ "driver_id": "uuid" }`
  - Response: `{ "message": "Driver assigned successfully" }`

- **GET `/deliveries/:id/history`**
  - Response: `{ "data": [{...DeliveryStatusHistory}] }`

### Admin / Driver Management APIs (`/drivers`)

- **POST `/drivers`**
  - Payload: `{ "name": "string", "phone": "string", "vehicle_type": "string" }`
  - Response: `{ "message": "Driver created successfully", "data": {...Driver} }`

- **GET `/drivers`**
  - Response: `{ "data": [{...Driver}] }`

- **GET `/drivers/:id/deliveries`**
  - Response: `{ "data": [{...Delivery}] }`

### Rider / Driver App APIs (`/driver`)
*Note: The driver's user ID is dynamically resolved via their Auth Token in these endpoints.*

- **GET `/driver/me/deliveries`**
  - Response: `{ "data": [{...Delivery}] }`

- **PATCH `/driver/deliveries/:id/start`**
  - Response: `{ "message": "Delivery started" }`
  
- **PATCH `/driver/deliveries/:id/complete`**
  - Response: `{ "message": "Delivery completed" }`

- **PATCH `/driver/deliveries/:id/issue`**
  - Payload: `{ "notes": "string" }`
  - Response: `{ "message": "Issue reported" }`

- **POST `/driver/location`**
  - Payload: `{ "driver_id": "uuid", "latitude": float, "longitude": float, "timestamp": int64 (optional) }`
  - Response: `{ "message": "Location updated" }`
