# Collaborative Code Editor & Role-Based Authentication Setup

This guide explains how to set up and use the real-time collaborative code editor with role-based authentication in VirtueConnect.

## Features Implemented

### 1. Real-Time Collaborative Code Editor
- **Real-time synchronization**: Multiple users can edit code simultaneously
- **Debounced updates**: Prevents excessive API calls during typing
- **Language switching**: Support for JavaScript, Python, and Java
- **Question selection**: Multiple coding problems available
- **Collaborative indicators**: Shows when multiple users are editing

### 2. Role-Based Authentication
- **Interviewer Role**: Can create and conduct interviews, manage schedules
- **Candidate Role**: Can join interviews, practice coding problems
- **Role selection**: Users choose their role during signup
- **Role-based routing**: Different interfaces based on user role

## Setup Instructions

### 1. Database Schema Updates
The following Convex tables have been added/updated:

```typescript
// New table for collaborative code sessions
codeSessions: defineTable({
  interviewId: v.string(),
  questionId: v.string(),
  language: v.string(),
  code: v.string(),
  participants: v.array(v.string()),
  lastModified: v.number(),
  lastModifiedBy: v.string(),
}).index("by_interview_id", ["interviewId"]),

// Updated users table to support roles
users: defineTable({
  name: v.string(),
  email: v.string(),
  image: v.optional(v.string()),
  role: v.union(v.literal("candidate"), v.literal("interviewer")),
  clerkId: v.string(),
}).index("by_clerk_id", ["clerkId"]),
```

### 2. Regenerate Convex API
After adding the new schema, regenerate the Convex API:

```bash
npx convex dev
```

### 3. Enable Real-Time Collaboration
Once the API is regenerated, uncomment the following lines in `src/components/CodeEditor.tsx`:

```typescript
// Uncomment these lines after API regeneration
const createCodeSession = useMutation(api.codeSessions.createCodeSession);
const updateCode = useMutation(api.codeSessions.updateCode);
const joinCodeSession = useMutation(api.codeSessions.joinCodeSession);
const codeSession = useQuery(api.codeSessions.getCodeSession, { interviewId });
```

## Usage

### For Interviewers
1. Sign up and select "Interviewer" role
2. Create or join an interview
3. Use the collaborative code editor to:
   - Select coding problems
   - Switch programming languages
   - See real-time code changes from candidates
   - Provide guidance during the interview

### For Candidates
1. Sign up and select "Candidate" role
2. Join scheduled interviews
3. Use the collaborative code editor to:
   - Solve coding problems in real-time
   - Switch between programming languages
   - See interviewer's guidance and suggestions
   - Collaborate on solutions

## File Structure

```
src/
├── components/
│   ├── CodeEditor.tsx          # Main collaborative editor
│   ├── RoleBasedSignup.tsx     # Role selection component
│   └── MeetingRoom.tsx         # Updated to use collaborative editor
├── hooks/
│   └── useUserRole.ts          # Role-based routing hook
├── app/
│   └── (root)/
│       ├── signup/             # Role-based signup page
│       └── unauthorized/       # Access denied page
└── convex/
    ├── codeSessions.ts         # Real-time collaboration functions
    ├── users.ts               # Updated user management
    └── schema.ts              # Updated database schema
```

## Technical Details

### Real-Time Collaboration
- Uses Convex subscriptions for real-time updates
- Debounced code changes (500ms) to prevent excessive API calls
- Participant tracking to show collaboration status
- Conflict resolution based on last modification timestamp

### Role-Based Access Control
- Clerk authentication with role extension
- Middleware-based route protection
- Dynamic UI based on user role
- Automatic redirects for unauthorized access

### Code Editor Features
- Monaco Editor integration
- Syntax highlighting for multiple languages
- Real-time cursor positions (future enhancement)
- Collaborative undo/redo (future enhancement)

## Future Enhancements

1. **Cursor Tracking**: Show other users' cursor positions
2. **Selection Highlighting**: Highlight other users' text selections
3. **Chat Integration**: In-editor chat for code discussions
4. **Code Execution**: Run code directly in the editor
5. **Version History**: Track code changes over time
6. **File Management**: Support for multiple files in a session

## Troubleshooting

### Common Issues

1. **API not found errors**: Run `npx convex dev` to regenerate the API
2. **Real-time not working**: Ensure Convex is running and check network connectivity
3. **Role not updating**: Clear browser cache and re-authenticate
4. **Code not syncing**: Check if the interviewId is properly passed to the CodeEditor

### Debug Mode
Enable debug logging by adding to your environment variables:
```
NEXT_PUBLIC_DEBUG=true
```

This will show detailed logs for real-time collaboration events. 