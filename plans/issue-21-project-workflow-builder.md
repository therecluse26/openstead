# Issue #21: Project-Specific Custom Workflow Builder

**Priority:** 🟢 MEDIUM-HIGH
**Complexity:** Hard
**Estimated Time:** 8-12 hours
**Status:** Backend Infrastructure Complete, UI Needed

## Overview

Allow users to customize project workflows by selecting and reordering status columns for each project. Currently, all projects use the same default statuses (Backlog, To Do, In Progress, Done). This feature enables per-project workflow customization to match different project types and team processes.

## Current State

### ✅ Backend Infrastructure (Ready to Use)
- `Project` model has `workflow_statuses` JSON field
- `ProjectItemStatus` model stores global status definitions (name, color, description, default_order)
- Auto-populates default statuses on project creation via `creating` event
- `workflow()` accessor builds status collection from JSON + database lookups
- Kanban board dynamically renders columns based on workflow
- API endpoint exists: `GET /api/projects/{id}/statuses` (returns project statuses)

**Current Project Model:**
```php
// /backend/app/Models/Project.php
protected $fillable = [
    'tenant_id',
    'name',
    'description',
    'workflow_statuses',  // JSON: [{'id': 'ulid', 'order': 0}, ...]
    'active',
];

protected static function booted(): void {
    static::creating(function ($project) {
        $statuses = ProjectItemStatus::default()->get();
        $project->workflow_statuses = $statuses->map(function ($status) {
            return ['id' => $status->id, 'order' => $status->default_order];
        })->toArray();
    });
}

public function workflow(): Attribute {
    return Attribute::make(
        get: fn() => collect($this->workflow_statuses)->map(function ($item) {
            $item['status'] = ProjectItemStatus::where('id', (string)$item['id'])->first();
            return $item;
        })
    );
}
```

### ❌ Missing UI Components
- No admin panel to select/reorder statuses
- No ability to create new custom ProjectItemStatus records
- No API endpoint to update `workflow_statuses` JSON
- No UI integration in project settings page

## Design Decisions

### Question: Global Status Library vs. Per-Project Custom Statuses?

**Option A: Global Status Library (Recommended for Phase 1)**
- Admin selects from pre-defined global statuses
- Reorder selected statuses for this project
- Simpler implementation
- Ensures consistency across projects
- Good starting point

**Option B: Per-Project Custom Statuses (Phase 2)**
- Users can create project-specific statuses
- More flexibility
- Risk of inconsistent naming/colors
- More complex implementation

**Decision:** Start with Option A (global library), add Option B later if needed.

## Implementation Plan

### Phase 1: Backend API - Update Workflow

- [ ] Create new API endpoint in `/backend/app/Http/Controllers/Projects/ProjectController.php`
  - [ ] Method: `updateWorkflow(Request $request, $projectId)`
  - [ ] Route: `PUT /api/projects/{id}/workflow`
  - [ ] Request validation:
    - [ ] `status_ids` - array of ProjectItemStatus IDs
    - [ ] Minimum 1 status required
    - [ ] All IDs must exist in ProjectItemStatus table
    - [ ] IDs must be unique
  - [ ] Update logic:
    - [ ] Build workflow_statuses JSON: `[{'id': 'ulid', 'order': 0}, ...]`
    - [ ] Save to project model
    - [ ] Return updated workflow
  - [ ] Authorization: `middleware('user-can:project:update')`

**Controller Method:**
```php
public function updateWorkflow(Request $request, $projectId)
{
    $request->validate([
        'status_ids' => 'required|array|min:1',
        'status_ids.*' => 'required|exists:project_item_statuses,id',
    ]);

    $project = Project::findOrFail($projectId);

    // Build workflow JSON
    $workflow = collect($request->status_ids)->map(function ($statusId, $index) {
        return ['id' => $statusId, 'order' => $index];
    })->toArray();

    $project->workflow_statuses = $workflow;
    $project->save();

    return response()->json([
        'workflow' => $project->workflow,
        'message' => 'Workflow updated successfully'
    ]);
}
```

- [ ] Add route in `/backend/routes/projects/project-routes.php`
  ```php
  Route::put('/{id}/workflow', [ProjectController::class, 'updateWorkflow'])
      ->middleware('user-can:project:update');
  ```

### Phase 2: Backend API - Manage Global Statuses (Optional for Phase 1)

If allowing creation of new global statuses:

- [ ] Create controller: `/backend/app/Http/Controllers/Projects/ProjectItemStatusController.php`
  - [ ] `index()` - List all global statuses
  - [ ] `store(Request $request)` - Create new global status
    - Validate: name, color, description
    - Default is_default to false
    - Return created status
  - [ ] `update(Request $request, $id)` - Update status
  - [ ] `destroy($id)` - Delete status (only if not used in any workflow)

- [ ] Add routes in `/backend/routes/projects/project-item-status-routes.php`
  ```php
  Route::get('/', [ProjectItemStatusController::class, 'index']);
  Route::post('/', [ProjectItemStatusController::class, 'store'])
      ->middleware('user-can:project:create');
  Route::put('/{id}', [ProjectItemStatusController::class, 'update'])
      ->middleware('user-can:project:update');
  Route::delete('/{id}', [ProjectItemStatusController::class, 'destroy'])
      ->middleware('user-can:project:delete');
  ```

- [ ] Register in `/backend/routes/api.php`:
  ```php
  Route::prefix('/project-statuses')->group(
      base_path('routes/projects/project-item-status-routes.php')
  );
  ```

### Phase 3: Frontend Service

- [ ] Create service: `/frontend/src/services/ProjectWorkflowService.js`
  ```javascript
  class ProjectWorkflowService {
      static async getWorkflow(projectId) {
          return axios.get(`/api/projects/${projectId}/statuses`);
      }

      static async updateWorkflow(projectId, statusIds) {
          return axios.put(`/api/projects/${projectId}/workflow`, {
              status_ids: statusIds
          });
      }
  }

  class ProjectItemStatusService {
      static async getAll() {
          return axios.get('/api/project-statuses');
      }

      static async create(data) {
          return axios.post('/api/project-statuses', data);
      }

      static async update(id, data) {
          return axios.put(`/api/project-statuses/${id}`, data);
      }

      static async delete(id) {
          return axios.delete(`/api/project-statuses/${id}`);
      }
  }
  ```

### Phase 4: Frontend Component - Workflow Builder

- [ ] Create component: `/frontend/src/components/Projects/WorkflowBuilder.js`
  - [ ] Props: `projectId`, `currentWorkflow`, `onSave`, `onCancel`
  - [ ] State:
    - [ ] `availableStatuses` - all global statuses
    - [ ] `selectedStatuses` - current project workflow (reorderable)
  - [ ] UI sections:
    - [ ] **Available Statuses (Left):** List of all global statuses
    - [ ] **Selected Workflow (Right):** Ordered list of selected statuses
    - [ ] Drag-and-drop to add/remove/reorder
    - [ ] Visual preview of workflow (column layout)
  - [ ] Actions:
    - [ ] Add status to workflow (from available list)
    - [ ] Remove status from workflow
    - [ ] Reorder statuses via drag-and-drop
    - [ ] Save button → calls `ProjectWorkflowService.updateWorkflow()`
    - [ ] Cancel button → reverts changes

**Using PrimeReact PickList:**
```jsx
import { PickList } from 'primereact/picklist';

const WorkflowBuilder = ({ projectId, currentWorkflow, onSave, onCancel }) => {
    const [availableStatuses, setAvailableStatuses] = useState([]);
    const [selectedStatuses, setSelectedStatuses] = useState([]);

    useEffect(() => {
        // Load all global statuses
        ProjectItemStatusService.getAll().then(res => {
            setAvailableStatuses(res.data.filter(s =>
                !currentWorkflow.find(w => w.status.id === s.id)
            ));
        });

        // Set current workflow as selected
        setSelectedStatuses(currentWorkflow.map(w => w.status));
    }, [projectId, currentWorkflow]);

    const handleSave = async () => {
        const statusIds = selectedStatuses.map(s => s.id);
        await ProjectWorkflowService.updateWorkflow(projectId, statusIds);
        onSave();
    };

    const itemTemplate = (item) => (
        <div className="flex align-items-center gap-2">
            <div style={{
                width: '20px',
                height: '20px',
                backgroundColor: item.color,
                borderRadius: '4px'
            }} />
            <span>{item.name}</span>
        </div>
    );

    return (
        <div className="workflow-builder">
            <PickList
                source={availableStatuses}
                target={selectedStatuses}
                onChange={(e) => {
                    setAvailableStatuses(e.source);
                    setSelectedStatuses(e.target);
                }}
                itemTemplate={itemTemplate}
                sourceHeader="Available Statuses"
                targetHeader="Project Workflow"
                sourceStyle={{ height: '400px' }}
                targetStyle={{ height: '400px' }}
            />
            <div className="mt-3 flex gap-2">
                <Button label="Save Workflow" onClick={handleSave} />
                <Button label="Cancel" onClick={onCancel} className="p-button-secondary" />
            </div>
        </div>
    );
};
```

**Alternative: Using OrderList for reordering only:**
```jsx
import { OrderList } from 'primereact/orderlist';

const WorkflowReorder = ({ currentWorkflow, onSave }) => {
    const [statuses, setStatuses] = useState(currentWorkflow.map(w => w.status));

    const handleSave = async () => {
        const statusIds = statuses.map(s => s.id);
        await ProjectWorkflowService.updateWorkflow(projectId, statusIds);
        onSave();
    };

    return (
        <div>
            <OrderList
                value={statuses}
                onChange={(e) => setStatuses(e.value)}
                itemTemplate={itemTemplate}
                header="Reorder Workflow Statuses"
            />
            <Button label="Save" onClick={handleSave} />
        </div>
    );
};
```

### Phase 5: Frontend Integration - Project Settings

- [ ] Update `/frontend/src/pages/projects/[id]/edit.js` (Project Edit Page)
  - [ ] Add new section: "Workflow Settings"
  - [ ] Show current workflow as ordered list
  - [ ] "Manage Workflow" button → opens dialog/modal
  - [ ] Restrict with `<Restrict permission="project:update">`

- [ ] Create dialog component: `/frontend/src/components/Projects/WorkflowBuilderDialog.js`
  - [ ] PrimeReact Dialog wrapper around WorkflowBuilder
  - [ ] Full-screen or large dialog
  - [ ] On save: close dialog, refresh project data, show toast
  - [ ] On cancel: close dialog, discard changes

**Integration:**
```jsx
// /frontend/src/pages/projects/[id]/edit.js
const [workflowDialogVisible, setWorkflowDialogVisible] = useState(false);

return (
    <div>
        {/* Existing project edit form */}

        <div className="field">
            <label>Workflow Configuration</label>
            <div className="flex align-items-center gap-2">
                <div>
                    {project.workflow.map((w, i) => (
                        <Tag key={i} value={w.status.name} style={{ backgroundColor: w.status.color }} />
                    ))}
                </div>
                <Restrict permission="project:update">
                    <Button
                        label="Manage Workflow"
                        icon="pi pi-cog"
                        onClick={() => setWorkflowDialogVisible(true)}
                        className="p-button-outlined"
                    />
                </Restrict>
            </div>
        </div>

        <WorkflowBuilderDialog
            visible={workflowDialogVisible}
            projectId={project.id}
            currentWorkflow={project.workflow}
            onHide={() => setWorkflowDialogVisible(false)}
            onSave={() => {
                setWorkflowDialogVisible(false);
                // Refresh project data
                fetchProject();
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Workflow updated successfully'
                });
            }}
        />
    </div>
);
```

### Phase 6: Visual Workflow Preview (Optional Enhancement)

- [ ] Add workflow preview in WorkflowBuilder
  - [ ] Show mini Kanban board layout
  - [ ] Display columns in order with colors
  - [ ] Help users visualize final result before saving

### Phase 7: Global Status Management UI (Optional, if creating new statuses)

- [ ] Create page: `/frontend/src/pages/settings/project-statuses.js`
  - [ ] Admin-only page for managing global status library
  - [ ] DataTable showing all ProjectItemStatus records
  - [ ] Actions: Create, Edit, Delete
  - [ ] Color picker for status colors
  - [ ] Prevent deletion of statuses currently in use

- [ ] Create form: `/frontend/src/forms/Projects/ProjectItemStatusForm.js`
  - [ ] Fields: name, color (ColorPicker), description
  - [ ] Validation: name required, color in hex format

### Phase 8: Handle Workflow Changes Impact

- [ ] When workflow is updated, consider existing project items:
  - [ ] Items with removed status → what happens?
    - **Option A:** Move to first status in new workflow
    - **Option B:** Move to "Backlog" or default status
    - **Option C:** Prevent removal if items exist with that status
  - [ ] Implement chosen strategy in backend

**Backend logic:**
```php
public function updateWorkflow(Request $request, $projectId)
{
    // ... validation ...

    $project = Project::with('items')->findOrFail($projectId);
    $newStatusIds = $request->status_ids;
    $oldStatusIds = collect($project->workflow_statuses)->pluck('id');

    // Find removed statuses
    $removedStatusIds = $oldStatusIds->diff($newStatusIds);

    if ($removedStatusIds->isNotEmpty()) {
        // Check if any items use removed statuses
        $affectedItems = $project->items()
            ->whereIn('project_item_status_id', $removedStatusIds)
            ->count();

        if ($affectedItems > 0) {
            // Option A: Move to first status
            $firstStatusId = $newStatusIds[0];
            $project->items()
                ->whereIn('project_item_status_id', $removedStatusIds)
                ->update(['project_item_status_id' => $firstStatusId]);

            // Option C: Prevent removal
            // return response()->json([
            //     'error' => "Cannot remove status - {$affectedItems} items still use it"
            // ], 400);
        }
    }

    // Update workflow
    $workflow = collect($newStatusIds)->map(function ($statusId, $index) {
        return ['id' => $statusId, 'order' => $index];
    })->toArray();

    $project->workflow_statuses = $workflow;
    $project->save();

    return response()->json(['workflow' => $project->workflow]);
}
```

### Phase 9: Testing

- [ ] Backend Testing
  - [ ] Test workflow update API with valid data
  - [ ] Test validation (empty status_ids, invalid IDs)
  - [ ] Test impact on existing project items when status removed
  - [ ] Test workflow accessor returns correct data
  - [ ] Test multi-tenant isolation (can't update other tenant's projects)

- [ ] Frontend Testing
  - [ ] Test WorkflowBuilder component renders correctly
  - [ ] Test drag-and-drop reordering (PickList or OrderList)
  - [ ] Test adding/removing statuses
  - [ ] Test save workflow → API call → success
  - [ ] Test cancel → no changes saved
  - [ ] Test workflow preview shows correct layout
  - [ ] Test permission restrictions (only admins can manage)
  - [ ] Test Kanban board updates after workflow change

- [ ] Integration Testing
  - [ ] Full workflow: Open project → Manage workflow → Reorder → Save → See changes in Kanban
  - [ ] Create new project → Verify default workflow applied
  - [ ] Update workflow → Verify project items still render correctly
  - [ ] Remove status with items → Verify items moved to new status
  - [ ] Multiple users editing same project (race conditions)

## Critical Files

### Backend Files to Modify:
- `/backend/app/Http/Controllers/Projects/ProjectController.php` - Add `updateWorkflow()` method
- `/backend/routes/projects/project-routes.php` - Add `PUT /{id}/workflow` route

### Backend Files to Create (Optional, if managing global statuses):
- `/backend/app/Http/Controllers/Projects/ProjectItemStatusController.php`
- `/backend/routes/projects/project-item-status-routes.php`

### Backend Files to Reference:
- `/backend/app/Models/Project.php` - Existing workflow implementation
- `/backend/app/Models/ProjectItemStatus.php` - Global status model

### Frontend Files to Create:
- `/frontend/src/services/ProjectWorkflowService.js`
- `/frontend/src/services/ProjectItemStatusService.js` (optional)
- `/frontend/src/components/Projects/WorkflowBuilder.js`
- `/frontend/src/components/Projects/WorkflowBuilderDialog.js`
- `/frontend/src/pages/settings/project-statuses.js` (optional)
- `/frontend/src/forms/Projects/ProjectItemStatusForm.js` (optional)

### Frontend Files to Modify:
- `/frontend/src/pages/projects/[id]/edit.js` - Add workflow management section

### Frontend Files to Reference:
- `/frontend/src/pages/projects/[id]/index.js` - Kanban board rendering
- `/frontend/src/components/Projects/ProjectColumn.js` - Column component

## Design Considerations

### UX Flow
1. User goes to Project Settings
2. Sees current workflow as ordered tags/chips
3. Clicks "Manage Workflow" button
4. Dialog opens with PickList (Available | Selected)
5. User drags statuses between lists, reorders selected list
6. User sees live preview of workflow
7. User clicks "Save"
8. Workflow updates, Kanban board reflects changes

### Visual Design
- Use PrimeReact PickList for elegant drag-and-drop
- Color-code statuses (show color swatches)
- Show status names clearly
- Provide visual feedback during drag operations
- Toast notification on successful save

### Performance
- Workflow updates should be instant (< 500ms)
- Kanban board should re-render efficiently after workflow change
- Consider caching workflow in frontend state

## Verification Checklist

- [ ] API endpoint `PUT /api/projects/{id}/workflow` created and working
- [ ] Workflow JSON updates correctly in database
- [ ] WorkflowBuilder component renders with PickList/OrderList
- [ ] Drag-and-drop works smoothly
- [ ] Save button updates workflow via API
- [ ] Kanban board reflects new workflow immediately
- [ ] Project items don't break when status removed
- [ ] Permission checks enforce `project:update` requirement
- [ ] Multi-tenant isolation maintained
- [ ] Default workflow still applied to new projects
- [ ] No console errors or warnings
- [ ] Toast notifications on success/error
- [ ] Mobile-responsive design

## Success Criteria

✅ **Complete when:**
1. Users can customize workflow for each project
2. Workflow builder UI is intuitive and easy to use
3. Kanban board dynamically adapts to custom workflows
4. Existing project items handled gracefully during workflow changes
5. All test cases pass
6. Documentation updated

## Future Enhancements

- Per-project custom statuses (not just global library)
- Workflow templates (e.g., "Agile Sprint", "Bug Triage", "Feature Development")
- Status transition rules (e.g., "Backlog can only move to To Do")
- Workflow analytics (time spent in each status)
- Bulk workflow updates across multiple projects

## Next Steps After Completion

- Close Issue #21 on GitHub
- Document workflow customization in user guide
- Gather user feedback on UX
- Consider adding workflow templates
- Move to Issue #25 (Plant Database) or Issue #16 (Feature Flags)

## Notes

- This feature significantly enhances project management flexibility
- Backend infrastructure is already solid, focus is on UI
- Start simple (global status library), expand later (custom statuses)
- PrimeReact PickList is perfect for this use case
- Consider visual workflow preview to improve UX
