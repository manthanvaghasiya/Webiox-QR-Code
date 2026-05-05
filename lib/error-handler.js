/**
 * Standardized error handling and response utilities
 */

import { NextResponse } from 'next/server';

export const ErrorTypes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  BAD_REQUEST: 'BAD_REQUEST',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMIT: 'RATE_LIMIT',
};

export class ApiError extends Error {
  constructor(type, message, statusCode = 500, details = null) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Standard error responses
export const ErrorResponses = {
  unauthorized: () => new ApiError(
    ErrorTypes.UNAUTHORIZED,
    'Unauthorized',
    401
  ),
  forbidden: () => new ApiError(
    ErrorTypes.FORBIDDEN,
    'Forbidden',
    403
  ),
  notFound: (resource = 'Resource') => new ApiError(
    ErrorTypes.NOT_FOUND,
    `${resource} not found`,
    404
  ),
  badRequest: (message) => new ApiError(
    ErrorTypes.BAD_REQUEST,
    message || 'Bad request',
    400
  ),
  conflict: (message) => new ApiError(
    ErrorTypes.CONFLICT,
    message || 'Conflict',
    409
  ),
  validationError: (message) => new ApiError(
    ErrorTypes.VALIDATION_ERROR,
    message || 'Validation failed',
    400
  ),
};

// Convert ApiError to NextResponse
export function errorToResponse(error) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        type: error.type,
        ...(error.details && { details: error.details }),
      },
      { status: error.statusCode }
    );
  }

  // Log unexpected errors
  console.error('Unexpected error:', error);

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}

// Safe error logging (no sensitive data)
export function logError(context, error) {
  const safeError = {
    timestamp: new Date().toISOString(),
    context,
    message: error?.message || 'Unknown error',
    type: error?.type || 'UNKNOWN',
    statusCode: error?.statusCode || 500,
  };

  if (process.env.NODE_ENV === 'development') {
    console.error(safeError);
  } else {
    // In production, consider sending to error tracking service
    console.error(JSON.stringify(safeError));
  }
}
