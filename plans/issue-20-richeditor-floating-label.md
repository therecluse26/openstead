# Issue #20: Fix RichEditor Floating Label

**Priority:** 🔴 HIGH (Quick Win)
**Complexity:** Easy
**Estimated Time:** 1-2 hours
**Status:** Not Started

## Overview

Fix the floating label placeholder on the RichEditor component. Currently, the label doesn't float when the editor is focused and doesn't center properly when unfocused.

## Current State

**Problem:** The `p-float-label` wrapper around RichTextInput doesn't work correctly because:
1. PrimeReact's `p-float-label` expects a direct input element as child
2. RichEditor wraps PrimeReact's `<Editor>` component (composite component)
3. The label can't detect focus state of nested Editor
4. Visual issues: label doesn't float on focus, doesn't center when empty

**Current Implementation:**
```jsx
// /frontend/src/components/HookFormInputs/RichTextInput.js
<span className="p-float-label">
    <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
            <RichEditor
                id={name}
                text={value ?? ''}
                onTextChange={onChange}
            />
        )}
    />
    <label htmlFor={name}>{label}</label>
</span>
```

## Implementation Options

### Option A: Custom CSS Solution ⭐ RECOMMENDED
Use custom CSS to manually float the label when Editor has focus or content.

**Pros:**
- Minimal code changes
- Maintains existing component structure
- Works with PrimeReact styling

**Cons:**
- Requires CSS specificity to override PrimeReact styles
- May need !important declarations

### Option B: Focus State Detection
Detect Editor's focus state and manually apply floating label class.

**Pros:**
- More control over behavior
- Can add additional logic if needed

**Cons:**
- More complex implementation
- Need to track focus/blur events

### Option C: Fixed Label (Simplest)
Remove floating label, use a fixed label above the editor.

**Pros:**
- Simplest implementation
- No compatibility issues
- Consistent with some form patterns

**Cons:**
- Different UX from other inputs
- Takes more vertical space

## Recommended Implementation (Option A)

### Phase 1: Investigate Current Behavior

- [ ] Read `/frontend/src/components/HookFormInputs/RichTextInput.js`
- [ ] Read `/frontend/src/components/RichEditor.js`
- [ ] Inspect PrimeReact Editor DOM structure in browser
- [ ] Identify CSS classes on Editor when focused/unfocused
- [ ] Check if Editor has content detection class
- [ ] Review PrimeReact `p-float-label` CSS implementation

### Phase 2: Create Custom CSS

- [ ] Create CSS file `/frontend/src/styles/richeditor-fix.css` (or add to existing global styles)
- [ ] Add rules to float label when:
  - [ ] Editor wrapper has focus
  - [ ] Editor has content (not empty)
- [ ] Target the specific structure: `.p-float-label` containing `.ql-container`
- [ ] Override label positioning
- [ ] Ensure label doesn't overlap with toolbar

**Example CSS:**
```css
/* Float label when RichEditor is focused or has content */
.p-float-label:has(.ql-container.ql-snow) label {
  top: -0.75rem;
  font-size: 12px;
  transition: all 0.2s;
}

/* Unfocused and empty state */
.p-float-label:has(.ql-editor.ql-blank) label {
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
}

/* Focused state */
.p-float-label:has(.ql-container:focus-within) label {
  top: -0.75rem;
  font-size: 12px;
  color: var(--primary-color);
}
```

### Phase 3: Alternative - JavaScript Solution

If CSS-only solution doesn't work:

- [ ] Modify `/frontend/src/components/HookFormInputs/RichTextInput.js`
- [ ] Add state: `const [isFocused, setIsFocused] = useState(false)`
- [ ] Add state: `const [hasContent, setHasContent] = useState(false)`
- [ ] Add focus/blur handlers to RichEditor
- [ ] Conditionally apply class to label wrapper
- [ ] Update `onTextChange` to check content length

**Example:**
```jsx
const RichTextInput = ({ name, control, label, rules, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasContent, setHasContent] = useState(false);

    const shouldFloat = isFocused || hasContent;

    return (
        <span className={classNames('p-float-label', { 'p-input-filled': shouldFloat })}>
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value }, fieldState }) => (
                    <RichEditor
                        text={value ?? ''}
                        onTextChange={(e) => {
                            onChange(e);
                            setHasContent(e.textValue && e.textValue.trim().length > 0);
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                )}
            />
            <label>{label}</label>
        </span>
    );
};
```

### Phase 4: Update RichEditor Component

- [ ] Check if RichEditor component supports focus/blur callbacks
- [ ] If not, add them to `/frontend/src/components/RichEditor.js`
- [ ] Pass through to underlying PrimeReact Editor
- [ ] Ensure events bubble correctly

**Modify RichEditor.js:**
```jsx
const RichEditor = ({ text, onTextChange, onFocus, onBlur, ...props }) => {
    return (
        <Editor
            value={text}
            onTextChange={onTextChange}
            onFocus={onFocus}
            onBlur={onBlur}
            style={{ height: '320px' }}
            {...props}
        />
    );
};
```

### Phase 5: Testing

- [ ] Test RichEditor in all forms that use it
  - [ ] Notes creation/editing
  - [ ] Project descriptions
  - [ ] Any other rich text fields
- [ ] Test label behavior:
  - [ ] Unfocused + empty: label centered/visible
  - [ ] Focused + empty: label floats up
  - [ ] Unfocused + content: label stays floated
  - [ ] Focused + content: label stays floated
- [ ] Verify no visual glitches during transitions
- [ ] Test across different browsers (Chrome, Firefox, Safari)
- [ ] Test responsive behavior (mobile/tablet)
- [ ] Verify label doesn't overlap toolbar

## Critical Files

### Files to Modify:
- `/frontend/src/components/HookFormInputs/RichTextInput.js` - Floating label wrapper
- `/frontend/src/components/RichEditor.js` - Editor component (add focus handlers)
- `/frontend/src/styles/*` - Add custom CSS (or modify global styles)

### Files to Reference:
- PrimeReact `p-float-label` CSS source
- Other HookFormInputs (TextInput.js, etc.) for comparison

### Files Using RichTextInput (Test Cases):
- Search for `<RichTextInput` usage across codebase
- Test in all forms using the component

## Visual Comparison

**Before (Broken):**
- Label doesn't move on focus
- Label not centered when empty
- Overlaps with editor content

**After (Fixed):**
- Label floats up smoothly on focus
- Label centered in editor when empty and unfocused
- Label stays floated when content exists
- Matches behavior of other PrimeReact inputs (TextInput, etc.)

## Verification Checklist

- [ ] Label floats correctly on focus
- [ ] Label centers correctly when unfocused and empty
- [ ] Label stays floated when content exists (even when unfocused)
- [ ] Smooth transition animation matches other inputs
- [ ] No overlap with editor toolbar
- [ ] No overlap with editor content
- [ ] Label color changes on focus (matches theme)
- [ ] Works in all forms using RichTextInput
- [ ] No console errors or warnings
- [ ] Responsive design maintained
- [ ] Cross-browser compatibility verified

## Success Criteria

✅ **Complete when:**
1. Floating label behavior matches other PrimeReact inputs
2. Visual appearance consistent with design system
3. All test cases pass
4. No regressions in existing forms
5. Screenshot/video shows correct behavior

## Next Steps After Completion

- Close Issue #20 on GitHub
- Document the fix (if using custom approach)
- Move to Issue #15 (User Management) or Issue #21 (Workflow Builder)

## Notes

- This is primarily a UX polish issue (low impact)
- Quick win that improves form consistency
- Good warm-up task before tackling larger features
- Consider creating a reusable pattern for other composite form components
