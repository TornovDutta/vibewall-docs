import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const apiEndpoints = [
  // ================= AUTH (PUBLIC) =================
  {
    group: 'Authentication',
    method: 'POST',
    path: '/api/v3/auth/register',
    summary: 'Register a new student user',
    description: 'Creates a new user profile with BCrypt encrypted password hashing.',
    auth: 'Public (No JWT required)',
    body: {
      name: 'student_user',
      password: 'StrongPassword123!'
    },
    responses: [
      { code: 201, desc: 'Created - User registered successfully' },
      { code: 400, desc: 'Bad Request - Validation error or user already exists' }
    ]
  },
  {
    group: 'Authentication',
    method: 'POST',
    path: '/api/v3/auth/login',
    summary: 'Login and get JWT tokens',
    description: 'Authenticates credentials and returns a short-lived access token + 7-day rotating refresh token.',
    auth: 'Public (No JWT required)',
    body: {
      name: 'student_user',
      password: 'StrongPassword123!'
    },
    responseExample: {
      jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZWY... (1h expiry)',
      refresh: 'e81a3b57-6c2e-4b71-8bc4-9d51f28b4c91 (7d expiry)',
      role: 'USER'
    },
    responses: [
      { code: 200, desc: 'OK - Login successful' },
      { code: 401, desc: 'Unauthorized - Invalid credentials' }
    ]
  },
  {
    group: 'Authentication',
    method: 'POST',
    path: '/api/v3/auth/refresh',
    summary: 'Rotate refresh token and issue new access token',
    description: 'Enforces single-active-session rotation: deletes the previous refresh token and returns a new token pair.',
    auth: 'Public (Requires valid refresh token)',
    body: {
      token: 'e81a3b57-6c2e-4b71-8bc4-9d51f28b4c91'
    },
    responseExample: {
      jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.new_access_token...',
      refresh: 'c92b4d68-7d3f-5c82-9cd5-0e62g39c5d02',
      role: 'USER'
    },
    responses: [
      { code: 200, desc: 'OK - New access token and rotated refresh token' },
      { code: 401, desc: 'Unauthorized - Expired or invalid refresh token' }
    ]
  },
  {
    group: 'Authentication',
    method: 'POST',
    path: '/api/v3/auth/logout',
    summary: 'Logout and delete active refresh session',
    description: 'Server-side revocation of the active refresh token associated with the caller.',
    auth: 'JWT (Authorization: Bearer <token>)',
    responseExample: 'Logged out successfully',
    responses: [
      { code: 200, desc: 'OK - Logged out successfully' },
      { code: 403, desc: 'Forbidden - Missing or invalid Bearer token' }
    ]
  },

  // ================= FEED (PUBLIC, CACHED) =================
  {
    group: 'Feed',
    method: 'GET',
    path: '/api/v3/feed/',
    summary: 'Get public feed of confessions',
    description: 'Returns active anonymous confessions. Cached in Redis for sub-millisecond read responses.',
    auth: 'Public (No JWT required)',
    responseExample: [
      {
        id: '66ef892a014a5b6c',
        content: 'Decrypted plaintext confession rendered for viewers',
        time: '2026-11-05T20:30:00.000Z',
        feedbacks: [
          {
            id: 1,
            content: 'Stay strong! Everyone goes through exam stress.',
            userId: '66ef771b99a03'
          }
        ]
      }
    ],
    responses: [
      { code: 200, desc: 'OK - Cached list of unexpired confessions returned' }
    ]
  },

  // ================= HEALTH =================
  {
    group: 'Health',
    method: 'GET',
    path: '/api/v3/health',
    summary: 'Service health check',
    description: 'Probes uptime status and service timestamp.',
    auth: 'Public (No JWT required)',
    responseExample: {
      status: 'UP',
      service: 'VibeWall',
      timestamp: '2026-11-05T23:36:51.100Z'
    },
    responses: [
      { code: 200, desc: 'OK - Service is healthy' }
    ]
  },

  // ================= CONFESSIONS (USER JWT) =================
  {
    group: 'Confessions',
    method: 'POST',
    path: '/api/v3/users/confession',
    summary: 'Submit a new anonymous confession',
    description: 'Screened synchronously by Meta Llama 3.1 via NVIDIA NIM. Encrypted with AES-256-GCM and stored with 12h TTL.',
    auth: 'JWT (User Bearer Token)',
    body: {
      content: 'Sometimes late-night engineering projects feel overwhelming, but building something from scratch is rewarding.'
    },
    responses: [
      { code: 201, desc: 'Created - Confession passed AI moderation and was saved' },
      { code: 422, desc: 'Unprocessable Entity - NVIDIA NIM flagged text as unsafe/toxic' },
      { code: 500, desc: 'Internal Error - AI unavailable or encryption failed' }
    ]
  },
  {
    group: 'Confessions',
    method: 'PUT',
    path: '/api/v3/users/confession/{id}',
    summary: 'Update own confession',
    description: 'Updates confession text if still within the 12-hour expiration window. Re-evaluates AI moderation and re-encrypts.',
    auth: 'JWT (User Bearer Token)',
    params: {
      id: 'Confession MongoDB ObjectID (Path)'
    },
    body: {
      content: 'Updated confession text'
    },
    responses: [
      { code: 202, desc: 'Accepted - Confession updated' },
      { code: 403, desc: 'Forbidden - Not the author of this confession' },
      { code: 404, desc: 'Not Found - Confession expired or does not exist' }
    ]
  },
  {
    group: 'Confessions',
    method: 'DELETE',
    path: '/api/v3/users/confession/{id}',
    summary: 'Delete own confession',
    description: 'Manually removes a confession before the 12-hour automated TTL expiration occurs.',
    auth: 'JWT (User Bearer Token)',
    params: {
      id: 'Confession MongoDB ObjectID (Path)'
    },
    responses: [
      { code: 204, desc: 'No Content - Confession deleted' },
      { code: 403, desc: 'Forbidden - Confession belongs to another user' },
      { code: 404, desc: 'Not Found - Confession not found' }
    ]
  },

  // ================= FEEDBACK (USER JWT) =================
  {
    group: 'Feedback',
    method: 'POST',
    path: '/api/v3/users/feedback/{confessionId}',
    summary: 'Add feedback to a confession',
    description: 'Post supportive peer comments on a confession. Moderated by NVIDIA NIM and encrypted with AES-256-GCM.',
    auth: 'JWT (User Bearer Token)',
    params: {
      confessionId: 'Target confession ID'
    },
    body: {
      content: 'You got this! Take a break and grab some water.'
    },
    responses: [
      { code: 201, desc: 'Created - Feedback added' },
      { code: 404, desc: 'Not Found - Target confession expired or missing' },
      { code: 422, desc: 'Unprocessable Entity - AI safety check flagged content' }
    ]
  },
  {
    group: 'Feedback',
    method: 'PUT',
    path: '/api/v3/users/feedback/{confessionId}/{feedbackId}',
    summary: 'Update existing feedback',
    description: 'Update the text of previously submitted feedback.',
    auth: 'JWT (User Bearer Token)',
    params: {
      confessionId: 'Target confession ID',
      feedbackId: 'Feedback sequence number (integer)'
    },
    body: {
      content: 'Updated feedback message'
    },
    responses: [
      { code: 200, desc: 'OK - Feedback updated' },
      { code: 404, desc: 'Not Found - Feedback or confession not found' }
    ]
  },
  {
    group: 'Feedback',
    method: 'DELETE',
    path: '/api/v3/users/feedback/{confessionId}/{feedbackId}',
    summary: 'Delete feedback',
    description: 'Removes feedback item from the target confession document.',
    auth: 'JWT (User Bearer Token)',
    params: {
      confessionId: 'Target confession ID',
      feedbackId: 'Feedback sequence number (integer)'
    },
    responses: [
      { code: 200, desc: 'OK - Feedback deleted' },
      { code: 404, desc: 'Not Found - Feedback or confession not found' }
    ]
  },
  {
    group: 'Feedback',
    method: 'POST',
    path: '/api/v3/users/feedback/{confessionId}/{feedbackId}/like',
    summary: 'Like or unlike a feedback comment',
    description: 'Toggles a like on the feedback comment and dynamically increases (+5) or decreases (-5) the comment author\'s reputation points.',
    auth: 'JWT (User Bearer Token)',
    params: {
      confessionId: 'Confession hex ID',
      feedbackId: 'Feedback sequence number (integer)'
    },
    responses: [
      { code: 200, desc: 'OK - Like recorded and reputation updated' },
      { code: 404, desc: 'Not Found - Feedback or confession not found' }
    ]
  },

  // ================= REPORTS =================
  {
    group: 'Reports',
    method: 'GET',
    path: '/api/v3/users/report/',
    summary: 'List user submitted reports',
    description: 'Retrieves all abuse or moderation reports submitted by the authenticated user.',
    auth: 'JWT (User Bearer Token)',
    responses: [
      { code: 200, desc: 'OK - Array of submitted reports' }
    ]
  },
  {
    group: 'Reports',
    method: 'POST',
    path: '/api/v3/users/report/',
    summary: 'Submit a new content report',
    description: 'Flags an abusive or harmful confession for administrator investigation.',
    auth: 'JWT (User Bearer Token)',
    body: {
      confessionId: '66ef892a014a5b6c',
      reason: 'Contains targeted bullying against a dorm resident'
    },
    responses: [
      { code: 201, desc: 'Created - Report logged and pending admin review' }
    ]
  },
  {
    group: 'Reports',
    method: 'PUT',
    path: '/api/v3/users/report/{reportId}',
    summary: 'Update report reason',
    description: 'Modify details of a previously submitted pending report.',
    auth: 'JWT (User Bearer Token)',
    params: {
      reportId: 'Report ID'
    },
    body: {
      confessionId: '66ef892a014a5b6c',
      reason: 'Updated description of violation'
    },
    responses: [
      { code: 202, desc: 'Accepted - Report updated' },
      { code: 403, desc: 'Forbidden - Not author of report' }
    ]
  },
  {
    group: 'Reports',
    method: 'DELETE',
    path: '/api/v3/users/report/{reportId}',
    summary: 'Delete report',
    description: 'Withdraws an active report.',
    auth: 'JWT (User Bearer Token)',
    params: {
      reportId: 'Report ID'
    },
    responses: [
      { code: 204, desc: 'No Content - Report removed' }
    ]
  },

  // ================= USER ACCOUNT =================
  {
    group: 'User Account',
    method: 'GET',
    path: '/api/v3/users/me',
    summary: 'Get user profile & reputation points',
    description: 'Retrieves authenticated user details including current reputation score, standing tier, ban status, and role.',
    auth: 'JWT (User Bearer Token)',
    responseExample: {
      id: '66ef892a014a5b6c',
      name: 'student_user',
      role: 'USER',
      points: 100,
      banned: false,
      banReason: null
    },
    responses: [
      { code: 200, desc: 'OK - Profile and reputation details returned' },
      { code: 401, desc: 'Unauthorized - Missing or expired JWT' }
    ]
  },
  {
    group: 'User Account',
    method: 'PUT',
    path: '/api/v3/users/me',
    summary: 'Update user profile',
    description: 'Modifies user nickname or updates password with BCrypt hashing.',
    auth: 'JWT (User Bearer Token)',
    body: {
      name: 'new_handle',
      password: 'NewStrongPassword456!'
    },
    responses: [
      { code: 200, desc: 'OK - Profile updated' },
      { code: 404, desc: 'Not Found - User account not found' }
    ]
  },
  {
    group: 'User Account',
    method: 'DELETE',
    path: '/api/v3/users/me',
    summary: 'Delete user account',
    description: 'Permanently removes the user record and invalidates active refresh tokens.',
    auth: 'JWT (User Bearer Token)',
    responses: [
      { code: 204, desc: 'No Content - Account deleted' }
    ]
  },

  // ================= ADMIN (ADMIN ROLE) =================
  {
    group: 'Admin',
    method: 'GET',
    path: '/api/v3/admin',
    summary: 'Get all registered users',
    description: 'Administrative listing of all user accounts across the system.',
    auth: 'Admin JWT (Role: ADMIN)',
    responses: [
      { code: 200, desc: 'OK - List of UserResponse objects' },
      { code: 403, desc: 'Forbidden - Insufficient role privileges' }
    ]
  },
  {
    group: 'Admin',
    method: 'POST',
    path: '/api/v3/admin/users/{userId}/unban',
    summary: 'Unban suspended user account',
    description: 'Restores user account posting privileges and resets their reputation points (default: 100).',
    auth: 'Admin JWT (Role: ADMIN)',
    params: {
      userId: 'User target hex ID',
      restorePoints: 'Optional points amount to grant upon unbanning (default: 100)'
    },
    responses: [
      { code: 200, desc: 'OK - User unbanned and points restored' },
      { code: 404, desc: 'Not Found - User not found' },
      { code: 403, desc: 'Forbidden - Admin role required' }
    ]
  },
  {
    group: 'Admin',
    method: 'POST',
    path: '/api/v3/admin/users/{userId}/ban',
    summary: 'Manually ban a user account',
    description: 'Suspends user from posting, commenting, or polling with an administrative reason.',
    auth: 'Admin JWT (Role: ADMIN)',
    params: {
      userId: 'User target hex ID',
      reason: 'Administrative justification for suspension'
    },
    responses: [
      { code: 200, desc: 'OK - User account marked as banned' },
      { code: 404, desc: 'Not Found - User not found' },
      { code: 403, desc: 'Forbidden - Admin role required' }
    ]
  },
  {
    group: 'Admin',
    method: 'PUT',
    path: '/api/v3/admin/users/{userId}/points',
    summary: 'Manually adjust user reputation points',
    description: 'Sets user reputation points to a specific integer value. If points become negative, auto-ban triggers.',
    auth: 'Admin JWT (Role: ADMIN)',
    params: {
      userId: 'User target hex ID',
      points: 'New integer reputation score'
    },
    responses: [
      { code: 200, desc: 'OK - Points adjusted successfully' },
      { code: 404, desc: 'Not Found - User not found' },
      { code: 403, desc: 'Forbidden - Admin role required' }
    ]
  },
  {
    group: 'Admin',
    method: 'POST',
    path: '/api/v3/admin',
    summary: 'Provision a new administrator',
    description: 'Creates a user with the ADMIN role and returns initial authentication tokens.',
    auth: 'Admin JWT (Role: ADMIN)',
    body: {
      name: 'admin_officer',
      password: 'AdminSuperPassword789!'
    },
    responses: [
      { code: 201, desc: 'Created - New admin created with tokens' },
      { code: 400, desc: 'Bad Request - Admin name taken' }
    ]
  },
  {
    group: 'Admin',
    method: 'GET',
    path: '/api/v3/admin/report',
    summary: 'Get all reports',
    description: 'Fetches all user submitted reports across both pending and resolved statuses.',
    auth: 'Admin JWT (Role: ADMIN)',
    responses: [
      { code: 200, desc: 'OK - List of all reports' }
    ]
  },
  {
    group: 'Admin',
    method: 'GET',
    path: '/api/v3/admin/report/pending',
    summary: 'Get all pending reports',
    description: 'Filters moderation queue to display unresolved content reports awaiting review.',
    auth: 'Admin JWT (Role: ADMIN)',
    responses: [
      { code: 200, desc: 'OK - List of pending reports' }
    ]
  },
  {
    group: 'Admin',
    method: 'GET',
    path: '/api/v3/admin/report/pending/{id}',
    summary: 'Get pending report by ID',
    description: 'Detailed inspection of an individual pending report.',
    auth: 'Admin JWT (Role: ADMIN)',
    params: {
      id: 'Report ID'
    },
    responses: [
      { code: 200, desc: 'OK - Report found' },
      { code: 404, desc: 'Not Found - Report ID not found' }
    ]
  },
  {
    group: 'Admin',
    method: 'PATCH',
    path: '/api/v3/admin/report/Reviewed/{id}?status=APPROVED',
    summary: 'Mark report as reviewed (APPROVED / REJECTED)',
    description: 'Resolves an abuse report. Takes status query parameter (APPROVED or REJECTED).',
    auth: 'Admin JWT (Role: ADMIN)',
    params: {
      id: 'Report ID',
      status: 'Query param: APPROVED | REJECTED'
    },
    responses: [
      { code: 200, desc: 'OK - Report status updated' },
      { code: 404, desc: 'Not Found - Report not found' }
    ]
  },
  {
    group: 'Admin',
    method: 'GET',
    path: '/api/v3/admin/logs',
    summary: 'Get system and user runtime error logs',
    description: 'Fetches recent runtime error logs (up to 100 entries) recorded automatically by global exception interceptors and client error telemetry.',
    auth: 'Admin JWT (Role: ADMIN)',
    responseExample: [
      {
        id: '67389a01b5c2d3e4',
        level: 'ERROR',
        source: 'BACKEND',
        endpoint: 'POST /api/v3/confession',
        statusCode: 422,
        userId: '66ef771b99a03',
        userAlias: 'Neon Dolphin',
        message: 'Content moderation violation: toxic content detected',
        details: 'org.example.vibewall.exception.GenericException...',
        timestamp: '2026-11-15T00:20:10.000Z'
      }
    ],
    responses: [
      { code: 200, desc: 'OK - List of system error logs returned' },
      { code: 403, desc: 'Forbidden - Requires administrator privileges' }
    ]
  },
  {
    group: 'Admin',
    method: 'DELETE',
    path: '/api/v3/admin/logs',
    summary: 'Clear all system error logs',
    description: 'Purges all stored runtime and user error logs from the database.',
    auth: 'Admin JWT (Role: ADMIN)',
    responses: [
      { code: 204, desc: 'No Content - All logs cleared successfully' },
      { code: 403, desc: 'Forbidden - Requires administrator privileges' }
    ]
  },
  {
    group: 'Admin',
    method: 'POST',
    path: '/api/v3/admin/logs/client',
    summary: 'Submit client-side error telemetry',
    description: 'Public endpoint allowing the frontend to report uncaught JavaScript errors or network failures directly into the Admin error feed.',
    auth: 'Public (Optional authentication context)',
    body: {
      endpoint: '/wall/66ef771b99a03',
      statusCode: 500,
      message: 'Network failure: unable to connect to server',
      details: 'UserAgent: Mozilla/5.0... Navigator error trace'
    },
    responses: [
      { code: 200, desc: 'OK - Client error logged' },
      { code: 400, desc: 'Bad Request - Validation error' }
    ]
  },
  {
    group: 'Admin',
    method: 'GET',
    path: '/api/v3/admin/ai-status',
    summary: 'Get AI engine health and diagnostics',
    description: 'Returns real-time telemetry on the active AI provider, model, latency, last error, and whether fallback heuristics are currently engaged.',
    auth: 'Admin JWT (Role: ADMIN)',
    responseExample: {
      status: 'HEALTHY',
      provider: 'Groq',
      model: 'llama-3.3-70b-versatile',
      endpoint: 'https://api.groq.com/openai/v1/chat/completions',
      latencyMs: 124,
      lastChecked: '2026-11-15T00:25:00.000Z',
      lastError: null,
      activeFallback: false,
      message: 'AI Provider Groq is operational and responsive.'
    },
    responses: [
      { code: 200, desc: 'OK - Real-time AI status telemetry' },
      { code: 403, desc: 'Forbidden - Requires administrator privileges' }
    ]
  },
  {
    group: 'Admin',
    method: 'POST',
    path: '/api/v3/admin/ai-test',
    summary: 'Trigger live connectivity ping test for AI provider',
    description: 'Sends a lightweight 5-token ping test to the configured AI provider to measure round-trip latency and confirm operational status on demand.',
    auth: 'Admin JWT (Role: ADMIN)',
    responses: [
      { code: 200, desc: 'OK - Ping test completed successfully' },
      { code: 503, desc: 'Service Unavailable - AI provider failed connection test' },
      { code: 403, desc: 'Forbidden - Requires administrator privileges' }
    ]
  },

  // ================= OPINION POLLS =================
  {
    group: 'Opinion Polls',
    method: 'GET',
    path: '/api/v3/polls',
    summary: 'Get all active opinion polls',
    description: 'Retrieves active community opinion polls with real-time voting counts, percentage breakdown, and current user vote state.',
    auth: 'Public (Optional JWT for user vote status)',
    responses: [
      { code: 200, desc: 'OK - List of active opinion polls returned' }
    ]
  },
  {
    group: 'Opinion Polls',
    method: 'POST',
    path: '/api/v3/polls',
    summary: 'Create a new opinion poll',
    description: 'Creates a community poll with 2 to 6 options. Content is evaluated by AI safety guardrails before persistence.',
    auth: 'JWT (User Bearer Token)',
    body: {
      question: 'Which framework do you prefer for building full-stack web applications?',
      options: ['Spring Boot + React', 'Next.js', 'FastAPI + Vue', 'Go + Svelte'],
      category: 'TECH'
    },
    responses: [
      { code: 201, desc: 'Created - Poll created successfully' },
      { code: 422, desc: 'Unprocessable Entity - Question flagged by AI safety' }
    ]
  },
  {
    group: 'Opinion Polls',
    method: 'GET',
    path: '/api/v3/polls/{id}',
    summary: 'Get single opinion poll by ID',
    description: 'Fetches details of a specific poll, including option vote tallies and expiration timestamp.',
    auth: 'Public (Optional JWT)',
    params: {
      id: 'Poll MongoDB ID'
    },
    responses: [
      { code: 200, desc: 'OK - Poll found' },
      { code: 404, desc: 'Not Found - Poll does not exist' }
    ]
  },
  {
    group: 'Opinion Polls',
    method: 'POST',
    path: '/api/v3/polls/{id}/vote',
    summary: 'Cast vote on a poll option',
    description: 'Records an anonymous vote. Enforces single-vote rule per user and recalculates dynamic percentages.',
    auth: 'JWT (User Bearer Token)',
    params: {
      id: 'Poll MongoDB ID'
    },
    body: {
      optionId: 1
    },
    responses: [
      { code: 200, desc: 'OK - Vote counted and updated statistics returned' },
      { code: 409, desc: 'Conflict - User already voted on this poll' }
    ]
  },
  {
    group: 'Opinion Polls',
    method: 'DELETE',
    path: '/api/v3/polls/{id}',
    summary: 'Delete a poll',
    description: 'Deletes a poll created by the authenticated user or an administrator.',
    auth: 'JWT (Creator or Admin)',
    params: {
      id: 'Poll MongoDB ID'
    },
    responses: [
      { code: 200, desc: 'OK - Poll deleted' },
      { code: 403, desc: 'Forbidden - Unauthorized to delete this poll' }
    ]
  },

  // ================= ANONYMOUS Q&A =================
  {
    group: 'Anonymous Q&A',
    method: 'GET',
    path: '/api/v3/qa',
    summary: 'Get all public community Q&A questions',
    description: 'Retrieves public Q&A questions for the unified live feed and Q&A explore page.',
    auth: 'Public (No JWT required)',
    responses: [
      { code: 200, desc: 'OK - List of public questions returned' }
    ]
  },
  {
    group: 'Anonymous Q&A',
    method: 'POST',
    path: '/api/v3/qa/ask',
    summary: 'Ask a community question',
    description: 'Posts a question to the community open feed. Supports 100% anonymous submission or display under an alias.',
    auth: 'Public / Authenticated (Optional JWT)',
    body: {
      content: 'What advice would you give to first-year software engineering students?',
      anonymous: true,
      askerName: ''
    },
    responses: [
      { code: 201, desc: 'Created - Question screened by AI and posted' },
      { code: 422, desc: 'Unprocessable Entity - Question flagged by AI safety' }
    ]
  },
  {
    group: 'Anonymous Q&A',
    method: 'POST',
    path: '/api/v3/qa/ask/{targetUserId}',
    summary: 'Ask a question to a specific user wall',
    description: 'Directs a question to a wall owner. Delivers to their private inbox with notification.',
    auth: 'Public / Authenticated',
    params: {
      targetUserId: 'Target user ID'
    },
    body: {
      content: 'How do you prepare for coding interviews?',
      anonymous: true
    },
    responses: [
      { code: 201, desc: 'Created - Question sent to wall inbox' },
      { code: 404, desc: 'Not Found - Target user does not exist' }
    ]
  },
  {
    group: 'Anonymous Q&A',
    method: 'GET',
    path: '/api/v3/qa/wall/{targetUserId}',
    summary: 'Get public answered Q&As on a user wall',
    description: 'Fetches questions answered publicly by the target user for display on their personal wall (/wall/:userId).',
    auth: 'Public (No JWT required)',
    params: {
      targetUserId: 'Target user ID'
    },
    responses: [
      { code: 200, desc: 'OK - Answered wall Q&As returned' }
    ]
  },
  {
    group: 'Anonymous Q&A',
    method: 'GET',
    path: '/api/v3/qa/inbox',
    summary: 'Get current user Q&A inbox',
    description: 'Retrieves questions directed to the authenticated user. Supports filtering by status (PENDING or ANSWERED).',
    auth: 'JWT (User Bearer Token)',
    params: {
      status: 'Optional query param: PENDING | ANSWERED | ALL'
    },
    responses: [
      { code: 200, desc: 'OK - Inbox questions returned' },
      { code: 401, desc: 'Unauthorized - Missing or invalid token' }
    ]
  },
  {
    group: 'Anonymous Q&A',
    method: 'POST',
    path: '/api/v3/qa/{questionId}/reply',
    summary: 'Reply to an incoming question',
    description: 'Answers a question. Can be published publicly on the wall/feed or sent as a private response.',
    auth: 'JWT (Target User or Community)',
    params: {
      questionId: 'Question MongoDB ID'
    },
    body: {
      answer: 'Focus on core data structures and practice problem-solving daily!',
      isPublic: true
    },
    responses: [
      { code: 200, desc: 'OK - Reply saved and notified to asker' },
      { code: 403, desc: 'Forbidden - Not authorized to reply' }
    ]
  },
  {
    group: 'Anonymous Q&A',
    method: 'DELETE',
    path: '/api/v3/qa/{questionId}',
    summary: 'Delete a question',
    description: 'Deletes a question by owner, recipient, or administrator.',
    auth: 'JWT (Authorized User or Admin)',
    params: {
      questionId: 'Question MongoDB ID'
    },
    responses: [
      { code: 200, desc: 'OK - Question deleted' },
      { code: 403, desc: 'Forbidden - Unauthorized' }
    ]
  },
  {
    group: 'Anonymous Q&A',
    method: 'GET',
    path: '/api/v3/qa/my-asked',
    summary: 'Get questions asked by current user',
    description: 'Fetches list of questions the authenticated user has submitted to others.',
    auth: 'JWT (User Bearer Token)',
    responses: [
      { code: 200, desc: 'OK - Questions asked by user returned' }
    ]
  },
  {
    group: 'Anonymous Q&A',
    method: 'GET',
    path: '/api/v3/qa/pending-count',
    summary: 'Get count of pending unanswered questions in inbox',
    description: 'Quick counter for unread / unanswered inbox badges.',
    auth: 'JWT (User Bearer Token)',
    responses: [
      { code: 200, desc: 'OK - { pendingCount: number }' }
    ]
  },

  // ================= NOTIFICATIONS =================
  {
    group: 'Notifications',
    method: 'GET',
    path: '/api/v3/notifications',
    summary: 'Get user notifications',
    description: 'Fetches in-app notifications for reactions, comments, feedback, and Q&A updates.',
    auth: 'JWT (User Bearer Token)',
    responses: [
      { code: 200, desc: 'OK - Notification list returned' }
    ]
  },
  {
    group: 'Notifications',
    method: 'GET',
    path: '/api/v3/notifications/unread-count',
    summary: 'Get unread notification count',
    description: 'Returns badge count of unread notifications for navbar bell icon.',
    auth: 'JWT (User Bearer Token)',
    responses: [
      { code: 200, desc: 'OK - { count: number }' }
    ]
  },
  {
    group: 'Notifications',
    method: 'PUT',
    path: '/api/v3/notifications/{id}/read',
    summary: 'Mark single notification as read',
    description: 'Updates notification state to read.',
    auth: 'JWT (User Bearer Token)',
    params: {
      id: 'Notification ID'
    },
    responses: [
      { code: 200, desc: 'OK - Notification marked as read' }
    ]
  },
  {
    group: 'Notifications',
    method: 'PUT',
    path: '/api/v3/notifications/read-all',
    summary: 'Mark all notifications as read',
    description: 'Clears all unread notifications for the authenticated user.',
    auth: 'JWT (User Bearer Token)',
    responses: [
      { code: 200, desc: 'OK - All marked as read' }
    ]
  }
]

const categories = [
  'All',
  'Authentication',
  'Feed',
  'Opinion Polls',
  'Anonymous Q&A',
  'Notifications',
  'Confessions',
  'Feedback',
  'Reports',
  'User Account',
  'Admin',
  'Health'
]

function Api() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)

  const filteredEndpoints = apiEndpoints.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.group === selectedCategory
    const matchesSearch =
      item.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.method.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const current = filteredEndpoints[selectedIdx] || filteredEndpoints[0] || apiEndpoints[0]

  const getMethodBadge = (method) => {
    switch (method) {
      case 'GET':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
      case 'POST':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/30'
      case 'PUT':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30'
      case 'PATCH':
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30'
      case 'DELETE':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30'
      default:
        return 'text-slate-400 bg-gray-800'
    }
  }

  return (
    <main className="container-page py-10 sm:py-14 space-y-10">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="kicker text-indigo-400">OpenAPI 3 / Swagger Reference</span>
          <span className="text-slate-600">•</span>
          <span className="text-xs text-slate-400 font-mono">Base: /api/v3</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-50 tracking-tight">
          VibeWall REST API Specification
        </h1>

        <p className="text-slate-300 max-w-3xl text-sm sm:text-base leading-relaxed">
          Detailed documentation for all public and protected REST routes. Public endpoints require no authentication;
          protected endpoints require an <code className="text-indigo-300 font-mono">Authorization: Bearer &lt;jwt&gt;</code> header.
        </p>

        {/* Live Swagger link card */}
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <span className="font-semibold text-indigo-300">Interactive Swagger UI Available:</span>
            <p className="text-slate-300 font-mono">http://localhost:8080/api/v3/swagger-ui.html</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="http://localhost:8080/api/v3/swagger-ui.html"
              target="_blank"
              rel="noreferrer"
              className="btn-primary px-3 py-1.5 text-xs rounded-lg no-underline whitespace-nowrap"
            >
              Open Swagger UI ↗
            </a>
            <a
              href="http://localhost:8080/api/v3/api-docs"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost px-3 py-1.5 text-xs rounded-lg no-underline whitespace-nowrap"
            >
              OpenAPI JSON Spec
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-1">
          <Link to="/" className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition-colors">
            ← Back to Overview
          </Link>
          <span className="text-slate-700">|</span>
          <Link to="/setup" className="text-slate-300 hover:text-white text-sm font-semibold transition-colors">
            Setup &amp; Run with Docker →
          </Link>
        </div>
      </header>

      {/* Category Pills & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat)
                  setSelectedIdx(0)
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-indigo-500 text-white font-semibold'
                    : 'bg-gray-900/60 text-slate-400 hover:bg-gray-800 hover:text-slate-200 border border-gray-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search endpoints..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setSelectedIdx(0)
              }}
              className="w-full rounded-lg border border-gray-800 bg-gray-950/80 px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar + Endpoint Inspector */}
      <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-6">
        {/* Endpoint List Sidebar */}
        <aside className="card p-3 h-[75vh] overflow-y-auto border-gray-800 bg-gray-950/70">
          <p className="kicker text-slate-400 px-2 py-1 mb-2">
            Endpoints ({filteredEndpoints.length})
          </p>
          <ul className="space-y-1">
            {filteredEndpoints.map((item, idx) => (
              <li key={idx}>
                <button
                  onClick={() => setSelectedIdx(idx)}
                  className={`w-full text-left rounded-lg p-2.5 transition flex flex-col gap-1 ${
                    idx === selectedIdx
                      ? 'bg-indigo-500/20 text-white border border-indigo-500/50'
                      : 'text-slate-400 hover:bg-gray-800/50 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${getMethodBadge(
                        item.method
                      )}`}
                    >
                      {item.method}
                    </span>
                    <span className="text-xs font-mono truncate text-slate-200">
                      {item.path}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 line-clamp-1">
                    {item.summary}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Detailed Inspector */}
        <section className="card p-6 sm:p-8 space-y-6 border-gray-800 bg-gray-950/70">
          {current ? (
            <>
              {/* Endpoint Header */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${getMethodBadge(
                      current.method
                    )}`}
                  >
                    {current.method}
                  </span>
                  <code className="text-base sm:text-lg font-mono font-bold text-slate-100">
                    {current.path}
                  </code>
                </div>

                <h2 className="text-xl font-bold text-slate-50">
                  {current.summary}
                </h2>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {current.description}
                </p>

                {/* Auth badge */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs font-mono text-slate-400">Authorization:</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                    {current.auth}
                  </span>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-indigo-500/40 via-gray-800 to-transparent" />

              {/* Path / Query Parameters */}
              {current.params && (
                <div className="space-y-2">
                  <p className="text-xs font-mono uppercase tracking-wider text-indigo-400">
                    Parameters
                  </p>
                  <div className="bg-black/60 rounded-xl border border-gray-800 p-4 font-mono text-xs text-slate-300">
                    {Object.entries(current.params).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-2 py-0.5">
                        <span className="text-sky-300 font-semibold">{key}:</span>
                        <span className="text-slate-400">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Request Body */}
              {current.body && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono uppercase tracking-wider text-indigo-400">
                      Request Body (application/json)
                    </span>
                    <span className="text-slate-500 font-mono">JSON</span>
                  </div>
                  <pre className="bg-black/80 rounded-xl border border-gray-800 p-4 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                    <code>{JSON.stringify(current.body, null, 2)}</code>
                  </pre>
                </div>
              )}

              {/* Response Example */}
              {current.responseExample && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono uppercase tracking-wider text-sky-400">
                      Sample Response
                    </span>
                    <span className="text-slate-500 font-mono">200 OK</span>
                  </div>
                  <pre className="bg-black/80 rounded-xl border border-gray-800 p-4 font-mono text-xs text-sky-200 overflow-x-auto leading-relaxed">
                    <code>{typeof current.responseExample === 'string' ? current.responseExample : JSON.stringify(current.responseExample, null, 2)}</code>
                  </pre>
                </div>
              )}

              {/* Response Status Codes */}
              {current.responses && (
                <div className="space-y-2">
                  <p className="text-xs font-mono uppercase tracking-wider text-indigo-400">
                    Status Codes &amp; Outcomes
                  </p>
                  <div className="grid gap-2">
                    {current.responses.map((resp, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-lg border border-gray-800/80 bg-gray-900/40 p-2.5 text-xs"
                      >
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded ${
                            resp.code < 300
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : resp.code === 422
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {resp.code}
                        </span>
                        <span className="text-slate-300 font-mono pt-0.5">{resp.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-slate-400">No matching endpoint found.</p>
          )}
        </section>
      </div>
    </main>
  )
}

export default Api