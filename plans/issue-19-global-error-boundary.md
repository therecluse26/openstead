# Issue #19: Global React Error Boundary

**Priority:** 🔴 HIGH
**Complexity:** Easy
**Estimated Time:** 2-3 hours
**Status:** Not Started

## Overview

Implement a global error boundary to catch React errors application-wide and prevent silent failures. This will provide consistent error messaging via the existing ToastContext and improve overall app robustness.

## Current State

- ❌ No ErrorBoundary component exists
- ❌ Error handling is scattered across components
- ❌ Manual `.catch()` blocks use inconsistent error display (some use `alert()`, some use `showToast()`)
- ✅ ToastContext already integrated globally (perfect foundation)

**Examples of current error handling:**
- `/frontend/src/pages/users/[id]/index.js` - uses `alert(error)`
- `/frontend/src/forms/Users/UserForm.js` - uses `showToast()` for errors
- Various form components manually handle errors via React Hook Form

## Implementation Plan

### Phase 1: Create ErrorBoundary Component

- [ ] Create `/frontend/src/components/ErrorBoundary.js`
  - [ ] Extend `React.Component` with error boundary lifecycle methods
  - [ ] Implement `static getDerivedStateFromError(error)` to update state
  - [ ] Implement `componentDidCatch(error, errorInfo)` to log errors
  - [ ] Add state: `{ hasError: false, error: null }`
  - [ ] Use ToastContext to show error notifications
  - [ ] Provide user-friendly fallback UI when errors occur
  - [ ] Add "Try Again" button that resets error state
  - [ ] Log errors to console (and optionally monitoring service)

**Component Structure:**
```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to console/monitoring
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
    }
    return this.props.children;
  }
}
```

### Phase 2: Integrate with App

- [ ] Update `/frontend/src/pages/_app.js`
  - [ ] Import ErrorBoundary component
  - [ ] Wrap entire app with `<ErrorBoundary>`
  - [ ] Place inside existing `ThemeContextProvider` and `ToastContextProvider`
  - [ ] Ensure Toast ref is accessible to ErrorBoundary

**Wrapping Order:**
```jsx
<ThemeContextProvider>
  <ToastContextProvider>
    <ErrorBoundary>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ErrorBoundary>
  </ToastContextProvider>
</ThemeContextProvider>
```

### Phase 3: Toast Integration

- [ ] Access ToastContext within ErrorBoundary
  - [ ] Use `useContext(ToastContext)` via a wrapper or class-based approach
  - [ ] Show toast notification when error is caught
  - [ ] Use `severity: 'error'` for toast messages
  - [ ] Message format: "An error has occurred. Please try again."

**Options for Context Access:**
- Option A: Wrap ErrorBoundary with a functional component that uses `useContext`
- Option B: Use `<ToastContext.Consumer>` inside ErrorBoundary render
- Option C: Pass toast ref as prop to ErrorBoundary

### Phase 4: Fallback UI Design

- [ ] Create error fallback page
  - [ ] Display generic error message (don't expose technical details to users)
  - [ ] Show "Try Again" button to reset error boundary
  - [ ] Show "Go to Dashboard" button as escape route
  - [ ] Use PrimeReact Message or Panel component for styling
  - [ ] Include visual indicator (icon/illustration)
  - [ ] Match app theme/branding

**Fallback UI Structure:**
```jsx
<div className="error-boundary-fallback">
  <Message severity="error" text="An error has occurred" />
  <p>We're sorry, something went wrong. Please try again.</p>
  <Button label="Try Again" onClick={this.resetError} />
  <Button label="Go to Dashboard" onClick={() => router.push('/')} />
</div>
```

### Phase 5: Error Logging (Optional)

- [ ] Add error logging service integration
  - [ ] Log errors to console (development)
  - [ ] Send errors to monitoring service (production)
  - [ ] Include error stack trace
  - [ ] Include user context (tenant ID, user ID)
  - [ ] Include component stack from `errorInfo`

**Logging Options:**
- Sentry integration
- LogRocket
- Custom API endpoint to Laravel backend
- Browser console only (simplest)

### Phase 6: Testing

- [ ] Create intentional errors to test error boundary
  - [ ] Throw error in component render method
  - [ ] Trigger error in event handler
  - [ ] Test error in async operation
  - [ ] Test error in different routes
  - [ ] Verify toast notification appears
  - [ ] Verify fallback UI renders correctly
  - [ ] Test "Try Again" button resets state
  - [ ] Test error boundary doesn't catch errors in event handlers (expected behavior)

**Test Cases:**
```jsx
// Test component
const ErrorTest = () => {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error('Test error boundary');
  }

  return <Button label="Trigger Error" onClick={() => setShouldError(true)} />;
};
```

## Critical Files

### Files to Create:
- `/frontend/src/components/ErrorBoundary.js` - New error boundary component

### Files to Modify:
- `/frontend/src/pages/_app.js` - Wrap app with ErrorBoundary

### Files to Reference:
- `/frontend/src/components/Context/ToastContext.js` - Existing toast system
- `/frontend/src/components/AppBase/Layouts/AppLayout.js` - Current app layout

## Technical Considerations

### Error Boundary Limitations
- ⚠️ Error boundaries do NOT catch errors in:
  - Event handlers (use try-catch manually)
  - Asynchronous code (setTimeout, promises)
  - Server-side rendering
  - Errors thrown in the error boundary itself

### Solutions for Uncaught Errors
- Event handlers: Wrap with try-catch, call toast directly
- Async operations: Use .catch() with toast notification
- Consider adding `window.onerror` global handler as backup

### Performance
- Error boundaries have minimal performance impact
- Only re-renders when error state changes
- Fallback UI is lightweight

## Verification Checklist

- [ ] ErrorBoundary component created and exported
- [ ] App wrapped with ErrorBoundary in `_app.js`
- [ ] Toast notification shows when error occurs
- [ ] Fallback UI displays with error message
- [ ] "Try Again" button resets error state successfully
- [ ] Errors logged to console with stack trace
- [ ] Multiple test scenarios pass:
  - [ ] Render error in component
  - [ ] Error in nested component
  - [ ] Error in different routes
  - [ ] Error doesn't break entire app (isolated to boundary)
- [ ] No console warnings about missing error boundary
- [ ] Toast notification matches app styling
- [ ] Fallback UI matches app theme

## Success Criteria

✅ **Complete when:**
1. Global ErrorBoundary wraps entire app
2. Errors display user-friendly toast notifications
3. Fallback UI appears on error
4. Users can recover via "Try Again" button
5. All test cases pass
6. No silent failures in app

## Next Steps After Completion

- Close Issue #19 on GitHub
- Document error boundary behavior in README
- Move to Issue #20 (RichEditor bug fix) or Issue #15 (User Management)

## Notes

- Keep error messages generic for users (don't expose technical details)
- Consider adding error reporting to backend for production monitoring
- Review existing error handling patterns and standardize where possible
- This is a foundation piece - improves reliability of all future features
