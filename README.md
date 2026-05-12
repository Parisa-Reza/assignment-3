# Assignment-3

A responsive  built with **HTML, CSS, JavaScript, Node.js, and Express.js**.  
The application displays nearby rental properties, integrates Google Maps, supports favourites, image galleries, date range booking, and dynamic property sorting.

---

# Features



## 1. API Endpoints

### GET `/get-property`

This endpoint returns property data based on query parameters.

### Supported Query Parameters

| Query Parameter | Description |
|---|---|
| `most-popular=true` | Returns `most_popular.json` |
| `highest-price=true` | Returns `highest_price.json` |
| `lowest-price=true` | Returns `lowest_price.json` |
| `limit=number` | Limits the number of returned items |

---

## Functionality

- If `limit` is provided, only the specified number of items should be returned otherwise all items will be returned




---

## Example Full URL


---

### Most Popular

```bash
http://localhost:3000/get-property?most-popular=true
```

### Most Popular With Limit

```bash
http://localhost:3000/get-property?most-popular=true&limit=4
```

### Highest Price

```bash
http://localhost:3000/get-property?highest-price=true
```

### Lowest Price

```bash
http://localhost:3000/get-property?lowest-price=true
```

### Highest Price With Limit

```bash
http://localhost:3000/get-property?highest-price=true&limit=6
```

---



## GET `/images`

Returns property image paths.

### Example Request

```bash
http://localhost:3000/images
```

---

## 2. Image Gallery Modal

- Fetch property images from `/images` endpoint.
- Open gallery inside a modal.
- Scrollable desktop gallery.
- Mobile swipe slider support.
- Next/Previous navigation buttons.
- Image counter in mobile view.
- Click outside modal to close.
- Prevent background scrolling while modal is open.

---


## 3. Property Description

- `Show More` button expands long descriptions.
- `Show Less` button collapses descriptions.
- DOM layout remains stable during expansion/collapse.

---

## 4. Hotel Datepicker Integration

Implemented using:

- Hotel Datepicker Library

### Features

- Select check-in and check-out dates
- Past dates disabled
- Minimum 1-night stay required
- Single-date selection disabled
- Automatic date population
- Dynamic total price calculation

### Pricing

- Base Price: `$2026`
- Total price updates automatically based on selected nights.

---

## 5. Property API Integration

- Fetch nearby properties dynamically from the backend.
- Sort properties by:
  - Most Popular (By default)
  - Highest Price
  - Lowest Price
- Responsive API limit handling:
  - Desktop → 6 properties
  - Mobile → 4 properties

---

## 6. Favourite Properties

- Heart/Favourite toggle functionality.
- Active favourite state shown in red.
- Favourite property IDs stored in `localStorage`.
- Persist favourites after page reload.
- Cross-platform consistency.



## 7. Google Maps Integration

- Display map markers for nearby properties.
- Hovering property cards highlights markers.
- Clicking markers highlights property cards.
- Longitiude and latitiude has been used from provided JSON files

---

# Tech Stack

## Frontend

- HTML5
- CSS3
- Vanilla JavaScript

## Backend

- Node.js
- Express.js

## External Libraries

- Google Maps JavaScript API
- Hotel Datepicker



---

# Installation

## 1. Clone the Repository

```bash
git clone https://github.com/Parisa-Reza/assignment-3.git
```

---

## 2. Navigate Into the Project

```bash
cd assignment-3
```

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Environment Variables

Create a `.env` file in the root directory.

```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
PORT=3000
```

---

## 5. Running the Project


```bash
npm run dev
```

```bash
http://localhost:3000/
```




# License

This project is developed for assessment and educational purposes.