# Frontend Integrated - Bounty/Event Management System

This is a React Native/Expo application with integrated bounty/event management functionality for faculty members.

## Features

### Faculty Dashboard
- **Quick Actions**: Direct access to create and view events
- **Analytics**: Student performance insights and statistics
- **Point Distribution**: Filter and view point distributions by category
- **Recent Activity**: Track recent point awards and transactions
- **Top Performers**: View leading students by points

### Event Management (Faculty)
- **Create Events**: Comprehensive form to create new events/bounties
- **Event Types**: Support for different event categories (event, competition, workshop, seminar)
- **Points & Berries**: Assign points and berries as rewards
- **Image Upload**: Optional event image upload
- **Search & Filter**: Find events by name, type, or status
- **Edit & Delete**: Manage existing events

## API Integration

The application integrates with a backend API for bounty/event management:

### Key API Endpoints
- `POST /api/bounties` - Create new bounty/event
- `GET /api/bounties` - Get all bounties
- `POST /api/bounties/search` - Search and filter bounties
- `PUT /api/bounties/:id` - Update bounty
- `DELETE /api/bounties/:id` - Delete bounty

### Field Mapping
The frontend maps form fields to the API structure:
- `title` → `name`
- `date` + `time` → `scheduled_date`
- `location` → `venue`
- `points` → `alloted_points`
- `berries` → `alloted_berries`
- `capacity` → `capacity`
- `type` → `type`

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npx expo start
   ```

3. **Access the Application**
   - Use Expo Go app on mobile device
   - Or press 'w' for web version

## Usage

### Creating Events (Faculty)
1. Navigate to Faculty Dashboard
2. Click "Create Event" quick action
3. Fill in the event details:
   - **Title**: Event name (required)
   - **Description**: Event details (required)
   - **Date**: Event date in YYYY-MM-DD format (required)
   - **Time**: Event time in HH:MM format (optional)
   - **Location**: Event venue (required)
   - **Points**: Points awarded (required)
   - **Berries**: Berries awarded (optional)
   - **Capacity**: Maximum participants (required)
   - **Type**: Event category (event, competition, workshop, seminar)
   - **Image**: Optional event image

4. Click "Create Event" to submit

### Managing Events
- **Search**: Use the search bar to find specific events
- **Edit**: Click the edit icon on any event card
- **Delete**: Click the delete icon to remove events
- **View Details**: Event cards show all relevant information

## File Structure

```
app/
├── (faculty)/
│   ├── dashboard.tsx      # Faculty dashboard with quick actions
│   └── events.tsx         # Event management page
├── (student)/
│   └── events.tsx         # Student event viewing
└── (admin)/
    └── create-bounty.tsx  # Admin bounty creation

utils/
└── api.ts                 # API integration functions

types/
└── index.ts              # TypeScript interfaces including Bounty

components/
├── AnimatedCard.tsx      # Reusable card component
├── GradientCard.tsx      # Gradient card component
└── TopMenuBar.tsx        # Navigation header
```

## API Response Structure

```typescript
interface Bounty {
  id: number;
  name: string;
  description: string;
  type: string;
  img_url?: string;
  image_hash?: string;
  alloted_points: number;
  alloted_berries: number;
  scheduled_date: string;
  venue: string;
  capacity: number;
  is_active: boolean;
  created_by?: number;
  modified_by?: number;
  created_on?: string;
  modified_on?: string;
  current_participants?: number;
  is_registered?: boolean;
}
```

## Error Handling

The application includes comprehensive error handling:
- Form validation with user-friendly error messages
- API error handling with detailed error display
- Loading states for better UX
- Network error recovery

## Authentication

The application uses JWT tokens for authentication:
- Tokens are stored in AsyncStorage
- API requests include Authorization headers
- Automatic token refresh handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 