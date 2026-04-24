# SmartSeason Frontend - Field Monitoring System

A modern Next.js web application for the SmartSeason field monitoring system, enabling farm administrators and field agents to track crop progress across multiple fields during a growing season.

## Features

**User Authentication**
- Secure login with JWT cookies
- Role-based access (Admin, Superadmin & Field Agent)
- Persistent sessions
- Automatic logout with loading message

**Admin Dashboard**
- Overview of all fields
- Status and stage breakdown
- Agent management
- Field assignment tracking
- Field history table showing all changes
- Edit field details with modal
- Add and manage field notes
- Auto-refresh after changes

**Agent Dashboard**
- View assigned fields only
- Add field notes
- View field notes table
- View field updates table
- Track changes to assigned fields

**Responsive Design**
- Mobile-friendly interface
- Tailwind CSS styling
- React Icons
- Smooth transitions

## Technology Stack

- **Framework**: Next.js 14+ (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **HTTP Client**: Fetch API
- **Authentication**: JWT with Cookies

## Installation

### Prerequisites
- Node.js 18+
- npm or pnpm
- Backend API running at `http://localhost:8000`

### Setup Instructions

1. **Clone the repository**
```bash
cd smart_season_frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```bash
NEXT_PUBLIC_API_HOST=http://localhost:8000/api
```

4. **Run development server**
```bash
npm run dev
```

Application will be available at `http://localhost:3000`

5. **Build for production**
```bash
npm run build
npm start
```

## Project Structure

```
smart_season_frontend/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── admin_dash/
│   │   └── page.tsx
│   ├── agent_dash/
│   │   └── page.tsx
│   ├── components/
│   │   ├── DashHeader.tsx
│   │   ├── AdminCards.tsx
│   │   └── Modals/
│   │       ├── ModalWrapper.tsx
│   │       ├── NewAgent.tsx
│   │       ├── NewField.tsx
│   │       ├── EditField.tsx
│   │       └── FieldNotes.tsx
│   ├── lib/
│   │   └── actions.ts
│   └── services/
│       └── apiService.ts
├── public/
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Pages Overview

### Login Page (`/`)
- Email and password inputs
- Show/hide password toggle
- Redirects to appropriate dashboard based on role

### Admin Dashboard (`/admin_dash`)
Access: Admin and Superadmin only

**Features:**
- Dashboard cards showing total fields, agents, and status breakdown
- Fields table with all field information
- Agents table showing agent details and assigned field counts
- Field History table showing all changes with old/new values
- Edit field button opens modal with current values
- Notes button opens modal for adding/viewing/editing notes
- Auto-refresh after adding field, agent, or editing field

**Actions:**
- Add new field
- Add new agent
- Edit field details (stage, status, assigned agent)
- Add, edit, delete field notes
- View complete field history

### Agent Dashboard (`/agent_dash`)
Access: Agent only

**Features:**
- My Fields table showing assigned fields
- Field Notes table showing all notes on assigned fields
- Field Updates table showing all changes to assigned fields
- Notes button to add/view/edit notes

**Actions:**
- View field details
- Add, edit, delete notes on assigned fields
- View update history

## Field Status Logic

The system automatically calculates field status based on the following logic:

### Status Determination
- **Active**: 
  - Planted stage: Always active
  - Growing stage: Active for first 45 days since planting
  - Ready stage: Always active
  
- **At Risk**: 
  - Growing stage after 45 days since planting
  - Indicates potential issues requiring agent attention
  
- **Completed**: 
  - Harvested stage: Field has completed its cycle

### Stage Progression
1. **Planted** - Initial stage when field is created
2. **Growing** - Crop is actively developing
3. **Ready** - Crop is mature and ready for harvest
4. **Harvested** - Final stage, harvest complete

### Field History Tracking
- Every change to stage, status, or assigned agent creates a history entry
- Each change is tracked separately (multiple changes = multiple history rows)
- History shows field name, what changed, old value, new value, who changed it, and when
- Provides complete audit trail visible in admin dashboard

## Phone Number Format

- All phone numbers use +254 prefix for Kenyan numbers
- Modal shows fixed +254 prefix (grayed out)
- Users enter remaining digits only
- System automatically removes leading 0 if entered
- Backend receives full number with prefix

## API Integration

### API Service (`app/services/apiService.ts`)

```typescript
apiService.postWithoutToken(url: string, data: any)
apiService.postWithToken(url: string, data: any)
apiService.getWithToken(url: string)
apiService.patchWithToken(url: string, data: any)
apiService.deleteWithToken(url: string)
```

### Authentication Flow

1. User enters credentials
2. `POST /api/users/login/` is called
3. Backend returns user data and sets cookies
4. Frontend stores user info
5. Subsequent requests automatically include cookies
6. Router redirects to appropriate dashboard

## Component Overview

### DashHeader
- Displays logged-in user's name (fetched from `/users/me/`)
- Logout button with loading message
- Shows "See you soon!" message when logging out

### AdminCards
- Shows real-time statistics
- Total fields count from database
- Total agents count from database
- Add Field and Add Agent buttons

### EditField Modal
- Shows current field values
- Allows editing stage, status, and assigned agent
- Creates separate history entry for each changed field
- Auto-closes and refreshes page after success

### FieldNotes Modal
- Large text area for adding notes
- View existing notes in collapsible section
- Edit and delete buttons for each note
- Shows author name and date
- Auto-refreshes after adding note

### NewField Modal
- Create new field form
- Dropdown for agents (fetched from database)
- Validation
- Auto-closes and refreshes page after success

### NewAgent Modal
- Create new agent form
- Fixed +254 prefix for phone number
- Auto-removes leading 0
- Auto-closes and refreshes page after success

## Styling

### Color Palette
- **Primary**: Green (growth theme)
- **Status Colors**:
  - Active: Green
  - At Risk: Yellow
  - Completed: Blue
- **Action Buttons**: Gradient backgrounds with hover effects

### Responsive Design
- Mobile-first approach
- Flexible layouts
- Scrollable tables on small screens

## Development Commands

```bash
npm install
npm run dev
npm run build
npm start
npm run lint
```

## Environment Variables

```env
NEXT_PUBLIC_API_HOST=http://localhost:8000/api
```

## Troubleshooting

### CORS Errors
- Ensure backend CORS settings include `http://localhost:3000`
- Verify credentials are sent in requests

### Authentication Errors
- Clear browser cookies
- Check if tokens are expired
- Verify backend is running

### Blank Page After Login
- Check browser console for errors
- Verify user role is returned from backend

## Security Considerations

- JWT authentication
- httponly cookies (set by backend)
- Input validation
- Secure password handling
- HTTPS in production

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Environment Setup for Production
```env
NEXT_PUBLIC_API_HOST=https://api.yourdomain.com/api
```

## License

This project is part of the SmartSeason Field Monitoring System.

---

**Last Updated**: April 2026  
**Version**: 1.0.0
