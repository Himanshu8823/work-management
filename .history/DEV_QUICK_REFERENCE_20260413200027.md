# Developer Quick Reference

## 📖 Common Tasks

### 1. Adding a New Page

**Step 1:** Create page component

```typescript
// src/pages/NewPage.tsx
import { MainLayout } from '@/components/layout/MainLayout';

export function NewPage() {
  return (
    <MainLayout>
      <h1>New Page</h1>
    </MainLayout>
  );
}
```

**Step 2:** Add route

```typescript
// src/App.tsx
<Route
  path="/newpage"
  element={
    <ProtectedRoute>
      <NewPage />
    </ProtectedRoute>
  }
/>
```

**Step 3:** Add sidebar link

```typescript
// src/components/layout/Sidebar.tsx
const navigation = [
  // ... existing routes
  {
    name: 'New Page',
    href: '/newpage',
    icon: IconComponent,
  },
];
```

---

### 2. Creating a New API Endpoint

**Step 1:** Add API method

```typescript
// src/services/api.ts
async getNewItems() {
  const response = await this.axiosInstance.get('/newitems');
  return response.data;
}

async createNewItem(data: any) {
  const response = await this.axiosInstance.post('/newitems', data);
  return response.data;
}
```

**Step 2:** Add query hooks

```typescript
// src/hooks/useQueries.ts
export const queryKeys = {
  // ... existing keys
  newItems: () => [...queryKeys.all, 'newItems'],
  newItemsList: (filters?: any) => [...queryKeys.newItems(), 'list', filters],
};

export function useNewItems(filters?: any) {
  return useQuery({
    queryKey: queryKeys.newItemsList(filters),
    queryFn: () => apiService.getNewItems(),
  });
}

export function useCreateNewItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiService.createNewItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.newItems() });
    },
  });
}
```

---

### 3. Creating a New Form

**Step 1:** Define Zod schema

```typescript
// src/features/newfeature/NewItemDialog.tsx
const newItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  status: z.enum(['Active', 'Inactive']),
});

type NewItemFormData = z.infer<typeof newItemSchema>;
```

**Step 2:** Create form component

```typescript
export function NewItemDialog({ open, onOpenChange }) {
  const form = useForm<NewItemFormData>({
    resolver: zodResolver(newItemSchema),
    defaultValues: { /* ... */ },
  });
  
  const mutation = useCreateNewItem();
  
  const onSubmit = (data: NewItemFormData) => {
    mutation.mutate(data, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Item</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={mutation.isPending}>
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

---

### 4. Using TanStack Query

**Simple Query**

```typescript
const { data, isLoading, error } = useClients();
```

**Query with Filters**

```typescript
const [search, setSearch] = useState('');
const { data } = useClients(search ? { search } : undefined);
```

**Mutation**

```typescript
const mutation = useCreateClient();

const handleCreate = (data) => {
  mutation.mutate(data, {
    onSuccess: () => {
      console.log('Created!');
    },
    onError: (error) => {
      console.log('Failed:', error);
    },
  });
};

// Use mutation
<button disabled={mutation.isPending}>
  {mutation.isPending ? 'Saving...' : 'Save'}
</button>
```

---

### 5. Working with Forms

**React Hook Form + Zod**

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(1, 'Name required'),
});

type FormData = z.infer<typeof schema>;

export function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
```

---

## 🎨 Component Examples

### Using Card Component

```typescript
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Using Dialog

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

### Using Table

```typescript
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column 1</TableHead>
      <TableHead>Column 2</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {items.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.value}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Using Select

```typescript
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

---

## 🔍 Debugging Tips

### Check Network Requests

```typescript
// DevTools → Network tab
// Look for /api/* requests
// Check status, response, headers
```

### Log Component State

```typescript
useEffect(() => {
  console.log('Data updated:', data);
}, [data]);
```

### Debug TanStack Query

```typescript
// Install DevTools
npm install @tanstack/react-query-devtools

// Add to App
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function App() {
  return (
    <>
      {/* ... */}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
```

### Check API Response

```typescript
// Browser DevTools → Network tab
// Click on request
// Check "Response" tab for API data
```

---

## 📋 Code Checklist Before Commit

- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Component is responsive (test on mobile)
- [ ] All inputs have validation
- [ ] Loading states handled
- [ ] Error states handled
- [ ] No hardcoded values
- [ ] Proper prop types
- [ ] Comments for complex logic
- [ ] No commented-out code

---

## 🚀 Performance Tips

### 1. Avoid Unnecessary Renders

```typescript
// ❌ BAD - Creates new object every render
<Component filter={{ name: 'test' }} />

// ✅ GOOD - Stable reference
const filter = useMemo(() => ({ name: 'test' }), []);
<Component filter={filter} />
```

### 2. Use Proper Query Keys

```typescript
// ✅ GOOD - Different data cached separately
queryKey: queryKeys.client(id)      // Different per ID
queryKey: queryKeys.tasks(filter)   // Different per filter

// ❌ BAD - Same key for different data
queryKey: ['clients']               // Always same
```

### 3. Cache Wisely

```typescript
staleTime: 1000 * 60,              // 1 minute
gcTime: 1000 * 60 * 5,             // 5 minutes
```

---

## 🔧 Common Fixes

### Issue: "Cannot find module"

```bash
rm -rf node_modules
npm install
```

### Issue: API calls failing

Check:
1. Backend is running
2. API URL in `.env.local` is correct
3. Token is valid (check cookies)

### Issue: Form not submitting

Check:
1. Validation errors (check FormMessage)
2. Zod schema is correct
3. API endpoint exists

### Issue: Page not found

Check:
1. Route exists in App.tsx
2. Path matches sidebar link
3. Component exported correctly

---

## 📚 File Navigation

| To find... | Look in... |
|-----------|-----------|
| API calls | `src/services/api.ts` |
| Queries | `src/hooks/useQueries.ts` |
| Types | `src/types/index.ts` |
| Utilities | `src/utils/helpers.ts` |
| Forms | `src/features/*/` |
| Pages | `src/pages/` |
| Components | `src/components/` |
| Styles | `src/styles/globals.css` |

---

## 🎯 Quick Imports

```typescript
// API Service
import { apiService } from '@/services/api';

// Query Hooks
import { useClients, useCreateClient } from '@/hooks/useQueries';

// Types
import { Client, Task, TaskStatus } from '@/types';

// Utilities
import { formatDate, getStatusColor } from '@/utils/helpers';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Forms
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Layouts
import { MainLayout } from '@/components/layout/MainLayout';
```

---

## 📞 Getting Help

1. **TypeScript Errors**: Check type definitions in `src/types/index.ts`
2. **Component Not Showing**: Check route in `src/App.tsx`
3. **API Failing**: Check `src/services/api.ts` and network tab
4. **Form Issues**: Check Zod schema and React Hook Form setup
5. **Styling Issues**: Check `src/styles/globals.css` and Tailwind config

---

## 🎓 Learning Resources

- [React Docs](https://react.dev)
- [TanStack Query](https://tanstack.com/query)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)

---

**Happy Coding!** 🚀
