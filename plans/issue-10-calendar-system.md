# Issue #10: Calendar System

**Priority:** 🔵 LOW (Major Feature)
**Complexity:** Very Hard
**Estimated Time:** 30-40 hours
**Status:** Not Started

## Overview

Implement a comprehensive calendar system that supports both manual and automatic events. The calendar should handle multi-day events, recurring events, assignees, reminders, and integrate with various modules (planting schedules, medication reminders, project due dates, etc.).

## Scope

### Core Features
- Global calendar UI with month/week/day views
- Manual event creation/editing/deletion
- Multi-day event support (event spans)
- Recurring events (daily, weekly, monthly, yearly with end conditions)
- Event assignees (multiple users per event)
- Reminders/notifications (configurable timing)
- Multiple notification methods (email, push, in-app)

### Auto-Generated Events
- Planting/harvest date reminders (from seed inventory)
- Animal medication schedules (from livestock service logs)
- Project item due date reminders
- Chore reminders (potential new module)

### Advanced Features
- Push notification infrastructure
- Recurring event management dashboard
- Event categories/types with color coding
- Event search and filtering
- iCal export/import
- Calendar sharing (optional)

## Current State

- ❌ No calendar infrastructure exists
- ❌ No event model or database schema
- ❌ No notification system (foundational requirement)
- ❌ No push notification infrastructure
- ✅ Existing modules have date fields that could trigger events (planting dates, service dates, etc.)

## Architecture Decisions

### Database Design: Recurring Events

**Challenge:** How to store and display recurring events efficiently?

**Option A: Expand All Occurrences (Not Recommended)**
- Create individual event records for each occurrence
- Pros: Simple queries, easy to modify individual occurrences
- Cons: Data bloat, difficult to update entire series

**Option B: Store Pattern, Generate On-Demand (Recommended)**
- Store recurrence pattern once, generate occurrences when querying
- Pros: Efficient storage, easy to update series
- Cons: More complex query logic

**Option C: Hybrid Approach**
- Store pattern + generate limited future occurrences (e.g., next 90 days)
- Regenerate as time progresses
- Pros: Balance of performance and flexibility
- Cons: Background job needed for regeneration

**Decision:** Use Option B (Store Pattern, Generate On-Demand)

### Notification System Architecture

**Option A: Laravel Notifications (Recommended)**
- Built-in notification system in Laravel
- Supports multiple channels (mail, database, custom)
- Easy to extend with custom channels (push notifications)

**Option B: Custom Queue-Based System**
- More control, more complexity
- Use Laravel queues with scheduled jobs

**Decision:** Use Laravel Notifications with scheduled jobs for reminder triggers

## Implementation Plan

### Phase 1: Database Schema - Core Events

- [ ] Create migration: `create_calendar_events_table`
  - [ ] `id` (ULID primary key)
  - [ ] `tenant_id` (string, foreign key to tenants)
  - [ ] `title` (string) - Event name
  - [ ] `description` (text, nullable) - Event details
  - [ ] `event_type` (enum: manual, planting, medication, project_due, chore) - Event category
  - [ ] `start_date` (datetime) - Event start
  - [ ] `end_date` (datetime, nullable) - Event end (for multi-day events)
  - [ ] `all_day` (boolean, default false) - All-day event flag
  - [ ] `location` (string, nullable) - Event location
  - [ ] `color` (string, nullable) - Display color (hex)
  - [ ] `created_by` (string, foreign key to users) - Creator
  - [ ] `source_type` (string, nullable) - Polymorphic source (e.g., 'App\Models\Seed')
  - [ ] `source_id` (string, nullable) - Polymorphic source ID
  - [ ] `recurrence_pattern` (JSON, nullable) - Recurrence rules (see schema below)
  - [ ] `recurrence_end_date` (datetime, nullable) - When recurrence stops
  - [ ] `created_at`, `updated_at`, `deleted_at`
  - [ ] Indexes: `tenant_id`, `start_date`, `end_date`, `event_type`, `source_type/id`

**Recurrence Pattern JSON Schema:**
```json
{
  "frequency": "daily|weekly|monthly|yearly",
  "interval": 1,
  "days_of_week": [0, 1, 2, 3, 4, 5, 6],
  "day_of_month": 15,
  "month_of_year": 6,
  "until": "2025-12-31T23:59:59Z"
}
```

- [ ] Create model: `/backend/app/Models/CalendarEvent.php`
  - [ ] Use `HasUlids`, `BelongsToTenant`, `SoftDeletes`
  - [ ] Casts: `start_date`, `end_date`, `recurrence_end_date` as `datetime`
  - [ ] Casts: `recurrence_pattern` as `array`
  - [ ] Casts: `all_day` as `boolean`
  - [ ] Relationship: `belongsTo(User::class, 'created_by')`
  - [ ] Relationship: `morphTo('source')` - Polymorphic source
  - [ ] Relationship: `hasMany(EventAssignee::class)`
  - [ ] Relationship: `hasMany(EventReminder::class)`
  - [ ] Scope: `scopeInRange($query, $start, $end)` - Events in date range
  - [ ] Scope: `scopeRecurring($query)` - Only recurring events
  - [ ] Method: `isRecurring()` - Check if event recurs
  - [ ] Method: `generateOccurrences($startDate, $endDate)` - Generate event instances for range

### Phase 2: Database Schema - Assignees & Reminders

- [ ] Create migration: `create_event_assignees_table`
  - [ ] `id` (ULID primary key)
  - [ ] `calendar_event_id` (string, foreign key to calendar_events)
  - [ ] `user_id` (string, foreign key to users)
  - [ ] `created_at`, `updated_at`
  - [ ] Unique constraint on `[calendar_event_id, user_id]`

- [ ] Create model: `/backend/app/Models/EventAssignee.php`
  - [ ] Use `HasUlids`
  - [ ] Relationship: `belongsTo(CalendarEvent::class)`
  - [ ] Relationship: `belongsTo(User::class)`

- [ ] Create migration: `create_event_reminders_table`
  - [ ] `id` (ULID primary key)
  - [ ] `calendar_event_id` (string, foreign key to calendar_events)
  - [ ] `user_id` (string, foreign key to users) - Who to remind
  - [ ] `remind_at` (datetime) - When to send reminder
  - [ ] `reminder_type` (enum: email, push, in_app) - Notification channel
  - [ ] `sent_at` (datetime, nullable) - When reminder was sent
  - [ ] `created_at`, `updated_at`
  - [ ] Index on `remind_at` (for scheduled jobs)

- [ ] Create model: `/backend/app/Models/EventReminder.php`
  - [ ] Use `HasUlids`
  - [ ] Casts: `remind_at`, `sent_at` as `datetime`
  - [ ] Relationship: `belongsTo(CalendarEvent::class)`
  - [ ] Relationship: `belongsTo(User::class)`
  - [ ] Scope: `scopePending()` - Not sent yet
  - [ ] Scope: `scopeDue()` - remind_at <= now

### Phase 3: Recurring Event Logic

- [ ] Create service: `/backend/app/Services/RecurrenceService.php`
  - [ ] Method: `generateOccurrences(CalendarEvent $event, Carbon $startDate, Carbon $endDate): Collection`
    - Parse recurrence pattern
    - Generate all occurrences in range
    - Respect recurrence_end_date
    - Handle daily, weekly, monthly, yearly patterns
    - Return collection of virtual event instances (not saved to DB)
  - [ ] Method: `getNextOccurrence(CalendarEvent $event, Carbon $afterDate): ?Carbon`
    - Calculate next occurrence after given date
  - [ ] Use library: `nesbot/carbon` for date manipulation
  - [ ] Optional: Use `simshaun/recurr` library for complex recurrence rules (RFC 5545)

**Example Implementation:**
```php
class RecurrenceService
{
    public function generateOccurrences(CalendarEvent $event, Carbon $start, Carbon $end): Collection
    {
        if (!$event->isRecurring()) {
            return collect([]);
        }

        $pattern = $event->recurrence_pattern;
        $occurrences = collect([]);
        $current = Carbon::parse($event->start_date);

        while ($current <= $end && ($event->recurrence_end_date === null || $current <= $event->recurrence_end_date)) {
            if ($current >= $start) {
                $occurrences->push([
                    'id' => $event->id . '_' . $current->format('Ymd'),
                    'title' => $event->title,
                    'start_date' => $current->copy(),
                    'end_date' => $event->end_date ? $current->copy()->addSeconds($event->start_date->diffInSeconds($event->end_date)) : null,
                    'is_recurring_instance' => true,
                    'parent_event_id' => $event->id,
                ]);
            }

            // Advance to next occurrence
            $current = $this->getNextOccurrence($pattern, $current);
        }

        return $occurrences;
    }

    protected function getNextOccurrence(array $pattern, Carbon $current): Carbon
    {
        $interval = $pattern['interval'] ?? 1;

        return match($pattern['frequency']) {
            'daily' => $current->addDays($interval),
            'weekly' => $current->addWeeks($interval),
            'monthly' => $current->addMonths($interval),
            'yearly' => $current->addYears($interval),
            default => $current->addDay(),
        };
    }
}
```

### Phase 4: Backend API - Calendar Events CRUD

- [ ] Create controller: `/backend/app/Http/Controllers/Calendar/CalendarEventController.php`
  - [ ] `index(Request $request)` - List events in date range
    - Query params: `start_date`, `end_date`, `event_type`, `assignee_id`
    - Fetch regular events in range
    - Generate recurring event occurrences via RecurrenceService
    - Merge and return combined list
  - [ ] `store(Request $request)` - Create new event
    - Validate: title, start_date, end_date, recurrence_pattern, assignees, reminders
    - Create CalendarEvent
    - Create EventAssignee records
    - Create EventReminder records
    - Return created event
  - [ ] `show($id)` - Get event details
  - [ ] `update(Request $request, $id)` - Update event
    - Handle series vs. single occurrence updates
    - If updating recurring event, ask: "Update this instance or all future?"
  - [ ] `destroy($id)` - Delete event
    - Handle series vs. single occurrence deletion
  - [ ] `updateSeries($id, Request $request)` - Update entire recurring series
  - [ ] `deleteSeries($id)` - Delete entire recurring series

- [ ] Create routes: `/backend/routes/calendar/calendar-event-routes.php`
  ```php
  Route::get('/', [CalendarEventController::class, 'index']);
  Route::post('/', [CalendarEventController::class, 'store']);
  Route::get('/{id}', [CalendarEventController::class, 'show']);
  Route::put('/{id}', [CalendarEventController::class, 'update']);
  Route::delete('/{id}', [CalendarEventController::class, 'destroy']);
  Route::put('/{id}/series', [CalendarEventController::class, 'updateSeries']);
  Route::delete('/{id}/series', [CalendarEventController::class, 'deleteSeries']);
  ```

- [ ] Register routes in `/backend/routes/api.php`:
  ```php
  Route::prefix('/calendar/events')->middleware(['auth:sanctum', InitializeTenancyByRequestData::class])
      ->group(base_path('routes/calendar/calendar-event-routes.php'));
  ```

### Phase 5: Auto-Generated Events Integration

- [ ] Create observers or event listeners for:
  - [ ] Seed planting dates → Create CalendarEvent with `event_type=planting`, `source_type=Seed`, `source_id={id}`
  - [ ] Livestock medication schedules → Create recurring CalendarEvent with `event_type=medication`
  - [ ] Project item due dates → Create CalendarEvent with `event_type=project_due`
  - [ ] Future: Chore schedules (if chore module created)

**Example Observer:**
```php
// /backend/app/Observers/SeedObserver.php
class SeedObserver
{
    public function created(Seed $seed)
    {
        if ($seed->planting_date) {
            CalendarEvent::create([
                'tenant_id' => $seed->tenant_id,
                'title' => "Plant {$seed->variety->name}",
                'event_type' => 'planting',
                'start_date' => $seed->planting_date,
                'all_day' => true,
                'source_type' => Seed::class,
                'source_id' => $seed->id,
                'created_by' => auth()->id(),
            ]);
        }

        if ($seed->harvest_date) {
            CalendarEvent::create([
                'tenant_id' => $seed->tenant_id,
                'title' => "Harvest {$seed->variety->name}",
                'event_type' => 'planting',
                'start_date' => $seed->harvest_date,
                'all_day' => true,
                'source_type' => Seed::class,
                'source_id' => $seed->id,
                'created_by' => auth()->id(),
            ]);
        }
    }

    public function updated(Seed $seed)
    {
        // Update or recreate related calendar events
    }

    public function deleted(Seed $seed)
    {
        // Delete related calendar events
        CalendarEvent::where('source_type', Seed::class)
            ->where('source_id', $seed->id)
            ->delete();
    }
}
```

### Phase 6: Notification System

- [ ] Create notification: `/backend/app/Notifications/EventReminder.php`
  - [ ] Via mail: Send email with event details
  - [ ] Via database: Store notification in database table
  - [ ] Via push: Send push notification (if push infrastructure exists)
  - [ ] Include event details, time until event, link to calendar

- [ ] Create scheduled job: `/backend/app/Console/Commands/SendEventReminders.php`
  - [ ] Run every minute (or 5 minutes)
  - [ ] Query EventReminder where `remind_at <= now()` and `sent_at is null`
  - [ ] For each reminder:
    - [ ] Send notification to user
    - [ ] Mark reminder as sent (`sent_at = now()`)
  - [ ] Schedule in `/backend/app/Console/Kernel.php`:
    ```php
    $schedule->command('events:send-reminders')->everyMinute();
    ```

### Phase 7: Frontend Service

- [ ] Create service: `/frontend/src/services/CalendarEventService.js`
  ```javascript
  class CalendarEventService {
      static async getEvents(startDate, endDate, filters = {}) {
          return axios.get('/api/calendar/events', {
              params: { start_date: startDate, end_date: endDate, ...filters }
          });
      }

      static async create(data) {
          return axios.post('/api/calendar/events', data);
      }

      static async update(id, data) {
          return axios.put(`/api/calendar/events/${id}`, data);
      }

      static async updateSeries(id, data) {
          return axios.put(`/api/calendar/events/${id}/series`, data);
      }

      static async delete(id) {
          return axios.delete(`/api/calendar/events/${id}`);
      }

      static async deleteSeries(id) {
          return axios.delete(`/api/calendar/events/${id}/series`);
      }
  }
  ```

### Phase 8: Frontend Calendar UI

- [ ] Choose calendar library:
  - **Option A:** FullCalendar (popular, feature-rich, premium for some features)
  - **Option B:** PrimeReact Calendar/Schedule (integrated with existing UI)
  - **Option C:** react-big-calendar (free, flexible)
  - **Recommendation:** PrimeReact Schedule or react-big-calendar

- [ ] Create page: `/frontend/src/pages/calendar/index.js`
  - [ ] Import chosen calendar library
  - [ ] Fetch events for current month/week
  - [ ] Display events on calendar
  - [ ] Click event → show EventDetailDialog
  - [ ] Click empty cell → create new event
  - [ ] Drag event → update event dates
  - [ ] View switcher: Month | Week | Day | List
  - [ ] Filter by event type (planting, medication, project, manual, etc.)
  - [ ] Filter by assignee

**Example with react-big-calendar:**
```jsx
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
    const [events, setEvents] = useState([]);
    const [view, setView] = useState('month');
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        fetchEvents();
    }, [view, date]);

    const fetchEvents = async () => {
        const startDate = moment(date).startOf(view).toISOString();
        const endDate = moment(date).endOf(view).toISOString();
        const res = await CalendarEventService.getEvents(startDate, endDate);
        setEvents(res.data.map(e => ({
            id: e.id,
            title: e.title,
            start: new Date(e.start_date),
            end: new Date(e.end_date || e.start_date),
            resource: e
        })));
    };

    const handleSelectSlot = ({ start, end }) => {
        // Open create event dialog with pre-filled dates
        setEventDialogVisible(true);
        setSelectedEvent({ start_date: start, end_date: end });
    };

    const handleSelectEvent = (event) => {
        // Open event detail dialog
        setSelectedEvent(event.resource);
        setEventDetailVisible(true);
    };

    return (
        <div style={{ height: '600px' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                view={view}
                onView={setView}
                date={date}
                onNavigate={setDate}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                selectable
                style={{ height: '100%' }}
            />
        </div>
    );
};
```

### Phase 9: Event Creation/Edit Form

- [ ] Create form: `/frontend/src/forms/Calendar/CalendarEventForm.js`
  - [ ] Fields:
    - [ ] Title (text input, required)
    - [ ] Description (rich text editor)
    - [ ] Event Type (dropdown: manual, planting, medication, project, chore)
    - [ ] Start Date/Time (calendar + time picker)
    - [ ] End Date/Time (calendar + time picker, optional)
    - [ ] All Day Event (checkbox)
    - [ ] Location (text input, optional)
    - [ ] Color (color picker)
    - [ ] Assignees (multiselect users)
    - [ ] Recurrence (checkbox + recurrence builder)
    - [ ] Reminders (add multiple reminders with timing + channel)
  - [ ] Recurrence Builder:
    - [ ] Frequency (daily, weekly, monthly, yearly)
    - [ ] Interval (every X days/weeks/months/years)
    - [ ] Days of week (if weekly)
    - [ ] End date or never
  - [ ] Submit: Create or Update event via CalendarEventService

- [ ] Create component: `/frontend/src/components/Calendar/RecurrenceBuilder.js`
  - [ ] UI to configure recurrence pattern
  - [ ] Visual preview of recurrence ("Occurs every 2 weeks on Monday and Wednesday")

### Phase 10: Recurring Event Management

- [ ] Create page: `/frontend/src/pages/calendar/recurring-events.js`
  - [ ] List all recurring events (not individual occurrences)
  - [ ] DataTable with columns: Title, Pattern, Start, End, Actions
  - [ ] Actions: Edit Series, Delete Series
  - [ ] Helps users manage all recurring events in one place

### Phase 11: Push Notifications (Optional, Advanced)

- [ ] Choose push notification service:
  - **Option A:** Firebase Cloud Messaging (FCM)
  - **Option B:** Pusher
  - **Option C:** OneSignal
  - **Recommendation:** FCM (free, reliable)

- [ ] Backend: Install `laravel-notification-channels/fcm`
  - [ ] Configure FCM credentials
  - [ ] Create custom notification channel for FCM
  - [ ] Store device tokens in users table or separate table

- [ ] Frontend: Integrate Firebase SDK
  - [ ] Request notification permission
  - [ ] Get device token, send to backend
  - [ ] Listen for push notifications, display in-app

### Phase 12: Testing

- [ ] Backend Testing
  - [ ] Test CalendarEvent CRUD operations
  - [ ] Test RecurrenceService.generateOccurrences() with various patterns
  - [ ] Test recurring event queries
  - [ ] Test event reminder scheduled job
  - [ ] Test notification sending
  - [ ] Test auto-generated events (observers)
  - [ ] Test multi-tenant isolation

- [ ] Frontend Testing
  - [ ] Test calendar rendering (month, week, day views)
  - [ ] Test event creation/editing
  - [ ] Test recurring event configuration
  - [ ] Test event deletion (single vs. series)
  - [ ] Test assignee selection
  - [ ] Test reminder configuration
  - [ ] Test calendar filters

- [ ] Integration Testing
  - [ ] Create manual event → Appears on calendar → Edit → Delete
  - [ ] Create recurring event → All occurrences display → Update series → Verify changes
  - [ ] Add planting date to seed → Event auto-created → Appears on calendar
  - [ ] Add reminder to event → Reminder sent at correct time
  - [ ] Assign event to user → User sees event on their calendar

## Critical Files

### Backend Files to Create:
- Migrations: `calendar_events`, `event_assignees`, `event_reminders`
- Models: `CalendarEvent.php`, `EventAssignee.php`, `EventReminder.php`
- Services: `RecurrenceService.php`
- Controllers: `CalendarEventController.php`
- Routes: `calendar/calendar-event-routes.php`
- Notifications: `EventReminder.php`
- Commands: `SendEventReminders.php`
- Observers: `SeedObserver.php`, `LivestockObserver.php`, etc.

### Frontend Files to Create:
- Services: `CalendarEventService.js`
- Pages: `calendar/index.js`, `calendar/recurring-events.js`
- Forms: `CalendarEventForm.js`
- Components: `RecurrenceBuilder.js`, `EventDetailDialog.js`, `EventFilterPanel.js`

## Verification Checklist

- [ ] Calendar displays events for current month/week/day
- [ ] Users can create manual events
- [ ] Multi-day events display correctly
- [ ] Recurring events generate all occurrences
- [ ] Users can edit/delete single occurrence vs. entire series
- [ ] Auto-generated events created when planting/medication dates set
- [ ] Event assignees can be selected
- [ ] Reminders sent at correct time via correct channel
- [ ] Push notifications work (if implemented)
- [ ] Calendar views (month/week/day) work smoothly
- [ ] Event filtering by type and assignee works
- [ ] Recurring event management dashboard functional
- [ ] Multi-tenant isolation enforced

## Success Criteria

✅ **Complete when:**
1. Calendar UI displays events from multiple sources
2. Users can create, edit, delete manual events
3. Recurring events work correctly with all patterns
4. Auto-generated events created from seed/livestock/project modules
5. Reminder system sends notifications reliably
6. All test cases pass
7. Push notifications work (if scope includes)

## Future Enhancements

- Calendar sharing between users/tenants
- iCal export/import for external calendar sync
- Event attachments (files, images)
- Event comments/discussion threads
- Calendar integrations (Google Calendar, Outlook)
- Weather integration (show weather on calendar)
- Timezone support for events

## Notes

- This is a MAJOR feature requiring 30-40 hours of development
- Requires foundational notification infrastructure
- Consider breaking into multiple phases/sprints
- Recurring event logic is complex - thorough testing essential
- Push notifications are optional for MVP, can be added later
- Calendar is a high-value feature that ties together many modules
- Consider user feedback on recurrence patterns (daily/weekly may be most common)
